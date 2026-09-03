export type ThemeColor = "pumpkin" | "orchid" | "danube" | "lima";

export const THEME_COLOR_PALETTE: Record<ThemeColor, string> = {
  pumpkin: "#fe7712",
  orchid: "#c66bdf",
  danube: "#6697cb",
  lima: "#75c932",
};

export const DEFAULT_THEME_COLOR: ThemeColor = "pumpkin";

export function isThemeColor(value: string | undefined): value is ThemeColor {
  return !!value && value in THEME_COLOR_PALETTE;
}
