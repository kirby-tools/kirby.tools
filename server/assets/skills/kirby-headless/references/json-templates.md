# JSON templates

A JSON template is an ordinary Kirby template that returns JSON. Reach for it when the response needs shaping that KQL cannot express: aggregations, computed fields, or data drawn from outside Kirby.

## Serving every page as JSON

```php [site/config/config.php]
return [
    'headless' => [
        'globalRoutes' => true,
        'token' => env('KIRBY_API_TOKEN'),
    ],
];
```

This replaces Kirby's routing with a catch-all, so every page answers with JSON and none with HTML. The catch-all validates the bearer token before resolving anything.

## Language on unprefixed paths

A prefixed URL names its own language: `/de/about` is German regardless of headers. A path without a prefix takes its language from the `X-Language` header, which is how a frontend that owns its routing asks for a translation.

```ts
await fetch("https://example.com/about", {
  headers: {
    Authorization: `Bearer ${process.env.KIRBY_API_TOKEN}`,
    "X-Language": "de",
  },
});
```

Three consequences worth holding onto:

- **The path wins.** `/de/about` stays German under `X-Language: en`, so a proxy stamping the header on every request cannot overrule a URL.
- **An unknown code is ignored** and the request falls back to the default language, rather than erroring.
- **This needs one language at the site root**, Kirby's default multi-language setup. Where every language carries a prefix, Kirby redirects an unprefixed path before the header is ever read — so the header never applies.

`t()` resolves in the same language as the surrounding content, so a template mixing translated labels into its JSON stays internally consistent.

Full reference: <https://kirby.tools/docs/headless/usage/json-templates.md>
