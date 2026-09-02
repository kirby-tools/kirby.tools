export type PanelSeoAuditRating = "good" | "ok" | "bad" | "feedback";

export interface PanelSeoAuditResultEntry {
  rating: PanelSeoAuditRating;
  text: string;
}
