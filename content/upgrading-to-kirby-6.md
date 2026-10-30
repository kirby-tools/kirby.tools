---
title: Upgrading to Kirby 6
description: Moving a Kirby Tools site to Kirby 6 – the PHP and license you need, and the blueprint change for each plugin
navigation.icon: i-ri-arrow-up-circle-line
---

Kirby 6 ships a new Panel, and every plugin with a Panel part has a new major for it: Kirby Copilot v4, Kirby Content Translator v4, Kirby SEO Audit v4, and Kirby Live Preview v3. Kirby SERP Preview v2 and Kirby Minimap v2 are free and follow the same rules. Each major runs on Kirby 6 only. Your current versions keep working on the Kirby 4 or 5 site they run on.

## Before You Upgrade

- **PHP 8.3, 8.4, or 8.5** – the versions Kirby 6 runs on
- **A Generation 3 license** for each paid plugin – see [Which License Covers It](#which-license-covers-it)

Update Kirby and the plugins in the same deployment. Composer won't install a Kirby 6 major on a Kirby 4 or 5 site, and a plugin version for Kirby 5 leaves an **Invalid section type** box on Kirby 6 where the plugin used to be.

## Sections Become Fields

Kirby 6 keeps `sections:` for its own section types – `fields`, `files`, `info`, `pages`, and `stats`. Every plugin that was a section is now a field with the same type name: move the entry from `sections:` to `fields:` and keep its name. The type and every property keep their names. A plugin entry left under `sections:` renders a red **Invalid section type** box in its place and has no other effect – your content is untouched.

Sections and fields share one namespace on Kirby 6, and upper and lower case count as the same name. If a field already has the entry's name, Kirby shows a box saying the field already exists – rename one of them.

A `fields` section wrapper can stay, since Kirby 6 unwraps it into its fields. A tab or column takes `fields:` directly, though, so SERP Preview and the meta fields it reads become one map:

```yaml [site/blueprints/pages/default.yml]
fields:
  metaTitle:
    type: text
  metaDescription:
    type: textarea
  serpPreview:
    type: serp-preview
    titleContentKey: metaTitle
    descriptionContentKey: metaDescription
```

The same move, per plugin:

<!-- unverified: Live Preview v3 is not ported yet – the `preview` field type, its properties keeping their names (`interactable: 0` already means `false` on Kirby 6), and "Compatibility release, no new options" in the table below rest on the plan -->

::tabs

:::tabs-item{label="Copilot"}

```diff [site/blueprints/pages/default.yml]
-sections:
+fields:
   copilot:
     type: copilot
     field: blocks
```

:::

:::tabs-item{label="Content Translator"}

```diff [site/blueprints/pages/default.yml]
-sections:
+fields:
   contentTranslator:
     type: content-translator
```

:::

:::tabs-item{label="SEO Audit"}

```diff [site/blueprints/pages/default.yml]
-sections:
+fields:
   seoAudit:
     type: seo-audit
     keyphraseField: metaKeyphrase
```

:::

:::tabs-item{label="Live Preview"}

```diff [site/blueprints/pages/default.yml]
 columns:
   - width: 1/3
     sticky: true
-    sections:
+    fields:
       livePreview:
         type: preview
```

:::

::

A section kept in its own file under `site/blueprints/sections/` can stay there – `extends: sections/seo-audit` works under `fields:` too.

The view buttons keep their names: `copilot`, `content-translator`, and `seo-audit` under `buttons:`.

## Which License Covers It

A **Generation 3** license includes the Kirby 6 majors – install them, there is nothing else to do. A Generation 1 or Generation 2 license stops at the earlier majors and upgrades to Generation 3 at 50% off, as [Upgrade Discount](/license-compatibility#upgrade-discount) describes. The upgrade issues a new license key, which you activate in the Panel like the old one.

Your current license stays valid for the versions it covers, so a site that stays on Kirby 4 or 5 needs no new license. Which version each generation covers is on the [license compatibility page](/license-compatibility).

## Per Plugin

<!-- unverified: the Headless row – Kirby Headless has no Kirby 6 branch yet, so v9 and KQL 4 rest on the plan -->

| Plugin                   | Latest for Kirby 5 | Kirby 6 | Notes                                                                                                                                                                      |
| ------------------------ | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kirby Copilot            | v3                 | v4      | Same providers, same `config.php` options                                                                                                                                  |
| Kirby Content Translator | v3                 | v4      | `confirm` is removed, Translation Coverage stays in the **Languages** view – [migration guide](/docs/content-translator/getting-started/migration#migrating-from-v3-to-v4) |
| Kirby SEO Audit          | v3                 | v4      | Same assessments and ratings, reports kept in the browser start over once – [changelog](/seo-audit/changelog)                                                              |
| Kirby Live Preview       | v2                 | v3      | Compatibility release, no new options                                                                                                                                      |
| Kirby SERP Preview       | v1                 | v2      | Free                                                                                                                                                                       |
| Kirby Minimap            | v1                 | v2      | Free, nothing to configure                                                                                                                                                 |
| Kirby Headless           | v8                 | v9      | No Panel part, requires KQL 4                                                                                                                                              |
