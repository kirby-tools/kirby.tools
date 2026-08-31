---
name: kirby-panel-mock-styles
description: Where styling goes in the Kirby Panel mock components under `layers/kirby-panel/app/components/` – Tailwind utility versus `<style>` block, and which tokens to spend. Use when adding a `Panel*.vue` mock, changing one's appearance, or deciding where a new rule belongs. Don't use for the docs site's own components outside that path.
---

# Panel Mock Styling

The mocks render Kirby's Panel from Kirby's own components, so a rule spends Kirby's tokens wherever Kirby has one. Which element the rule is about decides where it lives.

Kirby's whole sheet sits in the `kirby` cascade layer, below `utilities` (`app/assets/css/main.css`), so a utility beats any Kirby rule on the same element, whatever the specificity.

## Tailwind

A rule over an element the mock itself renders goes on that element as a utility. Spend Kirby's token through the `(--var)` shorthand, and take the bracket form where the shorthand cannot carry it:

```
gap-(--spacing-2)
text-[length:var(--text-font-size)]/[var(--text-line-height)]
text-[color:var(--color-text-dimmed)]
```

Kirby's scale is coarse and its steps are declared in `layers/kirby-panel/kirby/panel/src/styles/config/`. Off-scale steps (`gap-1.5`, `size-3`) and anything outside the Panel – the `.panel-preview` chrome, the figure's own page margin – take the plain utility.

Kirby declares no bare `--spacing`, which is the variable Tailwind v4 computes its scale from, so utilities resolve identically inside and outside `.panel-preview`.

## `<style>`

A rule earns a block when it

- reaches an element the mock does not render – `.panel-preview .k-section-header:last-child`
- needs a selector no element can carry – `:has()`, an attribute selector, `@container`, a media query
- sets a custom property – `--dialog-padding`, `--button-color-back`

Scope it under `.panel-preview` where it competes with Kirby's own rule, and keep the mock's hook class (`.panel-section-body`, `.panel-audit-result`) on the element so sibling mocks can target it.

## Borrowed Kirby Classes

Kirby ships styling that no component exposes: `.k-button-badge` lives in the style block of `Navigation/Button.vue`. Every component in `runtime/components.ts` carries its styles into the bundle, so those classes are available on any element. Put the class on the element and add utilities for the declarations that differ.

## Plugin Panel CSS

`kirby-copilot`, `kirby-seo-audit` and the rest build with kirbyup, which runs UnoCSS behind a per-plugin prefix and `preflight: false` – each repo's `uno.config.*` names its own. Their output is unlayered and loads after the Panel's own sheet, so a prefixed utility overrides Kirby there too and the borrowing pattern applies, written `ksr-static ksr-transform-none`. With preflight off, `ksr-shadow-none` declares no `--un-*` variables and silently does nothing – write `ksr-[box-shadow:none]`.
