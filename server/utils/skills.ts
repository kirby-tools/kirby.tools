import type { H3Event } from "h3";
import type { ProductId } from "#shared/products";
import { queryCollection } from "@nuxt/content/server";
import { joinURL } from "ufo";
import { alternatePath } from "#shared/alternate";
import {
  productChangelogPath,
  PRODUCTS,
  productSkillName,
  productVersionsPattern,
} from "#shared/products";

export function skillFileKeys(productId: ProductId) {
  return useStorage("assets:server").getKeys(
    `skills:${productSkillName(productId)}`,
  );
}

export function skillFilePath(productId: ProductId, key: string) {
  return key
    .slice(`skills:${productSkillName(productId)}:`.length)
    .replaceAll(":", "/");
}

export function skillLicenseNote(productId: ProductId) {
  if (PRODUCTS[productId].license !== "commercial") {
    return "";
  }

  return "## License\n\nRuns unlicensed in local development. Production needs a key, activated in the Panel's system view and written to `site/config/.kirby-tools-licenses` \u2013 add that file to `.gitignore`.";
}

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
