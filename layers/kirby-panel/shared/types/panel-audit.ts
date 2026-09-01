export type PanelAuditRating = "good" | "ok" | "bad" | "feedback";

export interface PanelAuditResultEntry {
  rating: PanelAuditRating;
  text: string;
}
