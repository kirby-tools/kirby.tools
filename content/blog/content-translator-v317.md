---
title: Kirby Modules Plugin Now Supported
description: A translation started from a page now also translates the pages and files its blueprint names – modules, image metadata, and child pages – and saves them directly.
date: "2026-09-28"
product: content-translator
---

Last weekend, the Kirby community met in Mainz for the first Kirby Konf – six years after the planned 2020 edition was called off two weeks before it began. I had planned to be there this year, but I had just become a father, so I cancelled with a heavy heart.

One of the speakers was Thomas Günther of [Medienbäcker](https://www.medienbaecker.com), the maker of [Kirby Modules](https://github.com/medienbaecker/kirby-modules). Greetings from afar, Thomas: Content Translator v3.17 translates Kirby Modules, as some of you had asked.

His plugin builds a page out of modules, and every module is a page of its own. Editors don't notice – they edit the modules inline on the parent page, as if they were one form. Content Translator did: **Translate → Deutsch** on such a page translated the title and intro and left every module below them in English. Most of the page's content lives in those modules, and translating them meant going through them one by one.

Modules are the clearest case, not the only one. The alt texts and captions of a page's images live in the files' own content. An overview page is often little more than the sum of its children. The translation stopped at the page's own fields.

Now all of them come along with the page, once the blueprint names them.

## One Line in the Blueprint

The new `cascade` option takes a [Kirby query](https://getkirby.com/docs/guide/blueprints/query-language) for the pages and files that belong to the page. For Kirby Modules, that's the children of the `modules` container:

```yaml [site/blueprints/pages/default.yml]
buttons:
  open: true
  preview: true
  settings: true
  content-translator:
    cascade: page.find("modules")?.children
  languages: true
  status: true

sections:
  modules:
    type: modules
```

The map replaces Kirby's default buttons, so it names each one to keep. From then on, **Translate** on this page translates the modules too. The Content Translator section takes the same option; with both on one page, give them the same query. `page.files` brings the image metadata along, `page.children.listed` the articles of an overview page, and a list combines them.

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

Translating into the language you have open still puts the page's own fields into the form, where you review them and save or discard as usual. The modules have no form open, so they're saved directly – **Discard** on the page doesn't take them back. When the run finishes, the view reloads, and the modules section shows the translated modules.

In Kirby Modules, inline module edits stay unsaved changes until you save the page. A module whose default language has unsaved changes is held back rather than translated from an outdated version, and the report says which one. Save first, then translate.

## Where It Stops

Every page and file in the cascade is a translation of its own, in every language you select. Each one is billed by your DeepL or AI provider, and a query like `site.index` translates the whole site from a single button. I'd keep queries as narrow as the page actually is.

Pages and files the current user can't edit are left out of the cascade, and one that another user is editing right now is held back and named in the report.

## What It Changes

On a site built with Kirby Modules, **Translate** now covers what the editor sees on the page: its own fields and every module below them, in one run.

The update is free for every v3 license. The documentation covers the rest: which options a module inherits from its page and how to reach nested modules.

[Read how to translate related pages and files](/docs/content-translator/advanced/cascade)
