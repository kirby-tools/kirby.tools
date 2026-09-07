## Install

```bash
composer require johannschopplich/kirby-headless
```

## Configuration

Its config namespace is the bare `headless` key, not `johannschopplich.headless`.

```php [site/config/config.php]
return [
    'headless' => [
        'token' => env('KIRBY_API_TOKEN'),
        'globalRoutes' => true,
    ],
];
```

`globalRoutes` is the fork in the road. Left off, Kirby routes as usual and the plugin only adds its endpoints. Turned on, a catch-all serves **every** page as JSON and Kirby stops rendering HTML – which is what a decoupled site wants and what a hybrid site must avoid.

## Token behavior

The token gate has three states, and the middle one is the trap:

- **Unset** – authentication is off and the whole site is public. Supported for genuinely public APIs.
- **Set but blank** (empty or whitespace, typically an env var that failed to resolve) – every guarded request gets `401`. This is deliberate: an unresolved variable must never open a site by accident.
- **Set** – the bearer token is required.

Media URLs under `/media/**` never require the token; Kirby serves them from its own routes, which is why `$file->url()` keeps working in a browser. Under `globalRoutes`, clean file URLs like `/about/hero.jpg` do require it, and additionally need Kirby's `content.fileRedirects`, which is off by default.

`/api/__sitemap__` and `/api/__template__` require the token too. They sit outside the catch-all and stay available with `globalRoutes` off, which also means they are public whenever no token is set.

Setting `kql.auth` to `'bearer'` without a `headless.token` authenticates nobody, so `/api/kql` silently falls back to Kirby's native API auth. Set `kql.auth` to `false` when the endpoint should be public on purpose.

<https://kirby.tools/docs/headless/configuration/authentication.md>

## Where the Panel's preview button sends an editor

`headless.panel` holds the frontend URL that `page.frontendUrl` resolves against, and `panel.redirect` decides what a browser gets when it opens the backend URL directly.

<https://kirby.tools/docs/headless/configuration/panel.md>

## CORS is Kirby's, not the plugin's

Since Kirby 5.2.0 CORS lives in core under the top-level `cors` key. Configure it there.

<https://kirby.tools/docs/headless/configuration/cors.md>

## Choosing a response shape

| Need                                                                   | Reach for     |
| ---------------------------------------------------------------------- | ------------- |
| Query the content tree from the client                                 | KQL           |
| Shape the response in PHP: aggregations, computed fields, outside data | JSON template |
| A hand-built endpoint with its own routes                              | API builder   |

Field and page methods apply to every shape: `toResolvedBlocks()`, `toResolvedLayouts()` and friends resolve the UUIDs inside a field to page and file objects, and `frontendUrl()`, `breadcrumbMeta()` and `i18nMeta()` build the navigation data a frontend needs.

<https://kirby.tools/docs/headless/advanced/api-builder.md>
<https://kirby.tools/docs/headless/usage/field-methods.md>
<https://kirby.tools/docs/headless/usage/page-methods.md>

## KQL

The plugin serves `/api/kql`, the official KQL plugin's query language behind bearer authentication, caching and language handling – the official plugin has to be installed (`composer require getkirby/kql`), and its own `/api/query` endpoint is untouched. Bearer auth needs both `headless.token` and `kql.auth` set to `'bearer'`.

A request names its language through the `X-Language` header or a `?language=` query parameter, and the query parameter wins when both are sent, so a proxy that stamps the header cannot override a client that appends the parameter. Caching starts only once Kirby's pages cache is on; `X-Cacheable: false` bypasses it per request, and a query sent once with `?language=de` and once with `X-Language: de` is cached twice.

<https://kirby.tools/docs/headless/usage/kql.md>

## JSON templates

A JSON template is an ordinary Kirby template that returns JSON, served for every page once `globalRoutes` is on. A prefixed path names its own language: `/de/about` is German whatever the headers say. An unprefixed path takes its language from the `X-Language` header, an unknown code falls back to the default language rather than erroring, and `t()` resolves in the same language as the surrounding content. The header only applies with one language at the site root, Kirby's default multi-language setup; where every language carries a prefix, Kirby redirects an unprefixed path before the header is read.

<https://kirby.tools/docs/headless/usage/json-templates.md>
