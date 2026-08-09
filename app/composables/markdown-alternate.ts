import { joinURL, withoutTrailingSlash } from "ufo";

/** Path and absolute URL of the current page's Markdown twin. */
export function useMarkdownPath() {
  const route = useRoute();
  const siteConfig = useSiteConfig();

  const path = computed(() => `${withoutTrailingSlash(route.path)}.md`);
  const url = computed(() => joinURL(siteConfig.url, path.value));

  return { path, url };
}

/** Announces the Markdown twin to agents and queues it for prerendering. */
export function useMarkdownAlternate() {
  const { path, url } = useMarkdownPath();

  if (import.meta.server) {
    // Nothing links to the Markdown twin, so crawling never finds it.
    prerenderRoutes(path.value);
  }

  useHead({
    link: [{ rel: "alternate", type: "text/markdown", href: url }],
  });
}
