---
name: kirby-tools-content
description: Writing or editing anything a visitor reads on kirby.tools – documentation under `content/1.docs/`, landing and home YAML, blog, buy pages, the plugin READMEs. Which register a sentence takes by where it sits, and how a documentation page is built from Nuxt UI Prose components.
---

# kirby.tools Content

## Register

A sentence's register follows its place. Hero, section and feature titles and CTAs may claim or joke. Everything that reads as information – descriptions, taglines, FeatureCard and FeatureList text, docs intros and bullets, README intros, buy-page heroes and FAQ answers, meta descriptions – says what the editor or developer does, what happens, and where it stops, taken from the plugin source rather than from adjectives. The blog is first person and may judge; an adjective still does not replace behavior. Two exceptions: Headless is the one page whose cards carry code identifiers, and the Yoast assessment count is never cited.

A plugin README opens with its documentation intro; a change to one is a change to both.

## Documentation

Docs live under `content/1.docs/<ProductId>/`, built from Nuxt UI Prose components: https://ui.nuxt.com/docs/typography. Read neighbouring pages for shape; this section carries what the corpus cannot tell you.

Plain prose is the default. A component earns its place by doing a job no other component on the page is already doing. A configuration guide has one `###` heading per option, then prose, default and example. A reference page – PHP classes, exceptions – is tables and `::field-group`, one sentence per entry.

- `::callout` is link-out only and always carries `to=`; advice without a link is `::tip`, `::note` or `::warning`.
- `::code-group` holds alternatives for one task; `::tabs` holds axes that are not substitutes.
- `::steps` numbers an ordered set of three or more. `::accordion` is unused, since folding hides content from search.
- Code blocks of 30 or more lines go in `::code-collapse`.

Headings in APA title case; a property heading carries the identifier in backticks; a feature name is a noun phrase. The frontmatter description summarises rather than echoes the first sentence, and keeps backticked identifiers only where an editor types them.

A blueprint key that takes a list of names – `marks`, `buttons`, `fields` – is an allow-list: the snippet's entries replace Kirby's defaults. An example that lists a plugin's own entry says so at the snippet.

A code example is a contract: pasted into the file its info string names, it works unchanged. An example you cannot check against the plugin source is one you go and read the source for.
