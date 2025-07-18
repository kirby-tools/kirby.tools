interface ProductItem {
  label: string;
  to: string;
  docsTo: string;
  icon: string;
  description: string;
  playground?: string;
  paid?: boolean;
}

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    label: "Content Translator",
    to: "/content-translator",
    docsTo: "/docs/content-translator/getting-started",
    icon: "i-ri-translate",
    description: "Content translation in the Panel or via CLI",
    paid: true,
  },
  {
    label: "Copilot",
    to: "/copilot",
    docsTo: "/docs/copilot/getting-started",
    icon: "i-ri-sparkling-line",
    description: "AI-powered content generation",
    playground: "https://try.kirbycopilot.com",
    paid: true,
  },
  {
    label: "Live Preview",
    to: "/live-preview",
    docsTo: "/docs/live-preview",
    icon: "i-ri-picture-in-picture-line",
    description: "Real-time page preview",
    playground: "https://play.kirby.tools",
    paid: true,
  },
  {
    label: "SEO Audit",
    to: "/seo-audit",
    docsTo: "/docs/seo-audit/get-started",
    icon: "i-ri-seo-line",
    description: "State-of-the-art SEO analysis",
    playground: "https://try.kirbyseo.com",
    paid: true,
  },
  {
    label: "Minimap",
    to: "/minimap",
    docsTo: "/docs/minimap",
    icon: "i-ri-timeline-view",
    description: "Sidebar content navigation",
  },
];
