import type { H3Event } from "h3";
import type { ProductId } from "#shared/constants";
import { queryCollection } from "@nuxt/content/server";
import { joinURL } from "ufo";
import { alternatePath } from "#shared/alternate";
import {
  productChangelogPath,
  PRODUCTS,
  productSkillName,
  productVersionsPattern,
} from "#shared/constants";

export function skillFileKeys(productId: ProductId) {
  return useStorage("assets:server").getKeys(
    `skills:${productSkillName(productId)}`,
  );
}

/** Translates a storage key into a file path, colons to slashes. */
export function skillFilePath(productId: ProductId, key: string) {
  return key
    .slice(`skills:${productSkillName(productId)}:`.length)
    .replaceAll(":", "/");
}

/**
 * Builds a dated version line, so an agent can tell how far the skill has
 * drifted from the plugin it describes.
 */
export async function skillProvenance(event: H3Event, productId: ProductId) {
  const { name, hasChangelog, githubRepo } = PRODUCTS[productId];
  const { domain } = useRuntimeConfig(event).llms;

  if (!hasChangelog) {
    return `Written against the latest ${name} release. Releases: <https://github.com/${githubRepo}/releases>`;
  }

  const latest = await queryCollection(event, "versions")
    .select("title", "date")
    .where("path", "LIKE", productVersionsPattern(productId))
    .order("date", "DESC")
    .first();

  const changelogUrl = joinURL(
    domain,
    alternatePath(productChangelogPath(productId)),
  );

  return `Written against ${name} ${latest?.title} (${latest?.date}). Changelog: <${changelogUrl}>`;
}
