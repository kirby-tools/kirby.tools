import {
  hasThemeColor,
  PRODUCT_THEME_COLORS,
  resolveProductId,
} from "./products";

export type ThemeColor = "pumpkin" | "orchid" | "danube" | "lima";

/** Hex of each 500 shade in `main.css`, for the favicon and the OG image, which cannot read CSS variables. */
export const THEME_COLOR_PALETTE: Record<ThemeColor, string> = {
  pumpkin: "#fe7712",
  orchid: "#d353f5",
  danube: "#3196f5",
  lima: "#75c932",
};

export const DEFAULT_THEME_COLOR: ThemeColor = "pumpkin";

/** Resolves the color a path is themed in: the product's own, or the site's off product routes. */
export function resolveThemeColor(path: string): ThemeColor {
  const productId = resolveProductId(path);

  return productId && hasThemeColor(productId)
    ? PRODUCT_THEME_COLORS[productId]
    : DEFAULT_THEME_COLOR;
}
