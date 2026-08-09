import { joinURL } from "ufo";
import { alternatePath, resolveAlternate } from "#shared/alternate";

/** Derives the path and absolute URL of the current page's alternate. */
export function useMarkdownPath() {
  const route = useRoute();
  const siteConfig = useSiteConfig();

  const path = computed(() => alternatePath(route.path));
  const url = computed(() => joinURL(siteConfig.url, path.value));

  return { path, url };
}

/**
 * Announces the alternate to agents and queues it for prerendering. A page
 * without one calls this to no effect.
 */
export function useMarkdownAlternate() {
  const route = useRoute();
  const { path, url } = useMarkdownPath();

  if (!resolveAlternate(route.path)) return;

  if (import.meta.server) {
    // Nothing links to the alternate, so crawling never finds it.
    prerenderRoutes(path.value);
  }

  useHead({
    link: [{ rel: "alternate", type: "text/markdown", href: url }],
  });
}
