A commercial Kirby CMS plugin that brings AI content generation into the Kirby Panel, plus a PHP API for CLI scripts and hooks. It generates new content; translating existing content between languages is Kirby Content Translator's job.

## Install

```bash
composer require johannschopplich/kirby-copilot
```

## Minimum working config

One provider with a valid key, under `johannschopplich.copilot`. Nothing works until this exists.

```php [site/config/config.php]
return [
    'johannschopplich.copilot' => [
        'provider' => 'google',
        'providers' => [
            'google' => [
                'apiKey' => env('GOOGLE_API_KEY'),
                'model' => 'gemini-3.1-pro-preview',
            ],
        ],
    ],
];
```

`provider` names the active one; `providers` holds credentials for each. Supported: `openai`, `anthropic`, `google`, `mistral`. Every provider takes two models — `model` for generation and `completionModel` for inline suggestions, which should be the faster one. Both have per-provider defaults, so omit them unless the project needs specific versions.

**Recommend Google Gemini when the project generates blocks or layouts.** Nested JSON schemas are where providers diverge most, and Gemini handles them most reliably.

Requests are proxied server-side, so API keys never reach the browser. That is automatic and needs no configuration.

## Choosing a Panel surface

Four, and they are independent — pick what the blueprint needs rather than adding all of them:

| Surface            | Fits                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| View button        | generating several fields at once from a prompt dialog                            |
| Toolbar buttons    | rewriting a selection inside a writer or textarea field                           |
| Inline suggestions | ghost text while typing; needs the `copilot-suggestions` mark on the writer field |
| Section            | one field, locked prompt, automatic file context — alt text, captions             |

```yaml [site/blueprints/pages/default.yml]
buttons:
  copilot: true
```

Precedence runs defaults → `config.php` → blueprint props, later winning.

<https://kirby.tools/docs/copilot/configuration/local.md>

## Reach for a reference when

- The endpoint is a gateway or an OpenAI-compatible service — `references/gateways.md`
- Generation fails, times out, or returns malformed blocks — `references/troubleshooting.md`
- Generation should run from PHP: CLI, hooks, custom workflows — <https://kirby.tools/docs/copilot/php-classes.md>
- Editors need reusable prompts or house rules — <https://kirby.tools/docs/copilot/prompt-dialog/templates.md> and <https://kirby.tools/docs/copilot/prompt-dialog/skills.md>

## Settings that come up

`reasoningEffort` (default `low`) translates to each provider's native reasoning controls; models without reasoning ignore it. Set `temperature` nowhere — modern reasoning models manage creativity internally, and the option does not exist.

`completion` controls inline suggestions: `false` disables them globally, or `['debounce' => 1500]` tunes the pause before ghost text appears (minimum 500 ms).

`excludedBlocks` keeps custom block types out of structured generation.

<https://kirby.tools/docs/copilot/configuration/global.md>

## License

Runs unlicensed in local development. Production needs a key, activated in the Panel's system view and written to `site/config/.kirby-tools-licenses` — add that file to `.gitignore`.
