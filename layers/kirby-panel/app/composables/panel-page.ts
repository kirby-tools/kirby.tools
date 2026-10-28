import type { MaybeRefOrGetter } from "vue";
import { providePanel } from "kirbyuse";
import { asPanel, PANEL } from "#panel-mock/panel";

export function providePanelPage(page: {
  title: MaybeRefOrGetter<string>;
  content: MaybeRefOrGetter<object>;
}) {
  providePanel(
    asPanel({
      ...PANEL,
      view: {
        get title() {
          return toValue(page.title);
        },
      },
      content: { version: () => toValue(page.content) },
    }),
  );
}
