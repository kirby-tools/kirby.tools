import type { InjectionKey, Ref } from "vue";

export type PanelFieldType = "textarea" | "writer";

export const panelFieldTypeKey: InjectionKey<Ref<PanelFieldType | undefined>> =
  Symbol("kirby-panel.field-type");
