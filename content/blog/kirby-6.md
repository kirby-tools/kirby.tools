---
title: Ready for Kirby 6
description: Each Kirby Tools plugin with a Panel part has a Kirby 6 major. What you move in your blueprints, which license covers it, and what changed on the way.
date: "2026-11-24"
---

Kirby 6 is out, and every Kirby Tools plugin with a Panel part runs on it: Kirby Copilot v4, Kirby Content Translator v4, Kirby SEO Audit v4, Kirby Live Preview v3, and the free Kirby SERP Preview v2, Kirby Minimap v2, and Kirby Deploy Trigger v2. Kirby Headless and Kirby Helpers need no new major – their current versions run on Kirby 5 and 6.

Kirby 6 rebuilds the Panel on Vue 3 and removes the section type plugins used to register. Each major is a port to that Panel, and each runs on Kirby 6 only. A site that stays on Kirby 4 or 5 keeps its current versions, and they keep working. The last major before Kirby 6 of each plugin gets security and critical fixes for six months after Kirby 6's release.

## From `sections:` to `fields:`

Every plugin that was a section is a field on Kirby 6, with the same type name, so the upgrade moves its entry from `sections:` to `fields:`:

```diff [site/blueprints/pages/default.yml]
-sections:
+fields:
   seoAudit:
     type: seo-audit
     keyphraseField: metaKeyphrase
```

Every property that remains keeps its name, and so do the view buttons: `copilot`, `content-translator`, and `seo-audit` under `buttons:` work as before. An entry you forget renders a red **Invalid section type** box in its place and touches no content, so you find it on the first visit to that page.

A blueprint that keeps other sections under `sections:` – `pages`, `files`, `info`, or `stats` – is the exception: `fields:` beside `sections:` renders none of its fields and shows no error, so the moved entry goes into a tab or column.

Update Kirby and the plugins in the same deployment – Composer won't install a Kirby 6 major on a Kirby 4 or 5 site.

## Which License Covers It

A Generation 3 license includes the Kirby 6 majors – install them and you're done. A Generation 1 or 2 license stops at the earlier majors and upgrades to Generation 3 at 50% off in the [Hub](https://hub.kirby.tools). The upgrade issues a new license key, which you activate in the Panel like the old one.

Your current license stays valid for the versions it covers, so a site that stays on Kirby 4 or 5 needs no new license.

## What Changed on the Way

Most of each port is invisible: the same assessments, the same translations, the same providers.

- **Copilot's prompt composer** – the Copilot field shows its prompt right away, with attached files as tags and its buttons in a bar below. :kbd{value="meta"} :kbd{value="enter"} starts a generation. Copilot no longer ships built-in prompt templates; for prompts every editor shares, set `promptTemplates` in the config.
- **Content Translator drops `confirm`** – **Import** no longer asks for confirmation, even where a site set `confirm: true`. The imported fields arrive as unsaved changes, and **Discard** reverts them.
- **SEO Audit starts some stored reports over** – a field named with capitals, like `seoAudit`, shows no report until its next analysis. Ratings carry over.

## Before You Upgrade

You need PHP 8.3 or newer and a Generation 3 license for each commercial plugin. Then move the entries, deploy, and open a page of each blueprint once.

The [Kirby 6 upgrade guide](/upgrading-to-kirby-6) has the move for every plugin, the blueprint layouts where `fields:` needs a tab or column, and the removed properties per plugin.
