---
name: kirby-tools-content
description: Writing or editing anything a visitor or an agent reads on kirby.tools – documentation under `content/1.docs/`, landing and home YAML, blog, buy pages, the plugin READMEs, the agent skills under `server/assets/skills/`. Which register and voice a sentence takes by where it sits, and how a documentation page is built from Nuxt UI Prose components.
---

# kirby.tools Content

## Register

A sentence's register follows its place. Hero, section and feature titles and CTAs may claim or joke. Everything that reads as information – descriptions, including a CTA's, taglines, FeatureCard and FeatureList text, docs intros and bullets, README intros, buy-page heroes and FAQ answers, meta descriptions – says what the editor or developer does, what happens, and where it stops, taken from the Plugin source rather than from adjectives. A price is stated, never graded. Headless is the one Product whose FeatureCards carry code identifiers, and SEO Audit copy describes the Yoast assessments without counting them.

The blog may judge; an adjective still does not replace behavior, and each aside – the quiet, the small thing, the that's it – belongs to one post.

## Voice

One person speaks on the site, as I – footer, contact page, home CTA, `ai.md`, the blog, and any FAQ answer or docs note that recommends. Kirby Tools is the brand that person runs; the contact page is the one place that says who I is. A commitment or a disclaimer has no subject: "Every purchase comes with a 30-day money-back guarantee", "The checks come without a guarantee of accuracy". License, privacy policy and legal notice keep their own voice, and an editor inside a Mock speaks in character.

The person sounds like one: contractions in titles and warm sentences, "you don't have to" where a form says "not required", "drop me a line" where German says schreib mir.

## Punctuation

Terminal punctuation follows form, not place: a sentence takes a period, a noun phrase or fragment takes none. A title is the exception – it ends without a period, though a question or exclamation mark may close it.

## Documentation

A documentation page is built from Nuxt UI Prose components: https://ui.nuxt.com/docs/typography. Read neighbouring pages for shape.

Plain prose is the default. A component earns its place by doing a job no other component on the page is already doing. A configuration guide has one `###` heading per option, then prose, default and example. A reference page – PHP classes, exceptions – is tables and `::field-group`, one sentence per entry.

The documentation states the contract, not the mechanism: what the reader calls – classes, signatures, config keys and defaults, the Plugin's own exceptions – what they observe, and what costs them money or data. The path a value takes through the code, the internal classes, enums and SDK exceptions along it, and the arithmetic behind a number stay in the source, where a developer using the classes reads them. After a cut, `pnpm docs:vanished-facts <base>..<head>` lists every number and identifier the cut removed from a Product's documentation entirely; each one is mechanism, or a fact that goes back.

- `::callout` is link-out only and always carries `to=`; advice without a link is `::tip`, `::note` or `::warning`.
- `::code-group` holds alternatives for one task; `::tabs` holds axes that are not substitutes.
- `::steps` numbers an ordered set of three or more. `::accordion` is unused, since folding hides content from search.
- Code blocks of 30 or more lines go in `::code-collapse`.

Headings in APA title case; a property heading carries the identifier in backticks; a feature name is a noun phrase. The frontmatter description summarises rather than echoes the first sentence, and keeps backticked identifiers only where an editor types them.

A blueprint key that takes a list of names – `marks`, `buttons`, `fields` – is an allow-list: the snippet's entries replace Kirby's defaults. An example that lists a plugin's own entry says so at the snippet.

## READMEs

A Plugin README opens with its documentation intro; a change to one is a change to both. Kirby Headless is the exception and opens with its Tagline.

## Code Examples

A code example – in a documentation page or a skill body – is a contract: pasted into the file its info string names, it works unchanged. An example you cannot check against the Plugin source is one you go and read the source for.

## Skills

The file under `server/assets/skills/` is only the body of a Product's agent skill: the route generates the frontmatter, heading, provenance, not-for line and license note from `products.ts`, so the body carries none of them and opens at `## Install`. The pointer is `skillDescription` in `products.ts`: it names the branches the body has a section for. The body is the decisions a setup makes, in the order it makes them, then the gotchas from support, each section closing with the `.md` page it summarises; what that page already says is a link, not a copy. A mechanism fact stays only where it retires a wrong fix. The Plugin on `main` is the truth.
