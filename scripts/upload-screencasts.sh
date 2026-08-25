#!/usr/bin/env bash
#
# Uploads screencasts to R2, which is the only place they live - the bucket
# serves them in development too, so nothing here ends up in the bundle. Stage
# a new recording in .data/screencasts and run this by hand; the deploy
# workflow stays out of it rather than pushing 90 MB on every commit.
#
# Remux before uploading, or playback stalls until the whole file arrives:
#   ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4
#
# Usage: scripts/upload-screencasts.sh [filename ...]

set -euo pipefail

BUCKET="kirby-tools-assets"
PREFIX="screencasts"
CACHE_CONTROL="public, max-age=2592000"
SOURCE_DIR=".data/screencasts"

cd "$(dirname "$0")/.."

if [ $# -gt 0 ]; then
  files=("$@")
else
  files=("$SOURCE_DIR"/*.mp4)
fi

for path in "${files[@]}"; do
  name="$(basename "$path")"
  echo "→ $name ($(du -h "$path" | cut -f1))"
  npx wrangler r2 object put "$BUCKET/$PREFIX/$name" \
    --remote \
    --file="$path" \
    --content-type=video/mp4 \
    --cache-control="$CACHE_CONTROL"
done

echo "${#files[@]} uploaded to $BUCKET/$PREFIX/"
