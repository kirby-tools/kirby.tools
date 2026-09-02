import type { InjectionKey, Ref } from "vue";

export const panelFieldTypeKey: InjectionKey<Ref<PanelFieldType | undefined>> =
  Symbol("kirby-panel.field-type");
