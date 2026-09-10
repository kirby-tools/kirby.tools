## Install

```bash
composer require johannschopplich/kirby-minimap
```

Or extract the ZIP from the releases page into `site/plugins/`.

The minimap appears next to the site view and every page view; there is no `config.php` namespace and no blueprint section to add.

<https://kirby.tools/docs/minimap.md>

## When a Field or Block Is Missing From the Outline

`gap`, `hidden`, `line`, `title`, and `slug` are never listed. Everything else follows the open tab, so a field on another tab is not missing, only elsewhere. Only a `blocks` field unfolds into its blocks: a `layout`, `structure`, or `object` field is one entry, and the blocks inside it stay hidden.

<https://kirby.tools/docs/minimap/fields-support.md>
