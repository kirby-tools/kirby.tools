# KQL through Kirby Headless

The plugin serves an enhanced KQL endpoint at `/api/kql`. It extends the official KQL plugin with bearer authentication, caching, and language handling – the query language itself is unchanged, so KQL documentation applies verbatim.

## Enabling it

```php [site/config/config.php]
return [
    'headless' => [
        'token' => env('KIRBY_API_TOKEN'),
    ],
    'kql' => [
        'auth' => 'bearer',
    ],
];
```

Both keys are needed. `kql.auth` alone falls back to Kirby's native API authentication, because there is no token to check against.

## Requests

```ts
await fetch("https://example.com/api/kql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.KIRBY_API_TOKEN}`,
  },
  body: JSON.stringify({
    query: "site",
    select: {
      title: true,
      children: { query: "site.children", select: ["title", "url"] },
    },
  }),
});
```

## Language selection

A request names its language through the `X-Language` header or a `?language=` query parameter. Where a request carries both, **the query parameter wins** – Kirby's API reads it first. A proxy that stamps `X-Language` onto every request therefore cannot override a client that appends `?language=`.

## Choosing between KQL and JSON templates

KQL shapes a response out of what the content tree already holds. When the response needs an aggregation, a computed field, or data from outside Kirby, the query language runs out and a JSON template is the answer – see `references/json-templates.md`.

Full reference: <https://kirby.tools/docs/headless/usage/kql.md>
