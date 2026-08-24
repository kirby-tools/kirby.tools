/**
 * Feeds the command palette. Both queries pull down a SQLite database, so they
 * wait for the palette to open.
 */
export function useContentSearchData() {
  const { open } = useContentSearch();
  const navigation = useSiteNavigation();
  const files = useSiteSearch();

  watch(
    open,
    () => {
      navigation.execute();
      files.execute();
    },
    { once: true },
  );

  return {
    navigation: navigation.data,
    files: files.data,
    isLoading: computed(
      () =>
        navigation.status.value === "pending" ||
        files.status.value === "pending",
    ),
  };
}

function useSiteNavigation() {
  return useLazyAsyncData(
    "navigation",
    async () => {
      const result = await Promise.all([
        queryCollectionNavigation("docs"),
        queryCollectionNavigation("posts"),
      ]);
      return result.flat();
    },
    { server: false, immediate: false },
  );
}

// Shiki appends its highlighting rules as a `style` node to each document body.
const SEARCH_SECTION_OPTIONS = { ignoredTags: ["style"] };

function useSiteSearch() {
  return useLazyAsyncData(
    "search",
    async () => {
      const result = await Promise.all([
        queryCollectionSearchSections("pages", SEARCH_SECTION_OPTIONS),
        queryCollectionSearchSections("docs", SEARCH_SECTION_OPTIONS),
        queryCollectionSearchSections("posts", SEARCH_SECTION_OPTIONS),
      ]);
      return result.flat();
    },
    { server: false, immediate: false },
  );
}
