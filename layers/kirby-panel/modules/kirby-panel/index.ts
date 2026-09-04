import { access } from "node:fs/promises";
import {
  addPlugin,
  addVitePlugin,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";
import { kirbyAliasPlugin, kirbyCssPlugin } from "./vite";

export default defineNuxtModule({
  meta: {
    name: "kirby-panel",
    configKey: "kirbyPanel",
  },

  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    const panelDir = resolve("../../kirby/panel");
    const srcDir = `${panelDir}/src`;

    try {
      await access(srcDir);
    } catch {
      throw new Error(
        "Kirby's Panel source is missing. Run `pnpm kirby-panel:fetch` and try again.",
      );
    }

    nuxt.options.alias["#kirby-panel"] = srcDir;
    nuxt.options.alias["#panel-mock"] = resolve("../../runtime");

    addVitePlugin(kirbyAliasPlugin(srcDir));
    addVitePlugin(kirbyCssPlugin(srcDir));

    // `k-icon` builds its `<use href>` from `$panel.urls.icons`, so Kirby's sprite
    // has to be served under that prefix.
    nuxt.options.nitro.publicAssets ??= [];
    nuxt.options.nitro.publicAssets.push({
      dir: `${panelDir}/public/img`,
      baseURL: "/_kirby",
      maxAge: 60 * 60 * 24 * 7,
    });

    addPlugin(resolve("../../runtime/plugin"));

    nuxt.hook("prepare:types", ({ tsConfig }) => {
      delete tsConfig.compilerOptions?.paths["#kirby-panel"];
      delete tsConfig.compilerOptions?.paths["#kirby-panel/*"];
    });
  },
});
