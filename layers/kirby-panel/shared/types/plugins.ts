// #region SEO Audit
export type PanelSeoAuditRating = "good" | "ok" | "bad" | "feedback";

export interface PanelSeoAuditResultEntry {
  rating: PanelSeoAuditRating;
  text: string;
}
// #endregion
