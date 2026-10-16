import type { InjectionKey, Ref } from "vue";

export const panelFieldTypeKey: InjectionKey<Ref<PanelFieldType | undefined>> =
  Symbol("kirby-panel.field-type");

export const panelFieldIdKey: InjectionKey<string> = Symbol(
  "kirby-panel.field-id",
);

/** A host's claim that its Mock is there to be read, not used. */
export const panelMockInertKey: InjectionKey<boolean> = Symbol(
  "kirby-panel.mock-inert",
);

/** A host's claim that it draws the Mock's edge and names it, so the Mock drops its frame and chrome bar and fills the host. */
export const panelMockFramedKey: InjectionKey<boolean> = Symbol(
  "kirby-panel.mock-framed",
);
