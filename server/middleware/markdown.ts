import type { H3Event } from "h3";
import type { ProductId } from "#shared/constants";
import { queryCollection } from "@nuxt/content/server";
import { pagePath, resolveAlternate } from "#shared/alternate";

/**
 * Serves the alternate of a page.
 *
 * Middleware rather than a route handler: Nitro turns `[...slug].md.get.ts`
 * into `/docs/**:slug.md`, a catch-all that would swallow the HTML pages under
 * the same prefix.
 */
export default defineEventHandler(async (event) => {
  if (event.method !== "GET") return;

  const [pathname] = event.path.split("?");
  const path = pathname ? pagePath(pathname) : undefined;
  if (!path) return;

  const alternate = resolveAlternate(path);
  if (!alternate) return;

  return alternate.kind === "changelog"
    ? sendChangelog(event, alternate.productId, path)
    : sendCollectionPage(event, alternate.collection, path);
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
