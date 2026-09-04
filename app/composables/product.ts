import type { ProductId } from "#shared/products";
import { PRODUCTS, resolveProductId } from "#shared/products";

export function useProduct() {
  const route = useRoute();

  const productId = computed<ProductId | undefined>(() =>
    resolveProductId(route.path),
  );

  const product = computed(() =>
    productId.value ? PRODUCTS[productId.value] : undefined,
  );

  return {
    productId,
    product,
  };
}
