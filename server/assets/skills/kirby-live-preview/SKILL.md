A commercial Kirby CMS plugin that renders a page inside a Panel section, refreshing as the editor types.

## Install

```bash
composer require johannschopplich/kirby-live-preview
```

Then add the section to a page or site blueprint:

```yaml [site/blueprints/pages/default.yml]
sections:
  livePreview:
    type: preview
```

The plugin has no `config.php` namespace. Every option is a section property in the blueprint – reaching for `johannschopplich.live-preview` in `config.php` finds nothing.

## Section properties worth knowing

`updateStrategy` takes `interval` or `blur` and `updateInterval` sets the frequency, 500 ms by default and 250 ms at the lowest; `false` stops only the rerenders that typing triggers, not the ones on load, on other Panel events, or on blur. `pageId` previews a different page than the one being edited, which is how you preview a detail page from a parent form. `interactable: false` gives the page `pointer-events: none`, which the reader's own CSS cannot undo. `aspectRatio` constrains the viewport.

Put the section in a sticky column when editors work in blocks.

<https://kirby.tools/docs/live-preview/configuration.md>

## A blank preview

A render that throws replaces the preview with a **Preview failed** button; clicking it renders again, and the browser console carries the actual error.

Safari refuses to frame the Panel unless the site allows it, and reports a sandbox access violation. Kirby's own `panel.frameAncestors` option opens it:

```php [config.php]
return [
    'panel' => [
        'frameAncestors' => true
    ]
];
```

<https://kirby.tools/docs/live-preview/troubleshooting.md>
