import type { ProductId } from "./products";

export const EXHIBITION_PRODUCT_IDS = [
  "copilot",
  "content-translator",
  "seo-audit",
  "serp-preview",
  "minimap",
] as const satisfies readonly ProductId[];

export type ExhibitionProductId = (typeof EXHIBITION_PRODUCT_IDS)[number];

export const SHOWCASE_PRODUCT_IDS = [
  "copilot",
  "content-translator",
  "seo-audit",
] as const satisfies readonly ExhibitionProductId[];

export type ShowcaseProductId = (typeof SHOWCASE_PRODUCT_IDS)[number];

export function isExhibitionProductId(
  value: string | undefined,
): value is ExhibitionProductId {
  return (EXHIBITION_PRODUCT_IDS as readonly string[]).includes(value ?? "");
}
