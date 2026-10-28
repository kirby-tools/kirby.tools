# Kirby Tools

Website, documentation and agent-facing surface for a set of Kirby CMS plugins.

Use the terms from `GLOSSARY.md`. Decisions are in `docs/adr/`.

## Commands

```bash
pnpm install             # prepare: fetches Kirby's Panel source, nuxt prepare, logo metrics
pnpm dev                 # localhost:3000
pnpm generate            # full prerender, failOnError – this is what CI deploys
pnpm test                # Vitest, limited to test/**/*.test.ts
pnpm run test:types      # vue-tsc
pnpm run format          # Prettier, runs separately from ESLint and before it in CI
pnpm run lint            # ESLint
pnpm kirby-panel:fetch   # re-fetch Kirby's and the plugins' Panel source after changing kirby.json or plugins.json
```

## Conventions

- `layers/kirby-panel/kirby` is a checkout of Kirby's source, pinned by `kirby.json`, and Kirby's license forbids redistributing it.
- The plugin repositories sit next to this one as `../kirby-<ProductId>`.
- `layers/kirby-panel/plugins.json` pins each plugin's Panel source, which the site compiles itself; a pinned ref must carry `src/panel/site.ts` and `index.css`. The clone resolves its imports from this repo's `node_modules`, so a plugin's Panel runtime dependencies belong in `package.json`. `KIRBY_PANEL_LOCAL_PLUGINS=<ProductId>,…` compiles the sibling checkout instead; its `index.css` is only as current as its last build.

## Search Hints

- `PRODUCT_REGISTRY` – the products and their metadata
- `#kirby-panel` – alias to Kirby's Panel source, set by `modules/kirby-panel`
- `#kirby-plugin/<ProductId>` – alias to a plugin's site barrel, set by the same module
- `PRODUCT_THEME_COLORS` – per-product theming
- `EXHIBITION_PRODUCT_IDS` / `SHOWCASE_PRODUCT_IDS` – which products appear where
