import { defineNuxtPlugin } from "#app";
import safeHtml from "#kirby-panel/config/safeHtml";
import array from "#kirby-panel/helpers/array";
import color from "#kirby-panel/helpers/color";
import isComponent from "#kirby-panel/helpers/isComponent";
import object from "#kirby-panel/helpers/object";
import ratio from "#kirby-panel/helpers/ratio";
import string from "#kirby-panel/helpers/string";
import translationsJson from "../kirby/i18n/translations/en.json";
import { components } from "./components";
import { extensions } from "./extensions";

const translations: Record<string, string> = translationsJson;

/** What Kirby's components read off `$panel` while rendering. */
const PANEL = {
  urls: { icons: "/_kirby/icons.svg" },
  plugins: extensions,
  direction: "ltr",
  language: { direction: "ltr" },
};

export default defineNuxtPlugin((nuxtApp) => {
  const { config } = nuxtApp.vueApp;

  config.globalProperties.$panel = PANEL;
  config.globalProperties.$helper = {
    array,
    color,
    object,
    ratio,
    string,
    // Kirby's own implementation, which otherwise reaches for the app through
    // `window.panel` – undefined on a server.
    isComponent: (name: string) => isComponent(name, nuxtApp.vueApp),
  };
  config.globalProperties.$t = translate;
  nuxtApp.vueApp.use(safeHtml);

  // Kirby's own `v-direction` reads `window.panel` and brings no SSR props.
  nuxtApp.vueApp.directive("direction", {
    getSSRProps: () => ({ dir: PANEL.direction }),
    beforeMount: (el: HTMLElement) => {
      el.dir = PANEL.direction;
    },
  });

  for (const [name, component] of Object.entries(components)) {
    nuxtApp.vueApp.component(name, component);
  }
});

/**
 * Resolves a Panel translation key through Kirby's own `template()`, so
 * placeholders like `{ min }` behave as they do in the Panel.
 */
function translate(
  key: string,
  data?: Record<string, string>,
  fallback?: string,
) {
  if (typeof data === "string") {
    fallback = data;
    data = undefined;
  }

  return string.template(translations[key] ?? fallback ?? key, data);
}
