---
name: kirby-tools-docs
description: Authoring rules for kirby.tools plugin documentation under `content/1.docs/` using Nuxt UI Pro Prose components. Use when creating, editing, harmonizing, or refactoring `.md` files under that path. Don't use for general Markdown outside `content/1.docs/`, code reviews, or non-kirby.tools projects.
---

# kirby.tools Documentation Authoring

Authoring rules for the kirby.tools docs corpus. Plain prose is the default; every Nuxt UI Pro Prose component must justify its presence with a specific job. Sidebar navigation already provides progressive disclosure, so content that would fold or re-list it stays on the page.

Docs live under `content/1.docs/<plugin>/` in a Nuxt Content site. Component reference: https://ui.nuxt.com/docs/typography.

## Glossary

Use these terms exactly. Drift between synonyms breaks the rules below.

- **Config guide** – `2.configuration/{global,local}.md`. Surface optimized for scanability.
- **Reference page** – `5.php-classes/...`, `4.value-objects.md`, `5.exceptions.md`, `6.advanced/2.reference.md`. Surface optimized for density and lookup.
- **Expanded-property layout** – `### \`name\` :u-badge{...}` heading followed by paragraphs, examples, sub-properties.
- **Field-group layout** – `::field{name="..." type="..."}` row with one tight sentence.
- **Role-based callout** – `::tip` / `::note` / `::warning`, picked by intent.
- **Link-out callout** – `::callout{... to="..."}`, used only to navigate elsewhere.

## Core Principles

- Plain prose first. A component is an exception that earns its place.
- Three things pick the component: **intent** picks the callout, the **axis** picks code-group vs tabs, the **surface** picks the property layout.
- Reference pages prefer density (tables, field-group). Config guides prefer scanability (expanded-property heading + badge). Surfaces don't mix.
- APA title case applies to every heading at every level across every plugin.
- A code example is a contract: the reader pastes it and it works.

## Callouts

Intent picks the primitive.

- `::tip` – actionable advice the reader can apply now.
- `::note` – neutral context, aside, version note, mild caveat.
- `::warning` – hazard, breaking change, footgun, "may overwrite".
- `::callout{... to="..."}` – link-out only; the `to=` attribute is required.

What that decides:

- Advice without a link is `::tip` / `::note` / `::warning`; `::callout` always carries a `to=`.
- Two sibling warnings are the ceiling – a third means they belong in one bulleted `::warning`.
- A link-out `::callout` sits inline where the reader needs the detour. The sidebar carries the page-end chain.

## Cards

A `::card` or `::card-group` earns its place under exactly one condition:

- **Navigation surface** – the card has `to="..."` and links elsewhere.
- **Parallel-choice visual** – two or more equivalent options on the same page form a visual pair or group: install Composer/ZIP, provider DeepL/AI, Strategy overview.

Everything else takes a plainer shape: one prose block with no `to=` is a `### Heading`, a step's content sits directly in the step, and a reference page uses a markdown table or field-group, where density wins for lookup.

## CodeCollapse

- Wrap any code block of 30 or more lines in `::code-collapse`.
- Wrap shorter blocks when the block dominates the page.
- Pass the `name` attribute when the page has multiple collapsed blocks: `::code-collapse{name="Custom Prompt Template"}`.

## CodeGroup vs Tabs

The axis decides the component.

- `::code-group` – runtime alternatives for the same task. The reader picks one and runs it: `npm` / `yarn` / `pnpm`, equivalent CSS / JS snippets.
- `::tabs` with `:::tabs-item{label="..."}` – orthogonal axes that aren't substitutes: Before v5 vs After v6, Basic vs Multilingual setup, Writer Field vs Textarea Field.

Two stacked `::code-group` blocks sharing the same axis labels signal a `::tabs` shape was needed. If you can copy one tab's contents into the other by rewriting wrapper keys only, it's not an axis – flatten it.

## Property References

Two valid layouts; the surface picks one.

- **Expanded-property** – config guides at `2.configuration/{global,local}.md`. Use when each property warrants more than 2–3 sentences, code examples, or sub-properties.

  ```mdc
  ### `apiKey` :u-badge{label="String" class="align-middle ml-2 rounded-full!" variant="subtle"}

  Description paragraph. Defaults, examples, code blocks all welcome.
  ```

- **Field-group** – reference pages and dense-listing surfaces. Use when each property is one tight sentence.

  ```mdc
  ::field-group
    ::field{name="text" type="string" required}
    The source text to translate.
    ::
  ::
  ```

Rule: every entry needs its own code block → expanded-property. Every entry is one short sentence → field-group.

### Multiple Accepted Types

An option that accepts more than one type badges them alphabetically, joined by a spaced pipe: `Array | Boolean`, `Boolean | String`. Every type in the badge is documented in the body – a badge that promises `Array` and a body that only shows `false` leaves the array shape to guesswork.

- A scalar type enumerates its literal values on an `**Options:**` line: `true`, `false`, `"auto"`.
- An array or object type gets its own example, because its shape is the part the reader cannot infer.

## Kirby Semantics

A blueprint key that takes a list of names – `marks`, `buttons`, `fields` – is an **allow-list**: the snippet's entries are the whole set, and Kirby's defaults are gone. Every example that lists a plugin's own entry says so at the snippet, since a reader who pastes it otherwise loses the rest of their toolbar.

Swapping the list for a map to pass props keeps allow-list semantics – each entry still has to be named, and `true` renders one with its own defaults.

## Steps

Use `::steps{level="3"}` only when all three hold:

- The procedure has 3 or more ordered steps.
- At least one step contains a code block, callout, or tabs.
- A flat ordered list would flatten meaningful structure.

Two steps are two H3 headings, and prose that already reads top-to-bottom stays prose.

## Headings

- APA title case at every level. Capitalise words of 4 or more letters. Lowercase short articles, conjunctions, and prepositions: `a, an, the, and, but, or, for, nor, on, at, to, from, by, with, in, of, as`. Always capitalise the first and last word.
  - `## Migrating From v5 to v6`
  - `## Configuration With KQL`
  - `## Working With Files as Context`
- Property reference headings use code formatting: `` ### `propertyName` `` – never `### Property Name`.
- Section feature names use noun phrases: "Prompt Storage", not "Storing Prompts".

## Frontmatter Description

- Summarises, never echoes. If the description and the first body sentence share more than half their content words, rewrite one.
- Keep backtick-wrapped identifiers only when an editor types them (`@page://`, `@skill://`, slot names, blueprint keys); abstract internal API names (PHP classes, methods, headers, config keys) to plain prose.

## Avoid

- `::accordion` anywhere in the docs. Folding hides content from search and skim-readers – inline it, or split it to a new page.
- Decorative wrapping in any component that adds no semantic job.

## Inline Primitives

Use freely where they fit.

- `:icon{name="i-ri-..."}` – inline icons.
- `:kbd{value="Ctrl"}` – keyboard shortcuts.
- `:u-badge{...}` – property-type badges on expanded-property headings.
- `:latest-version` – dynamic version pill on install pages.

## MDC Syntax

- `::component` – block-level; closes with a fence of the same width.
- Colon count is two plus the nesting depth, on the opening and closing fence alike: `::tabs` > `:::tabs-item` is the canonical case, and `::card-group` > `:::card` > `::::code-group` is the deepest shape the corpus uses.
- `:component{prop="val"}` – inline form.
- Code block info string supports a filename: ` ```php [config.php] `.
- Card children sit between the opening and closing fence with one blank line above and below.

Tabs example with two orthogonal axes:

```mdc
::tabs

:::tabs-item{label="Before (v5)"}
\`\`\`php [config.php]
// old config
\`\`\`
:::

:::tabs-item{label="After (v6)"}
\`\`\`php [config.php]
// new config
\`\`\`
:::

::
```

## Workflow

1. Run `git diff --stat content/1.docs/` to see scope before refactoring across files.
2. For each component on the page, name its job in one sentence. If another component on the page already does that job → drop the redundant one. Else → keep it.
3. Re-read the relevant rule section above before assuming a card/callout/tabs distinction.
4. Apply the copy-paste test to every code example you add or rewrite: pasted into the file its info string names, it works unchanged – valid YAML or PHP, real option and blueprint keys, and any allow-list consequence spelled out. An example you cannot check against the plugin source is one you go and read the source for.
5. If a rule could go either way → present 2 or 3 framings and ask the maintainer. Else → apply the rule.
