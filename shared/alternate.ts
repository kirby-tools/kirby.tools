import type { ProductId } from "./products";
import { withoutTrailingSlash } from "ufo";
import { isProductId, PRODUCTS } from "./products";

const SUFFIX = ".md";

/** Prose outside the docs and blog trees that agents get asked about, minus the legal boilerplate. */
const PROSE_PATHS = new Set([
  "/ai",
  "/license",
  "/license/zero-one-edition",
  "/license-compatibility",
]);

export type AlternateCollection = "docs" | "posts" | "pages";

/**
 * What an alternate is rendered from. Callers switch on this to fetch it; only
 * this module decides which pages have one.
 */
export type Alternate =
  | { kind: "collection"; collection: AlternateCollection }
  | { kind: "changelog"; productId: ProductId };

/** Resolves what a page's alternate renders from, or `undefined` for a page without one. */
export function resolveAlternate(path: string): Alternate | undefined {
  const normalizedPath = withoutTrailingSlash(path);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (PROSE_PATHS.has(normalizedPath)) {
    return { kind: "collection", collection: "pages" };
  }

  if (segments.length > 1) {
    if (segments[0] === "docs") {
      return { kind: "collection", collection: "docs" };
    }
    if (segments[0] === "blog") {
      return { kind: "collection", collection: "posts" };
    }
  }

  const [productId, section] = segments;
  if (
    segments.length === 2 &&
    section === "changelog" &&
    isProductId(productId) &&
    PRODUCTS[productId].hasChangelog
  ) {
    return { kind: "changelog", productId };
  }
}

/** Builds the path of the alternate published beside `path`. */
export function alternatePath(path: string): string {
  return `${withoutTrailingSlash(path)}${SUFFIX}`;
}

/** Recovers the page an alternate belongs to, or `undefined` for any other path. */
export function pagePath(path: string): string | undefined {
  return path.endsWith(SUFFIX) ? path.slice(0, -SUFFIX.length) : undefined;
}
