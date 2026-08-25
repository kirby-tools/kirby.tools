#!/usr/bin/env bash
#
# Remuxes every recording staged in .data/screencasts, writes its two posters
# and uploads it to R2, which is the only place the videos live – the bucket
# serves them in development too, so none of this ends up in the bundle. Run it
# by hand after adding a recording; the deploy workflow stays out of it, since
# screencasts change a few times a year and would otherwise cost 90 MB on every
# commit.
#
# The remux moves the `moov` atom to the front of the file. Without it a
# browser has to stream the entire video before the first frame appears.
#
# Usage: .agents/skills/screencasts/upload.sh [--force] [file[@timestamp] ...]
#
# The timestamp picks the frame for `-poster.jpg`, as in `demo.mp4@00:04`.

set -euo pipefail
shopt -s nullglob

BUCKET="kirby-tools-assets"
KEY_PREFIX="screencasts"
CACHE_CONTROL="public, max-age=2592000"
STAGING_DIRECTORY=".data/screencasts"
POSTER_DIRECTORY="public/screencasts"
# The `assetsBaseUrl` from `nuxt.config.ts`, duplicated because a shell script
# cannot read it.
ASSETS_BASE_URL="https://assets.kirby.tools"
# The level that reproduces the file size of the posters already committed.
POSTER_QUALITY=3

for binary in ffmpeg ffprobe; do
  if ! command -v "$binary" >/dev/null; then
    echo "$binary is not installed - brew install ffmpeg." >&2
    exit 1
  fi
done

shouldForceUpload=""
recordingPaths=()
posterTimestamps=()

# Arguments are resolved against the caller's directory, since the working
# directory moves to the repository root further down.
for argument in "$@"; do
  if [ "$argument" = "--force" ]; then
    shouldForceUpload=1
    continue
  fi

  recordingPath="$argument"
  posterTimestamp=""
  case "$argument" in
    *@*)
      recordingPath="${argument%@*}"
      posterTimestamp="${argument##*@}"
      ;;
  esac
  case "$recordingPath" in
    /*) ;;
    *) recordingPath="$PWD/$recordingPath" ;;
  esac

  recordingPaths+=("$recordingPath")
  posterTimestamps+=("$posterTimestamp")
done

# The repository root, derived from the script rather than from the working
# directory so that the script runs from anywhere. Three levels up lands there
# either way, through `.agents/skills/` or through the `.claude/skills` symlink.
cd "$(dirname "$0")/../../.."

if [ ${#recordingPaths[@]} -eq 0 ]; then
  for recordingPath in "$STAGING_DIRECTORY"/*.mp4 "$STAGING_DIRECTORY"/*.mov; do
    recordingPaths+=("$recordingPath")
    posterTimestamps+=("")
  done
fi

if [ ${#recordingPaths[@]} -eq 0 ]; then
  echo "No recordings in $STAGING_DIRECTORY." >&2
  exit 1
fi

temporaryDirectory="$(mktemp -d)"
trap 'rm -rf "$temporaryDirectory"' EXIT

uploadedCount=0
unchangedCount=0

for ((index = 0; index < ${#recordingPaths[@]}; index++)); do
  recordingPath="${recordingPaths[$index]}"
  posterTimestamp="${posterTimestamps[$index]}"
  recordingName="$(basename "${recordingPath%.*}")"
  objectName="$recordingName.mp4"

  # Repacking is only lossless while the codec already is what browsers want.
  # Copying anything else into an MP4 would produce a file that plays nowhere.
  codec="$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=codec_name -of csv=p=0 "$recordingPath")"
  if [ "$codec" != "h264" ]; then
    echo "Skipped $recordingName: encoded as $codec, expected h264." >&2
    continue
  fi

  remuxedPath="$temporaryDirectory/$objectName"
  ffmpeg -v error -i "$recordingPath" -c copy -movflags +faststart "$remuxedPath"

  # Read through a process substitution rather than a pipe, since `grep` quits
  # on the match and would leave `head` to die on SIGPIPE under `pipefail`.
  if ! LC_ALL=C grep -qa moov <(head -c 65536 "$remuxedPath"); then
    echo "Aborted on $objectName: no moov atom near the start after remuxing." >&2
    exit 1
  fi

  # The first frame, and the only poster that can be derived rather than
  # chosen, which is why it is written for every recording whether or not a
  # page ends up pointing at it.
  startPosterPath="$POSTER_DIRECTORY/$recordingName-poster-start.jpg"
  if [ ! -f "$startPosterPath" ]; then
    ffmpeg -v error -y -i "$recordingPath" -frames:v 1 \
      -q:v "$POSTER_QUALITY" "$startPosterPath"
  fi

  # A hand-picked poster is only replaced on request, so re-running the script
  # never silently swaps a chosen frame for the first one.
  posterPath="$POSTER_DIRECTORY/$recordingName-poster.jpg"
  if [ -n "$posterTimestamp" ]; then
    ffmpeg -v error -y -ss "$posterTimestamp" -i "$recordingPath" -frames:v 1 \
      -q:v "$POSTER_QUALITY" "$posterPath"
  elif [ ! -f "$posterPath" ]; then
    cp "$startPosterPath" "$posterPath"
    echo "  $recordingName-poster.jpg is the first frame - pass @<timestamp>." >&2
  fi

  # R2 reports the content MD5 as the ETag at this object size, so a single
  # HEAD decides whether the bytes up there are the bytes just built. The query
  # string is a nonce: Cloudflare caches the 404 that this very request
  # produces for a new video for four hours, which would hide the upload
  # following it from the next run.
  localChecksum="$(md5 -q "$remuxedPath")"
  publishedChecksum="$(curl -fsI "$ASSETS_BASE_URL/$KEY_PREFIX/$objectName?$$" |
    tr -d '\r' | awk -F'"' 'tolower($1) ~ /^etag:/ { print $2 }')" ||
    publishedChecksum=""

  if [ -z "$shouldForceUpload" ] && [ "$publishedChecksum" = "$localChecksum" ]; then
    echo "= $objectName unchanged"
    unchangedCount=$((unchangedCount + 1))
    continue
  fi

  echo "→ $objectName ($(du -h "$remuxedPath" | cut -f1))"
  # Called directly rather than through `pnpm exec`, which spends three seconds
  # on a dependency check before every single upload.
  node_modules/.bin/wrangler r2 object put "$BUCKET/$KEY_PREFIX/$objectName" \
    --remote \
    --file="$remuxedPath" \
    --content-type=video/mp4 \
    --cache-control="$CACHE_CONTROL"

  uploadedCount=$((uploadedCount + 1))
done

echo "$uploadedCount uploaded to $BUCKET/$KEY_PREFIX/, $unchangedCount unchanged"
