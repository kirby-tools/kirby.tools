interface ProductItem {
  label: string;
  to: string;
  icon: string;
  description: string;
  hasPlayground: boolean;
}

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    label: "Content Translator",
    to: "/content-translator",
    icon: "i-ri-translate",
    description: "Content translation in the Panel or server-side",
    hasPlayground: false,
  },
  {
    label: "Live Preview",
    to: "/live-preview",
    icon: "i-ri-picture-in-picture-line",
    description: "Real-time page preview",
    hasPlayground: true,
  },
  {
    label: "Copilot",
    to: "/copilot",
    icon: "i-ri-sparkling-fill",
    description: "AI-powered content generation",
    hasPlayground: true,
  },
  {
    label: "SEO Audit",
    to: "/seo-audit",
    icon: "i-ri-seo-fill",
    description: "State-of-the-art SEO analysis",
    hasPlayground: true,
  },
];
