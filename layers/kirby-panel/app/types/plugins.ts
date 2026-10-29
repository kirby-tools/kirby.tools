import type { TranslatorAction } from "#kirby-plugin/content-translator";
import type { Rating } from "#kirby-plugin/seo-audit";
import type { PanelDropdownOption } from "./kirby";

// #region SEO Audit
export interface PanelSeoAuditButtonProps {
  /** The page's stored rating, which the plugin reads from its storage. */
  rating?: Rating;
  /** An analysis in progress, which the plugin keeps in its own state. */
  isAnalyzing?: boolean;
  /** Analyzes the page and opens the report, which the plugin does itself. */
  click?: () => void;
}
// #endregion

// #region Content Translator
/** The blueprint options and the view's language the plugin derives its actions from. */
export interface PanelContentTranslatorOptions {
  language?: string;
  /** The site's language codes, the default language first. */
  languages?: string[];
  import?: boolean;
  importFrom?: "all";
  batch?: boolean;
}

export interface PanelContentTranslatorDropdownButtonProps extends PanelContentTranslatorOptions {
  label?: string;
  theme?: string;
  isTranslating?: boolean;
  /** The dropdown held open, for a Mock the reader doesn't click. */
  open?: boolean;
  /** Runs the picked action, which the plugin runs itself. */
  run?: (action: TranslatorAction) => void;
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
