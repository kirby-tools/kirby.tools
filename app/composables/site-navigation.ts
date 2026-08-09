/**
 * Collects the navigation tree the command palette shows. From `pages` only the
 * `/docs` subtree contributes, so the legal pages stay out.
 */
export function useSiteNavigation() {
  return useAsyncData("navigation", async () => {
    const result = await Promise.all([
      queryCollectionNavigation("pages").then(
        (data) => data.find((item) => item.path === "/docs")?.children ?? [],
      ),
      queryCollectionNavigation("docs"),
      queryCollectionNavigation("posts"),
    ]);
    return result.flat();
  });
}

export function useSiteSearch() {
  return useLazyAsyncData(
    "search",
    async () => {
      const result = await Promise.all([
        queryCollectionSearchSections("pages"),
        queryCollectionSearchSections("docs"),
        queryCollectionSearchSections("posts"),
      ]);
      return result.flat();
    },
    {
      server: false,
    },
  );
}
