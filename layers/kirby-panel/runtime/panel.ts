import type { Panel } from "kirby-types";
import { extensions } from "./extensions";
import { translate } from "./translate";

/**
 * What Kirby's components read off `$panel` while rendering and the plugins'
 * views read through `usePanel()`, with inert overlays for the clicks no Mock
 * stages.
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

/** The cast holds while no plugin's render path calls a member `PANEL` lacks. */
export function asPanel(panel: typeof PANEL) {
  return panel as unknown as Panel;
}
