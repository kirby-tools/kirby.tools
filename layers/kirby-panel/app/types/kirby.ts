import type {
  PanelContentTranslatorDropdownButtonProps,
  PanelCopilotButtonProps,
  PanelSeoAuditButtonProps,
} from "./plugins";

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
}

export type PanelPageStatus = "draft" | "unlisted" | "listed";

/** A plugin's view button, with the props its blueprint or state sets. */
export type PanelPluginViewButton =
  | ({ plugin: "copilot" } & PanelCopilotButtonProps)
  | ({
      plugin: "content-translator";
    } & PanelContentTranslatorDropdownButtonProps)
  | ({ plugin: "seo-audit" } & PanelSeoAuditButtonProps);

// `plugin?: never` keeps Kirby's own button props off a plugin's entry.
export type PanelViewButton =
  | ((
      | PanelViewButtonProps
      | { component: string; props: object }
      | { status: PanelPageStatus }
    ) & { plugin?: never })
  | PanelPluginViewButton
  | "-";

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
