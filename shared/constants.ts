interface ProductItem {
  label: string;
  to: string;
  docsTo: string;
  icon: string;
  description: string;
  playground?: string;
  isPaid?: boolean;
  isHidden?: boolean;
}

/// keep-sorted
export const GITHUB_REPOS: Record<string, string> = {
  "content-translator": "kirby-tools/kirby-content-translator",
  "live-preview": "kirby-tools/kirby-live-preview",
  "seo-audit": "kirby-tools/kirby-seo-audit",
  copilot: "kirby-tools/kirby-copilot",
  headless: "johannschopplich/kirby-headless",
  minimap: "johannschopplich/kirby-minimap",
};

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    label: "Copilot",
    to: "/copilot",
    docsTo: "/docs/copilot/getting-started",
    icon: "i-ri-sparkling-line",
    description: "AI-powered content generation",
    playground: "https://try.kirbycopilot.com",
    isPaid: true,
  },
  {
    label: "Content Translator",
    to: "/content-translator",
    docsTo: "/docs/content-translator/getting-started",
    icon: "i-ri-translate",
    description: "Content translation in the Panel or via CLI",
    isPaid: true,
  },
  {
    label: "SEO Audit",
    to: "/seo-audit",
    docsTo: "/docs/seo-audit/getting-started",
    icon: "i-ri-seo-line",
    description: "State-of-the-art SEO analysis",
    playground: "https://try.kirbyseo.com",
    isPaid: true,
  },
  {
    label: "Live Preview",
    to: "/live-preview",
    docsTo: "/docs/live-preview",
    icon: "i-ri-picture-in-picture-line",
    description: "Real-time page preview",
    playground: "https://play.kirby.tools",
    isPaid: true,
    isHidden: true,
  },
  {
    label: "Minimap",
    to: "/minimap",
    docsTo: "/docs/minimap",
    icon: "i-ri-timeline-view",
    description: "Sidebar content navigation",
  },
];
