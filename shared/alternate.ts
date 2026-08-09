import type { ProductId } from "./constants";
import { withoutTrailingSlash } from "ufo";
import { isProductId, PRODUCTS } from "./constants";

const SUFFIX = ".md";

/**
 * What an alternate is rendered from. Callers switch on this to fetch it; only
 * this module decides which pages have one.
 */
export type Alternate =
  | { kind: "collection"; collection: "docs" | "posts" }
  | { kind: "changelog"; productId: ProductId };

/** Resolves what a page's alternate renders from, or `undefined` for a page without one. */
export function resolveAlternate(path: string): Alternate | undefined {
  const segments = withoutTrailingSlash(path).split("/").filter(Boolean);

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
