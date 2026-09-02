---
name: kirby-panel-mock-styles
description: Styling a Kirby Panel mock (`Panel*.vue` under `layers/kirby-panel/app/components/`): where a rule goes, how to spell it so it compiles in the plugin too, and what to check it against. Don't use for the docs site's own components under `app/components/`.
---

# Panel Mock Styling

The mocks render Kirby's Panel from Kirby's own components, so a rule spends Kirby's tokens wherever Kirby has one. Three places it can live, in the order to try them: a class Kirby already ships, a Tailwind utility on the element the mock renders, a `<style>` block for everything else.

Kirby's whole sheet sits in the `kirby` cascade layer, below `utilities` (`app/assets/css/main.css`), so a utility beats any Kirby rule on the same element, whatever the specificity.

## Borrowed Kirby Classes

Kirby ships styling that no component exposes: `.k-button-badge` lives in the style block of `Navigation/Button.vue`. Every component in `runtime/components.ts` carries its styles into the bundle, so those classes are available on any element. Put the class on the element and add utilities for the declarations that differ, the way `PanelAuditResult.vue` does with `k-button-badge static transform-none shadow-none`.

## Tailwind

A rule over an element the mock itself renders goes on that element as a utility. Spend Kirby's token through the `(--var)` shorthand, and take the bracket form where the shorthand cannot carry it:

```
gap-(--spacing-2)
text-[length:var(--text-font-size)]/[var(--text-line-height)]
text-[color:var(--color-text-dimmed)]
```

Kirby's scale is coarse and its steps are declared in `layers/kirby-panel/kirby/panel/src/styles/config/`. Off-scale steps (`gap-1.5`, `size-3`) and anything outside the Panel – the figure's own page margin – take the plain utility.

A class mirrored from a plugin has to mean the same on both sides, and kirbyup's UnoCSS `presetWind3` disagrees with Tailwind v4 three ways: it parses neither the `(--var)` shorthand nor a prefixed variant, and it compiles `space-y-*` to `> :not([hidden]) ~ :not([hidden])` where v4 emits `:not(:last-child)`, leaving the last child to Kirby on one side only. So the token takes its bracket form, the prefix goes on the utility alone, and a child selector is spelled out: `[&>div+div]:mt-[var(--spacing-4)]` here, `[&>div+div]:ksr-mt-[var(--spacing-4)]` there.

## `<style>`

A rule earns a block when it

- reaches an element the mock does not render – `.panel-preview .k-section-header:last-child`
- needs a selector no element can carry – `:has()`, an attribute selector, `@container`, a media query
- sets a custom property – `--dialog-padding`, `--button-color-back`

Scope it under `.panel-preview`: Kirby's own selectors are rewritten to that prefix, and the rule should reach nothing outside a preview. Keep the mock's hook class (`.panel-section-body`, `.panel-audit-result`) on the element so sibling mocks can target it.

A mock renders into the Stage, `.panel-preview-stage`. A rule about what the Panel would supply around a component reaches it from the mock's own block: `.panel-preview .panel-preview-stage:has(> .panel-dialog)`. A container query names `panel-stage`: Kirby's dialogs are containers too, and an unnamed query measures whichever is nearest.

A block that departs from Kirby names what Kirby does and why the mock differs, the way `PanelSection.vue` does: the Panel always has a section body, so Kirby reserves the gap below a header unconditionally, and a mock cropped to the header alone would sit off-center.

## Checking a Mock

A running plugin playground is authoritative for the plugin's own markup. For Kirby's rendering it is not: the playgrounds run Kirby 5 against mocks built on 6, and a view-button dropdown that aligns `start` in 5 aligns `end` in 6. Measure Kirby against a worktree of `origin/v6/develop` served with `php -S`; its templates, props and defaults are also readable in `layers/kirby-panel/kirby`.
