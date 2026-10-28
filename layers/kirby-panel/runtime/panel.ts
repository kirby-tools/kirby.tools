import type { Panel } from "kirby-types";
import { extensions } from "./extensions";
import { translate } from "./translate";

/**
 * What Kirby's and the plugins' components read off the Panel while
 * rendering, with inert overlays for the clicks no Mock stages.
 */
export const PANEL = {
  urls: { icons: "/_kirby/icons.svg" },
  plugins: extensions,
  direction: "ltr",
  dialog: { isLoading: false, open() {}, close() {} },
  drawer: { open() {}, close() {} },
  t: translate,
  view: { title: "" },
  content: { version: () => ({}) },
};

export function asPanel(panel: typeof PANEL) {
  return panel as unknown as Panel;
}
