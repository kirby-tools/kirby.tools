A commercial Kirby CMS plugin that renders a page inside a Panel section, refreshing as the editor types. It previews **Kirby-rendered** pages; a decoupled frontend that renders outside Kirby is out of scope.

## Install

```bash
composer require johannschopplich/kirby-live-preview
```

Then add the section to a page or site blueprint:

```yaml [site/blueprints/pages/default.yml]
sections:
  livePreview:
    type: live-preview
```

The plugin has no `config.php` namespace. Every option is a section property in the blueprint — reaching for `johannschopplich.live-preview` in `config.php` finds nothing.

## Section properties worth knowing

`updateStrategy` and `updateInterval` decide when the iframe re-renders; `pageId` previews a different page than the one being edited, which is how you preview a detail page from a parent form. `interactable` decides whether clicks reach the preview, and `aspectRatio` constrains the viewport.

Put the section in a sticky column when editors work in blocks — side-by-side is the case the plugin was built for.

<https://kirby.tools/docs/live-preview/configuration.md>

## A blank preview in Safari

Safari refuses to frame the Panel unless the site allows it. Add `frameAncestors` to `config.php`; this is a Kirby CSP option, not a plugin option.

<https://kirby.tools/docs/live-preview/troubleshooting.md>

## License

Runs unlicensed in local development. Production needs a key, activated in the Panel's system view and written to `site/config/.kirby-tools-licenses` — add that file to `.gitignore`.
