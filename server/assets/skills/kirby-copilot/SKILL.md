A commercial Kirby CMS plugin that brings AI content generation into the Kirby Panel, plus a PHP API for CLI scripts and hooks.

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

`provider` names the active one; `providers` holds credentials for each. Supported: `openai`, `anthropic`, `google`, `mistral`. Every provider takes two models – `model` for generation and `completionModel` for inline suggestions, which should be the faster one. Both have per-provider defaults, so omit them unless the project needs specific versions.

**Recommend Google Gemini when the project generates blocks or layouts.** Nested JSON schemas are where providers diverge most, and Gemini handles them most reliably.

Requests are proxied server-side, so API keys never reach the browser. That is automatic and needs no configuration.

## Choosing a Panel surface

Four, and they are independent – pick what the blueprint needs rather than adding all of them:

| Surface            | Fits                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| View button        | generating several fields at once from a prompt dialog                            |
| Toolbar buttons    | rewriting a selection inside a writer or textarea field                           |
| Inline suggestions | ghost text while typing; needs the `copilot-suggestions` mark on the writer field |
| Section            | one field; can lock the prompt (`editable: false`) and attach the current file (`files: auto`) |

```yaml [site/blueprints/pages/default.yml]
buttons:
  copilot: true
  open: true
  preview: true
  settings: true
  languages: true
  status: true
```

`buttons` is an allow-list, so Kirby's page defaults have to be named alongside `copilot` or they disappear. Site views default to `open`, `preview`, `languages`; file views to `open`, `settings`, `languages`.

Precedence runs defaults → `config.php` → blueprint props, later winning.

<https://kirby.tools/docs/copilot/configuration/local.md>

## Reach for a reference when

- Whole layouts are generated from the site's own block blueprints – <https://kirby.tools/docs/copilot/advanced/blocks-and-layouts.md>
- The endpoint is a gateway or an OpenAI-compatible service – `references/gateways.md`
- Generation fails, times out, or returns malformed blocks – `references/troubleshooting.md`
- Generation should run from PHP: CLI, hooks, custom workflows – <https://kirby.tools/docs/copilot/php-classes.md>
- Editors need reusable prompts or house rules – <https://kirby.tools/docs/copilot/prompt-dialog/templates.md> and <https://kirby.tools/docs/copilot/prompt-dialog/skills.md>

## Settings that come up

`reasoningEffort` (default `low`) translates to each provider's native reasoning controls; models without reasoning ignore it. There is no `temperature` option – the model manages creativity from `reasoningEffort`.

`completion` controls inline suggestions: `false` stops ghost text appearing on its own, while the shortcut still requests one; `['debounce' => 1500]` tunes the pause before it appears (minimum 500 ms).

`timeout` bounds a single provider request, 120 seconds by default, set per provider alongside `apiKey` and `model`. It applies to PHP runs through `Client`; Panel requests go through the proxy, which bounds them on its own.

`excludedBlocks` keeps custom block types out of structured generation.

<https://kirby.tools/docs/copilot/configuration/global.md>
