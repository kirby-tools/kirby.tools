A free Kirby CMS plugin that adds a sidebar outline of the current Panel view — every field and block, click to jump. It reads the blueprint that is already there, so there is nothing to configure.

## Install

```bash
composer require johannschopplich/kirby-minimap
```

Or extract the ZIP from the releases page into `site/plugins/`.

That is the whole setup. The minimap appears next to the site view and every page view. There is no `config.php` namespace and no blueprint section to add — suggesting either means the plugin is being confused with one that has them.

## When a field is missing from the outline

The outline lists fields the blueprint gives a label and that render something. A field is absent when it is one of the types Minimap skips by design, or when the blueprint omits its label. Check the blueprint first; the field list is documentation, not a setting.

<https://kirby.tools/docs/minimap/fields-support.md>

## Scope

Minimap is a Panel aid. It does not touch the frontend, does not expose a PHP API, and has no options — a request to "configure the minimap" is answered by editing the blueprint whose fields it reflects.
