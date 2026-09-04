import type { ProductIdWithThemeColor } from "#shared/constants";
import { hasThemeColor, isProductId, PRODUCTS } from "#shared/constants";

export interface ProductBadge {
  label: string;
  icon: string;
  color: ProductIdWithThemeColor | "primary";
}

export function getProductBadge(productId?: string): ProductBadge | undefined {
  if (!isProductId(productId)) return;

  const product = PRODUCTS[productId];

  return {
    label: product.label,
    icon: product.icon,
    color: hasThemeColor(productId) ? productId : "primary",
  };
}
