import { PRODUCT_ITEMS } from "#shared/constants";

export function useProduct() {
  const route = useRoute();

  const currentProductId = computed(
    () =>
      route.path.split("/").filter(Boolean)[
        route.path.startsWith("/docs") ? 1 : 0
      ],
  );

  const currentProduct = computed(() =>
    PRODUCT_ITEMS.find(
      (product) => product.to === `/${currentProductId.value}`,
    ),
  );

  return {
    currentProductId,
    currentProduct,
  };
}
