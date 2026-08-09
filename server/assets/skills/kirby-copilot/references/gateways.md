# Gateways and OpenAI-compatible endpoints

Any endpoint that speaks the OpenAI shape is configured as `provider: 'openai'` with a custom `baseUrl` — Vercel AI Gateway, Cloudflare AI Gateway, OpenRouter, llama.cpp, vLLM, LiteLLM.

## The `api` option decides whether it works at all

Copilot defaults to the Responses API (`/v1/responses`). Endpoints that only expose `/v1/chat/completions` need `api: 'chat'`, otherwise requests fail with 404 or JSON parse errors.

| Endpoint                                      | Responses API | `api`  |
| --------------------------------------------- | ------------- | ------ |
| Direct OpenAI (`api.openai.com/v1`)           | yes           | —      |
| Vercel AI Gateway (`ai-gateway.vercel.sh/v1`) | yes           | —      |
| Cloudflare AI Gateway `…/openai`              | yes           | —      |
| Cloudflare AI Gateway `…/compat`              | no            | `chat` |
| OpenRouter (`openrouter.ai/api/v1`)           | yes           | —      |
| Self-hosted: llama.cpp, vLLM, LiteLLM default | typically no  | `chat` |

For anything unlisted, check the gateway's docs for `/v1/responses` and set `api: 'chat'` when it is absent.

## Routing several providers through one gateway

Cloudflare's Unified API (`…/compat`) carries `{provider}/{model}` model IDs through the OpenAI shape, which buys one endpoint for observability, caching, and rate limiting across vendors.

```php [site/config/config.php]
return [
    'johannschopplich.copilot' => [
        'provider' => 'openai',
        'providers' => [
            'openai' => [
                'apiKey' => env('GOOGLE_AI_STUDIO_API_KEY'),
                'baseUrl' => 'https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat',
                'model' => 'google-ai-studio/gemini-3.5-flash',
                'completionModel' => 'google-ai-studio/gemini-2.5-flash-lite',
                'api' => 'chat',
            ],
        ],
    ],
];
```

**Set `completionModel` explicitly whenever the model carries a foreign prefix.** Copilot derives a completion model from the provider, and it will not guess one across gateways — leave it out and inline suggestions fail while everything else works.

## What a gateway costs you

Two capabilities degrade on the OpenAI-compatible path, so test before relying on them:

- **Structured output** — blocks, layouts, and field schemas depend on the gateway translating `json_schema` faithfully.
- **`reasoningEffort`** — it cannot map reliably onto another vendor's models through the OpenAI shape. For full reasoning control on Anthropic or Google models, configure `provider: 'anthropic'` or `provider: 'google'` directly.

## Dynamic keys

`apiKey` accepts a closure receiving the Kirby instance, which covers per-role keys, keys fetched from a service, and multi-tenant setups.

```php
'apiKey' => fn (\Kirby\Cms\App $kirby) => $kirby->user()?->role()->name() === 'admin'
    ? env('OPENAI_API_KEY_ADMIN')
    : env('OPENAI_API_KEY_USER'),
```

Full reference: <https://kirby.tools/docs/copilot/configuration/global.md>
