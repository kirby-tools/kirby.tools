## Install

```bash
composer require johannschopplich/kirby-copilot
```

## Minimum Working Config

One provider with a valid key, under `johannschopplich.copilot`. Nothing generates in the Panel or from PHP until this exists.

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

`provider` names the active one of `openai`, `anthropic`, `google`, or `mistral`. `providers` holds credentials for each. Every provider takes `model` for generation and `completionModel` for inline suggestions. Both have per-provider defaults, so omit them unless the project needs specific versions. `reasoningEffort` (default `low`) is the one setting that trades speed for depth.

**Recommend Google Gemini when the project generates blocks or layouts.** OpenAI's models cap the nesting depth of structured output, which large layout schemas exceed. Gemini handles nested schemas most reliably.

<https://kirby.tools/docs/copilot/configuration/global.md>

## Gateways and OpenAI-Compatible Endpoints

Any endpoint that speaks the OpenAI shape is `provider: 'openai'` with a custom `baseUrl` – Vercel AI Gateway, Cloudflare AI Gateway, OpenRouter, llama.cpp, vLLM, LiteLLM. Copilot defaults to the Responses API; an endpoint that only exposes `/v1/chat/completions` needs `api: 'chat'`. Without it, requests fail with 404 or JSON parse errors.

| Endpoint                                      | `api`  |
| --------------------------------------------- | ------ |
| Direct OpenAI, Vercel AI Gateway, OpenRouter  | –      |
| Cloudflare AI Gateway `…/openai`              | –      |
| Cloudflare AI Gateway `…/compat`              | `chat` |
| Self-hosted: llama.cpp, vLLM, LiteLLM default | `chat` |

**Set `completionModel` explicitly whenever the `model` carries a foreign prefix** such as `google-ai-studio/…`. Copilot derives a completion model only from a prefix that matches the provider. Without one, inline suggestions fail while everything else works.

Structured output and `reasoningEffort` only reach a non-OpenAI model as far as the gateway translates them. For full control over Anthropic or Google models, configure that provider directly.

<https://kirby.tools/docs/copilot/configuration/global.md>

## Choosing a Panel Surface

The surfaces are independent. Pick what the blueprint needs rather than adding all of them:

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

`buttons` and a writer field's `marks` are allow-lists: Kirby's defaults have to be named alongside `copilot` or `copilot-suggestions`, or they disappear – for `marks`, from stored content on the next save, links included. To reach every view without editing blueprints, list the button names in Kirby's `panel.viewButtons.<view>` option. Props like `userPrompt` stay in the blueprint. A blueprint's `buttons` wins over the option.

`completion: false` stops ghost text appearing on its own while the shortcut still requests one.

<https://kirby.tools/docs/copilot/configuration/local.md>

## Generating Blocks and Layouts

A view button or section on a `blocks` or `layout` field generates whole blocks from the site's own block blueprints. `excludedBlocks` in `config.php` keeps content-less custom blocks out everywhere. A `description` key on a custom block blueprint is all the AI model learns about the block beyond its name. Generated content is appended to the field, never replacing it. Blocks nest one level, so a block inside a nested block is never generated.

<https://kirby.tools/docs/copilot/advanced/blocks-and-layouts.md>

## Driving Generation From PHP

`Client::instance()` reads the same `johannschopplich.copilot` options as the Panel and keeps them until `Client::reset()`. `generateText` and `generateObject` are the calls. The bound on a call is the provider's `timeout` (120 seconds, set per provider alongside `apiKey`), not the web server.

<https://kirby.tools/docs/copilot/php-classes/client.md>

## Prompt Templates and Skills

Templates are reusable user prompts in the dialog, some built in. Skills are house rules an editor layers onto a prompt with `@skill://<id>`. Both live in `config.php`.

<https://kirby.tools/docs/copilot/prompt-dialog/templates.md> and <https://kirby.tools/docs/copilot/prompt-dialog/skills.md>

## Connecting Agents

`'agents' => true` under `johannschopplich.copilot` lets Panel users connect any agent that supports remote MCP servers over HTTP with OAuth to the MCP URL, by default `https://<site>/api/copilot/mcp`. The agent logs in through the Panel, works as that Kirby user within their role, and brings its own model, so it needs no provider. Keep a role out with `copilot-agents: false` under `permissions.access` in its blueprint.

```bash
claude mcp add --transport http kirby https://example.com/api/copilot/mcp
```

Then `/mcp` in Claude Code or `claude mcp login kirby` opens the Panel's login.

The user picks the connection permissions in the Panel's consent view, capped by their role, and changes them later in the **Agents** view. A role blueprint withholds publishing or deleting from agents with `agentsPublish: false` or `agentsDelete: false` under `permissions.johannschopplich.copilot`. Publishing takes all unsaved changes of a page in a language, the user's own Panel edits included, as the Panel's **Save** button does.

The hosting has to pass `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server` at the domain root, and the paths below them, to Kirby. It also has to pass the `Authorization` header to PHP. A Kirby in a subfolder such as `/cms` needs both passed on from the domain root, the second as `/.well-known/oauth-authorization-server/cms`. The Panel's **Agents** view checks all of this from the browser and names the fix. claude.ai, Claude Desktop, and ChatGPT connect from their own servers, so they need a site reachable from the internet, which the browser check doesn't test. After a server fix, Claude Code needs `claude mcp remove kirby` and the URL added again – it keeps the login server of an earlier connection.

<https://kirby.tools/docs/copilot/agents.md> and <https://kirby.tools/docs/copilot/agents/hosting.md>

## When Generation Fails

**Long generations cut off** – _No object generated_, _Unterminated string_, a 504, or a closed connection. In the Panel the cause is the web server's read timeout (nginx `fastcgi_read_timeout`, Apache `ProxyTimeout`); PHP's own execution limit is already lifted for proxy requests. From PHP the bound is the provider's `timeout`.

**A missing API key** – the PHP `Client` fails with `Missing API key in "johannschopplich.copilot.providers.<name>.apiKey"`, the Panel with `Missing API key for the "<name>" provider`. The key sits under `providers.<name>.apiKey`. A key read from an environment variable resolves in the environment the **Panel** runs under, which routinely differs from the CLI's.

**An option that is silently wrong** – with Kirby's `debug` off, the Panel does this without an error:

- It swaps an option value it cannot use for the default.
- It drops a `promptTemplates` or `skills` entry it cannot read.
- It turns an unknown `provider` into Google.

With `debug` on, the exception names the option. The PHP `Client` always fails: `Unknown provider "<name>"` or `Missing required option "johannschopplich.copilot.provider"`.

**Blocks come back malformed** – generate fewer blocks per prompt and set `logLevel: 'debug'` to see the prompts that were sent in the browser console. Through a gateway, confirm it translates `json_schema` at all.

**Inline suggestions never appear** – in order: `copilot-suggestions` is in the writer field's `marks`, `completion` is not `false`, and behind a gateway `completionModel` is set.

<https://kirby.tools/docs/copilot/advanced/troubleshooting.md>

## When an Agent's Write Goes Wrong

A refused write or delete tells the connected agent why and what to do. Two failures don't explain themselves:

**An agent's write is overwritten** – an editor who types in a page the agent just wrote to saves their form over it before the view reloads, which takes up to 10 seconds. Pause typing while the agent works.

**A page delete stops halfway through its files** – a file template turns off `delete`, and Kirby deleted the page's other files first. Without `files.delete`, deleting a page with files fails outright, so give a role both `pages.delete` and `files.delete`, or neither.

<https://kirby.tools/docs/copilot/agents/permissions-and-review.md> and <https://kirby.tools/docs/copilot/agents/hosting.md>
