---
title: "SEO in Kirby CMS: A Practical Guide"
description: Kirby leaves meta tags, canonical URLs, hreflang, and the sitemap to you. Here's what your templates need to output, and where the Panel helps editors.
date: "2026-10-08"
---

If you're setting up SEO on a Kirby site, there's no settings page to start from. Kirby fills in no title tag, writes no sitemap, and adds no hreflang. A page's `<head>` holds whatever your template puts there, and nothing else.

I like that: nothing ends up in the head by accident. But it makes SEO on a Kirby site two jobs – template code you write once, and the titles and descriptions editors type in the Panel for every page. My plugins help with the second.

## Write the Meta Tags in One Head Snippet

I'd keep the head in one snippet that every template includes. It reads the `metaTitle` and `metaDescription` fields from your blueprints. Where an editor leaves them empty, it falls back to the page title followed by the site title, and to the site's meta description. The canonical URL points at the page itself:

```php [site/snippets/head.php]
<title><?= $page->metaTitle()->or($page->title() . ' – ' . $site->title())->esc() ?></title>
<meta name="description" content="<?= $page->metaDescription()->or($site->metaDescription())->esc('attr') ?>">
<link rel="canonical" href="<?= $page->url() ?>">
```

## Decide Which URLs Get Indexed

Kirby answers more URLs than your navigation links to. These are the four I'd check before a launch:

- **The home page.** On a single-language site, `/home` redirects to `/`. On a multi-language site, `/en/home` renders the same page as `/en`.
- **The language prefix.** Every language, the default one included, gets its code as a URL prefix (`/en/about`), unless you set a different `url` in that language's config file. `/` and paths without a prefix redirect to the prefixed URL, with a temporary 302.
- **Translated slugs.** If a page has a German slug, the English one still works under the German prefix: `/de/about` and `/de/ueber-uns` render the same page.
- **Unlisted pages.** Unlisted pages are only left out of listings like your menu. Anyone with the URL can open them; only drafts stay private.

You don't have to block the duplicates: where Kirby renders a page under a second URL, the canonical tag from the head snippet names its main URL, so search engines know which one to index.

The canonical tag doesn't hide unlisted pages, and Kirby adds `noindex` only to the Panel, never to your pages. If your unlisted pages shouldn't show up in search, I'd add one to the head snippet:

```php [site/snippets/head.php]
<?php if ($page->isUnlisted()): ?>
  <meta name="robots" content="noindex">
<?php endif ?>
```

For the sitemap, the [recipe in the Kirby cookbook](https://getkirby.com/docs/cookbook/navigation/sitemap) builds one from a route and a snippet. It lists every page, unlisted ones included, so I'd add the ones you don't want found to its `sitemap.ignore` option. If you'd rather not build it yourself, [Kirby Helpers](/docs/helpers/sitemap) serves a sitemap that lists each page's existing translations as `hreflang` alternates.

## Add hreflang Only for Translations That Exist

On a multi-language site, each page also lists its versions in the other languages. Kirby has the parts – `$kirby->languages()` and `$page->url()` with a language code – and leaves the markup to you:

```php [site/snippets/head.php]
<?php foreach ($kirby->languages() as $language): ?>
  <?php if ($page->translation($language->code())->exists()): ?>
    <link rel="alternate" hreflang="<?= $language->code() ?>" href="<?= $page->url($language->code()) ?>">
  <?php endif ?>
<?php endforeach ?>
<link rel="alternate" hreflang="x-default" href="<?= $page->url($kirby->defaultLanguage()->code()) ?>">
```

`x-default` names the URL for every visitor whose language isn't on the list – here, the default language's.

Kirby renders every page in every language, translated or not. Without a German translation, `/de/…` shows the English text with a normal 200 response. The `exists()` check keeps those pages out of the hreflang list.

Those pages still answer, though, and the canonical tag from the head snippet names their own `/de/…` URL. I'd point it at the default language wherever the translation is missing, in place of the canonical line above:

```php [site/snippets/head.php]
<link rel="canonical" href="<?= $page->translation()->exists() ? $page->url() : $page->url($kirby->defaultLanguage()->code()) ?>">
```

A translation can also be half there: fields nobody translated show the default language's text, and fields saved empty stay empty. I built Translation Coverage into Content Translator so you don't have to find those by hand. It lists, per language, the pages without a translation and the fields a translation leaves empty, in the **Languages** view:

:product-translator-coverage

Content Translator can translate slugs too: with [`slug: true`](/docs/content-translator/configuration/local#slug), it translates the title, and Kirby builds the slug from it with the target language's rules.

## Preview the Google Result in the Panel

The meta fields get filled in on every page, by editors who never see the `<head>`. [SERP Preview](/serp-preview) is a Panel section, and its `titleContentKey` and `descriptionContentKey` options point it at the same `metaTitle` and `metaDescription` fields. It draws the page as a Google result while the editor types, and clamps the title to one line and the description to two, as Google does:

:::::panel-mock
::::panel-section{label="SERP Preview"}
:::panel-serp-preview-snippet
---
faviconUrl: /favicon.ico
siteTitle: Kirby Tools
siteUrl: https://kirby.tools/blog/seo-in-kirby
title: "SEO in Kirby CMS: A Practical Guide – Kirby Tools"
description: Kirby leaves meta tags, canonical URLs, hreflang, and the sitemap to you. Here's what your templates need to output, and where the Panel helps editors.
---
:::
::::
:::::

It's free, and it never writes to the page: the snippet comes from the form as it stands, unsaved changes included.

## Audit the Rendered Page

SERP Preview shows what the fields say. [SEO Audit](/seo-audit) checks what the page says: it fetches the page's preview URL, unsaved changes included, and runs the Yoast analysis and its own checks on the rendered HTML in the editor's browser. It reads the title and meta description your head snippet produced and the content the editor just wrote, so the report flags template mistakes, like a second H1, next to writing problems:

:::::panel-mock
::::panel-dialog{size="large"}
:::panel-seo-audit-result
---
isDialog: true
ratings:
  seo:
    rating: ok
  readability:
    rating: good
results:
  seo:
    - rating: bad
      text: >-
          Single H1: The text contains multiple H1 tags. Rethink your heading structure!
    - rating: good
      text: >-
          <a href="https://yoa.st/34h">SEO title width</a>: Good job.
  readability:
    - rating: good
      text: >-
          <a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.
    - rating: good
      text: >-
          <a href="https://yoa.st/34v">Sentence length</a>: Great.
version: changes
timestamp: 1791446400000
---
:::
::::
:::::

SEO Audit picks its language rules from the `lang` attribute on `<html>`. Without one, the analysis assumes English, so I'd set it from the current language wherever your templates open `<html>`:

```php [site/snippets/header.php]
<html lang="<?= $kirby->language()?->code() ?? 'en' ?>">
```

On a single-language site, `$kirby->language()` is `null`, so replace `en` with your site's language.

## The Plugins Output No Tags

SERP Preview and SEO Audit read what your templates render and what your editors type, Content Translator fills in the translations, and the `<head>` stays in your templates. If you'd rather not write the template half yourself, the [SEO topic in the Kirby plugin directory](https://plugins.getkirby.com/topics/seo) lists plugins that take it over.

[Get started with SERP Preview](/docs/serp-preview) or [get started with SEO Audit](/docs/seo-audit/getting-started)
