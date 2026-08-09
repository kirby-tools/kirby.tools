# Choosing a translation strategy

`strategy` (v3.11+) selects the backend. It takes a string preset, a closure, or a `Strategy` instance.

| Value      | Resolves to                   | Needs                                                                          |
| ---------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `'deepl'`  | `DeepLStrategy`               | `DeepL.apiKey`                                                                 |
| `'ai'`     | `CopilotAIStrategy`           | the Kirby Copilot plugin installed and configured                              |
| `Closure`  | wrapped in `CallableStrategy` | signature `fn (string $text, string $target, ?string $source): string`         |
| `Strategy` | used as-is                    | an implementation of `JohannSchopplich\ContentTranslator\Translation\Strategy` |

```php [site/config/config.php]
return [
    'johannschopplich.content-translator' => [
        'strategy' => 'deepl',
        'DeepL' => ['apiKey' => env('DEEPL_API_KEY')],
    ],
];
```

## What the Panel does with it

The option drives the UI, not just the call:

- A closure or `Strategy` instance enables the translation buttons **without** a `DeepL.apiKey`.
- `'ai'` makes Copilot the only provider on offer, so no provider dialog renders — with one option there is nothing to pick.
- With both available, the AI toggle carries the Copilot provider's name (`Gemini`, `GPT (OpenAI)`, `Claude`, `Mistral AI`), falling back to `AI (Copilot)`.

## Leaving it unset

Without `strategy`, the plugin uses a configured `translateFn` if one exists and DeepL otherwise. `translateFn` is deprecated and goes away in v4; migrating is a rename, since the closure signature is identical.

## AI translation

`'ai'` routes through Kirby Copilot's provider stack, which means Copilot's own provider configuration applies. Shape the output with the global `ai.systemPrompt`, or per blueprint with `systemPrompt`.

Full reference:
<https://kirby.tools/docs/content-translator/configuration/global.md>
<https://kirby.tools/docs/content-translator/php-classes/strategies.md>
