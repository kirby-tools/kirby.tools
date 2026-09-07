## Install

```bash
composer require johannschopplich/kirby-seo-audit
```

## Add It to a Blueprint

Two surfaces, and they can coexist. The view button is the recommended one:

```yaml [site/blueprints/pages/default.yml]
buttons:
  seo-audit:
    keyphraseField: metaKeyphrase
  open: true
  preview: true
  settings: true
  languages: true
  status: true
```

`buttons` is an allow-list, so Kirby's defaults for the view have to be named alongside `seo-audit` or they disappear.

The section renders results inline instead of in a dialog and adds `persisted`; `theme` belongs to the button alone:

```yaml [site/blueprints/pages/default.yml]
sections:
  seoAudit:
    type: seo-audit
```

<https://kirby.tools/docs/seo-audit/configuration/local.md>

## Wiring the Keyphrase

Keyphrase assessments are skipped until the page supplies a keyphrase, unless `assessments` names them explicitly. Two ways, and they answer different questions:

- `keyphraseField` names a blueprint field the editor fills in. Reach for this when each page has its own target term.
- `keyphrase` sets it from the blueprint or a Kirby query. Reach for this when the term is derived, e.g. from the page title.

`synonymsField` and `synonyms` mirror the pair. A Kirby query resolves only in a string; a `{{ }}` inside a `synonyms` list stays unresolved, so a query goes in `synonyms: "{{ page.metaSynonyms }}"`.

`assessments` narrows the report to the checks that matter for the template; `contentSelector` scopes the analysis to the markup that is content, e.g. `#main`.

<https://kirby.tools/docs/seo-audit/configuration/local.md>

## When the Audit Fails

The audit analyzes whatever the model's preview URL returns, so a decoupled frontend is audited by pointing the blueprint's `options.preview` at it. A preview URL on the Panel's own origin is fetched by the browser. Any other origin is fetched by Kirby on the server, so anything that hides the frontend from the server hides it from the audit:

- Kirby in Docker reaching a host-machine frontend: rewrite the URL with `johannschopplich.seo-audit.proxy.urlResolver`, a closure that receives the URL and returns the one to fetch. Return the URL unchanged when it needs no rewrite.
- Preview URL behind HTTP auth: pass `basicAuth` through `johannschopplich.seo-audit.proxy.params`.

Failures that are not the fetch:

- `options.preview: false` in the blueprint stops the audit with the error that the preview URL is disabled.
- An assessment listed in `assessments` that does not support the page's `lang` aborts the analysis with an error naming the languages it supports; unlisted, it is skipped silently.
- `logLevel: info` prints the fetched URL and the extracted HTML to the browser console, which is the check for `contentSelector` and for a proxy rewrite.

<https://kirby.tools/docs/seo-audit/configuration/global.md>
<https://kirby.tools/docs/seo-audit/guide/audit-url.md>
