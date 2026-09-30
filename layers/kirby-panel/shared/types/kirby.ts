export type PanelDropdownOption =
  | {
      text?: string;
      info?: string;
      icon?: string;
      disabled?: boolean;
      click?: () => void;
    }
  | "-";

export interface PanelPicklistOption {
  value: string;
  text: string;
}

export interface PanelViewButtonProps {
  text?: string;
  title?: string;
  icon?: string;
  theme?: string;
  responsive?: boolean;
  badge?: { theme?: string; text?: string };
  /** Kirby's caret, on a button whose dropdown the Mock leaves closed. */
  dropdown?: boolean;
  /** The options of the one dropdown a Mock shows open under the button. */
  options?: PanelDropdownOption[];
  /**
   * Kirby's view buttons force `end`; a plugin that ships its own button gets
   * `k-dropdown`'s `start`.
   */
  alignX?: "start" | "end";
}

export interface PanelLanguagesDropdownOption {
  text: string;
  code: string;
  current?: boolean;
  click?: () => void;
}

export type PanelViewButton =
  PanelViewButtonProps | { component: string; props: object } | "-";

export type PanelFieldType = "text" | "textarea" | "writer";

/** A field of the page's blueprint, as Kirby hands it to the Panel. */
export interface PanelFieldProps {
  name: string;
  label: string;
}

export interface PanelBlock {
  type: "heading" | "text" | "quote";
  text: string;
  level?: string;
  citation?: string;
}

export interface PanelLayout {
  columns: { width: string; blocks: PanelBlock[] }[];
}
