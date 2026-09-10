## Install

```bash
composer require johannschopplich/kirby-headless
```

## Configuration

Its config namespace is the bare `headless` key, not `johannschopplich.headless`.

```php [site/config/config.php]
return [
    'headless' => [
        'token' => 'your-secret-token',
        'globalRoutes' => true,
    ],
];
```

`globalRoutes` is the fork in the road. Left off, Kirby routes as usual and the plugin only adds its endpoints. Turned on, a catch-all serves **every** page as JSON and Kirby stops rendering HTML – which is what a decoupled site wants and what a hybrid site must avoid.

CORS is Kirby's own since 5.2.0, under the top-level `cors` key: <https://kirby.tools/docs/headless/configuration/cors.md>

## Token

A token that is set but blank – typically an env var that failed to resolve – answers every guarded request with `401`. An unresolved variable never opens a site by accident, so check the env before the code.

Under `globalRoutes`, clean file URLs like `/about/hero.jpg` need the token and additionally Kirby's `content.fileRedirects`, which is off by default.

`/api/__sitemap__` and `/api/__template__` require the token too. They sit outside the catch-all and stay available with `globalRoutes` off, which also means they are public whenever no token is set. Setting `kql.auth` to `'bearer'` without a `headless.token` authenticates nobody, so `/api/kql` silently falls back to Kirby's native API auth.

<https://kirby.tools/docs/headless/configuration/authentication.md>

## JSON Templates

A JSON template is an ordinary Kirby template that returns JSON, served for every page once `globalRoutes` is on. The `X-Language` header only applies with one language at the site root, Kirby's default multi-language setup; where every language carries a prefix, Kirby redirects an unprefixed path before the header is read.

<https://kirby.tools/docs/headless/usage/json-templates.md>

## KQL

`/api/kql` needs the official plugin installed (`composer require getkirby/kql`). Bearer auth needs both `headless.token` and `kql.auth` set to `'bearer'`.

A request names its language through the `X-Language` header or a `?language=` query parameter, and the query parameter wins when both are sent. A query sent once with `?language=de` and once with `X-Language: de` is cached twice.

<https://kirby.tools/docs/headless/usage/kql.md>

## Resolving UUIDs

`toResolvedBlocks()`, `toResolvedLayouts()`, and `resolvePermalinks()` turn the `page://` and `file://` UUIDs inside a field into URLs and objects. Their options live under the top-level `blocksResolver` and `permalinksResolver` keys, not under `headless`. Out of the box only the `image` field of Kirby's `image` block resolves; a `blocksResolver.files` list replaces that default rather than extending it, so keep `'image' => 'image'` in the list or the image block hands out UUIDs again. `blocksResolver.pages` starts empty.

`frontendUrl()`, `breadcrumbMeta()`, and `i18nMeta()` build the navigation data a frontend needs.

<https://kirby.tools/docs/headless/usage/field-methods.md>
<https://kirby.tools/docs/headless/usage/page-methods.md>

## Sitemap

`/api/__sitemap__` lists every indexable page. Three filters under `headless.sitemap` narrow it: `exclude.templates`, `exclude.pages` (IDs or regex, or a callable returning them), and an `isIndexable` closure.

<https://kirby.tools/docs/headless/usage/json-templates.md>

## Building Your Own Endpoint

`Api::createHandler()` runs middlewares in order and returns as soon as one yields anything but `null` or an array, so `Middlewares::hasBearerToken()` comes first or a resolver answers before the token is checked. `hasBearerToken()` is called (it returns the middleware); every other middleware is passed as a callable, `Middlewares::tryResolvePage(...)`.

<https://kirby.tools/docs/headless/advanced/api-builder.md>

## Panel Preview

`headless.panel.frontendUrl` is what `page.frontendUrl` and `site.frontendUrl` rebase onto; without it both return `null` and a blueprint `preview` built from them leads nowhere. `headless.panel.redirect` sends a browser that opens the backend URL to the Panel, but only inside the catch-all (`globalRoutes` on) or a route built with `hasBearerToken(true)`.

<https://kirby.tools/docs/headless/configuration/panel.md>
