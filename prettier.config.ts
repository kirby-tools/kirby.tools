import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

export default {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/assets/css/main.css",
  tailwindAttributes: ["ui"],
  tailwindFunctions: ["defineAppConfig"],
} satisfies Config & PluginOptions;
