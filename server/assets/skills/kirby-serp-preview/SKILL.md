A Kirby CMS plugin that adds a Panel section drawing the Google result snippet for the page being edited – favicon, site name, URL, title and description. It reads the open form rather than the saved content, so the snippet follows the editor's typing and nothing is written back.

## Install

```bash
composer require johannschopplich/kirby-serp-preview
```

Or extract the ZIP from the releases page into `site/plugins/`.

Then add the section to a page blueprint:

```yaml
sections:
  serpPreview:
    type: serp-preview
```

With nothing else set, the title line is the page title, an en dash and the site title; the URL line is the installation's URL followed by the page path; there is no description line.

## Pointing it at a meta title and description

The two properties that matter are `titleContentKey` and `descriptionContentKey` – the names of the fields the snippet should read. Each has a `defaultTitle` / `defaultDescription` companion used while that field is empty, and both companions accept Kirby queries.

```yaml
sections:
  serpPreview:
    type: serp-preview
    titleContentKey: metaTitle
    descriptionContentKey: metaDescription
    defaultTitle: "{{ page.title }} – {{ site.title }}"
```

The content keys are lowercased before the lookup, so the blueprint may name a field in camel case. They take a field name, not a query – a `{{ ... }}` there is read literally and finds nothing.

<https://kirby.tools/docs/serp-preview/configuration.md>

## Shortening the text rather than clipping it

The section clamps the title to one line and the description to two. To change the text, define a closure under `johannschopplich.serp-preview.formatters`, one for `title` and one for `description`. Each receives the resolved value and the page and returns what to draw:

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

Typing sends the current value to the server for formatting, so a formatter that fetches a remote URL makes typing slow.

<https://kirby.tools/docs/serp-preview/formatters.md>

## Scope

SERP Preview draws a snippet and judges nothing – there is no score, no keyphrase and no recommendation in it. Kirby SEO Audit is the plugin that assesses the same fields. The section also has no effect on what the frontend renders: a title shortened by a formatter is short in the Panel only, and the `<title>` tag stays whatever the template writes.
