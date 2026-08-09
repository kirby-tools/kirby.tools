export default defineNitroPlugin((nitroApp) => {
  // With `llms.contentRawMarkdown` off, `@nuxt/content` links every document by
  // its HTML URL. Point them at the Markdown twin instead.
  nitroApp.hooks.hook("llms:generate", (_event, options) => {
    for (const section of options.sections) {
      // Collection-less sections are hand-written, like the `llms-full.txt`
      // entry `nuxt-llms` prepends.
      if (!section.contentCollection) continue;

      for (const link of section.links ?? []) {
        link.href += ".md";
      }
    }
  });
});
