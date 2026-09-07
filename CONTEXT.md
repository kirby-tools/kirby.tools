# Kirby Tools

The website, documentation and agent-facing surface for a set of Kirby CMS plugins sold and maintained by Johann Schopplich.

## Language

**Product**:
A unit offered on kirby.tools: a documentation section, a landing page, and – when commercial – a buy flow.
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
The option namespace a Plugin reads from Kirby's `config.php`, e.g. `johannschopplich.copilot`. The commercial Plugins namespace under the Composer vendor; Headless claims the bare `headless` key it has used since before that convention. A Plugin configured through blueprints alone has none.
_Avoid_: Namespace, option prefix

**ThemeColor**:
One of the named color ramps the site is drawn in: Pumpkin, Orchid, Danube, Lima. Pumpkin is the site's own; a Product may carry one of the others, alone or shared with the Products it forms a family with, and everything themed after that Product – its pages, its favicon, its SocialCard – takes the color from the Product. Every path resolves to a ThemeColor, so a Product is distinguished by carrying one, not by being themed.
_Avoid_: Color slot, brand color, palette, hex code

**Mock**:
A live rendering of a Panel surface, assembled from Kirby's own Panel components, that stands in a documentation or landing page where a screenshot would otherwise go. A Mock is staged, not replicated: it must not misrepresent the Plugin it depicts, and it spends Kirby's own tokens wherever a Panel component renders, but the frame around it belongs to the page rather than to a Panel view, so the values Kirby uses to size a full view are not the Mock's to match. Where Kirby lets an editor type or unfold, a Mock lets the reader do the same; nothing else in it responds and nothing is kept. A Mock the page shows rather than offers answers nothing at all: inside a FeatureCard, on a SocialCard, or behind a dialog it stages.
_Avoid_: Screenshot, demo, replica, figure

**Stage**:
The frame a Mock renders into, standing in for whatever the Panel supplies around a component – the view a header sits above, the portal a dialog centers in, the viewport a container query measures. The Stage belongs to the page, so its measures are the page's rather than Kirby's.
_Avoid_: Frame, canvas, wrapper, viewport

**Crop**:
A Stage the page gives less room than the Mock renders into, showing the top of it and hiding the rest. The Mock is not shortened – the Panel it depicts has no short view – so what a Crop hides is live, and a cropped Stage is one the page shows rather than offers.
_Avoid_: Clip, cutoff, truncation, fold

**Exhibition**:
The one fictional site the Mocks on the home and landing pages depict: a photography exhibition, edited in a Panel that has several of the Plugins installed. A Product is in the Exhibition when its Plugin is, and only then does it have a Scene. Membership is a fact about the fiction, not a place on the site.
_Avoid_: Demo site, sample content, fixture

**Scene**:
The Mock of the Exhibition's page, one for each Product in the Exhibition. The page is the same in every Scene; the Products differ in what their Plugin adds to it – a section, a view button, a dialog over the view. A Plugin that opens no dialog leaves its Scene with none, and the page it renders is undimmed, because the dim belongs to a dialog. A Scene is what a SocialCard renders and what the Showcase offers.
_Avoid_: Demo, variant

**Showcase**:
The tabbed arrangement on the home page, showing one Scene at a time. It carries a curated few, not every Scene, so a Product joining the Exhibition does not join the Showcase with it.
_Avoid_: Carousel, gallery, switcher

**Tagline**:
The one-line pitch of a Product. It is one sentence, short enough to stand on a single line of the SocialCard, and says what the Plugin does; it does not repeat the Product's name. The short menu line next to a Product's name is its description, not its Tagline.
_Avoid_: Subtitle, subline, claim, slogan

**FeatureCard**:
One of the cards a Product's landing page lays out in a grid: a Mock above a title and a paragraph, the whole card a link into the documentation. The plainer icon-and-sentence grid a landing page may carry instead is not a FeatureCard. The title may claim or joke; the paragraph says what the editor or developer does, what happens, and where it stops, and it is the longest place on the site where a single feature is described in prose.
_Avoid_: Feature box, tile, USP

**FeatureList**:
The three lines under a Product on the home page, each a name and one sentence. It is the FeatureCard's shorter sibling with the same register: the name may claim, the sentence states behavior. A FeatureList names the Product's three strongest features, not everything it does.
_Avoid_: Feature bullets, highlights, key features

**SocialCard**:
A PNG rendered from the site's own components, with the Product's Scene as its Mock, for sharing off-site. Only a Product in the Exhibition has one, in two formats: the Open Graph format, linked from the landing page's meta tags, and the 4:3 format, posted by hand. Every other page shares the site's generated share image, which is not a SocialCard.
_Avoid_: OG image, social image, header image
