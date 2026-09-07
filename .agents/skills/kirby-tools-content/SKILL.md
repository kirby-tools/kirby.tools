---
name: kirby-tools-content
description: Writing or editing anything a visitor or an agent reads on kirby.tools – documentation under `content/1.docs/`, landing and home YAML, blog, buy pages, the plugin READMEs, the agent skills under `server/assets/skills/`. Which register a sentence takes by where it sits, and how a documentation page is built from Nuxt UI Prose components.
---

# kirby.tools Content

## Register

A sentence's register follows its place. Hero, section and feature titles and CTAs may claim or joke. Everything that reads as information – descriptions, taglines, FeatureCard and FeatureList text, docs intros and bullets, README intros, buy-page heroes and FAQ answers, meta descriptions – says what the editor or developer does, what happens, and where it stops, taken from the plugin source rather than from adjectives. The blog is first person and may judge; an adjective still does not replace behavior. Two exceptions: Headless is the one page whose cards carry code identifiers, and the Yoast assessment count is never cited.

Terminal punctuation follows form, not place: a sentence takes a period, a noun phrase or fragment takes none. A title is the exception – never a period, though it may end on a question or exclamation mark.

A plugin README opens with its documentation intro; a change to one is a change to both.

## Documentation

Docs live under `content/1.docs/<ProductId>/`, built from Nuxt UI Prose components: https://ui.nuxt.com/docs/typography. Read neighbouring pages for shape; this section carries what the corpus cannot tell you.

Plain prose is the default. A component earns its place by doing a job no other component on the page is already doing. A configuration guide has one `###` heading per option, then prose, default and example. A reference page – PHP classes, exceptions – is tables and `::field-group`, one sentence per entry.

The documentation states the contract, not the mechanism: what the reader calls – classes, signatures, config keys and defaults, the plugin's own exceptions – what they observe, and what costs them money or data. The path a value takes through the code, the internal classes, enums and SDK exceptions along it, and the arithmetic behind a number stay in the source, where a developer using the classes reads them. After a cut, `pnpm docs:vanished-facts <base>..<head>` lists every number and identifier the cut removed from a Product's documentation entirely; each one is mechanism, or a fact that goes back.

- `::callout` is link-out only and always carries `to=`; advice without a link is `::tip`, `::note` or `::warning`.
- `::code-group` holds alternatives for one task; `::tabs` holds axes that are not substitutes.
- `::steps` numbers an ordered set of three or more. `::accordion` is unused, since folding hides content from search.
- Code blocks of 30 or more lines go in `::code-collapse`.

Headings in APA title case; a property heading carries the identifier in backticks; a feature name is a noun phrase. The frontmatter description summarises rather than echoes the first sentence, and keeps backticked identifiers only where an editor types them.

A blueprint key that takes a list of names – `marks`, `buttons`, `fields` – is an allow-list: the snippet's entries replace Kirby's defaults. An example that lists a plugin's own entry says so at the snippet.

A code example is a contract: pasted into the file its info string names, it works unchanged. An example you cannot check against the plugin source is one you go and read the source for.

## Skills

`server/assets/skills/<Plugin>/SKILL.md` is the body of a Product's agent skill. The route serves it with the frontmatter, heading, provenance, not-for line and license note generated from `products.ts`, so the body carries none of them and opens at `## Install`. The pointer is `skillDescription` in `products.ts`: it names the branches the body has a section for. The body is the decisions a setup makes, in the order it makes them, then the gotchas from support, each section closing with the `.md` page it summarises; what that page already says is a link, not a copy. A mechanism fact stays only where it retires a wrong fix. A snippet is a contract, and the plugin on `main` is the truth.
