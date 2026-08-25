---
name: screencasts
description: Adds or replaces a Panel screencast on kirby.tools – staging a recording, uploading it to the R2 assets bucket, the two posters, and the content wiring. Use when a new `.mp4` goes on a product page or documentation page, or an existing recording is replaced. Don't use for still images under `public/img/`.
---

# Adding a Screencast

Videos live in the `kirby-tools-assets` R2 bucket and nowhere else. `public/screencasts/` holds the posters, and those are the part that belongs in git. `useAssetUrl()` prefixes the bucket at runtime, so a `src` in content stays a repo-root path either way.

## Run

Record at 1816×1080, name the file `kirby-<plugin>-<feature>.mp4`, drop it in `.data/screencasts/`, then:

```bash
.agents/skills/screencasts/upload.sh .data/screencasts/kirby-copilot-inline-suggestions.mp4@00:04
```

Everything after `@` is the timestamp of the frame to freeze as `-poster.jpg`. Without arguments the script takes the whole staging directory.

Re-running is free: a video whose bytes already match the bucket is skipped, and an existing `-poster.jpg` survives unless a timestamp is passed. Nothing is ever deleted from the bucket, so a re-recording needs a new filename to get past the month-long caches.

## The Two Posters

- `-poster-start.jpg` is the first frame. It belongs on `Media/Video`, which autoplays, and any other frame visibly jumps the moment playback starts.
- `-poster.jpg` is a chosen frame. It belongs on `ProseVideo`, which waits for a click.

Six of the fifteen product-page references still point at `-poster.jpg`. That is a leftover, not a second convention.

## Wiring

Documentation page under `content/1.docs/`:

```md
:prose-video{src="/screencasts/<name>.mp4" poster="/screencasts/<name>-poster.jpg" width="908" height="540"}
```

Product page `index.yml`, where the recording is displayed at half its recorded size:

```yaml
video:
  src: /screencasts/<name>.mp4
  poster: /screencasts/<name>-poster-start.jpg
  label: What the recording shows, in one sentence
```

`label` is optional on both components, but `ProseVideo` otherwise builds one from the filename, which reads badly aloud.
