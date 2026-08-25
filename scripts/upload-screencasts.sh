#!/usr/bin/env bash
#
# Remuxes every recording staged in .data/screencasts and uploads it to R2,
# which is the only place the videos live - the bucket serves them in
# development too, so none of this ends up in the bundle. Run it by hand after
# adding a recording; the deploy workflow stays out of it, since screencasts
# change a few times a year and would otherwise cost 90 MB on every commit.
#
# The remux moves the `moov` atom to the front of the file. Without it a
# browser has to stream the entire video before the first frame appears.
#
# Usage: scripts/upload-screencasts.sh [file ...]

set -euo pipefail
shopt -s nullglob

BUCKET="kirby-tools-assets"
PREFIX="screencasts"
CACHE_CONTROL="public, max-age=2592000"
SOURCE_DIR=".data/screencasts"

cd "$(dirname "$0")/.."

if [ $# -gt 0 ]; then
  files=("$@")
else
  files=("$SOURCE_DIR"/*.mp4 "$SOURCE_DIR"/*.mov)
fi

if [ ${#files[@]} -eq 0 ]; then
  echo "No recordings in $SOURCE_DIR." >&2
  exit 1
fi

workDir="$(mktemp -d)"
trap 'rm -rf "$workDir"' EXIT

uploaded=0

for path in "${files[@]}"; do
  name="$(basename "${path%.*}").mp4"

  # Repacking is only lossless while the codec already is what browsers want.
  # Copying anything else into an MP4 would produce a file that plays nowhere.
  codec="$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=codec_name -of csv=p=0 "$path")"
  if [ "$codec" != "h264" ]; then
    echo "Skipped $(basename "$path"): encoded as $codec, expected h264." >&2
    continue
  fi

  remuxed="$workDir/$name"
  ffmpeg -v error -i "$path" -c copy -movflags +faststart "$remuxed"

  if ! head -c 65536 "$remuxed" | LC_ALL=C grep -qa moov; then
    echo "Aborted on $name: no moov atom near the start after remuxing." >&2
    exit 1
  fi

  echo "→ $name ($(du -h "$remuxed" | cut -f1))"
  npx wrangler r2 object put "$BUCKET/$PREFIX/$name" \
    --remote \
    --file="$remuxed" \
    --content-type=video/mp4 \
    --cache-control="$CACHE_CONTROL"

  uploaded=$((uploaded + 1))
done

echo "$uploaded uploaded to $BUCKET/$PREFIX/"
