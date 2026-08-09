import type { ProductId } from "#shared/constants";
import { PRODUCTS, resolveProductId } from "#shared/constants";

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
