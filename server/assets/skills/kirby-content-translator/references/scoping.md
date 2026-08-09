# Deciding what gets translated

Four settings narrow the field set, and they compose rather than override. All of them work globally in `config.php` and per blueprint.

## `fieldTypes`

Which field **types** participate. The default covers every text-like type — `list`, `tags`, `text`, `textarea`, `writer`, `markdown` — plus the containers they nest in: `blocks`, `layout`, `object`, `structure`. Third-party `markdown` and `table` fields are included when their plugins are present.

```yaml
fieldTypes:
  - blocks
  - text
  - textarea
```

**Containers do not imply their contents.** Translating a text field inside a blocks field needs both `blocks` and `text` in the array. A list containing only `blocks` translates nothing.

## `includeFields` and `excludeFields`

Which field **names** participate, case-insensitively, nested or not. `includeFields` narrows to a named set; `excludeFields` subtracts from whatever `fieldTypes` admitted. Both still respect `fieldTypes`, so a name listed in `includeFields` whose type is absent from `fieldTypes` stays untranslated.

```yaml
excludeFields:
  - description
  - summary
```

## `translate: false` wins

A field marked `translate: false` in its blueprint is skipped no matter what these four settings say. When a field refuses to translate and the config looks right, that flag is the first thing to check.

## `kirbyTags`

KirbyTags are **excluded by default**, which keeps URLs, filenames, and technical attributes intact. Opt in per tag type, naming the attributes that carry prose:

```yaml
kirbyTags:
  link: [text, title]
  image: [alt, title, caption]
  file: [text, title]
  email: [text, title]
  video: [caption]
```

Listing an attribute that holds a URL or filename sends it to the translator, which is the failure mode this default exists to prevent.

## `title` and `slug`

Separate booleans, because they are separate risks. Translating `title` is usually wanted; translating `slug` changes URLs, so decide it deliberately.

Full reference:
<https://kirby.tools/docs/content-translator/configuration/local.md>
<https://kirby.tools/docs/content-translator/advanced/kirbytags.md>
