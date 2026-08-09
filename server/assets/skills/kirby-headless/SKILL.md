A free Kirby CMS plugin that exposes content as JSON for a decoupled frontend. It serves the content; the client is yours to build.

## Install

```bash
composer require johannschopplich/kirby-headless
```

## The one option that decides everything else

Its config namespace is the bare `headless` key, not `johannschopplich.headless` — the plugin predates the vendor-prefixed convention its siblings follow.

```php [site/config/config.php]
return [
    'headless' => [
        'token' => env('KIRBY_API_TOKEN'),
        'globalRoutes' => true,
    ],
];
```

`globalRoutes` is the fork in the road. Left off, Kirby routes as usual and the plugin only adds its endpoints. Turned on, a catch-all serves **every** page as JSON and Kirby stops rendering HTML — which is what a decoupled site wants and what a hybrid site must avoid.

## Token behavior, exactly

The token gate has three states, and the middle one is the trap:

- **Unset** — authentication is off and the whole site is public. Supported for genuinely public APIs.
- **Set but blank** (empty or whitespace, typically an env var that failed to resolve) — every request gets `401`. This is deliberate: an unresolved variable must never open a site by accident.
- **Set** — the bearer token is required.

Media URLs under `/media/**` never require the token; Kirby serves them from its own routes, which is why `$file->url()` keeps working in a browser. Clean file URLs like `/about/hero.jpg` do require it, and additionally need Kirby's `content.fileRedirects`, which is off by default.

Setting `kql.auth` to `'bearer'` without a `headless.token` authenticates nobody, so `/api/kql` silently falls back to Kirby's native API auth. Set `kql.auth` to `false` when the endpoint should be public on purpose.

<https://kirby.tools/docs/headless/configuration/authentication.md>

## CORS is Kirby's, not the plugin's

Since Kirby 5.2.0 CORS lives in core under the top-level `cors` key. Configure it there.

<https://kirby.tools/docs/headless/configuration/cors.md>

## Choosing a response shape

| Need                                                                   | Reach for                                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Query the content tree from the client                                 | KQL — `references/kql.md`                                                 |
| Shape the response in PHP: aggregations, computed fields, outside data | JSON templates — `references/json-templates.md`                           |
| A hand-built endpoint with its own routes                              | API builder — <https://kirby.tools/docs/headless/advanced/api-builder.md> |

Field and page methods (`toResolvedBlocks()`, `toResolvedLayouts()` and friends) exist to flatten Kirby's nested field values into something a frontend can consume directly, and apply to both shapes:
<https://kirby.tools/docs/headless/usage/field-methods.md>
