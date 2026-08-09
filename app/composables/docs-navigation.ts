export function useDocsNavigation() {
  const { productId } = useProduct();

  return useAsyncData(
    () => `${productId.value}-navigation`,
    async () => {
      const navigation = await queryCollectionNavigation("docs");
      const docsItems = navigation?.[0]?.children;
      const productItem = docsItems?.find(
        (item) => item.path === `/docs/${productId.value}`,
      );

      if (productItem?.stem?.endsWith("index")) {
        return productItem ? [productItem] : undefined;
      }

      if (productItem?.children?.length) {
        return productItem.children;
      }
    },
    {
      immediate: !!productId.value,
      watch: [productId],
    },
  );
}
