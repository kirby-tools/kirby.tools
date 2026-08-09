import type { Ref } from "vue";
import type { ProductId } from "#shared/constants";
import { productVersionsPattern } from "#shared/constants";

/** Fetches the newest release of a product, or `null` off a product route. */
export function useLatestProductVersion(productId: Ref<ProductId | undefined>) {
  return useAsyncData(
    () => `${productId.value}-version`,
    async () => {
      const id = productId.value;
      if (!id) return null;

      return queryCollection("versions")
        .select("title", "date")
        .where("path", "LIKE", productVersionsPattern(id))
        .order("date", "DESC")
        .first();
    },
    { immediate: !!productId.value },
  );
}

/** Fetches every release of a product, newest first. */
export function useProductVersions(productId: Ref<ProductId | undefined>) {
  return useAsyncData(
    () => `${productId.value}-versions`,
    async () => {
      const id = productId.value;
      if (!id) return [];

      return queryCollection("versions")
        .where("path", "LIKE", productVersionsPattern(id))
        .order("date", "DESC")
        .all();
    },
    { immediate: !!productId.value },
  );
}
