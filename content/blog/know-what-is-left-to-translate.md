---
title: Know What's Left to Translate
description: Translation Coverage shows which languages and pages still need attention across your multilingual Kirby site.
date: "2026-07-03"
badge:
  label: Update
---

A multilingual site is never really finished. Existing content changes, new pages are added, and translations that were complete last week quietly fall behind.

So a question keeps coming back, and often it comes from someone else – a colleague, a client, whoever is waiting on the launch: is the German version actually ready? On a small site you can answer by hand, opening a few pages and checking each language. Once the page tree grows, you can't – missing content sits several levels deep, and there's no single place to see the overall state of a project.

I kept hitting that same question with no quick way to answer it: what's left to translate? Translation Coverage adds that answer to the Kirby Panel.

![Translation Coverage view in the Languages panel showing per-language completion rings and a focused tree of pages with missing translations](/img/kirby-content-translator-translation-coverage.png)

## One Place to See What's Missing

Open the **Languages** view in the Panel and each secondary language now has its own completion ring. You can see at a glance whether a translation is nearly done, only just started, or complete.

Below the rings, the **Pages to Translate** tree lists every page with missing content. It deliberately leaves out completed branches while keeping the parent pages needed for orientation. Instead of searching through the entire site, you get a focused list of the places that still need attention.

This is particularly useful for existing sites with years of content. Translation work no longer depends on remembering which sections were added recently or keeping a separate spreadsheet up to date. The current state of the content becomes the checklist.

## What the Percentage Means

Coverage follows the same field rules as Content Translator itself: a field counts once it is translatable and has content in the default language, and it is complete when its translation is not empty. Empty source fields don't create phantom tasks, and fields you exclude in your blueprints don't affect the result. The number stays tied to real work.

It also has a deliberate boundary. Coverage tells you whether content is _present_, not whether a translation is current or well written. It can't tell you that an existing translation drifted out of date after the source text changed – that still takes editorial judgment. What it removes is the mechanical part: finding the empty translations in the first place.

## From Spotting a Gap to Filling It

The view isn't just a report. Every entry links directly to its Panel page, so you move from spotting a gap to filling it in with a single click.

That makes it part of everyday editorial work: check a language, open an incomplete page, translate the missing fields, move on to the next one. As the content changes over time, the overview changes with it.

When everything is translated, the tree of pages disappears. The completion rings stay at 100% – the only confirmation you need.

Translation Coverage is available with Content Translator on Kirby 5, and it stays responsive even on sites with thousands of pages. Update to the latest version, open `/panel/languages`, and see what your site still has left to translate.

[Learn more about Translation Coverage](/docs/content-translator/panel/translation-coverage)
