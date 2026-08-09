A commercial Kirby CMS plugin that fetches a page's rendered HTML and scores it against a keyphrase, inside the Panel. It **audits** output – it does not render meta tags. Producing the tags stays your template's job.

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

The section renders results inline instead of in a dialog, and adds two properties the button lacks – `label` and `persisted` – plus Kirby query resolution in `keyphrase` and `synonyms`:

```yaml [site/blueprints/pages/default.yml]
sections:
  seoAudit:
    type: seo-audit
```

Both need an HTML preview URL, so file views are out of scope.

## Wiring the keyphrase

Nothing keyword-related is scored until the page supplies a keyphrase. Two ways, and they answer different questions:

- `keyphraseField` names a blueprint field the editor fills in. Reach for this when each page has its own target term.
- `keyphrase` sets it from the blueprint or a Kirby query. Reach for this when the term is derived, e.g. from the page title.

`synonymsField` and `synonyms` mirror the pair. `assessments` narrows the report to the checks that matter for the template; `contentSelector` scopes the analysis to the markup that is actually content, e.g. `#main`, which keeps navigation and footer text out of the word count.

<https://kirby.tools/docs/seo-audit/configuration/local.md>

## When the fetch fails

The plugin retrieves the preview URL through a server-side proxy, so anything that hides the frontend from the server hides it from the audit.

- Kirby in Docker reaching a host-machine frontend: rewrite the URL with `johannschopplich.seo-audit.proxy.urlResolver`, a closure that receives the URL and returns a reachable one.
- Preview URL behind HTTP auth: pass credentials through `johannschopplich.seo-audit.proxy.params`, which forwards any parameter Kirby's `Remote::request()` accepts.

<https://kirby.tools/docs/seo-audit/configuration/global.md>

## Auditing a decoupled frontend

Point Kirby's page preview URL at the frontend and the audit follows it – it analyzes whatever the preview URL returns, not Kirby's own templates.

## License

Runs unlicensed in local development. Production needs a key, activated in the Panel's system view and written to `site/config/.kirby-tools-licenses` – add that file to `.gitignore`.
