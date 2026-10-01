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
A live rendering of a Panel surface, assembled from Kirby's own Panel components, that stands on a page of the site where a screenshot or screencast would otherwise go. A Mock is staged, not replicated: it must not misrepresent the Plugin it depicts. Depending on where it stands, a Mock is interactive, looping, or still.
_Avoid_: Screenshot, demo, replica, figure

**Interactive Mock**:
A Mock that lets the reader do what Kirby lets an editor do – type, unfold, close, switch language – and plays the Plugin's answer where the Plugin answers the editor; nothing else answers, nothing is kept, and while its dialog is open, only the dialog answers.

**Looping Mock**:
A Mock that plays its Plugin's answer on its own, over and over, for an answer whose trigger a reader would not find, such as the moment an editor stops typing. The reader can pause it, except inside a FeatureCard, where a click follows the card's link; nothing else reaches it.
_Avoid_: Animated

**Still Mock**:
A Mock that answers nothing at all. An Interactive Mock is still inside a FeatureCard, and a SocialCard's Scene is still.
_Avoid_: Static

**Stage**:
The frame a Mock renders into, standing in for whatever the Panel supplies around a component – the view a header sits above, the portal a dialog centers in, the viewport a container query measures. The Stage belongs to the page, so its measures are the page's rather than Kirby's.
_Avoid_: Frame, canvas, wrapper, viewport

**Crop**:
A Stage the page gives less room than the Mock renders into, showing the top of it and hiding the rest. The Mock is not shortened – the Panel it depicts has no short view – so what a Crop hides is live.
_Avoid_: Clip, cutoff, truncation, fold

**Exhibition**:
The one fictional site every Scene depicts and other Mocks may borrow from: an art venue's site, edited in a Panel with several of the Plugins installed. Every Scene shows the same page of it: its page for a photography exhibition. A Product is in the Exhibition when its Plugin is, and only then does it have a Scene. Membership is a fact about the fiction, not a place on the site.
_Avoid_: Demo site, sample content, fixture

**Scene**:
The Interactive Mock of the Exhibition's page, one for each Product in the Exhibition; the page is the same in every Scene, except that Copilot's, unless still, shows the page before its text and description are written, and the Products differ in what their Plugin adds to it – a section, a sidebar, a view button, a dialog over the view. A Scene shows its Plugin's dialog open, if it has one, unless it can play its way there: in the Showcase and on a landing page, a Scene the reader scrolls to may play its way to its Plugin's answer once on its own, until the reader acts.
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
