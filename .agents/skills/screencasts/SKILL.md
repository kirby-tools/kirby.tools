---
name: screencasts
description: Add or replace a Panel screencast – upload, posters, content wiring.
disable-model-invocation: true
---

# Adding a Screencast

Videos live in the `kirby-tools-assets` R2 bucket, posters in `public/screencasts/`. Only the posters are in git.

## Run

Record at 1816×1080, name the file `kirby-<plugin>-<feature>.mp4`, drop it in `.data/screencasts/`, then:

```bash
.agents/skills/screencasts/upload.sh .data/screencasts/kirby-copilot-inline-suggestions.mp4@00:04
```

Everything after `@` is the timestamp of the frame to freeze as `-poster.jpg`. Without arguments the script takes every recording in `.data/screencasts/`. Re-running skips what already matches the bucket.

Nothing is ever deleted from the bucket, so a re-recording needs a new filename.

## Posters

The script writes `-poster-start.jpg` from the first frame and `-poster.jpg` from the timestamp. Which of the two a page references was decided per video, so leave existing references as they are.

## Wiring

Documentation page under `content/1.docs/`:

```md
:prose-video{src="/screencasts/<name>.mp4" poster="/screencasts/<name>-poster.jpg" width="908" height="540"}
```

Product page `index.yml`:

```yaml
video:
  src: /screencasts/<name>.mp4
  poster: /screencasts/<name>-poster-start.jpg
  label: What the recording shows, in one sentence
```

A poster that does not exist fails the build. A misspelled `src` does not.
