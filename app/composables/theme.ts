import type { RouteLocationNormalized } from "vue-router";
import type { ThemeColor } from "#shared/constants";
import {
  PRODUCT_THEME_COLOR_MAP,
  THEME_COLOR_PALETTE,
} from "#shared/constants";
import faviconSvgRaw from "~/assets/icons/favicon.svg?raw";

export type { ThemeColor };
export { THEME_COLOR_PALETTE };

export function useDynamicTheme() {
  const appConfig = useAppConfig();
  const currentThemeColor = useState<ThemeColor>(
    "app.theme.color",
    () => "danube",
  );

  function getThemeColorFromPath(path: string): ThemeColor {
    const segments = path.split("/").filter(Boolean);
    const productSlug = segments[0] === "docs" ? segments[1] : segments[0];
    return PRODUCT_THEME_COLOR_MAP[productSlug ?? ""] ?? "danube";
  }

  function updateThemeColor(to: RouteLocationNormalized) {
    const primaryColor = getThemeColorFromPath(to.path);

    currentThemeColor.value = primaryColor;
    appConfig.ui.colors.primary = primaryColor;
    updateFavicon(primaryColor);
  }

  return {
    getThemeColorFromPath,
    updateThemeColor,
    createFaviconDataUri,
  };
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

function createFaviconDataUri(themeColor: ThemeColor) {
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
