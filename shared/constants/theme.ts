export type ThemeColor = "danube" | "lima" | "orchid";

export const THEME_COLOR_PALETTE: Record<ThemeColor, string> = {
  danube: "#6697cb",
  lima: "#75c932",
  orchid: "#c66bdf",
};

export const DEFAULT_THEME_COLOR: ThemeColor = "danube";

export function isThemeColor(value: string | undefined): value is ThemeColor {
  return !!value && value in THEME_COLOR_PALETTE;
}
