---
title: Kirby SEO Audit v3.5 – The Verdict Before the Report
description: The analysis reads your unsaved changes, sums them up in two lights, and leaves a rating on every page it has seen.
date: "2026-09-16"
product: seo-audit
badge:
  label: Release
---

Until now, Kirby SEO Audit told you everything or nothing. You opened the report and got the full list of checks, or you didn't open it and knew nothing about the page. Most editors opened it only when they already suspected something was wrong. And whatever it told you was about the published page, not the text you were still editing.

Version 3.5 changes both.

## The Verdict First

The analysis now reads what your form shows. Edit the intro, click the button, and the report rates the intro you just wrote. The report says which version it looked at – "Unsaved changes" or "Published version" – so there's no guessing.

It also opens with a light for SEO and one for readability, the same way Yoast sums up a post. Each light sums up its half of the results, so you know which half needs work before you read a single one. The list of checks is still there, but the verdict comes first.

:::::panel-mock
::::panel-dialog{size="large"}
:::panel-seo-audit-result
---
title: SEO Audit
ratings:
  seo:
    rating: ok
  readability:
    rating: good
results:
  seo:
    - rating: good
      text: >-
          <a href="https://yoa.st/33z">Internal links</a>: You have enough internal links. Good job.
    - rating: good
      text: >-
          <a href="https://yoa.st/34h">SEO title width</a>: Good job.
    - rating: ok
      text: >-
          <a href="https://yoa.st/34d">Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. <a href="https://yoa.st/34e">Use the space</a>.
  readability:
    - rating: good
      text: >-
          <a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.
    - rating: good
      text: >-
          <a href="https://yoa.st/34v">Sentence length</a>: Great.
version: changes
timestamp: "2026-09-16T09:40"
---
:::
::::
:::::

## A Rating on Every Page

Every analysis leaves a rating behind, per page and language. The view button shows it as a colored dot, so the header tells you where a page stands before you open anything. Publish the page again and the dot gets an exclamation mark: the rating is stale, older than the content it describes.

::::panel-mock
:::panel-view-header
---
title: Our Studio
buttons:
  - text: SEO Audit
    icon: seo-audit-analyze
    theme: positive-icon
    responsive: true
    badge:
      theme: negative
      text: "!"
  - icon: window
  - icon: cog
    dropdown: true
  - text: Public
    icon: status-listed
    theme: positive-icon
---
:::
::::

If you'd rather not click at all, set `auto: publish`. The analysis then runs on its own after you publish your changes, without a dialog or a notification, and the rating keeps up with the content.

The rating is available in blueprints and templates too. A pages section can show it per page and sort by it, which turns a section into a to-do list of the pages that need work:

```yaml [sections/articles.yml]
type: pages
info: "{{ page.seoAuditRating }}"
sortBy: seoAuditScore asc
```

## What It Changes

I used to open the report to find out whether a page needed work. Now the header tells me, and the report confirms it with two lights before I read a single result. The list is still there for the fix, but the question I actually had is answered on the way in.

The update is free for every v3 license. Update, open a page, click the button once, and the dot stays with the page from then on.

[Read the ratings guide](/docs/seo-audit/guide/ratings)
