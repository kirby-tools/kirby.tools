export type ThemeColor = "danube" | "lima" | "orchid";

export const PRODUCT_THEME_COLOR_MAP: Record<string, ThemeColor> = {
  "seo-audit": "lima",
  copilot: "orchid",
};

export const THEME_COLOR_PALETTE: Record<ThemeColor, string> = {
  danube: "#6697cb",
  lima: "#75c932",
  orchid: "#c66bdf",
};
