A commercial Kirby CMS plugin that translates existing content between the languages a Kirby site already defines. It moves text across languages; generating new text from a prompt is Kirby Copilot's job.

## Install

```bash
composer require johannschopplich/kirby-content-translator
```

The site must be multi-language. The plugin translates between Kirby's configured languages and adds none.

## Two decisions, in order

**1. Which backend translates.** Set `strategy` explicitly – see `references/strategies.md`. Without it the plugin infers one, which is fine until someone wonders why DeepL is being called.

**2. What counts as translatable.** The defaults translate every text-like field, which is almost never what a real project wants. See `references/scoping.md`.

```php [site/config/config.php]
return [
    'johannschopplich.content-translator' => [
        'strategy' => 'deepl',
        'DeepL' => ['apiKey' => env('DEEPL_API_KEY')],
        'fieldTypes' => ['blocks', 'text', 'textarea'],
        'title' => true,
        'slug' => true,
    ],
];
```

## Adding it to a blueprint

A view button, a section, or both:

```yaml [site/blueprints/pages/default.yml]
buttons:
  content-translator: true
  open: true
  preview: true
  settings: true
  languages: true
  status: true

sections:
  contentTranslator:
    type: content-translator
```

`buttons` is an allow-list, so Kirby's page defaults have to be named alongside `content-translator` or they disappear. Site views default to `open`, `preview`, `languages`; file views to `open`, `settings`, `languages`.

Precedence runs defaults → `config.php` → blueprint props, later winning. Two blueprint properties have no global twin: `systemPrompt` corresponds to the global `ai.systemPrompt`, and `label` falls back to a Panel translation rather than a config value.

<https://kirby.tools/docs/content-translator/configuration/local.md>

## Rate limits during batch translation

Batch mode translates languages in parallel, two at a time. When the provider returns rate-limit errors, set `batchConcurrency` to `1` and the languages run in sequence.

## Scripting it

`Translator` is the PHP entry point, and it is what the CLI recipes wrap – single page, all children, whole site, file metadata, and a Janitor command. Reach for these when a migration needs translating in bulk rather than page by page.

<https://kirby.tools/docs/content-translator/cli-automation/single-page.md>
<https://kirby.tools/docs/content-translator/php-classes/translator.md>

## License

Runs unlicensed in local development. Production needs a key, activated in the Panel's system view and written to `site/config/.kirby-tools-licenses` – add that file to `.gitignore`.
