export type ProductId = keyof typeof PRODUCT_REGISTRY;
export type ProductLicense = "commercial" | "free";
/** Registered brand color slot (see `app.config.ts` → `ui.colors`). */
export type ProductColorSlot = "copilot" | "seo";

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
  colorSlot?: ProductColorSlot;
  playground?: string;
  /** Surfaced to agents via `llms.txt`. */
  keywords: readonly string[];
  /** The case this product does not cover. */
  notFor: string;
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
    colorSlot: "copilot",
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
    keywords: [
      "kirby translation",
      "kirby multilanguage",
      "kirby deepl",
      "kirby translate panel",
      "kirby cli translation",
    ],
    notFor:
      "Generating new content from a prompt – use Kirby Copilot for that.",
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
    colorSlot: "seo",
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
  },
} satisfies Record<string, Product>;

export const PRODUCTS: Record<ProductId, Product> = PRODUCT_REGISTRY;

export const PRODUCT_LIST: (Product & { id: ProductId })[] = Object.entries(
  PRODUCTS,
).map(([id, product]) => ({ id: id as ProductId, ...product }));

export function isProductId(value: string | undefined): value is ProductId {
  return !!value && value in PRODUCTS;
}

/** Resolves the product a path belongs to, or `undefined` off a product route. */
export function resolveProductId(path: string): ProductId | undefined {
  const segments = path.split("/").filter(Boolean);
  // Documentation pages carry the id one segment deeper than landing pages.
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
