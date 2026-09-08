import type { PanelDropdownOption, PanelPicklistOption } from "./kirby";

// #region SEO Audit
export type PanelSeoAuditRating = "good" | "ok" | "bad" | "feedback";

export interface PanelSeoAuditResultEntry {
  rating: PanelSeoAuditRating;
  text: string;
}
// #endregion

// #region Content Translator
export interface PanelContentTranslatorLanguageCoverage {
  code: string;
  name: string;
  percentage: number;
  incompletePageCount: number;
}

export interface PanelContentTranslatorTreeEntry {
  label: string;
  icon?: string;
  isOpen?: boolean;
  missingLanguages?: string[];
  children?: PanelContentTranslatorTreeEntry[];
}
// #endregion

// #region Copilot
/**
 * Under `fields` the dropdown is a picklist, which carries a selection rather
 * than actions.
 */
export type PanelCopilotPromptDropdown =
  | {
      under: "placeholders" | "templates" | "history" | "skills";
      options?: PanelDropdownOption[];
      selected?: number;
    }
  | {
      under: "fields";
      options?: PanelPicklistOption[];
      value?: string[];
    };
// #endregion

// #region Minimap
/** A block of a blocks field, as the sidebar resolves it for its own entry. */
export interface PanelMinimapBlock {
  icon: string;
  text: string;
  /** In view, which the sidebar marks while the editor scrolls. */
  active?: boolean;
}

export interface PanelMinimapField {
  label: string;
  required?: boolean;
  active?: boolean;
  blocks?: PanelMinimapBlock[];
}
// #endregion
