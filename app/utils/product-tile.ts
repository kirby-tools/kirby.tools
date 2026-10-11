import type { ProductIdWithThemeColor } from "#shared/products";
import { hasThemeColor, isProductId, PRODUCTS } from "#shared/products";

export interface ProductTile {
  label: string;
  icon: string;
  color: ProductIdWithThemeColor | "primary";
}

export function getProductTile(productId?: string): ProductTile | undefined {
  if (!isProductId(productId)) return;

  const product = PRODUCTS[productId];

  return {
    label: product.label,
    icon: product.icon,
    color: hasThemeColor(productId) ? productId : "primary",
  };
}
