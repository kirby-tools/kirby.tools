A commercial Kirby CMS plugin that fetches a page's rendered HTML and scores it against a keyphrase, inside the Panel.

## Install

```bash
composer require johannschopplich/kirby-seo-audit
```

## Add it to a blueprint

Two surfaces, and they can coexist. The view button is the recommended one:

```yaml [site/blueprints/pages/default.yml]
buttons:
  - seo-audit
  - open
  - preview
  - "-"
  - settings
  - languages
  - status
```

`buttons` is an allow-list, so Kirby's page defaults have to be named alongside `seo-audit` or they disappear. Site views default to `open`, `preview`, `languages`.

The section renders results inline instead of in a dialog and adds `persisted`; `theme` belongs to the button alone. Everything else, `label` included, is shared, and both resolve Kirby queries in `keyphrase` and `synonyms`:

```yaml [site/blueprints/pages/default.yml]
sections:
  seoAudit:
    type: seo-audit
```

Both need an HTML preview URL, so file views are out of scope.

## Wiring the keyphrase

Keyphrase assessments are skipped until the page supplies a keyphrase, unless `assessments` names them explicitly. Two ways, and they answer different questions:

- `keyphraseField` names a blueprint field the editor fills in. Reach for this when each page has its own target term.
- `keyphrase` sets it from the blueprint or a Kirby query. Reach for this when the term is derived, e.g. from the page title.

`synonymsField` and `synonyms` mirror the pair. `assessments` narrows the report to the checks that matter for the template; `contentSelector` scopes the analysis to the markup that is actually content, e.g. `#main`, which keeps navigation and footer text out of the word count.

<https://kirby.tools/docs/seo-audit/configuration/local.md>

## When the fetch fails

A preview URL on the Panel's own origin is fetched by the browser, and none of this applies. Any other origin is fetched by Kirby on the server, so anything that hides the frontend from the server hides it from the audit.

- Kirby in Docker reaching a host-machine frontend: rewrite the URL with `johannschopplich.seo-audit.proxy.urlResolver`, a closure that receives the URL and returns the one the proxy fetches instead. It has to return a non-empty string or the request fails.
- Preview URL behind HTTP auth: pass credentials through `johannschopplich.seo-audit.proxy.params`, which forwards any parameter Kirby's `Remote::request()` accepts.

<https://kirby.tools/docs/seo-audit/configuration/global.md>

## Auditing a decoupled frontend

Point the blueprint's `options.preview` at the frontend and the audit follows it – it analyzes whatever that URL returns, not Kirby's own templates.
