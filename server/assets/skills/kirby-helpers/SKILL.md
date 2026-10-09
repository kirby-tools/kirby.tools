## Install

```bash
composer require johannschopplich/kirby-helpers
```

Or extract the ZIP from the releases page into `site/plugins/`. Options live under `johannschopplich.helpers` in `config.php`.

<https://kirby.tools/docs/helpers.md>

## Environment Variables

Load the file at the top of `config.php`, then read values with `env()` anywhere:

```php [site/config/config.php]
use JohannSchopplich\Helpers\Env;

$root = dirname(__DIR__, 2);

if (is_file($root . '/.env')) {
    Env::load($root);
}

return [
    'debug' => env('KIRBY_DEBUG', false)
];
```

`Env::load()` throws on a missing file. `Env` and `env()` exist in `config.php` only with the Composer install. Variables set in the server environment win over the file. Without `Env::load()`, the first `$site->env()` call loads the file from Kirby's `base` root, else from the folder that holds `site` – not from a public `index` root. Until one of the two has run, `env()` sees only the server environment. Numbers come back as strings. `true`, `false`, `null`, and `empty` are parsed.

<https://kirby.tools/docs/helpers/environment-variables.md>

## Meta Tags

`$page->meta()->robots()`, `->social()`, and `->jsonld()` render the tags. The `<title>` stays in the template. A page model's `metadata()` beats `meta.defaults`, which beats the page field of that name on every page. A site field of that name is the last fallback for single values such as `description` and `thumbnail`, never for `priority` or the `opengraph`, `twitter`, `meta`, and `jsonld` arrays. Keys in `metadata()` and `meta.defaults` must be lowercase. `og:title` and `twitter:title` come from `opengraph.title` and `twitter.title`, else the page's `customTitle` field, else its title.

`thumbnail` takes a file ID, a UUID, or a files field returned from a closure: `'thumbnail' => fn (Page $page) => $page->cover()`. A `File` or `Field` object set directly throws once `social()` runs. An `opengraph.image` of your own drops the derived width, height, and alt text.

<https://kirby.tools/docs/helpers/meta-tags.md>

## Sitemap and `robots.txt`

`sitemap.enabled` and `robots.enabled` turn on `/sitemap.xml` and `/robots.txt`. The sitemap includes the `error` page and unlisted pages. Exclude them with `exclude.templates`, `exclude.pages`, or `options.sitemap: false` in the blueprint. `exclude.pages` entries are regular expressions matched against the whole page ID: `blog` keeps `blog/post`, `blog(/.*)?` drops both.

On a multi-language site, a page lists an `hreflang` alternate only for the languages it has a content file in. With Kirby's pages cache on, the sitemap is cached with it. A changed option shows after the cache is emptied. A static `robots.txt` in the web root wins over the route.

<https://kirby.tools/docs/helpers/sitemap.md>

## Redirects

`redirects` maps Kirby route patterns to targets and fires only where Kirby would render the error page. It answers `302` to `GET` requests. For `301`, call `go($url, 301)` in a closure target. Patterns match the whole path, language prefix included, so a `de/` path needs its own rule.

<https://kirby.tools/docs/helpers/redirects.md>

## Vite

`vite()->css()` and `vite()->js()` serve the dev server until `<outDir>/.vite/manifest.json` exists under Kirby's index root. A leftover build keeps the site on built files. Delete it when starting the dev server. In a public folder setup, Vite builds into `public/dist` while `vite.build.outDir` stays `dist`.

Call `vite()->panelJs()` and `vite()->panelCss()` inside the `ready` callback, not at the top level of `config.php`.

<https://kirby.tools/docs/helpers/vite.md>
