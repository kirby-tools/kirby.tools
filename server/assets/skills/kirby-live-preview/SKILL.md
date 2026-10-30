## Install

```bash
composer require johannschopplich/kirby-live-preview
```

Then add the field to a page or site blueprint:

```yaml [site/blueprints/pages/default.yml]
fields:
  livePreview:
    type: preview
```

`sticky: true` on the field's column keeps the preview beside a long blocks field.

The plugin has no `config.php` namespace – every option is a field property.

<https://kirby.tools/docs/live-preview.md>

## When It Rerenders

The preview rerenders once the editor pauses typing for `updateInterval` milliseconds. `updateInterval: false` stops only those rerenders; the preview still renders on load and from the **Refresh preview** button.

<https://kirby.tools/docs/live-preview/configuration.md>

## What It Shows

The field renders the page being edited. On the site blueprint that is the home page. `pageId` picks another page. `aspectRatio` takes `width/height`, so `16/9` renders and `16:9` shows an error in place of the field.

<https://kirby.tools/docs/live-preview/configuration.md>

## What Editors Can Click

A link inside the preview opens the matching Panel view. `data-preview-ignore` on the anchor keeps it an ordinary link. `/assets/` or `/media/` links do nothing. `interactable: false` makes the page inert. A site rule that sets `pointer-events` with `!important` wins over it.

<https://kirby.tools/docs/live-preview/preview-mode.md>
<https://kirby.tools/docs/live-preview/configuration.md#interactable>

## Hiding Parts of the Page in Preview

`$page->previewMode()->isTrue()` in a template and `[data-preview-mode]` on `<html>` in CSS or JavaScript mark the preview render. Cookie banners and page transitions go behind them.

<https://kirby.tools/docs/live-preview/preview-mode.md>

## A Blank Preview

A render that throws replaces the preview with a **Preview failed** button. The button carries no detail. The browser console has the error. These causes come up:

- Neither the page's template nor `default.php` exists.
- `pageId` names a page that doesn't exist or that the editor's role can't access.
- The template renders no `<head>` tag.
- The template or its controller raised an error on the unsaved content it was handed.

Safari refuses to frame the Panel unless the site allows it, and reports a sandbox access violation. Kirby's own `panel.frameAncestors` option opens it:

```php [site/config/config.php]
return [
    'panel' => [
        'frameAncestors' => true
    ]
];
```

<https://kirby.tools/docs/live-preview/troubleshooting.md>
