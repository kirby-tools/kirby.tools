import type { MaybeRefOrGetter } from "vue";
import { providePanel } from "kirbyuse";
import { createPanel } from "#panel-mock/panel";

export function providePanelPage(page: {
  title: MaybeRefOrGetter<string>;
  content: MaybeRefOrGetter<object>;
}) {
  providePanel(
    createPanel(useNuxtApp().vueApp, {
      view: {
        get title() {
          return toValue(page.title);
        },
      },
      content: { version: () => toValue(page.content) },
    }),
  );
}
