## Install

```bash
composer require johannschopplich/kirby-live-preview
```

Then add the section to a page or site blueprint. A sticky column keeps the preview beside a long blocks field:

```yaml [site/blueprints/pages/default.yml]
columns:
  - width: 2/3
    fields:
      blocks:
        type: blocks

  - width: 1/3
    sticky: true
    sections:
      livePreview:
        type: preview
```

The plugin has no `config.php` namespace – every option is a section property.

<https://kirby.tools/docs/live-preview.md>

## When It Rerenders

`updateStrategy: blur` rerenders when a Panel element loses focus instead of while the editor types. `updateInterval: false` stops only the rerenders typing triggers, not the ones on load, on blur or from the toolbar button. `updateInterval` takes an integer or `false`; anything else throws when the section loads.

<https://kirby.tools/docs/live-preview/configuration.md>

## What It Shows

The section renders the page being edited; on the site blueprint that is the home page, and `pageId` picks another page. `aspectRatio` takes `width/height`, so `16/9` renders and `16:9` throws when the section loads.

<https://kirby.tools/docs/live-preview/configuration.md>

## What Editors Can Click

A link inside the preview opens the matching Panel view; `data-preview-ignore` on the anchor keeps it an ordinary link, another origin opens a tab, and `/assets/` or `/media/` links do nothing. `interactable: false` makes the page inert with `pointer-events: none`, which the site's own CSS cannot undo.

<https://kirby.tools/docs/live-preview/preview-mode.md>

## Hiding Parts of the Page in Preview

`$page->previewMode()->isTrue()` in a template and `[data-preview-mode]` on `<html>` in CSS or JavaScript mark the preview render. Cookie banners and page transitions go behind them.

<https://kirby.tools/docs/live-preview/preview-mode.md>

## A Blank Preview

A render that throws replaces the preview with a **Preview failed** button; the button carries no detail, the browser console has the error. Three causes come up: the page has no template file, the template renders no `<head>` tag, and the template raised an error on the unsaved content it was handed.

Safari refuses to frame the Panel unless the site allows it, and reports a sandbox access violation. Kirby's own `panel.frameAncestors` option opens it:

```php [config.php]
return [
    'panel' => [
        'frameAncestors' => true
    ]
];
```

<https://kirby.tools/docs/live-preview/troubleshooting.md>
