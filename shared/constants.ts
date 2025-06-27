interface ProductItem {
  label: string;
  to: string;
  icon: string;
  description: string;
  playground?: string;
  paid?: boolean;
}

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    label: "Content Translator",
    to: "/content-translator",
    icon: "i-ri-translate",
    description: "Content translation in the Panel or via CLI",
    paid: true,
  },
  {
    label: "Live Preview",
    to: "/live-preview",
    icon: "i-ri-picture-in-picture-line",
    description: "Real-time page preview",
    playground: "https://play.kirby.tools",
    paid: true,
  },
  {
    label: "Copilot",
    to: "/copilot",
    icon: "i-ri-sparkling-line",
    description: "AI-powered content generation",
    playground: "https://try.kirbycopilot.com",
    paid: true,
  },
  {
    label: "SEO Audit",
    to: "/seo-audit",
    icon: "i-ri-seo-line",
    description: "State-of-the-art SEO analysis",
    playground: "https://try.kirbyseo.com",
    paid: true,
  },
  {
    label: "Minimap",
    to: "/minimap",
    icon: "i-ri-timeline-view",
    description: "Sidebar content navigation",
  },
];
