#!/usr/bin/env bash
#
# Remuxes every recording staged in .data/screencasts, writes its two posters
# and uploads it to R2, which is the only place the videos live - the bucket
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
PREFIX="screencasts"
CACHE_CONTROL="public, max-age=2592000"
SOURCE_DIR=".data/screencasts"
POSTER_DIR="public/screencasts"
# Mirrors `assetsBaseUrl` in `nuxt.config.ts`, which a shell script cannot read.
ASSETS_BASE_URL="https://assets.kirby.tools"
# Matches the file size of the posters already in the repository.
POSTER_QUALITY=3

for binary in ffmpeg ffprobe; do
  if ! command -v "$binary" >/dev/null; then
    echo "$binary is not installed - brew install ffmpeg." >&2
    exit 1
  fi
done

force=""
paths=()
stamps=()

# Arguments are resolved against the caller's directory, since the working
# directory moves to the repository root below.
for argument in "$@"; do
  if [ "$argument" = "--force" ]; then
    force=1
    continue
  fi

  path="$argument"
  stamp=""
  case "$argument" in
    *@*)
      path="${argument%@*}"
      stamp="${argument##*@}"
      ;;
  esac
  case "$path" in
    /*) ;;
    *) path="$PWD/$path" ;;
  esac

  paths+=("$path")
  stamps+=("$stamp")
done

# Derived from the script rather than the working directory, so the script runs
# from anywhere. Three levels up lands on the root either way, whether the
# script is reached through `.agents/skills/` or the `.claude/skills` symlink.
cd "$(dirname "$0")/../../.."

if [ ${#paths[@]} -eq 0 ]; then
  for path in "$SOURCE_DIR"/*.mp4 "$SOURCE_DIR"/*.mov; do
    paths+=("$path")
    stamps+=("")
  done
fi

if [ ${#paths[@]} -eq 0 ]; then
  echo "No recordings in $SOURCE_DIR." >&2
  exit 1
fi

workDir="$(mktemp -d)"
trap 'rm -rf "$workDir"' EXIT

uploaded=0
unchanged=0

for ((index = 0; index < ${#paths[@]}; index++)); do
  path="${paths[$index]}"
  stamp="${stamps[$index]}"
  base="$(basename "${path%.*}")"
  name="$base.mp4"

  # Repacking is only lossless while the codec already is what browsers want.
  # Copying anything else into an MP4 would produce a file that plays nowhere.
  codec="$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=codec_name -of csv=p=0 "$path")"
  if [ "$codec" != "h264" ]; then
    echo "Skipped $base: encoded as $codec, expected h264." >&2
    continue
  fi

  remuxed="$workDir/$name"
  ffmpeg -v error -i "$path" -c copy -movflags +faststart "$remuxed"

  # Reading through a process substitution rather than a pipe, since `grep`
  # quits on the match and would leave `head` to die on SIGPIPE under pipefail.
  if ! LC_ALL=C grep -qa moov <(head -c 65536 "$remuxed"); then
    echo "Aborted on $name: no moov atom near the start after remuxing." >&2
    exit 1
  fi

  # The autoplaying component shows the first frame, so the poster has to be
  # that exact frame or the picture jumps the moment playback starts.
  startPoster="$POSTER_DIR/$base-poster-start.jpg"
  if [ ! -f "$startPoster" ]; then
    ffmpeg -v error -y -i "$path" -frames:v 1 -q:v "$POSTER_QUALITY" "$startPoster"
  fi

  # A hand-picked poster is only replaced on request, so re-running the script
  # never silently swaps a chosen frame for the first one.
  poster="$POSTER_DIR/$base-poster.jpg"
  if [ -n "$stamp" ]; then
    ffmpeg -v error -y -ss "$stamp" -i "$path" -frames:v 1 \
      -q:v "$POSTER_QUALITY" "$poster"
  elif [ ! -f "$poster" ]; then
    cp "$startPoster" "$poster"
    echo "  $base-poster.jpg is the first frame - re-run with @<timestamp>." >&2
  fi

  # R2 reports the content MD5 as the ETag for objects this size, so one HEAD
  # tells us whether the bytes already up there are the bytes we just built.
  # The query string is a nonce: Cloudflare caches the 404 this very request
  # produces for a new video for four hours, and would then hide the upload
  # that follows it from the next run.
  checksum="$(md5 -q "$remuxed")"
  published="$(curl -fsI "$ASSETS_BASE_URL/$PREFIX/$name?$$" |
    tr -d '\r' | awk -F'"' 'tolower($1) ~ /^etag:/ { print $2 }')" || published=""

  if [ -z "$force" ] && [ "$published" = "$checksum" ]; then
    echo "= $name unchanged"
    unchanged=$((unchanged + 1))
    continue
  fi

  echo "→ $name ($(du -h "$remuxed" | cut -f1))"
  # Called directly rather than through `pnpm exec`, which spends three seconds
  # on a dependency check before every single upload.
  node_modules/.bin/wrangler r2 object put "$BUCKET/$PREFIX/$name" \
    --remote \
    --file="$remuxed" \
    --content-type=video/mp4 \
    --cache-control="$CACHE_CONTROL"

  uploaded=$((uploaded + 1))
done

echo "$uploaded uploaded to $BUCKET/$PREFIX/, $unchanged unchanged"
