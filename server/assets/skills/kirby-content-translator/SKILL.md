## Install

```bash
composer require johannschopplich/kirby-content-translator
```

The site must be multi-language. The plugin translates between Kirby's configured languages and adds none.

<https://kirby.tools/docs/content-translator/getting-started/installation.md>

## Which Backend Translates

Set `strategy` explicitly. Without it the plugin uses a configured `translateFn` if one exists and DeepL otherwise; `translateFn` is deprecated and goes away in v4.

| `strategy` | Resolves to                   | Needs                                                                          |
| ---------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `'deepl'`  | `DeepLStrategy`               | `DeepL.apiKey`                                                                 |
| `'ai'`     | `CopilotAIStrategy`           | the Kirby Copilot plugin installed and configured                              |
| `Closure`  | wrapped in `CallableStrategy` | signature `fn (string $text, string $target, ?string $source): string`         |
| `Strategy` | used as-is                    | an implementation of `JohannSchopplich\ContentTranslator\Translation\Strategy` |

A closure or `Strategy` instance enables the translation buttons without a `DeepL.apiKey`. `'ai'` runs through Copilot's provider configuration; shape its output with the global `ai.systemPrompt`, or per section with `systemPrompt`. A closure that cannot translate a text returns an empty string, and the field keeps its source text.

<https://kirby.tools/docs/content-translator/configuration/global.md>
<https://kirby.tools/docs/content-translator/providers/custom-translator.md>

## Adding It to a Blueprint

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

`buttons` is an allow-list, so Kirby's defaults have to be named alongside `content-translator` or they disappear. `systemPrompt` is a section property; the view button ignores it and reads the global `ai.systemPrompt`.

<https://kirby.tools/docs/content-translator/configuration/local.md>

## What Gets Translated

The defaults translate every text-like field. Four settings narrow the set, globally in `config.php` and per blueprint, and they compose rather than override:

- `fieldTypes` – which field **types** participate. A container type opens its contents but does not translate them: a text field inside a blocks field needs both `blocks` and `text` in the list.
- `includeFields` and `excludeFields` – which **top-level** field names participate. A field nested in a block, structure, layout, or object is reached through its parent, never by its own name. Both still respect `fieldTypes`.
- `translate: false` in a field's blueprint wins over all of the above. When a field refuses to translate and the config looks right, that flag is the first thing to check.
- `kirbyTags` – excluded by default. Opt in per tag type, naming only the attributes that carry prose: `link: [text, title]`, `image: [alt, title, caption]`.

`title` and `slug` are separate booleans, both `false` by default; `slug` is ignored on file and site models and on the home and error pages.

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

<https://kirby.tools/docs/content-translator/configuration/local.md>
<https://kirby.tools/docs/content-translator/advanced/kirbytags.md>

## When a Field Keeps Its Source Text

- The browser console names the field, the language, and the reason. A `placeholder mismatch` means the translation damaged a KirbyTag placeholder, and the field keeps its source text on every provider. <https://kirby.tools/docs/content-translator/panel/translation-results.md>
- The three hooks fire for DeepL, custom strategies, the CLI, and `Translator` calls. AI translation started in the Panel runs in the browser and never reaches them, so terminology or logging wired up in a hook skips it. <https://kirby.tools/docs/content-translator/advanced/hooks.md>
- The coverage dashboard is Kirby 5 only and reads `fieldTypes`, `includeFields`, and `excludeFields` from `config.php` alone; blueprint narrowing does not change the rings. <https://kirby.tools/docs/content-translator/panel/translation-coverage.md>
- Batch translation runs two languages in parallel. On provider rate-limit errors set `batchConcurrency` to `1`. <https://kirby.tools/docs/content-translator/configuration/global.md#batchconcurrency>
- A Kirby language whose code DeepL cannot name throws `LogicException`; map it with `targetLanguageOverrides`. <https://kirby.tools/docs/content-translator/providers/deepl.md>
- `new DeepL()` at the top level of `config.php` throws `AuthException: Missing DeepL API key` even with the key set, because the client reads the key as it is built; a bare `new DeepLStrategy()` resolves its client lazily and is safe there. Build a custom client inside Kirby's `ready` callback. <https://kirby.tools/docs/content-translator/php-classes/strategies/deepl-strategy.md>

## Scripting It

`Translator` is the PHP entry point, and the CLI recipes wrap it: single page, all children, whole site, file metadata, and a Janitor command.

<https://kirby.tools/docs/content-translator/cli-automation/single-page.md>
<https://kirby.tools/docs/content-translator/php-classes/translator.md>
