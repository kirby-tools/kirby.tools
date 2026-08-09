import type { H3Event } from "h3";
import type { ProductId } from "#shared/constants";
import { queryCollection } from "@nuxt/content/server";
import { isProductId } from "#shared/constants";

/**
 * Serves the Markdown source of a page under its own URL plus `.md`.
 *
 * Middleware rather than a route handler: Nitro turns `[...slug].md.get.ts`
 * into `/docs/**:slug.md`, a catch-all that would swallow the HTML pages under
 * the same prefix.
 */
export default defineEventHandler(async (event) => {
  if (event.method !== "GET") return;

  const [pathname] = event.path.split("?");
  if (!pathname?.endsWith(".md")) return;

  const path = pathname.slice(0, -".md".length);
  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "docs" && segments.length > 1) {
    return sendCollectionPage(event, "docs", path);
  }

  if (segments[0] === "blog" && segments.length > 1) {
    return sendCollectionPage(event, "posts", path);
  }

  if (
    segments.length === 2 &&
    segments[1] === "changelog" &&
    isProductId(segments[0])
  ) {
    return sendChangelog(event, segments[0], path);
  }
});

async function sendCollectionPage(
  event: H3Event,
  collection: "docs" | "posts",
  path: string,
) {
  const page = await queryCollection(event, collection).path(path).first();
  if (!page) return sendMarkdownNotFound(event, path);

  return sendMarkdown(event, {
    title: page.title,
    description: page.description,
    path,
    body: stringifyPageBody(page),
  });
}

async function sendChangelog(
  event: H3Event,
  productId: ProductId,
  path: string,
) {
  const page = await queryCollection(event, "changelog").path(path).first();
  if (!page) return sendMarkdownNotFound(event, path);

  const versions = await queryCollection(event, "versions")
    .where("path", "LIKE", `/${productId}/changelog/%`)
    .order("date", "DESC")
    .all();

  return sendMarkdown(event, {
    title: page.title,
    description: page.description,
    path,
    body: versions
      .map(
        (version) =>
          `## ${version.title}\n\nReleased ${version.date}\n\n${stringifyPageBody(version)}`,
      )
      .join("\n\n"),
  });
}
