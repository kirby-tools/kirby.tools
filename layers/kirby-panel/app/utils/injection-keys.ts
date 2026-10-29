import type { InjectionKey, Ref } from "vue";

/** The field a `PanelInput` sits in, which reads back the value for its counter. */
export const panelFieldKey: InjectionKey<{
  id: string;
  type: Ref<PanelFieldType>;
  value: Ref<string | undefined>;
}> = Symbol("kirby-panel.field");

/** A host's claim that its Mock is there to be read, not used. */
export const panelMockInertKey: InjectionKey<boolean> = Symbol(
  "kirby-panel.mock-inert",
);

/** A host's claim that it draws the Mock's edge and names it, so the Mock drops its frame and chrome bar and fills the host. */
export const panelMockFramedKey: InjectionKey<boolean> = Symbol(
  "kirby-panel.mock-framed",
);

/** A host's claim that a picklist dropdown inside it starts open, so its Mock shows the list without a click. */
export const panelPicklistDropdownOpenKey: InjectionKey<boolean> = Symbol(
  "kirby-panel.picklist-dropdown-open",
);
