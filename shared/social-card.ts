import type { ProductId } from "./products";

export const SOCIAL_CARD_FORMATS = {
  og: { width: 1200, height: 630 },
  "4x3": { width: 1600, height: 1200 },
} as const;

export type SocialCardFormat = keyof typeof SOCIAL_CARD_FORMATS;

export function socialCardPath(
  id: ProductId,
  format: SocialCardFormat = "og",
): string {
  return `/social-card/${id}${format === "og" ? "" : `-${format}`}.png`;
}
