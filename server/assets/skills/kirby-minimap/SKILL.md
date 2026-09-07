A Kirby CMS plugin that adds a sidebar outline of the current Panel view – every field and block, click to jump. It reads the blueprint that is already there, so there is nothing to configure.

## Install

```bash
composer require johannschopplich/kirby-minimap
```

Or extract the ZIP from the releases page into `site/plugins/`.

That is the whole setup. The minimap appears next to the site view and every page view. There is no `config.php` namespace and no blueprint section to add.

## When a field is missing from the outline

`gap`, `hidden` and `line` are skipped, at the top level and inside block fields alike. `title` and `slug` are dropped too, since they live in the Panel header rather than the content area. `headline` and `info` stay, as the landmarks they are in the form. The outline follows the open tab, so a field on another tab is not missing, only elsewhere.

<https://kirby.tools/docs/minimap/fields-support.md>

## Scope

Minimap is a Panel aid. It does not touch the frontend, does not expose a PHP API, and has no options – a request to "configure the minimap" is answered by editing the blueprint whose fields it reflects.
