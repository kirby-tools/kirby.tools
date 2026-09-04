import type { ThemeColor } from "./theme";

export type ProductId = keyof typeof PRODUCT_REGISTRY;
export type ProductLicense = "commercial" | "free";
export interface Product {
  /** Canonical name, always carrying the CMS prefix: "Kirby Copilot". */
  name: string;
  /** Short form for navigation, where repeating "Kirby" adds nothing. */
  label: string;
  description: string;
  icon: string;
  license: ProductLicense;
  /**
   * Option namespace the plugin reads from Kirby's `config.php`. Products
   * configured through blueprints alone leave this unset.
   */
  configKey?: string;
  githubRepo: string;
  composerPackage: string;
  /**
   * Entry page below `/docs/<id>`. Products whose documentation is a single
   * page leave this unset.
   */
  docsEntry?: string;
  /**
   * Whether release notes are published under `/<id>/changelog`. Products
   * without one leave releases to their GitHub repository.
   */
  hasChangelog?: boolean;
  /**
   * Theme color the product is drawn in. Products without one are themed in
   * the site's color.
   */
  color?: ThemeColor;
  playground?: string;
  /** Retrieval terms, surfaced to agents through `llms.txt`. */
  keywords: readonly string[];
  /** The case this product does not cover. */
  notFor: string;
  /**
   * The pointer an agent reads before deciding to load the skill. It states
   * what the plugin does and names the branches that should trigger a load, so
   * it carries no sentence the skill body repeats.
   */
  skillDescription: string;
}

// Insertion order is the display order in navigation menus and the footer.
const PRODUCT_REGISTRY = {
  copilot: {
    name: "Kirby Copilot",
    label: "Copilot",
    description: "AI-powered content generation",
    icon: "i-ri-sparkling-line",
    license: "commercial",
    configKey: "johannschopplich.copilot",
    githubRepo: "kirby-tools/kirby-copilot",
    composerPackage: "johannschopplich/kirby-copilot",
    docsEntry: "getting-started",
    hasChangelog: true,
    color: "orchid",
    playground: "https://try.kirbycopilot.com",
    keywords: [
      "kirby ai",
      "kirby content generation",
      "kirby panel ai",
      "kirby writer field ai",
      "kirby blocks generation",
    ],
    notFor:
      "Translating existing content between languages – use Kirby Content Translator for that.",
    skillDescription:
      "Configure Kirby Copilot, the AI content generation plugin for the Kirby Panel. Use when wiring up an AI provider, adding generation to a blueprint, generating blocks or layouts, or driving generation from PHP.",
  },
  "content-translator": {
    name: "Kirby Content Translator",
    label: "Content Translator",
    description: "Content translation in the Panel or via CLI",
    icon: "i-ri-translate",
    license: "commercial",
    configKey: "johannschopplich.content-translator",
    githubRepo: "kirby-tools/kirby-content-translator",
    composerPackage: "johannschopplich/kirby-content-translator",
    docsEntry: "getting-started",
    hasChangelog: true,
    color: "danube",
    keywords: [
      "kirby translation",
      "kirby multilanguage",
      "kirby deepl",
      "kirby translate panel",
      "kirby cli translation",
    ],
    notFor:
      "Generating new content from a prompt – use Kirby Copilot for that.",
    skillDescription:
      "Configure Kirby Content Translator, which translates Panel content between Kirby's languages. Use when choosing a translation strategy, restricting which fields translate, translating KirbyTags, or scripting bulk translation from the CLI.",
  },
  "seo-audit": {
    name: "Kirby SEO Audit",
    label: "SEO Audit",
    description: "State-of-the-art SEO analysis",
    icon: "i-ri-seo-line",
    license: "commercial",
    configKey: "johannschopplich.seo-audit",
    githubRepo: "kirby-tools/kirby-seo-audit",
    composerPackage: "johannschopplich/kirby-seo-audit",
    docsEntry: "getting-started",
    hasChangelog: true,
    color: "lima",
    playground: "https://try.kirbyseo.com",
    keywords: [
      "kirby seo",
      "kirby meta tags",
      "kirby seo analysis",
      "kirby readability",
      "kirby panel seo",
    ],
    notFor:
      "Rendering meta tags in the frontend – it audits the output, it does not produce it.",
    skillDescription:
      "Configure Kirby SEO Audit, which scores a rendered page against a keyphrase inside the Panel. Use when adding the audit to a blueprint, wiring keyphrase and synonym fields, scoping the analyzed markup, or auditing a decoupled frontend.",
  },
  "live-preview": {
    name: "Kirby Live Preview",
    label: "Live Preview",
    description: "Real-time page preview",
    icon: "i-ri-picture-in-picture-line",
    license: "commercial",
    githubRepo: "kirby-tools/kirby-live-preview",
    composerPackage: "johannschopplich/kirby-live-preview",
    hasChangelog: true,
    playground: "https://play.kirby.tools",
    keywords: [
      "kirby live preview",
      "kirby panel preview",
      "kirby instant preview",
      "kirby preview iframe",
    ],
    notFor:
      "Previewing a decoupled frontend that renders outside Kirby – it previews Kirby-rendered pages.",
    skillDescription:
      "Configure Kirby Live Preview, which renders a page beside its Panel form. Use when adding the preview section to a blueprint, tuning when it refreshes, or fixing a preview that stays blank.",
  },
  minimap: {
    name: "Kirby Minimap",
    label: "Minimap",
    description: "Sidebar content navigation",
    icon: "i-ri-timeline-view",
    license: "free",
    githubRepo: "johannschopplich/kirby-minimap",
    composerPackage: "johannschopplich/kirby-minimap",
    keywords: [
      "kirby panel navigation",
      "kirby sidebar",
      "kirby content overview",
      "kirby minimap",
    ],
    notFor: "Frontend navigation – it is a Panel-only aid.",
    skillDescription:
      "Configure Kirby Minimap, a zero-config sidebar that outlines the fields and blocks of the current Panel view. Use when a field fails to appear in the outline or the plugin needs installing.",
  },
  headless: {
    name: "Kirby Headless",
    label: "Headless",
    description: "API-first CMS toolkit",
    icon: "i-ri-code-block",
    license: "free",
    // Predates the vendor-prefixed convention the commercial plugins follow.
    configKey: "headless",
    githubRepo: "johannschopplich/kirby-headless",
    composerPackage: "johannschopplich/kirby-headless",
    docsEntry: "getting-started",
    keywords: [
      "kirby headless",
      "kirby api",
      "kirby kql",
      "kirby json",
      "kirby decoupled frontend",
    ],
    notFor:
      "Building the frontend itself – it exposes the content, you bring the client.",
    skillDescription:
      "Configure Kirby Headless, which turns Kirby into a JSON API for a decoupled frontend. Use when securing the API with a bearer token, setting up CORS, querying through KQL, or serving pages as JSON templates.",
  },
} satisfies Record<string, Product>;

export const PRODUCTS: Record<ProductId, Product> = PRODUCT_REGISTRY;

export const PRODUCT_LIST: (Product & { id: ProductId })[] = Object.entries(
  PRODUCTS,
).map(([id, product]) => ({ id: id as ProductId, ...product }));

export function isProductId(value: string | undefined): value is ProductId {
  return !!value && value in PRODUCTS;
}

export type ProductIdWithThemeColor = {
  [Id in ProductId]: (typeof PRODUCT_REGISTRY)[Id] extends { color: ThemeColor }
    ? Id
    : never;
}[ProductId];

export const PRODUCT_THEME_COLORS = Object.fromEntries(
  PRODUCT_LIST.filter((product) => product.color).map(({ id, color }) => [
    id,
    color,
  ]),
) as Record<ProductIdWithThemeColor, ThemeColor>;

export function hasThemeColor(
  productId: ProductId,
): productId is ProductIdWithThemeColor {
  return productId in PRODUCT_THEME_COLORS;
}

/** Resolves the product a path belongs to, or `undefined` off a product route. */
export function resolveProductId(path: string): ProductId | undefined {
  const segments = path.split("/").filter(Boolean);
  const candidateId = segments[0] === "docs" ? segments[1] : segments[0];
  return isProductId(candidateId) ? candidateId : undefined;
}

export function productPath(id: ProductId): string {
  return `/${id}`;
}

export function productSkillName(id: ProductId): string {
  return `kirby-${id}`;
}

export function productDocsPath(id: ProductId): string {
  const { docsEntry } = PRODUCTS[id];
  return docsEntry ? `/docs/${id}/${docsEntry}` : `/docs/${id}`;
}

export function productChangelogPath(id: ProductId): string {
  return `/${id}/changelog`;
}

/** `LIKE` pattern matching every release page of a product. */
export function productVersionsPattern(id: ProductId): string {
  return `${productChangelogPath(id)}/%`;
}
