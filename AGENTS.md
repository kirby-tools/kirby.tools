# Kirby Tools

Website, documentation and agent-facing surface for a set of Kirby CMS plugins.

Use the terms from `GLOSSARY.md`. Decisions are in `docs/adr/`.

## Commands

```bash
pnpm install             # prepare: fetches the Panel sources, nuxt prepare, logo metrics
pnpm generate            # full prerender, failOnError – this is what CI deploys
pnpm test                # runs test/**/*.test.ts only
pnpm run test:types
pnpm run format          # Prettier, runs separately from ESLint and before it in CI
pnpm run lint
pnpm kirby-panel:fetch   # after changing kirby.json or plugins.json
```

## Conventions

- `layers/kirby-panel/kirby` is a checkout of Kirby's source, pinned by `kirby.json`, and Kirby's license forbids redistributing it.
- The plugin repositories sit next to this one as `../kirby-<ProductId>`.
- `KIRBY_PANEL_LOCAL_PLUGINS=<ProductId>,…` compiles the sibling checkout instead of the `plugins.json` pin; its `index.css` is only as current as its last build.
