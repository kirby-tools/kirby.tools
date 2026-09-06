import type { InjectionKey, Ref } from "vue";

export const panelFieldTypeKey: InjectionKey<Ref<PanelFieldType | undefined>> =
  Symbol("kirby-panel.field-type");

/** A page's claim that its Mock is there to be read, not used. */
export const panelMockInertKey: InjectionKey<boolean> = Symbol(
  "kirby-panel.mock-inert",
);
