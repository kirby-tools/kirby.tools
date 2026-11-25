---
title: Ready for Kirby 6
description: Every Kirby Tools plugin with a Panel part has a Kirby 6 major – a move from sections to fields, included in a Generation 3 license.
date: "2026-11-24"
---

Kirby 6 is out, and the Panel [runs on Vue 3](https://getkirby.com/releases/6/foundation#vue-3). As a Vue lover, I've waited a long time for this one.

Every Kirby Tools plugin with a Panel part has a new major for it. These run on Kirby 6 only. A site that stays on Kirby 4 or 5 keeps its current versions and its license, and the last major before Kirby 6 of each plugin gets security and critical fixes for six months after Kirby 6's release.

## Too Good Not to Get Sherlocked

Kirby 6 turns the preview view into a [live editor](https://getkirby.com/releases/6/live-editor): your site next to the form, updated as you edit. When I built Live Preview, a preview of unsaved changes was one of the most requested features for the Panel.

That's bittersweet, and mostly sweet: Kirby building it in is the nicest compliment a plugin can get. Or, as Nico of the Kirby core team said on Discord:

> It was too good to not get sherlocked eventually.

## Sections Become Fields

Every plugin that was a section is now a field with the same type name, so its entry moves from `sections:` to `fields:`:

```diff [site/blueprints/pages/default.yml]
-sections:
+fields:
   seoAudit:
     type: seo-audit
     keyphraseField: metaKeyphrase
```

One trap: at the top of a blueprint, `fields:` next to `sections:` renders none of its fields and shows no error. Where a blueprint keeps a `pages`, `files`, `info`, or `stats` section, the moved entry goes into a tab or column.

## What Editors Notice

Most of each port is invisible: the same assessments, the same translations, the same providers. The change editors notice most is the Copilot field. It shows its prompt right away, with attached files as tags and its buttons in a bar below:

:::panel-mock
::panel-copilot-field
---
userPrompt: Summarize the attached brief in five points.
fileNames: [brief.pdf]
---
::
:::

:kbd{value="meta"} :kbd{value="enter"} starts a generation. Copilot no longer ships built-in prompt templates; for prompts every editor shares, set `promptTemplates` in the config.

## Generation 3 Includes It

A Generation 3 license includes the Kirby 6 majors. A Generation 1 or 2 license stops at the earlier majors and upgrades to Generation 3 at 50% off in the [Hub](https://hub.kirby.tools).

The upgrade guide has the Composer command, the move for every plugin, and what each one removes.

[Read the Kirby 6 upgrade guide](/upgrading-to-kirby-6)
