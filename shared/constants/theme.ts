import {
  hasThemeColor,
  PRODUCT_THEME_COLORS,
  resolveProductId,
} from "./products";

interface ThemeColorShade {
  /** Lightness as the percentage `main.css` writes, chroma and hue bare. */
  l: number;
  c: number;
  h: number;
  /** The same shade as a hex, for the favicon and the SocialCard, which render outside a stylesheet. */
  hex: string;
}

/** The 500 shade of every ramp `app/assets/css/main.css` declares. */
export const THEME_COLORS = {
  pumpkin: { l: 71.8, c: 0.189, h: 48.7, hex: "#fe7712" },
  orchid: { l: 67.5, c: 0.247, h: 318.6, hex: "#d353f5" },
  danube: { l: 66.3, c: 0.167, h: 250.8, hex: "#3196f5" },
  lima: { l: 75.4, c: 0.197, h: 134.6, hex: "#75c932" },
} satisfies Record<string, ThemeColorShade>;

export type ThemeColor = keyof typeof THEME_COLORS;

export const DEFAULT_THEME_COLOR: ThemeColor = "pumpkin";

/** Resolves the color a path is themed in: the product's own, or the site's off product routes. */
export function resolveThemeColor(path: string): ThemeColor {
  const productId = resolveProductId(path);

  return productId && hasThemeColor(productId)
    ? PRODUCT_THEME_COLORS[productId]
    : DEFAULT_THEME_COLOR;
}
