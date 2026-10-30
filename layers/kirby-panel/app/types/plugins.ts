import type { TranslatorAction } from "#kirby-plugin/content-translator";
import type { Rating } from "#kirby-plugin/seo-audit";
import type { PanelDropdownOption } from "./kirby";

// #region SEO Audit
export interface PanelSeoAuditButtonProps {
  rating?: Rating;
  isAnalyzing?: boolean;
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
  run?: (action: TranslatorAction) => void;
}
// #endregion

// #region Copilot
export interface PanelCopilotButtonProps {
  label?: string;
  icon?: string;
  theme?: string;
  isGenerating?: boolean;
  click?: () => void;
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

// #region Deploy Trigger
export interface PanelDeployTriggerButtonProps {
  isDeploying?: boolean;
  click?: () => void;
}
// #endregion
