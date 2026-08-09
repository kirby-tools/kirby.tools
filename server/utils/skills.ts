import type { H3Event } from "h3";
import type { ProductId } from "#shared/constants";
import { queryCollection } from "@nuxt/content/server";
import { PRODUCTS, productSkillName } from "#shared/constants";

/**
 * The pointer an agent reads before deciding to load a skill. It states what
 * the plugin does and names the branches that should trigger a load, so it
 * carries no sentence the skill body repeats.
 */
export const SKILL_DESCRIPTIONS: Record<ProductId, string> = {
  copilot:
    "Configure Kirby Copilot, the AI content generation plugin for the Kirby Panel. Use when wiring up an AI provider, adding generation to a blueprint, generating blocks or layouts, or driving generation from PHP.",
  "content-translator":
    "Configure Kirby Content Translator, which translates Panel content between Kirby's languages. Use when choosing a translation strategy, restricting which fields translate, translating KirbyTags, or scripting bulk translation from the CLI.",
  "seo-audit":
    "Configure Kirby SEO Audit, which scores a rendered page against a keyphrase inside the Panel. Use when adding the audit to a blueprint, wiring keyphrase and synonym fields, scoping the analyzed markup, or auditing a decoupled frontend.",
  "live-preview":
    "Configure Kirby Live Preview, which renders a page beside its Panel form. Use when adding the preview section to a blueprint, tuning when it refreshes, or fixing a preview that stays blank.",
  minimap:
    "Configure Kirby Minimap, a zero-config sidebar that outlines the fields and blocks of the current Panel view. Use when a field fails to appear in the outline or the plugin needs installing.",
  headless:
    "Configure Kirby Headless, which turns Kirby into a JSON API for a decoupled frontend. Use when securing the API with a bearer token, setting up CORS, querying through KQL, or serving pages as JSON templates.",
};

export function skillFileKeys(productId: ProductId) {
  return useStorage("assets:server").getKeys(
    `skills:${productSkillName(productId)}`,
  );
}

/** Storage keys are colon-separated; skill file paths are slash-separated. */
export function skillFilePath(productId: ProductId, key: string) {
  return key
    .slice(`skills:${productSkillName(productId)}:`.length)
    .replaceAll(":", "/");
}

/**
 * A dated version line, so an agent can tell how far the skill has drifted from
 * the plugin it describes.
 */
export async function skillProvenance(event: H3Event, productId: ProductId) {
  const { name, hasChangelog, githubRepo } = PRODUCTS[productId];
  const { domain } = useRuntimeConfig(event).llms;

  if (!hasChangelog) {
    return `Written against the latest ${name} release. Releases: <https://github.com/${githubRepo}/releases>`;
  }

  const latest = await queryCollection(event, "versions")
    .select("title", "date")
    .where("path", "LIKE", `/${productId}/changelog/%`)
    .order("date", "DESC")
    .first();

  return `Written against ${name} ${latest?.title} (${latest?.date}). Changelog: <${domain}/${productId}/changelog.md>`;
}
