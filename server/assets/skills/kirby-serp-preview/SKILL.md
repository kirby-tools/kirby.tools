## Install

```bash
composer require johannschopplich/kirby-serp-preview
```

Or extract the ZIP from the releases page into `site/plugins/`.

Then add the section to a page or the site blueprint:

```yaml
sections:
  serpPreview:
    type: serp-preview
```

<https://kirby.tools/docs/serp-preview.md>

## Pointing It at a Meta Title and Description

`titleContentKey` and `descriptionContentKey` name the fields the snippet reads; `defaultTitle` and `defaultDescription` fill in while a field is empty and accept Kirby queries.

```yaml
sections:
  serpPreview:
    type: serp-preview
    titleContentKey: metaTitle
    descriptionContentKey: metaDescription
    defaultDescription: "{{ site.metaDescription }}"
```

A content key takes a field name, not a query – a `{{ ... }}` there is read literally and finds nothing. Without a `titleContentKey` the title line is the page title as last saved, so it does not follow the title field while typing; `titleContentKey: title` makes it follow.

<https://kirby.tools/docs/serp-preview/configuration.md>

## Favicon, Site Name and URL Line

`faviconUrl`, `siteTitle` and `siteUrl` accept Kirby queries; `searchConsoleUrl` adds a button below the snippet. `siteUrl` defaults to the URL Kirby runs under, so a staging install sets the production host. The path after it is the page's preview URL path, language prefix included; a blueprint with `preview: false` leaves the line at the site URL.

```yaml
sections:
  serpPreview:
    type: serp-preview
    faviconUrl: "{{ site.favicon.toFile.url }}"
    siteUrl: https://example.com
```

<https://kirby.tools/docs/serp-preview/configuration.md>

## Shortening the Text Rather Than Clipping It

The section clamps the title to one line and the description to two. A closure under `johannschopplich.serp-preview.formatters`, keyed `title` or `description`, receives the resolved value and the page and returns what to draw:

```php [site/config/config.php]
use Kirby\Toolkit\Str;

return [
    'johannschopplich.serp-preview' => [
        'formatters' => [
            'description' => fn (string $value, \Kirby\Cms\Page $page) => Str::short(strip_tags($value), 160)
        ]
    ]
];
```

Each change posts the value to the site, at most once per 250 ms per line, and a failed reply keeps the last drawn text – a formatter that throws shows no error, the failed request is in the browser's network tab. On the site view the page is the home page; on a file view the formatter does not run.

<https://kirby.tools/docs/serp-preview/formatters.md>
