/** One entry in a dropdown, or the string Kirby reads as a separator. */
export type PanelDropdownOption =
  | {
      text?: string;
      info?: string;
      icon?: string;
    }
  | "-";

export interface PanelPicklistOption {
  value: string;
  text: string;
}

/** The props of one view button, as a blueprint's `buttons` map defines them. */
export interface PanelViewButtonProps {
  text?: string;
  icon?: string;
  theme?: string;
  responsive?: boolean;
  /** Kirby's caret, on a button whose dropdown the mock leaves closed. */
  dropdown?: boolean;
  /** The options of the one dropdown a mock shows open under the button. */
  options?: PanelDropdownOption[];
  /**
   * Kirby's view buttons force `end`; a plugin that ships its own button gets
   * `k-dropdown`'s `start`.
   */
  alignX?: "start" | "end";
}

/** A view button, or the name of one Kirby ships such as `"-"`. */
export type PanelViewButton = PanelViewButtonProps | string;

export type PanelFieldType = "text" | "textarea" | "writer";

export interface PanelBlock {
  type: "heading" | "text" | "quote";
  text: string;
  level?: string;
  citation?: string;
}
