import type { Panel } from "kirby-types";
import type { App } from "vue";
import { extensions } from "./extensions";
import { translate } from "./translate";

/**
 * What Kirby's and the plugins' components read off the Panel while
 * rendering, with inert overlays for the clicks no Mock stages.
 */
const PANEL = {
  urls: { icons: "/_kirby/icons.svg" },
  plugins: extensions,
  direction: "ltr",
  dialog: { isLoading: false, open() {}, close() {} },
  drawer: { open() {}, close() {} },
  api: {
    post: () => Promise.reject(new Error("The docs have no Panel backend.")),
  },
  notification: { error() {} },
  t: translate,
  view: { title: "" },
  content: { version: () => ({}) },
};

/** Builds a Panel with the Vue app whose `$helper` the `useHelpers()` composable reads. */
export function createPanel(app: App, overrides: Partial<typeof PANEL> = {}) {
  return { ...PANEL, ...overrides, app } as unknown as Panel;
}
