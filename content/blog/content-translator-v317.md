---
title: Kirby Content Translator v3.17 – Modules Included
description: A translation started from a page now also translates the pages and files its blueprint names – modules, image metadata, and child pages – and saves them directly.
date: "2026-09-26"
product: content-translator
---

[Kirby Modules](https://github.com/medienbaecker/kirby-modules) builds a page out of modules, and every module is a page of its own. Editors don't notice – they edit the modules inline on the parent page, as if they were one form. Content Translator noticed. Click **Translate** on such a page, and the title and intro came back in German while every module below them stayed in English. Most of the page's content lives in those modules, and translating them meant going through them one by one.

Modules are the clearest case, not the only one. The alt texts and captions of a page's images live in the files' own content. An overview page is often little more than the sum of its children. The editor thinks of all of it as the page, but the translation stopped at the page's own fields.

Version 3.17 lets the blueprint say where the page ends.

## One Line in the Blueprint

The new `cascade` option takes a [Kirby query](https://getkirby.com/docs/guide/blueprints/query-language) for the pages and files that belong to the page. For Kirby Modules, that's the children of the `modules` container:

```yaml [site/blueprints/pages/default.yml]
sections:
  contentTranslator:
    type: content-translator
    cascade: page.find("modules")?.children
  modules:
    type: modules
```

The view button takes the same option. From then on, every translation started from this page translates its modules too. `page.files` brings the image metadata along, `page.children.listed` the articles of an overview page, and a list combines them.

## What the Editor Sees

Before anything is translated, the dialog counts what comes along:

:::panel-mock
::panel-dialog
---
size: medium
buttons:
  - icon: cancel
    text: Cancel
  - icon: translate
    text: Translate
    theme: positive
fields:
  languages:
    type: checkboxes
    label: Translate to
    options:
      - value: de
        text: Deutsch
      - value: fr
        text: Français
    help: Content from English will be translated and saved to all selected languages. This may take a few seconds. 4 pages will also be translated and saved directly.
value:
  languages:
    - de
    - fr
---
::
:::

That count is worth a glance. A typo in the query doesn't raise an error – it finds fewer pages, or none, and then the sentence is missing from the dialog.

The second half of that sentence matters more. Translating into the language you have open still puts the page's own fields into the form, where you review them and save or discard as usual. The modules have no form open, so they're saved directly either way – **Discard** on the page doesn't take them back. When the run finishes, the view reloads, and the modules section shows the translated modules.

One habit carries over from Kirby Modules itself: inline module edits are unsaved changes until you save the page. A module whose default language has unsaved changes is held back rather than translated from an outdated version, and the report says which one. Save first, then translate.

## Where It Stops

Every page and file in the cascade is a translation of its own, in every language you select. That's the point, and it's also what you pay for – with DeepL or an AI provider, a query like `site.index` translates the whole site from a single button. I'd keep queries as narrow as the page actually is.

The cascade also respects what the editor may do. Pages and files the current user can't edit are left out, and one that another user is editing right now is skipped and named in the report.

## What It Changes

On a site built with Kirby Modules, the translator button finally means what an editor assumes it means: this page, in another language, the way it looks in the Panel. One line in the blueprint, and nobody has to remember that the page they see is a dozen pages underneath.

The update is free for every v3 license. The documentation covers the rest: which options a module inherits from its page and how to reach nested modules.

[Read how to translate related pages and files](/docs/content-translator/advanced/cascade)
