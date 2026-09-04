import type { SocialCardFormat } from "../shared/social-card.ts";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import { chromium } from "playwright-core";
import { EXHIBITION_PRODUCT_IDS } from "../shared/exhibition.ts";
import { SOCIAL_CARD_FORMATS, socialCardPath } from "../shared/social-card.ts";

const origin = process.env.SOCIAL_CARD_ORIGIN ?? "http://localhost:3000";
const publicDirectory = resolve(import.meta.dirname, "../public");

const isServerUp = await fetch(origin, { method: "HEAD" })
  .then((response) => response.ok)
  .catch(() => false);

if (!isServerUp) {
  console.error(
    `No dev server at ${origin}. Run \`pnpm dev\` first, or point \`SOCIAL_CARD_ORIGIN\` at it.`,
  );
  process.exit(1);
}

await mkdir(resolve(publicDirectory, "social-card"), { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: SOCIAL_CARD_FORMATS["4x3"],
  deviceScaleFactor: 2,
  colorScheme: "light",
});
page.on("pageerror", (error) => console.error(`[chrome] ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") console.error(`[chrome] ${message.text()}`);
});

for (const productId of EXHIBITION_PRODUCT_IDS) {
  for (const format of Object.keys(SOCIAL_CARD_FORMATS) as SocialCardFormat[]) {
    const path = socialCardPath(productId, format);
    await page.goto(`${origin}/${productId}/social-card?format=${format}`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(
      () => new Promise((settle) => requestAnimationFrame(settle)),
    );
    await page.addStyleTag({
      content: "#nuxt-devtools-container { display: none; }",
    });
    await page.locator(".social-card").screenshot({
      path: resolve(publicDirectory, `.${path}`),
      type: "png",
    });
    console.log(path);
  }
}

await browser.close();
