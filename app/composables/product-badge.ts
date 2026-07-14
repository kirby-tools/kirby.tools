import type { ProductColorSlot } from "#shared/constants";
import { PRODUCT_COLOR_SLOT, PRODUCT_ITEMS } from "#shared/constants";

export interface ProductBadge {
  label: string;
  icon: string;
  /** Registered UI color slot (see `app.config.ts` → `ui.colors`). */
  color: ProductColorSlot | "primary";
}

export function getProductBadge(slug?: string): ProductBadge | undefined {
  if (!slug) return;

  const product = PRODUCT_ITEMS.find((item) => item.to === `/${slug}`);
  if (!product) return;

  return {
    label: product.label,
    icon: product.icon,
    color: PRODUCT_COLOR_SLOT[slug] ?? "primary",
  };
}
