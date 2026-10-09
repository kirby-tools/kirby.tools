import type { H3Event } from "h3";
import type { ProductDownload, ProductId } from "#shared/products";
import { queryCollection } from "@nuxt/content/server";
import {
  productDownload,
  PRODUCTS,
  productVersionsPattern,
  resolveProductId,
} from "#shared/products";

export async function queryLatestProductVersion(
  event: H3Event,
  productId: ProductId,
) {
  if (!PRODUCTS[productId].hasChangelog) return null;

  return queryCollection(event, "versions")
    .select("title", "date")
    .where("path", "LIKE", productVersionsPattern(productId))
    .order("date", "DESC")
    .order("title", "DESC")
    .first();
}

/** Resolves the download link of the product a page belongs to, or `undefined` off a product page. */
export async function productPageDownload(
  event: H3Event,
  path: string,
): Promise<ProductDownload | undefined> {
  const productId = resolveProductId(path);
  if (!productId) return;

  const latestVersion = await queryLatestProductVersion(event, productId);
  return productDownload(productId, latestVersion?.title);
}
