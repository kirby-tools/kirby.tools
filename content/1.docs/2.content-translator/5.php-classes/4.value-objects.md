---
title: Value Objects
description: Typed payloads passed between translator, strategies, and hooks – use them when implementing a custom strategy or inspecting hook arguments.
---

The pipeline passes small, immutable value objects between layers. You'll encounter them when implementing a custom strategy or inspecting hook payloads. All live in `JohannSchopplich\ContentTranslator\Translation`.

## `TranslationUnit`

A single piece of text to translate, paired with a dispatch hint and optional field key.

```php
final readonly class TranslationUnit
{
    public function __construct(
        public string $text,
        public TranslationMode $mode = TranslationMode::Batch,
        public string|null $fieldKey = null,
    ) {}
}
```

::field-group

::field{name="text" type="String"}
The text to translate. Already passed through `content-translator.translate:before` when emitted by `Translator`.
::

::field{name="mode" type="TranslationMode"}
Dispatch hint – `Batch` (default) or `Single`. See below.
::

::field{name="fieldKey" type="String | null"}
The originating field key, or `null` for ad-hoc translations. For nested table cells, the format is `fieldName[row][col]`.
::

::

## `TranslationMode`

Dispatch hint for a unit.

```php
enum TranslationMode: string
{
    case Batch = 'batch';
    case Single = 'single';
}
```

| Value    | When emitted                          | What it means                                                |
| -------- | ------------------------------------- | ------------------------------------------------------------ |
| `Batch`  | Default for prose, blocks, structures | Strategy may pool with other units in one upstream request   |
| `Single` | Table cells                           | Strategy should send standalone to preserve per-cell context |

::note
`CopilotAIStrategy` ignores the mode – LLM batching preserves per-item context naturally. `DeepLStrategy` honors it strictly.
::

## `ExecutionOptions`

Per-`execute()` options handed to a strategy.

```php
final readonly class ExecutionOptions
{
    public function __construct(
        public TranslationLanguage $targetLanguage,
        public TranslationLanguage|null $sourceLanguage = null,
    ) {}
}
```

::field-group

::field{name="targetLanguage" type="TranslationLanguage"}
The language to translate **into**.
::

::field{name="sourceLanguage" type="TranslationLanguage | null"}
The language to translate **from**, or `null` to let the backend auto-detect (DeepL) or guess (AI).
::

::

::tip
Always provide `sourceLanguage` when you know it. DeepL detection is unreliable for short strings, and AI providers produce noticeably better translations with an explicit source.
::

## `TranslationLanguage`

A language identifier paired with its display name.

```php
final readonly class TranslationLanguage
{
    public function __construct(
        public string $code,
        public string $name,
    ) {}

    /**
     * @throws \Kirby\Exception\InvalidArgumentException When the code is unknown on a multi-language site.
     */
    public static function fromCode(string $code): self;
}
```

::field-group

::field{name="code" type="String"}
The Kirby language code (`de`, `en`, `fr-ca`, …).
::

::field{name="name" type="String"}
The Kirby language name (`Deutsch`, `English`). On a single-language site (or when matched against an unknown code there), `name` falls back to `code`.
::

::

```php
$lang = TranslationLanguage::fromCode('de');
echo $lang->code; // "de"
echo $lang->name; // "Deutsch"
```

::warning
On a multi-language site, `fromCode()` throws `Kirby\Exception\InvalidArgumentException` when the code is not registered in `kirby()->languages()`.
::

::note
`CopilotAIStrategy` uses `name` in its prompt (`Translate from English to Deutsch`). Strategies targeting code-only APIs (DeepL) use `code`.
::
