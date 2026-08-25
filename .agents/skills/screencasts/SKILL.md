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

The script writes both for every recording, and every recording keeps both. `-poster-start.jpg` is the first frame, the one poster that can be derived rather than chosen; `-poster.jpg` is a frame picked for what it shows.

Which of the two a page references is an editorial call made per video, not a rule to apply. A start poster keeps an autoplaying `Media/Video` from jumping when playback begins. A frame from the middle tells a visitor what the recording is about before they commit to it – and on touch devices `Media/Video` never autoplays, so the poster is the thumbnail they tap. Both readings are in use on purpose, on landing pages as well as in the documentation. Leave the poster an existing page references as it is.

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

A poster that does not exist fails the build, named alongside the page that links it. A `src` that does not exist does not: it points at the bucket and is never fetched while building, so check that spelling against the upload output.
