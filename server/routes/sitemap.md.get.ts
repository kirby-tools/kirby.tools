import { queryCollection } from "@nuxt/content/server";
import { joinURL } from "ufo";
import { alternatePath } from "#shared/alternate";
import { PRODUCT_LIST, resolveProductId } from "#shared/constants";

export default defineEventHandler(async (event) => {
  const { domain } = useRuntimeConfig(event).llms;

  const [docs, posts] = await Promise.all([
    queryCollection(event, "docs")
      // `stem` keeps the numeric directory prefixes, so it orders by the
      // sidebar's reading order rather than the alphabet.
      .select("path", "title", "stem")
      .where("extension", "=", "md")
      .where("path", "NOT LIKE", "%/.navigation")
      .order("stem", "ASC")
      .all(),
    queryCollection(event, "posts")
      .select("path", "title", "date")
      .order("date", "DESC")
      .all(),
  ]);

  const lines = [
    "# Kirby Tools Sitemap",
    "",
    "> Every documentation and blog page of kirby.tools, linked as Markdown. Strip the `.md` suffix from any URL below to reach the HTML page.",
    "",
  ];

  for (const product of PRODUCT_LIST) {
    lines.push(`## ${product.name}`, "");

    for (const page of docs.filter(
      (page) => resolveProductId(page.path) === product.id,
    )) {
      lines.push(markdownLink(domain, page.title, page.path));
    }

    if (product.hasChangelog) {
      lines.push(markdownLink(domain, "Changelog", `/${product.id}/changelog`));
    }

    lines.push("");
  }

  lines.push("## Blog", "");
  for (const post of posts) {
    lines.push(markdownLink(domain, post.title, post.path));
  }

  lines.push(
    "",
    "## Sets",
    "",
    `- [Index for language models](${joinURL(domain, "/llms.txt")})`,
    `- [Every documentation page in one file](${joinURL(domain, "/llms-full.txt")})`,
    `- [Agent skills, one per plugin](${joinURL(domain, "/.well-known/agent-skills/index.json")})`,
    "",
  );

  setResponseHeader(event, "Content-Type", "text/markdown; charset=utf-8");
  return lines.join("\n");
});

function markdownLink(domain: string, title: string, path: string) {
  const label = title.replace(/[[\]\\]/g, "\\$&");
  return `- [${label}](${joinURL(domain, alternatePath(path))})`;
}
