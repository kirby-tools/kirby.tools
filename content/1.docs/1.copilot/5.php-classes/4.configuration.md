---
title: Configuration Objects
description: Inspect, override, or rebuild the resolved provider configuration – useful for tests, dependency injection, and one-off scripts.
---

Inspect, override, or rebuild Copilot's resolved provider configuration. Useful for tests, dependency injection, and one-off scripts that need a custom resolution pass. The classes documented here are marked `@internal`. Their shapes are stable for v3.

## `ProviderName`

```php
namespace JohannSchopplich\Copilot\AI;

enum ProviderName: string
{
    case OpenAI    = 'openai';
    case Anthropic = 'anthropic';
    case Google    = 'google';
    case Mistral   = 'mistral';
}
```

The string value matches the lowercase config key – `johannschopplich.copilot.provider` and the `providers` map are both case-normalised to lowercase.

## `ProviderConfig`

```php
final readonly class ProviderConfig
{
    public function __construct(
        public string|null $apiKey = null,
        public string|null $model = null,
        public string|null $baseUrl = null,
        public array $options = [],
    ) {}
}
```

::field-group

::field{name="apiKey" type="String | null"}
Provider API key. Closures are resolved at construction time and receive the Kirby `App` instance.
::

::field{name="model" type="String | null"}
Model identifier. `null` falls back to the provider's `DEFAULT_MODEL`.
::

::field{name="baseUrl" type="String | null"}
Custom base URL. `null` falls back to the provider's `DEFAULT_BASE_URL`.
::

::field{name="options" type="Array"}
Passthrough bag – everything in `providers.<name>` that isn't `apiKey`, `model`, or `baseUrl` lands here and is spread into the upstream request payload.
::

::

## `Resolver`

```php
final readonly class Resolver
{
    public function __construct(
        public ProviderName $defaultProvider,
        public array $providers,
    );

    public static function fromKirbyOptions(): static;

    public function forProvider(ProviderName $name): ProviderConfig;
}
```

`fromKirbyOptions()` validates that `provider` is set and matches a known `ProviderName`. The `providers` map keys are lowercased automatically.

`forProvider()` resolves the `apiKey` closure (if any) on each call – the closure runs on every `Client` request, which is what powers [dynamic API keys](/docs/copilot/configuration/global#dynamic-api-keys).

::callout{icon="i-ri-arrow-right-line" color="info" to="/docs/copilot/php-classes/exceptions"}
`fromKirbyOptions()` throws `InvalidArgumentException` on missing or unknown `provider`; `forProvider()` throws `AuthException` on missing API keys. See **Exceptions** for the full message catalog.
::

## DI for Tests

Construct a `Resolver` directly:

```php
use JohannSchopplich\Copilot\AI\Client;
use JohannSchopplich\Copilot\AI\ProviderName;
use JohannSchopplich\Copilot\AI\Resolver;

$resolver = new Resolver(
    defaultProvider: ProviderName::OpenAI,
    providers: [
        'openai' => ['apiKey' => 'sk-test', 'model' => 'gpt-test'],
    ],
);

$client = new Client($resolver);
```

Or skip the resolver entirely with `providerOverride`:

```php
use JohannSchopplich\Copilot\AI\Providers\OpenAIProvider;

$client = new Client(
    providerOverride: new OpenAIProvider(
        config: new ProviderConfig(apiKey: 'sk-test'),
        client: $mockOpenAIClient,
    ),
);
```
