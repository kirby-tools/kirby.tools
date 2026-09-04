import type { ThemeColor } from "#shared/constants";
import { THEME_COLORS } from "#shared/constants";
import faviconSvgRaw from "~/assets/icons/favicon.svg?raw";

/** Builds the SVG favicon as a data URI, filled in the given theme color. */
export function createFaviconDataUri(themeColor: ThemeColor): string {
  const svg = faviconSvgRaw.replace(
    'fill="currentColor"',
    `fill="${THEME_COLORS[themeColor].hex}"`,
  );
  const encodedSvg = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml,${encodedSvg}`;
}
