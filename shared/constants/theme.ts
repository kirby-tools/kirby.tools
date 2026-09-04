import { PRODUCTS, resolveProductId } from "./products";

export type ThemeColor = "pumpkin" | "orchid" | "danube" | "lima";

export const THEME_COLOR_PALETTE: Record<ThemeColor, string> = {
  pumpkin: "#fe7712",
  orchid: "#c66bdf",
  danube: "#6697cb",
  lima: "#75c932",
};

export const DEFAULT_THEME_COLOR: ThemeColor = "pumpkin";

/** Resolves the color a path is themed in: the product's own, or the site's off product routes. */
export function resolveThemeColor(path: string): ThemeColor {
  const productId = resolveProductId(path);
  return (productId && PRODUCTS[productId].color) || DEFAULT_THEME_COLOR;
}
