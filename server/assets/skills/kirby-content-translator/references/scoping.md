# Deciding what gets translated

Four settings narrow the field set, and they compose rather than override. All of them work globally in `config.php` and per blueprint.

## `fieldTypes`

Which field **types** participate. The default names eleven: `blocks`, `layout`, `list`, `object`, `structure`, `tags`, `text`, `textarea`, `writer`, plus `markdown` and `table`, which come from community field plugins.

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

Separate booleans, both `false` by default. Translating `slug` changes URLs, so decide it deliberately. `slug` is ignored on file and site models and on the home and error pages.

Full reference:
<https://kirby.tools/docs/content-translator/configuration/local.md>
<https://kirby.tools/docs/content-translator/advanced/kirbytags.md>
