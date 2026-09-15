---
title: Kirby SEO Audit v3.5 – The Verdict Before the Report
description: The analysis reads your unsaved changes, sums them up in two lights, and leaves a rating on every page it has seen.
date: "2026-09-15"
product: seo-audit
badge:
  label: Release
---

Until now, Kirby SEO Audit told you everything or nothing. You opened the report and got the full list of checks, or you didn't open it and knew nothing about the page. Most editors opened it only when they already suspected something was wrong. And whatever it told you was about the published page, not the text you were still editing.

Version 3.5 changes both.

## Unsaved Changes

The analysis now reads what your form shows. Edit the intro, click the button, and the report grades the intro you just wrote. The report says which version it looked at – "Unsaved changes" or "Published version" – so there's no guessing.

## Two Lights

The report opens with a light for SEO and one for readability, the same way Yoast sums up a post. The list of checks is still there, but the verdict comes first.

## A Rating on Every Page

Every analysis leaves a rating behind, per page and language. The view button shows it as a colored dot, so the header tells you where a page stands before you open anything. Publish the page again and the dot gets an exclamation mark: the rating is stale, older than the content it describes.

The rating is available in blueprints and templates too. A pages section can show it per page and sort by it, which turns a section into a to-do list of the pages that need work:

```yaml [sections/articles.yml]
type: pages
info: "{{ page.seoAuditRating }}"
sortBy: seoAuditScore asc
```

[Read the ratings guide](/docs/seo-audit/guide/ratings)

## Analyze on Publish

If you'd rather not click at all, set `auto: publish`. The analysis then runs on its own after you publish your changes, without a dialog or a notification, and the rating keeps up with the content.

The update is free for every v3 license.
