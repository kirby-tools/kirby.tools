import type { RouteLocationNormalized } from "vue-router";
import type { ThemeColor } from "#shared/constants";
import { resolveThemeColor, THEME_COLOR_PALETTE } from "#shared/constants";
import faviconSvgRaw from "~/assets/icons/favicon.svg?raw";

export function useDynamicTheme() {
  const appConfig = useAppConfig();

  function updateThemeColor(to: RouteLocationNormalized) {
    const themeColor = resolveThemeColor(to.path);

    appConfig.ui.colors.primary = themeColor;
    updateFavicon(themeColor);
  }

  return { updateThemeColor };
}

function updateFavicon(themeColor: ThemeColor) {
  if (import.meta.client) {
    const faviconDataUri = createFaviconDataUri(themeColor);

    const iconElement = document.head.querySelector<HTMLLinkElement>(
      'link[type="image/svg+xml"]',
    );

    if (!iconElement) {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = faviconDataUri;
      link.sizes = "any";
      link.type = "image/svg+xml";
      document.head.appendChild(link);
      return;
    }

    iconElement.href = faviconDataUri;
  }
}

export function createFaviconDataUri(themeColor: ThemeColor) {
  const hexColor = THEME_COLOR_PALETTE[themeColor];
  const svg = faviconSvgRaw.replace(
    'fill="currentColor"',
    `fill="${hexColor}"`,
  );

  return encodeSvgToDataUri(svg);
}

function encodeSvgToDataUri(svg: string): string {
  const encodedSvg = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encodedSvg}`;
}
