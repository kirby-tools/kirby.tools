import type { ProductColorSlot } from "#shared/constants";
import { isProductId, PRODUCTS } from "#shared/constants";

export interface ProductBadge {
  label: string;
  icon: string;
  color: ProductColorSlot | "primary";
}

export function getProductBadge(productId?: string): ProductBadge | undefined {
  if (!isProductId(productId)) return;

  const product = PRODUCTS[productId];

  return {
    label: product.label,
    icon: product.icon,
    color: product.colorSlot ?? "primary",
  };
}
