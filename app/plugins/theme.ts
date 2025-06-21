import type { RouteLocationNormalized } from "vue-router";

type ThemeColor = "danube" | "lima" | "orchid";

const PRODUCT_THEME_COLOR_MAP: Record<string, ThemeColor> = {
  "seo-audit": "lima",
  copilot: "orchid",
};

export default defineNuxtPlugin({
  enforce: "post",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const appConfig = useAppConfig();

    function updateThemeColor(to: RouteLocationNormalized) {
      let primaryColor: ThemeColor = "danube";

      for (const [path, color] of Object.entries(PRODUCT_THEME_COLOR_MAP)) {
        if (to.path.includes(`/${path}`)) {
          primaryColor = color;
          break;
        }
      }

      appConfig.ui.colors.primary = primaryColor;
    }

    updateThemeColor(route);
    router.afterEach(updateThemeColor);
  },
});
