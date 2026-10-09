import { alternatePath } from "#shared/alternate";

export default defineNitroPlugin((nitroApp) => {
  // With `llms.contentRawMarkdown` off, `@nuxt/content` links every document by
  // its HTML URL. Point them at the alternate instead.
  nitroApp.hooks.hook("llms:generate", (_event, options) => {
    for (const section of options.sections) {
      // Collection-less sections are hand-written, like the `llms-full.txt`
      // entry `nuxt-llms` prepends.
      if (!section.contentCollection) continue;

      for (const link of section.links ?? []) {
        link.href = alternatePath(link.href);
      }
    }
  });

  // `llms-full.txt` stringifies each document itself, past the alternates' middleware.
  nitroApp.hooks.hook("content:llms:generate:document", async (event, doc) => {
    const latestDownload = await productPageDownload(event, doc.path);
    const nodes = dropLinkRel(doc.body.value);
    doc.body.value = latestDownload
      ? linkLatestVersion(nodes, latestDownload)
      : nodes;
  });
});
