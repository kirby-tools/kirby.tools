import type { NitroRouteConfig } from "nitropack";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineNuxtModule, useLogger } from "nuxt/kit";

// Cloudflare silently ignores every rule past this limit.
const MAX_HEADER_RULES = 100;

/**
 * Translates the redirect and header `routeRules` into the files Cloudflare's
 * asset router reads.
 *
 * @see https://developers.cloudflare.com/workers/static-assets/redirects/
 * @see https://developers.cloudflare.com/workers/static-assets/headers/
 */
export default defineNuxtModule({
  meta: {
    name: "cloudflareAssets",
  },
  setup(_options, nuxt) {
    if (nuxt.options.dev) return;

    const logger = useLogger("cloudflare-assets");

    nuxt.hook("nitro:init", (nitro) => {
      // The output directory is only complete once prerendering is done.
      nitro.hooks.hook("prerender:done", async () => {
        const publicDir = nitro.options.output.publicDir;
        const routeRules = nuxt.options.routeRules ?? {};

        const redirects = collectRedirects(routeRules);
        const headers = collectHeaders(routeRules);

        await writeFile(
          join(publicDir, "_redirects"),
          formatRedirects(redirects),
          "utf8",
        );
        await writeFile(
          join(publicDir, "_headers"),
          formatHeaders(headers),
          "utf8",
        );

        const removedCount = await removeRedirectStubs(publicDir, redirects);

        logger.success(
          `Wrote ${redirects.length} redirects and ${headers.length} header rules, removed ${removedCount} redirect stubs`,
        );
      });
    });
  },
});

interface Redirect {
  from: string;
  to: string;
  statusCode: number;
}

interface HeaderRule {
  pattern: string;
  headers: Record<string, string>;
}

function collectRedirects(
  routeRules: Record<string, NitroRouteConfig>,
): Redirect[] {
  const redirects: Redirect[] = [];

  for (const [from, rule] of Object.entries(routeRules)) {
    const redirect = rule?.redirect;
    if (!redirect) continue;

    // A `_redirects` splat is `*` and needs an explicit `:splat` in the
    // target, so Nitro's `**` has no mechanical translation.
    if (from.includes("*")) {
      throw new Error(
        `Cannot translate the wildcard redirect \`${from}\` into a \`_redirects\` rule. Write it out in \`public/_redirects\` instead.`,
      );
    }

    redirects.push(
      typeof redirect === "string"
        ? // A bare string is a page that moved for good.
          { from, to: redirect, statusCode: 301 }
        : { from, to: redirect.to, statusCode: redirect.statusCode ?? 301 },
    );
  }

  return redirects;
}

function collectHeaders(
  routeRules: Record<string, NitroRouteConfig>,
): HeaderRule[] {
  const rules: HeaderRule[] = [];

  for (const [pattern, rule] of Object.entries(routeRules)) {
    const headers = rule?.headers;
    if (!headers || Object.keys(headers).length === 0) continue;

    rules.push({ pattern: toAssetPattern(pattern), headers });
  }

  if (rules.length > MAX_HEADER_RULES) {
    throw new Error(
      `Collected ${rules.length} header rules, but \`_headers\` holds at most ${MAX_HEADER_RULES}.`,
    );
  }

  return rules;
}

function formatRedirects(redirects: Redirect[]): string {
  const lines = redirects.map(
    ({ from, to, statusCode }) => `${from} ${to} ${statusCode}`,
  );

  return `${lines.join("\n")}\n`;
}

function formatHeaders(rules: HeaderRule[]): string {
  const blocks = rules.map(({ pattern, headers }) =>
    [
      pattern,
      ...Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`),
    ].join("\n"),
  );

  return `${blocks.join("\n\n")}\n`;
}

/**
 * Deletes the meta refresh pages Nitro prerenders for redirect rules. The
 * `_redirects` file takes precedence over them, so they would only drift.
 */
async function removeRedirectStubs(
  publicDir: string,
  redirects: Redirect[],
): Promise<number> {
  let removedCount = 0;

  for (const { from } of redirects) {
    const file = join(publicDir, from, "index.html");

    let contents: string;
    try {
      contents = await readFile(file, "utf8");
    } catch {
      continue;
    }

    if (!contents.includes('<meta http-equiv="refresh"')) continue;

    await rm(file);
    removedCount++;
  }

  return removedCount;
}

/**
 * Rewrites a Nitro route pattern for Cloudflare's asset router, whose splat is
 * a single `*` and already matches across slashes.
 */
function toAssetPattern(pattern: string): string {
  return pattern.replaceAll("**", "*");
}
