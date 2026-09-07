## Install

```bash
composer require johannschopplich/kirby-content-translator
```

The site must be multi-language. The plugin translates between Kirby's configured languages and adds none.

## Two decisions, in order

**1. Which backend translates.** Set `strategy` explicitly. Without it the plugin uses a configured `translateFn` if one exists and DeepL otherwise; `translateFn` is deprecated and goes away in v4, and migrating is a rename, since the closure signature is identical.

| `strategy` | Resolves to                   | Needs                                                                          |
| ---------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `'deepl'`  | `DeepLStrategy`               | `DeepL.apiKey`                                                                 |
| `'ai'`     | `CopilotAIStrategy`           | the Kirby Copilot plugin installed and configured                              |
| `Closure`  | wrapped in `CallableStrategy` | signature `fn (string $text, string $target, ?string $source): string`         |
| `Strategy` | used as-is                    | an implementation of `JohannSchopplich\ContentTranslator\Translation\Strategy` |

The option drives the Panel, not just the call: a closure or `Strategy` instance enables the translation buttons without a `DeepL.apiKey`; `'ai'` makes Copilot the only provider on offer, so no provider dialog renders; with both available, the AI toggle carries the name of the Copilot provider in use. `'ai'` routes through Copilot's provider stack, so Copilot's own provider configuration applies; shape the output with the global `ai.systemPrompt`, or per section with `systemPrompt`. A closure returns an empty string for a text it could not translate, and the field keeps its source text; returning the source text yourself counts as a translation.

**2. What counts as translatable.** The defaults translate every text-like field. Four settings narrow the set, and they compose rather than override, globally in `config.php` and per blueprint:

- `fieldTypes` – which field **types** participate. The default names eleven: `blocks`, `layout`, `list`, `object`, `structure`, `tags`, `text`, `textarea`, `writer`, plus `markdown` and `table` from community field plugins. Containers do not imply their contents: a text field inside a blocks field needs both `blocks` and `text` in the list, and a list of only `blocks` translates nothing.
- `includeFields` and `excludeFields` – which **top-level** field names participate, case-insensitively; a field nested in a block, structure, layout or object is reached through its parent, never by its own name. Both still respect `fieldTypes`, so a name in `includeFields` whose type is absent from `fieldTypes` stays untranslated.
- `translate: false` in a field's blueprint wins over all of the above. When a field refuses to translate and the config looks right, that flag is the first thing to check.
- `kirbyTags` – KirbyTags are **excluded by default**, which keeps URLs, filenames and technical attributes intact. Opt in per tag type, naming only the attributes that carry prose: `link: [text, title]`, `image: [alt, title, caption]`. Listing an attribute that holds a URL sends it to the translator.

`title` and `slug` are separate booleans, both `false` by default. Translating `slug` changes URLs, so decide it deliberately; it is ignored on file and site models and on the home and error pages.

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

<https://kirby.tools/docs/content-translator/configuration/global.md>
<https://kirby.tools/docs/content-translator/configuration/local.md>
<https://kirby.tools/docs/content-translator/advanced/kirbytags.md>

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

Precedence runs defaults → `config.php` → blueprint props, later winning. Three blueprint properties have no global twin: `systemPrompt` is section-only and corresponds to the global `ai.systemPrompt`, `theme` is button-only, and `label` falls back to a Panel translation rather than a config value.

<https://kirby.tools/docs/content-translator/configuration/local.md>

## Rate limits during batch translation

Batch mode translates languages in parallel, two at a time. When the provider returns rate-limit errors, set `batchConcurrency` to `1` and the languages run in sequence.

## Scripting it

`Translator` is the PHP entry point, and it is what the CLI recipes wrap – single page, all children, whole site, file metadata, and a Janitor command. Reach for these when a migration needs translating in bulk rather than page by page.

<https://kirby.tools/docs/content-translator/cli-automation/single-page.md>
<https://kirby.tools/docs/content-translator/php-classes/translator.md>
