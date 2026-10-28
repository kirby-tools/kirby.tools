import { access, readFile } from "node:fs/promises";
import { relative } from "node:path";
import process from "node:process";
import {
  addPlugin,
  addVitePlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
} from "@nuxt/kit";
import { kirbyAliasPlugin, kirbyCssPlugin, PLUGIN_CSS_LAYER } from "./vite";

const LOCAL_PLUGINS_ENV = "KIRBY_PANEL_LOCAL_PLUGINS";

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

    const plugins = await resolvePlugins(nuxt.options.rootDir, resolve);

    nuxt.options.alias["#kirby-panel"] = srcDir;
    nuxt.options.alias["#panel-mock"] = resolve("../../runtime");
    for (const { id, dir, barrel } of plugins) {
      nuxt.options.alias[`#kirby-plugin/${id}`] = barrel;
      // The prerender inlines only CSS a `.vue` file or the entry imports.
      nuxt.options.css.push(`${dir}/index.css`);
    }

    addVitePlugin(kirbyAliasPlugin(srcDir));
    addVitePlugin(kirbyCssPlugin([srcDir]));
    addVitePlugin(
      kirbyCssPlugin(
        plugins.map(({ dir }) => dir),
        PLUGIN_CSS_LAYER,
      ),
    );

    const localDirs = plugins
      .filter(({ isLocal }) => isLocal)
      .map(({ dir }) => dir);
    if (localDirs.length > 0) {
      extendViteConfig((config) => {
        config.server!.fs!.allow!.push(...localDirs);
      });
    }

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
      delete tsConfig.compilerOptions?.paths?.["#kirby-panel"];
      delete tsConfig.compilerOptions?.paths?.["#kirby-panel/*"];

      tsConfig.include ??= [];
      for (const { dir } of plugins) {
        tsConfig.include.push(
          `${relative(nuxt.options.buildDir, dir)}/src/panel/site.ts`,
        );
      }
    });
  },
});

async function resolvePlugins(
  rootDir: string,
  resolve: (path: string) => string,
) {
  const pins: Record<string, unknown> = JSON.parse(
    await readFile(resolve("../../plugins.json"), "utf8"),
  );
  const localIds = new Set(
    process.env[LOCAL_PLUGINS_ENV]?.split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
  for (const id of localIds) {
    if (!(id in pins)) {
      throw new Error(
        `"${id}" in \`${LOCAL_PLUGINS_ENV}\` is no plugin in \`plugins.json\`.`,
      );
    }
  }

  return Promise.all(
    Object.keys(pins).map(async (id) => {
      const isLocal = localIds.has(id);
      const dir = isLocal
        ? resolve(`${rootDir}/../kirby-${id}`)
        : resolve(`../../plugins/${id}`);
      const barrel = `${dir}/src/panel/site.ts`;

      for (const file of [barrel, `${dir}/index.css`]) {
        try {
          await access(file);
        } catch {
          throw new Error(
            isLocal
              ? `\`${file}\` is missing. Check out a branch of kirby-${id} that has it, or drop "${id}" from \`${LOCAL_PLUGINS_ENV}\`.`
              : `\`${file}\` is missing. Run \`pnpm kirby-panel:fetch\`, or pin a commit of kirby-${id} in \`plugins.json\` that has it.`,
          );
        }
      }

      return { id, dir, barrel, isLocal };
    }),
  );
}
