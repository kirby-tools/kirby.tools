export type ThemeColor = "danube" | "lima" | "orchid";
export type ProductColorSlot = "copilot" | "seo";

// Product route slug → registered brand color slot (see `app.config.ts` → `ui.colors`)
export const PRODUCT_COLOR_SLOT: Record<string, ProductColorSlot> = {
  copilot: "copilot",
  "seo-audit": "seo",
};

export const THEME_COLOR_PALETTE: Record<ThemeColor, string> = {
  danube: "#6697cb",
  lima: "#75c932",
  orchid: "#c66bdf",
};
