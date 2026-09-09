# Kirby Tools

Website, documentation and agent-facing surface for a set of Kirby CMS plugins.

Use the terms from `CONTEXT.md`. Decisions are in `docs/adr/`.

## Commands

```bash
pnpm install             # prepare: fetches Kirby's Panel source, nuxt prepare, logo metrics
pnpm dev                 # localhost:3000
pnpm generate            # full prerender, failOnError – this is what CI deploys
pnpm test                # Vitest, limited to test/**/*.test.ts
pnpm run test:types      # vue-tsc
pnpm run format          # Prettier, runs separately from ESLint and before it in CI
pnpm run lint            # ESLint
pnpm kirby-panel:fetch   # re-fetch Kirby's Panel source after changing kirby.json
```

## Conventions

- `layers/kirby-panel/kirby` is a checkout of Kirby's source, pinned by `kirby.json`, and Kirby's license forbids redistributing it.
- The plugin repositories sit next to this one as `../kirby-<ProductId>`.

## Search Hints

- `PRODUCT_REGISTRY` – the products and their metadata
- `#kirby-panel` – alias to Kirby's Panel source, set by `modules/kirby-panel`
- `PRODUCT_THEME_COLORS` – per-product theming
- `EXHIBITION_PRODUCT_IDS` / `SHOWCASE_PRODUCT_IDS` – which products appear where
