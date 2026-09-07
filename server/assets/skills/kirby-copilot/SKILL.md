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

<https://kirby.tools/docs/copilot/configuration/global.md>

## Choosing a Panel surface

Four, and they are independent – pick what the blueprint needs rather than adding all of them:

| Surface            | Fits                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| View button        | generating several fields at once from a prompt dialog                                                          |
| Toolbar buttons    | rewriting a selection inside a writer or textarea field                                                         |
| Inline suggestions | ghost text while typing; on in every writer field unless a custom `marks` list leaves out `copilot-suggestions` |
| Section            | one field; can lock the prompt (`editable: false`) and attach the current file (`files: auto`)                  |

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

## Settings that come up

`reasoningEffort` (default `low`) translates to each provider's native reasoning controls; models without reasoning ignore it. There is no `temperature` option – the model manages creativity from `reasoningEffort`.

`completion` controls inline suggestions: `false` stops ghost text appearing on its own, while the shortcut still requests one; `['debounce' => 1500]` tunes the pause before it appears (minimum 500 ms).

`timeout` bounds a single provider request, 120 seconds by default, set per provider alongside `apiKey` and `model`. It applies to PHP runs through `Client`; Panel requests go through the proxy, which bounds them on its own.

`excludedBlocks` keeps custom block types out of structured generation.

<https://kirby.tools/docs/copilot/configuration/global.md>

## Gateways and OpenAI-compatible endpoints

Any endpoint that speaks the OpenAI shape is `provider: 'openai'` with a custom `baseUrl` – Vercel AI Gateway, Cloudflare AI Gateway, OpenRouter, llama.cpp, vLLM, LiteLLM. Copilot defaults to the Responses API (`/v1/responses`); an endpoint that only exposes `/v1/chat/completions` needs `api: 'chat'`, otherwise requests fail with 404 or JSON parse errors.

| Endpoint                                      | `api`  |
| --------------------------------------------- | ------ |
| Direct OpenAI, Vercel AI Gateway, OpenRouter  | –      |
| Cloudflare AI Gateway `…/openai`              | –      |
| Cloudflare AI Gateway `…/compat`              | `chat` |
| Self-hosted: llama.cpp, vLLM, LiteLLM default | `chat` |

**Set `completionModel` explicitly whenever the `model` carries a foreign prefix** such as `google-ai-studio/…` – Copilot derives no completion model across gateways, and without one inline suggestions fail while everything else works.

Structured output (blocks, layouts, field schemas) depends on the gateway translating `json_schema` faithfully, and `reasoningEffort` cannot map onto another vendor's models through the OpenAI shape. For full control over Anthropic or Google models, configure that provider directly.

<https://kirby.tools/docs/copilot/configuration/global.md>

## When generation fails

**Long generations cut off** – _No object generated_, _Unterminated string_, a 504, or a closed connection. In the Panel the cause is almost always a web server timeout: every request streams through a server-side PHP proxy, so the connection must stay open for the whole generation, 60+ seconds for longer content, and the web server's read timeout (nginx `fastcgi_read_timeout`, Apache `ProxyTimeout`) has to allow that. PHP's own execution limit is already lifted for proxy requests. From PHP – CLI, hooks, custom workflows – the bound is the provider's `timeout` instead.

**A missing API key** – the PHP `Client` fails with `Missing API key in "johannschopplich.copilot.providers.<name>.apiKey"`, the Panel with `Missing API key for the "<name>" provider`. In order: the key sits under `providers.<name>.apiKey`, not one level up; an `env()` lookup resolves in the environment the **Panel** runs under, which routinely differs from the CLI's; a closure returns a non-empty string for the current Panel user.

**A provider the plugin does not know** – the PHP `Client` fails with `Unknown provider "<name>"` when `provider` names something outside `openai`, `anthropic`, `google`, `mistral`, and with `Missing required option "johannschopplich.copilot.provider"` when the key is absent. The Panel reports an unknown provider only while Kirby's `debug` option is on; otherwise it falls back to Google without saying so, which is what a wrong provider name looks like from the editor's side.

**Blocks come back malformed** – missing fields, empty results, wrong structure. Switch to Google Gemini, generate fewer blocks per prompt, and set `logLevel: 'debug'` to see the system and user prompt that were actually sent in the browser console. Through a gateway, confirm it translates `json_schema` at all.

**Inline suggestions never appear** – in order: a custom `marks` list on the writer field includes `copilot-suggestions` (`marks` is an allow-list, so a mark left out is dropped from the editor, and the next save strips that formatting from stored content, links included); `completion` is not `false`; behind a gateway with a prefixed `model`, `completionModel` is set. After a failed provider request Copilot waits 30 seconds before suggesting again; the manual shortcut retries immediately.

<https://kirby.tools/docs/copilot/advanced/troubleshooting.md>

## Reach for the docs when

- Whole layouts are generated from the site's own block blueprints – <https://kirby.tools/docs/copilot/advanced/blocks-and-layouts.md>
- Generation should run from PHP: CLI, hooks, custom workflows – <https://kirby.tools/docs/copilot/php-classes.md>
- Editors need reusable prompts or house rules – <https://kirby.tools/docs/copilot/prompt-dialog/templates.md> and <https://kirby.tools/docs/copilot/prompt-dialog/skills.md>
