import type { PanelDropdownOption } from "./kirby";

// #region SEO Audit
export type PanelSeoAuditCategory = "seo" | "readability";

export type PanelSeoAuditRating = "good" | "ok" | "bad" | "feedback";

export type PanelSeoAuditCategoryRating = "good" | "ok" | "bad" | "none";

export type PanelSeoAuditContentVersion = "latest" | "changes";

export interface PanelSeoAuditResultEntry {
  rating: PanelSeoAuditRating;
  text: string;
}

export type PanelSeoAuditResults = Record<
  PanelSeoAuditCategory,
  PanelSeoAuditResultEntry[]
>;

/** A category without results has no score. */
export type PanelSeoAuditRatings = Partial<
  Record<PanelSeoAuditCategory, { rating: PanelSeoAuditCategoryRating }>
>;

export interface PanelSeoAuditButtonProps {
  label?: string;
  theme?: string;
  /** The last report's ratings, which the plugin keeps in its storage. */
  ratings?: PanelSeoAuditRatings;
  /** Whether the page was published since the last report. */
  isStale?: boolean;
  /** An analysis in progress, which the plugin keeps in its own state. */
  isAnalyzing?: boolean;
  /** Analyzes the page and opens the report, which the plugin does itself. */
  click?: () => void;
}
// #endregion

// #region Content Translator
export interface PanelContentTranslatorLanguageCoverage {
  code: string;
  name: string;
  percentage: number;
  incompletePageCount: number;
}

/** The blueprint options and the view's language the plugin derives its actions from. */
export interface PanelContentTranslatorOptions {
  /** The language the view shows. */
  language?: string;
  /** The site's language codes, the default language first. */
  languages?: string[];
  import?: boolean;
  importFrom?: "all";
  batch?: boolean;
}

export interface PanelContentTranslatorAction {
  type: "import" | "translate" | "batch";
  text: string;
  icon: string;
  disabled: boolean;
  /** The language an import copies from, where the editor picks one. */
  from?: string;
}

export interface PanelContentTranslatorDropdownButtonProps extends PanelContentTranslatorOptions {
  label?: string;
  theme?: string;
  /** A run in progress, which the plugin reads from its translation state. */
  isTranslating?: boolean;
  /** The dropdown held open, for a Mock the reader doesn't click. */
  open?: boolean;
  /** Runs the picked action, which the plugin runs itself. */
  run?: (action: PanelContentTranslatorAction) => void;
}

export interface PanelContentTranslatorTreeEntry {
  label: string;
  icon?: string;
  isOpen?: boolean;
  missingLanguages: { code: string; name: string }[];
  children?: PanelContentTranslatorTreeEntry[];
}
// #endregion

// #region Copilot
export interface PanelCopilotButtonProps {
  label?: string;
  icon?: string;
  theme?: string;
  /** A run in progress, which the plugin keeps in its own state. */
  isGenerating?: boolean;
  /** Opens the prompt dialog, which the plugin opens itself. */
  click?: () => void;
  /** Stops the answer in progress, which the plugin aborts itself. */
  abort?: () => void;
}

/**
 * Under `fields` the dropdown is a picklist of the dialog's `fields`, which
 * carries a selection rather than actions.
 */
export type PanelCopilotPromptDropdown =
  | {
      under: "placeholders" | "templates" | "history" | "skills";
      options?: PanelDropdownOption[];
      selected?: number;
    }
  | {
      under: "fields";
      value?: string[];
    };
// #endregion
