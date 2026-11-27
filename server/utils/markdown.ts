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

const BLANK_LINE_MARK = "\0";
const BLANK_LINE_MARK_PATTERN = /^ *\0$/gm;

export function stringifyPageBody(
  page: PageCollectionItemBase,
  latestDownload?: ProductDownload,
): string {
  const nodes = markCodeBlankLines(
    separateListItemCode(writeClassAttribute(dropLinkRel(page.body.value))),
  );
  const markdown = stringify(
    {
      ...page.body,
      type: "minimark",
      value: latestDownload ? linkLatestVersion(nodes, latestDownload) : nodes,
    },
    { format: "markdown/html" },
  );

  return (
    markdown
      // minimark separates the blocks inside an HTML tag twice.
      .replace(/\n{3,}/g, "\n\n")
      // minimark leaves a blank line in indented code without its indent.
      .replace(BLANK_LINE_MARK_PATTERN, "")
      .replaceAll(BLANK_LINE_MARK, "")
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

/** Drops every link's `rel`, which Nuxt Content adds to external links and both minimark and `@nuxtjs/mdc` write as a broken attribute. */
export function dropLinkRel(nodes: MinimarkNode[]): MinimarkNode[] {
  return mapElements(nodes, (element) => {
    if (element[0] !== "a") return element;
    const [tag, { rel: _rel, ...linkProps }, ...children] = element;
    return [tag, linkProps, ...children];
  });
}

/** Writes every `className` array as a `class` attribute, since minimark writes an array as escaped JSON. */
function writeClassAttribute(nodes: MinimarkNode[]): MinimarkNode[] {
  return mapElements(nodes, (element) => {
    const [tag, { className, ...props }, ...children] = element;
    if (!Array.isArray(className)) return element;
    return [tag, { ...props, class: className.join(" ") }, ...children];
  });
}

/** Wraps the text before a list item's code block in a paragraph, since minimark writes the fence onto the text's line otherwise. */
function separateListItemCode(nodes: MinimarkNode[]): MinimarkNode[] {
  return mapElements(nodes, (element) => {
    const [tag, props, ...children] = element;
    if (tag !== "li") return element;

    const codeIndex = children.findIndex(
      (child) => typeof child !== "string" && child[0] === "pre",
    );
    if (codeIndex < 1) return element;

    return [
      tag,
      props,
      ["p", {}, ...children.slice(0, codeIndex)],
      ...children.slice(codeIndex),
    ];
  });
}

/** Marks the blank lines in every code block, so that collapsing the blank lines of the Markdown leaves the code alone. */
function markCodeBlankLines(nodes: MinimarkNode[]): MinimarkNode[] {
  return mapElements(nodes, (element) => {
    const [tag, props, ...children] = element;
    if (tag !== "pre" || typeof props.code !== "string") return element;

    const code = props.code.trim().replace(/^$/gm, BLANK_LINE_MARK);
    return [tag, { ...props, code }, ...children];
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
