# Kirby Tools

The website, documentation and agent-facing surface for a set of Kirby CMS plugins sold and maintained by Johann Schopplich.

## Language

**Product**:
A unit offered on kirby.tools: a documentation section, a landing page, and – when commercial – a buy flow. Six exist: Copilot, Content Translator, SEO Audit, Live Preview, Minimap, Headless.
_Avoid_: Tool, module, package

**Plugin**:
The Composer package a customer installs into their Kirby site. A Product has exactly one Plugin; the two are not interchangeable, because the Plugin carries the vendor namespace and the Product does not.
_Avoid_: Extension, add-on

**ProductId**:
The canonical key of a Product, e.g. `copilot` or `seo-audit`. It is also the first path segment of the landing page and the second of a documentation page, but identity comes first and routes are derived from it.
_Avoid_: Slug, product key, product name

**License**:
Whether a Product is `commercial` (requires a license key) or `free`. Describes the terms, not the transaction.
_Avoid_: Paid, pricing, isPaid

**ConfigKey**:
The option namespace a Plugin reads from Kirby's `config.php`, e.g. `johannschopplich.copilot`. The commercial Plugins namespace under the Composer vendor; Headless claims the bare `headless` key it has used since before that convention. Live Preview and Minimap have none – they are configured through blueprints alone.
_Avoid_: Namespace, option prefix

**ColorSlot**:
A brand color registered in the Nuxt UI theme, e.g. `copilot` or `seo`. A design-system resource, not part of a Product's identity – most Products have none and fall back to `primary`.
_Avoid_: Theme color, brand color

**Skill**:
A hand-written document that teaches an AI coding agent how to work with one Plugin. Published per Product, named `kirby-<ProductId>`.
_Avoid_: Agent doc, instructions
