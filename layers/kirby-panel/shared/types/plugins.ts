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
