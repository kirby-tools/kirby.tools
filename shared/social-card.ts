import type { ExhibitionProductId } from "./exhibition";

export const SOCIAL_CARD_FORMATS = {
  og: { width: 1200, height: 630 },
  "4x3": { width: 1600, height: 1200 },
} as const;

export type SocialCardFormat = keyof typeof SOCIAL_CARD_FORMATS;

/** The public path of a product's rendered social card. */
export function socialCardPath(
  id: ExhibitionProductId,
  format: SocialCardFormat = "og",
): string {
  return `/social-card/${id}${format === "og" ? "" : `-${format}`}.png`;
}
