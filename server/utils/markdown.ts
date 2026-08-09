import type { PageCollectionItemBase } from "@nuxt/content";
import type { H3Event } from "h3";
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
 * tags. The `markdown/mdc` format emits every component at `::` regardless of
 * nesting, which makes `:::card` and `:::tabs-item` ambiguous.
 */
export function stringifyPageBody(page: PageCollectionItemBase): string {
  return stringify(
    { ...page.body, type: "minimark" },
    { format: "markdown/html" },
  );
}

export function sendMarkdown(event: H3Event, document: MarkdownDocument) {
  const { domain } = useRuntimeConfig(event).llms;
  const canonicalUrl = joinURL(domain, document.path);

  setResponseHeader(event, "Content-Type", "text/markdown; charset=utf-8");
  setResponseHeader(
    event,
    "Link",
    `<${canonicalUrl}>; rel="canonical", <${canonicalUrl}>; rel="alternate"; type="text/html"`,
  );

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
