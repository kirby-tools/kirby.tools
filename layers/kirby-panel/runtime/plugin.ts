import { defineNuxtPlugin } from "#app";
import array from "#kirby-panel/helpers/array";
import color from "#kirby-panel/helpers/color";
import field from "#kirby-panel/helpers/field";
import isComponent from "#kirby-panel/helpers/isComponent";
import object from "#kirby-panel/helpers/object";
import ratio from "#kirby-panel/helpers/ratio";
import string, { escapeHTML } from "#kirby-panel/helpers/string";
import { HtmlString } from "#kirby-panel/panel/html";
import { components } from "./components";
import { extensions } from "./extensions";
import { translate } from "./translate";

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
    field,
    object,
    ratio,
    string,
    // Kirby's own implementation, which otherwise reaches for the app through
    // `window.panel` – undefined on a server.
    isComponent: (name: string) => isComponent(name, nuxtApp.vueApp),
  };
  config.globalProperties.$t = translate;

  // Kirby's `v-safe-html` writes on `mounted` only, so the server-rendered
  // HTML would carry nothing until hydration.
  const toHtml = (value: unknown) =>
    value instanceof HtmlString
      ? String(value)
      : value == null
        ? ""
        : escapeHTML(value);

  nuxtApp.vueApp.directive("safe-html", {
    getSSRProps: ({ value }) => ({ innerHTML: toHtml(value) }),
    mounted: (el: HTMLElement, { value }) => {
      el.innerHTML = toHtml(value);
    },
    updated: (el: HTMLElement, { value, oldValue }) => {
      if (value !== oldValue) el.innerHTML = toHtml(value);
    },
  });

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
