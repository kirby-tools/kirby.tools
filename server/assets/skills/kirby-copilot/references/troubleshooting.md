# When generation fails

## Long generations cut off

Symptoms: _No object generated: could not parse the response_, _JSON parsing failed: Unterminated string_, a 504, or a connection that simply closes.

The cause is almost always a web server timeout, not PHP. Every request goes through a server-side PHP proxy, so the connection must stay open for the whole generation – 60+ seconds for longer content. The proxy already calls `set_time_limit(0)`, so PHP's own limit is not the problem.

**Laravel Herd.** nginx with FastCGI, default `fastcgi_read_timeout` 60 s. In `~/Library/Application Support/Herd/config/nginx/herd.conf`, inside the existing `location ~ [^/]\.php(/|$) { }` block:

```nginx
fastcgi_read_timeout 300;
fastcgi_send_timeout 300;
send_timeout 300;
```

Then `herd restart`. Herd may overwrite its global config on update – run `herd isolate` or `herd secure` on the site for a per-site config that survives.

**Production.**

| Stack              | Raise                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| nginx + PHP-FPM    | `fastcgi_read_timeout`, `fastcgi_send_timeout`, `send_timeout` to 300 s |
| Apache + PHP-FPM   | Apache's `ProxyTimeout`, FPM's `request_terminate_timeout`              |
| Apache + mod_fcgid | `FcgidOutputBufferSize 0` – the 64 KB default delays streamed tokens    |

**Cloudflare.** The 120-second limit (HTTP 524) is an idle timeout between reads, not a wall clock, and streaming SSE should never hit it. Seeing 524 means something buffers the response: add `fastcgi_buffering off;` to the `__copilot__/proxy` location for nginx, and if streams still arrive in bursts, disable Brotli/gzip for that route – the proxy sends `Cache-Control: no-transform`, but compression can still buffer `text/event-stream`.

## `Missing API key in "johannschopplich.copilot.providers.<name>.apiKey"`

The selected provider received an empty key. In order:

1. The key sits under `providers.<name>.apiKey`, not one level up.
2. An `env()` lookup resolves in the environment the **Panel** runs under – CLI and web server environments routinely differ.
3. A closure returns a non-empty string for the current Panel user, which matters when keys vary by role.

## `Unknown provider "<name>"`

The top-level `provider` key is missing or names something outside `openai`, `anthropic`, `google`, `mistral`. Matching is case-insensitive.

## Blocks generation returns malformed content

Missing fields, empty results, or wrong structure come from the model's handling of nested JSON schemas.

1. Switch to Google Gemini – the strongest structured-output support.
2. Generate fewer blocks per prompt, or simplify the prompt.
3. Set `logLevel: 'debug'` and inspect the raw response.

Through an OpenAI-compatible gateway, also confirm the gateway translates `json_schema` at all – see `references/gateways.md`.

## 404 or JSON parse errors from a gateway

The endpoint exposes only `/v1/chat/completions`. Set `providers.openai.api` to `'chat'`.

## Inline suggestions never appear

1. The writer field carries the mark. Append it to the existing `marks` list – never replace the list. `marks` is an allow-list: a mark left out is dropped from the editor schema, and the next save strips that formatting from stored content, links included.

```yaml [site/blueprints/pages/default.yml]
text:
  type: writer
  marks:
    - bold
    - italic
    - underline
    - strike
    - code
    - sup
    - sub
    - "|"
    - link
    - email
    - "|"
    - clear
    - "|"
    - copilot-suggestions
```

2. `completion` is not `false` in the global config.
3. Behind a gateway with a prefixed `model`, `completionModel` is set explicitly.

Full reference: <https://kirby.tools/docs/copilot/advanced/troubleshooting.md>
Exception types and payloads: <https://kirby.tools/docs/copilot/php-classes/exceptions.md>
