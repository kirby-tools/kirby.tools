## Install

```bash
composer require johannschopplich/kirby-copilot
```

## Minimum Working Config

One provider with a valid key, under `johannschopplich.copilot`. Nothing works until this exists.

```php [site/config/config.php]
return [
    'johannschopplich.copilot' => [
        'provider' => 'google',
        'providers' => [
            'google' => [
                'apiKey' => 'your-google-api-key',
            ],
        ],
    ],
];
```

`provider` names the active one of `openai`, `anthropic`, `google`, or `mistral`; `providers` holds credentials for each. Every provider takes `model` for generation and `completionModel` for inline suggestions; both have per-provider defaults, so omit them unless the project needs specific versions. `reasoningEffort` (default `low`) is the one setting that trades speed for depth.

**Recommend Google Gemini when the project generates blocks or layouts.** OpenAI's models cap the nesting depth of structured output, which large layout schemas exceed; Gemini handles nested schemas most reliably.

<https://kirby.tools/docs/copilot/configuration/global.md>

## Gateways and OpenAI-Compatible Endpoints

Any endpoint that speaks the OpenAI shape is `provider: 'openai'` with a custom `baseUrl` – Vercel AI Gateway, Cloudflare AI Gateway, OpenRouter, llama.cpp, vLLM, LiteLLM. Copilot defaults to the Responses API; an endpoint that only exposes `/v1/chat/completions` needs `api: 'chat'`, otherwise requests fail with 404 or JSON parse errors.

| Endpoint                                      | `api`  |
| --------------------------------------------- | ------ |
| Direct OpenAI, Vercel AI Gateway, OpenRouter  | –      |
| Cloudflare AI Gateway `…/openai`              | –      |
| Cloudflare AI Gateway `…/compat`              | `chat` |
| Self-hosted: llama.cpp, vLLM, LiteLLM default | `chat` |

**Set `completionModel` explicitly whenever the `model` carries a foreign prefix** such as `google-ai-studio/…` – Copilot derives a completion model only from a prefix that matches the provider, and without one inline suggestions fail while everything else works.

Structured output and `reasoningEffort` only reach a non-OpenAI model as far as the gateway translates them; for full control over Anthropic or Google models, configure that provider directly.

<https://kirby.tools/docs/copilot/configuration/global.md>

## Choosing a Panel Surface

Four, and they are independent – pick what the blueprint needs rather than adding all of them:

| Surface            | Fits                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| View button        | generating several fields at once from a prompt dialog                                         |
| Toolbar buttons    | rewriting a selection inside a writer or textarea field                                        |
| Inline suggestions | ghost text while typing, on in every writer field                                              |
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

`buttons` and a writer field's `marks` are allow-lists: Kirby's defaults have to be named alongside `copilot` or `copilot-suggestions`, or they disappear – for `marks`, from stored content on the next save, links included. To reach every view without editing blueprints, list the button names in Kirby's `panel.viewButtons.<view>` option. Props like `userPrompt` stay in the blueprint, and a blueprint's `buttons` wins over the option.

`completion: false` stops ghost text appearing on its own while the shortcut still requests one.

<https://kirby.tools/docs/copilot/configuration/local.md>

## Generating Blocks and Layouts

A view button or section on a `blocks` or `layout` field generates whole blocks from the site's own block blueprints. `excludedBlocks` in `config.php` keeps content-less custom blocks out everywhere. A `description` key on a custom block blueprint is all the AI model learns about the block beyond its name. Generated content is appended to the field, never replacing it, and blocks nest one level, so a block inside a nested block is never generated.

<https://kirby.tools/docs/copilot/advanced/blocks-and-layouts.md>

## Driving Generation From PHP

`Client::instance()` reads the same `johannschopplich.copilot` options as the Panel and keeps them until `Client::reset()`; `generateText` and `generateObject` are the two calls. The bound on a call is the provider's `timeout` (120 seconds, set per provider alongside `apiKey`), not the web server.

<https://kirby.tools/docs/copilot/php-classes/client.md>

## When Generation Fails

**Long generations cut off** – _No object generated_, _Unterminated string_, a 504, or a closed connection. In the Panel the cause is the web server's read timeout (nginx `fastcgi_read_timeout`, Apache `ProxyTimeout`); PHP's own execution limit is already lifted for proxy requests. From PHP the bound is the provider's `timeout`.

**A missing API key** – the PHP `Client` fails with `Missing API key in "johannschopplich.copilot.providers.<name>.apiKey"`, the Panel with `Missing API key for the "<name>" provider`. The key sits under `providers.<name>.apiKey`, and a key read from an environment variable resolves in the environment the **Panel** runs under, which routinely differs from the CLI's.

**An option that is silently wrong** – with Kirby's `debug` off, the Panel swaps an option value it cannot use for the default, drops a `promptTemplates` or `skills` entry it cannot read, and turns an unknown `provider` into Google, all without an error; with `debug` on the exception names the option. The PHP `Client` always fails: `Unknown provider "<name>"` or `Missing required option "johannschopplich.copilot.provider"`.

**Blocks come back malformed** – generate fewer blocks per prompt and set `logLevel: 'debug'` to see the prompts that were sent in the browser console. Through a gateway, confirm it translates `json_schema` at all.

**Inline suggestions never appear** – in order: `copilot-suggestions` is in the writer field's `marks`, `completion` is not `false`, and behind a gateway `completionModel` is set.

<https://kirby.tools/docs/copilot/advanced/troubleshooting.md>

## Prompt Templates and Skills

Templates are reusable user prompts in the dialog, five built in; skills are house rules an editor layers onto a prompt with `@skill://<id>`. Both live in `config.php`.

<https://kirby.tools/docs/copilot/prompt-dialog/templates.md> and <https://kirby.tools/docs/copilot/prompt-dialog/skills.md>
