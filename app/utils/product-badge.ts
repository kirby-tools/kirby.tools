import type { BrandColorProductId } from "#shared/constants";
import { hasBrandColor, isProductId, PRODUCTS } from "#shared/constants";

export interface ProductBadge {
  label: string;
  icon: string;
  color: BrandColorProductId | "primary";
}

export function getProductBadge(productId?: string): ProductBadge | undefined {
  if (!isProductId(productId)) return;

  const product = PRODUCTS[productId];

  return {
    label: product.label,
    icon: product.icon,
    color: hasBrandColor(productId) ? productId : "primary",
  };
}
