---
title: License & Plugin Compatibility
description: Gen 1, Gen 2 & Gen 3 licenses, the Kirby 4–6 version matrix, and how to manage your license keys.
navigation.icon: i-ri-key-2-line
---

## How Licenses Work

When you purchase a Kirby Tools plugin, you receive a license key that covers specific plugin versions. Your license generation determines which versions you can use:

- **Generation 1** (before December 2024): Kirby 4 plugin versions
- **Generation 2** (from December 2024): adds Kirby 5 support
- **Generation 3** (from August 2026): adds Kirby 6 support once released

::tip
Each generation includes everything earlier ones covered – a newer license never loses access to older plugin versions, only gains newer ones.
::

Generations align with major Kirby CMS releases. When Kirby ships a new major version, plugins often require significant rewrites – the generation system funds continued development while giving existing customers upgrade discounts.

::card{title="Manage Your Licenses" icon="i-ri-key-2-line" to="https://hub.kirby.tools" target="\_blank"}
View your licenses, check your generation, and get upgrade discounts.
::

## Updates vs Upgrades

### Updates (Free)

Bug fixes, security patches, and minor improvements within your licensed versions. These are always free and automatic via Composer.

### Upgrades (Paid/Discounted)

Moving to a new major plugin version that adds significant features or Kirby compatibility. Upgrades typically coincide with new Kirby releases.

**Why the distinction?** Major Kirby releases often require significant plugin rewrites. The upgrade model lets us continue development while offering existing customers generous discounts.

## Current Status

Every commercial Kirby Tools plugin has a version for Kirby 4 and one for Kirby 5:

| Plugin                   | Kirby 4 Version | Kirby 5 Version |
| ------------------------ | --------------- | --------------- |
| Kirby Copilot            | v1              | v2, v3          |
| Kirby SEO Audit          | v1, v2          | v2, v3          |
| Kirby Content Translator | v2              | v3              |
| Kirby Live Preview       | v1              | v2              |

::callout{icon="i-ri-information-line" color="info"}
Gen 2 licenses already include **Copilot v3** and **SEO Audit v3** – no upgrade needed.
::

<!--
TODO (Kirby 6 launch): Re-introduce the upgrade-discount section here once the
Kirby 6 compatible plugin majors ship. Decided discount: Gen 1 & Gen 2 -> Gen 3
at 50% off (one rule: any generation below the current one).
Note: the Gen 1 -> 50% offer already works in the hub (getDiscountAmount); the
Gen 2 -> 50% offer is intentionally not live yet (a Gen 2 -> Gen 3 buy would grant
nothing until the majors ship) and is stated as a forward promise in the FAQ below.
-->

## Frequently Asked Questions

::accordion

::accordion-item{label="Do I need a new license for Kirby 5?"}
Not necessarily. If you have a Generation 2 license (purchased December 2024+), it already covers Kirby 5 versions. Check your license at [hub.kirby.tools](https://hub.kirby.tools).
::

::accordion-item{label="Do I need a new license for Kirby 6?"}
Kirby 6 support is included with **Generation 3** licenses (purchased from August 2026) once the Kirby 6 compatible plugin versions are released – at no additional cost. Once that happens, Gen 1 and Gen 2 holders will be able to upgrade to Generation 3 at **50% off**. Check your license at [hub.kirby.tools](https://hub.kirby.tools).
::

::accordion-item{label="What's the difference between license generation and plugin version?"}
**License generation** (Gen 1, Gen 2, Gen 3) determines which plugin versions your license covers. **Plugin version** (v1, v2, v3) is the actual version you install.
::

::accordion-item{label="Are v3 plugin versions included with my license?"}
If you have a Gen 2 license, yes – Copilot v3, SEO Audit v3, and Content Translator v3 are all included.
::

::accordion-item{label="Can I use an older plugin version with a new license?"}
Yes. Licenses are backward compatible – you can always use older versions.
::

::accordion-item{label="Can I use a newer plugin version with an old license?"}
Only if your license generation covers it. Check the [version compatibility matrix](#version-compatibility-matrix) below for exact constraints per plugin. If your version isn't covered, you can upgrade – see the options for your license at [hub.kirby.tools](https://hub.kirby.tools).
::

::

## Technical Reference

This section covers implementation details for developers.

### License Key Format

License keys follow the format: `KT{generation}-{hash}-{hash}`. The digit after `KT` is your generation number.

- `KT1-xxxxx-xxxxx`: Generation 1 (before December 2024)
- `KT2-xxxxx-xxxxx`: Generation 2 (December 2024 onwards)
- `KT3-xxxxx-xxxxx`: Generation 3 (August 2026 onwards)

### Version Compatibility Matrix

| Plugin                   | Gen 1 Constraint | Gen 2 Constraint     | Gen 3 Constraint     |
| ------------------------ | ---------------- | -------------------- | -------------------- |
| Kirby Content Translator | `^2`             | `^2 \|\| ^3`         | `^2 \|\| ^3`         |
| Kirby Copilot            | `^1`             | `^1 \|\| ^2 \|\| ^3` | `^1 \|\| ^2 \|\| ^3` |
| Kirby SEO Audit          | `^1`             | `^1 \|\| ^2 \|\| ^3` | `^1 \|\| ^2 \|\| ^3` |
| Kirby Live Preview       | `^1`             | `^1 \|\| ^2`         | `^1 \|\| ^2`         |

Gen 3 currently mirrors Gen 2 – until Kirby 6 ships, both cover the same plugin versions. When each plugin's Kirby 6 compatible major is released, its Gen 3 constraint gains that major (e.g. `… || ^4`) while Gen 2 stays capped at the current one.

<!--
TODO (Kirby 6 launch): when each plugin's Kirby 6 major ships, add it to that
plugin's Gen 3 Constraint column in the matrix above (e.g. add `|| ^4`), change
the Gen 3 row below to "Kirby 4–6", and restore the Upgrade Discount section
(Gen 1 & Gen 2 → Gen 3 at 50%).
-->

### Generation Timeline

| Generation | Purchase Date              | Kirby Compatibility              |
| ---------- | -------------------------- | -------------------------------- |
| Gen 1      | Before Dec 1, 2024         | Kirby 4                          |
| Gen 2      | Dec 1, 2024 – Jul 31, 2026 | Kirby 4 & 5                      |
| Gen 3      | Aug 1, 2026+               | Kirby 4 & 5 (Kirby 6 on release) |
