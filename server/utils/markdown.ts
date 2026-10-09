import type { PageCollectionItemBase } from "@nuxt/content";
import type { H3Event } from "h3";
import type { MinimarkElement, MinimarkNode } from "minimark";
import type { ProductDownload } from "#shared/products";
import { stringify } from "minimark/stringify";
import { joinURL } from "ufo";

export interface MarkdownDocument {
  title: string;
  description?: string;
  /** Path of the HTML page this document mirrors, without the `.md` suffix. */
  path: string;
  body: string;
}

/**
 * Renders a stored page body back to Markdown, with MDC components as HTML
 * tags and a `latest-version` component as the download link passed in. The
 * `markdown/mdc` format emits every component at `::` regardless of nesting,
 * which makes `:::card` and `:::tabs-item` ambiguous.
 */
export function stringifyPageBody(
  page: PageCollectionItemBase,
  latestDownload?: ProductDownload,
): string {
  const value = latestDownload
    ? linkLatestVersion(page.body.value, latestDownload)
    : page.body.value;

  return stringify(
    { ...page.body, type: "minimark", value },
    { format: "markdown/html" },
  );
}

export function sendMarkdown(event: H3Event, document: MarkdownDocument) {
  const { domain } = useRuntimeConfig(event).llms;
  const canonicalUrl = joinURL(domain, document.path);

  setResponseHeader(event, "Content-Type", "text/markdown; charset=utf-8");

  // These routes prerender to files, so no response header survives to
  // production. The canonical URL rides in the frontmatter instead.
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(document.title)}`,
    ...(document.description
      ? [`description: ${JSON.stringify(document.description)}`]
      : []),
    `canonical_url: ${JSON.stringify(canonicalUrl)}`,
    "---",
  ].join("\n");

  const heading = document.description
    ? `# ${document.title}\n\n> ${document.description}`
    : `# ${document.title}`;

  return `${frontmatter}\n\n${heading}\n\n${document.body.trim()}\n\n---\n\nEvery page of this site as Markdown: <${joinURL(domain, "/sitemap.md")}>\n`;
}

export function sendMarkdownNotFound(event: H3Event, path: string) {
  const { domain } = useRuntimeConfig(event).llms;

  setResponseStatus(event, 404);
  setResponseHeader(event, "Content-Type", "text/markdown; charset=utf-8");

  return `---\ntitle: "Not Found"\n---\n\n# Not Found\n\nNo page exists at \`${path}\`. Browse <${joinURL(domain, "/sitemap.md")}> for every available page.\n`;
}

/** Replaces each `latest-version` component, an empty node in the stored body, with the page's download link. */
export function linkLatestVersion(
  nodes: MinimarkNode[],
  latestDownload: ProductDownload,
): MinimarkNode[] {
  return mapElements(nodes, (element) =>
    element[0] === "latest-version"
      ? ["a", { href: latestDownload.url }, latestDownload.label]
      : element,
  );
}

/** Drops every link's `rel`, which Nuxt Content adds to external links and the MDC stringifier writes as a broken attribute. */
export function dropLinkRel(nodes: MinimarkNode[]): MinimarkNode[] {
  return mapElements(nodes, (element) => {
    if (element[0] !== "a") return element;
    const [tag, { rel: _rel, ...linkProps }, ...children] = element;
    return [tag, linkProps, ...children];
  });
}

/** Rewrites every element of a stored body, its children first. */
function mapElements(
  nodes: MinimarkNode[],
  transform: (element: MinimarkElement) => MinimarkNode,
): MinimarkNode[] {
  return nodes.map((node) => {
    if (typeof node === "string") return node;
    const [tag, props, ...children] = node;
    return transform([tag, props, ...mapElements(children, transform)]);
  });
}
