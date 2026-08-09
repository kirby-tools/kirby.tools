---
name: kirby-tools-docs
description: Authoring rules for kirby.tools plugin documentation under `content/1.docs/` using Nuxt UI Pro Prose components. Use when creating, editing, harmonizing, or refactoring `.md` files under that path. Don't use for general Markdown outside `content/1.docs/`, code reviews, or non-kirby.tools projects.
---

# kirby.tools Documentation Authoring

Docs live under `content/1.docs/<plugin>/` in a Nuxt Content site, built from Nuxt UI Pro Prose components: https://ui.nuxt.com/docs/typography. Read neighbouring pages for shape and formatting. This file carries what the corpus cannot tell you.

Plain prose is the default. A component earns its place by doing a job no other component on the page is already doing.

## Surfaces

Two of them, and they don't mix:

- **Config guide** – `2.configuration/{global,local}.md`. Optimized for scanability: one `###` heading per option, then prose, defaults and examples.
- **Reference page** – `5.php-classes/...`, `4.value-objects.md`, `5.exceptions.md`, `6.advanced/2.reference.md`. Optimized for density: markdown tables and `::field-group`, one tight sentence per entry.

Every entry needs its own code block → config-guide layout. Every entry is one short sentence → field-group.

## Corpus Conventions

Facts about this corpus, not about the components:

- `::callout` is link-out only and always carries `to=`. Advice without a link is `::tip`, `::note` or `::warning`, picked by intent.
- Code blocks of 30 or more lines go in `::code-collapse`.
- `::card` without `to=` appears only as a parallel-choice pair – Composer/ZIP, DeepL/AI.
- `::code-group` holds runtime alternatives for one task; `::tabs` holds orthogonal axes that aren't substitutes.
- `::steps` numbers an ordered set of three or more: a procedure, a precedence list, or a pipeline.
- `::accordion` is unused – folding hides content from search and skim-readers.
- Colon count is two plus the nesting depth, on opening and closing fence alike.

## Headings

APA title case at every level. Capitalise words of 4 or more letters, lowercase `a, an, the, and, but, or, for, nor, on, at, to, from, by, with, in, of, as`, and always capitalise the first and last word: `## Migrating From v5 to v6`, `## Working With Files as Context`.

Property headings carry the identifier in backticks. Feature names are noun phrases – "Prompt Storage", not "Storing Prompts".

## Frontmatter Description

Summarises, never echoes: if it and the first body sentence share more than half their content words, rewrite one. Keep backticked identifiers only where an editor types them (`@page://`, blueprint keys); abstract PHP classes, methods, headers and config keys to plain prose.

## Kirby Semantics

A blueprint key that takes a list of names – `marks`, `buttons`, `fields` – is an **allow-list**: the snippet's entries are the whole set, and Kirby's defaults are gone. Every example that lists a plugin's own entry says so at the snippet, since a reader who pastes it otherwise loses the rest of their toolbar. Swapping the list for a map to pass props keeps allow-list semantics.

## Examples

A code example is a contract: pasted into the file its info string names, it works unchanged – valid YAML or PHP, real option and blueprint keys. An example you cannot check against the plugin source is one you go and read the source for.

## Workflow

1. Name each component's job on the page in one sentence. Another component already does that job → drop the redundant one. Else → keep it.
2. Apply the example contract to every code block you add or rewrite.
3. A rule could go either way → present 2 or 3 framings and ask the maintainer. Else → apply the rule.
