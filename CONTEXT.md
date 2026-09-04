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

**ThemeColor**:
One of the four named color ramps the site is drawn in: Pumpkin, Orchid, Danube, Lima. Pumpkin is the site's own; a Product may carry one of the others as its own, and everything themed after that Product – its pages, its favicon, its SocialCard – takes the color from the Product. Every path resolves to a ThemeColor, so a Product is distinguished by carrying one, not by being themed. The Nuxt UI color slot keyed by ProductId is derived from this, never the source.
_Avoid_: Color slot, brand color, palette, hex code

**Mock**:
A live rendering of a Panel surface, assembled from Kirby's own Panel components, that stands in a documentation or landing page where a screenshot would otherwise go. A Mock is staged, not replicated: it must not misrepresent the Plugin it depicts, and it spends Kirby's own tokens wherever a Panel component renders, but the frame around it belongs to the page rather than to a Panel view, so the values Kirby uses to size a full view are not the Mock's to match. Where Kirby lets an editor type or unfold, a Mock lets the reader do the same; nothing else in it responds and nothing is kept.
_Avoid_: Screenshot, demo, replica

**Stage**:
The frame a Mock renders into, standing in for whatever the Panel supplies around a component – the view a header sits above, the portal a dialog centers in, the viewport a container query measures. The Stage belongs to the page, so its measures are the page's rather than Kirby's.
_Avoid_: Frame, canvas, wrapper, viewport

**Tagline**:
The one-line pitch of a Product, written for the SocialCard and the agent-facing index. It is one sentence, short enough to stand on a single line of the SocialCard, and says what the Plugin does; it does not repeat the Product's name. The short menu line next to a Product's name is its description, not its Tagline.
_Avoid_: Subtitle, subline, claim, slogan

**FeatureCard**:
One of the cards a Product's landing page lays out in a grid: a title, a paragraph, and a link into the documentation. The title may claim or joke; the paragraph says what the editor or developer does, what happens, and where it stops, and it is the longest place on the site where a single feature is described in prose.
_Avoid_: Feature box, tile, USP

**FeatureList**:
The three lines under a Product on the home page, each a name and one sentence. It is the FeatureCard's shorter sibling with the same register: the name may claim, the sentence states behavior. A FeatureList names the Product's three strongest features, not everything it does.
_Avoid_: Feature bullets, highlights, key features

**SocialCard**:
A PNG rendered from the site's own components – Mocks included – for sharing off-site. It comes in two formats: the Open Graph format, linked from a page's meta tags, and the 4:3 format, posted by hand. A SocialCard is rendered, never drawn; the design tool that once produced it is gone.
_Avoid_: OG image, social image, header image, Lemon Squeezy image
