export function useDocsNavigation() {
  const { currentProductId } = useProduct();

  return useAsyncData(
    () => `${currentProductId.value}-navigation`,
    async () => {
      const navigation = await queryCollectionNavigation("docs");
      const docsItems = navigation?.[0]?.children;
      const productItem = docsItems?.find(
        (item) => item.path === `/docs/${currentProductId.value}`,
      );

      if (productItem?.stem?.endsWith("index")) {
        return productItem ? [productItem] : undefined;
      }

      if (productItem?.children?.length) {
        return productItem.children;
      }
    },
    {
      immediate: !!currentProductId.value,
      watch: [currentProductId],
    },
  );
}
