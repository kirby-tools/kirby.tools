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
The canonical key of a Product, e.g. `copilot` or `seo-audit`. It is also the first path segment of the landing page and the second of a documentation page, but identity comes first and routes are derived from it. On disk the documentation lives in `content/1.docs/<n>.<ProductId>/` and the landing page with its changelog in `content/<n>.<ProductId>/`, where `<n>` orders the siblings and differs between the two trees.
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

**Mock**:
A live rendering of a Panel surface, assembled from Kirby's own Panel components, that stands in a documentation page where a screenshot would otherwise go. A Mock is a stage, not a replica: it must not misrepresent the Plugin it depicts, and it spends Kirby's own tokens wherever a Panel component renders, but the frame around it belongs to the page rather than to a Panel view, so the values Kirby uses to size a full view are not the Mock's to match.
_Avoid_: Screenshot, demo, replica

**Alternate**:
The Markdown representation of a page, published beside it and announced by a `rel="alternate"` link. It is regenerated from the stored content rather than copied from it, so it is a second rendering of the page – not the file an author wrote.
_Avoid_: Twin, source, raw
