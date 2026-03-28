---
title: License & Plugin Compatibility
description: Gen 1 vs. Gen 2 licenses, Kirby 4 & 5 version matrix, upgrade discounts, and how to manage your license keys.
navigation.icon: i-ri-discount-percent-line
---

## How Licenses Work

When you purchase a Kirby Tools plugin, you receive a license key that covers specific plugin versions. Your license generation determines which versions you can use:

- **Generation 1** (purchased before December 2024): Covers original plugin versions
- **Generation 2** (purchased from December 2024): Covers original + Kirby 5 compatible versions

Generations align with major Kirby CMS releases. When Kirby ships a new major version, plugins often require significant rewrites – the generation system funds continued development while giving existing customers upgrade discounts.

You can always use older plugin versions with newer licenses, but not newer plugin versions with older licenses.

::card{title="Manage Your Licenses" icon="i-ri-key-2-line" to="https://hub.kirby.tools" target="\_blank"}
View your licenses, check your generation, and get upgrade discounts.
::

## Quick Reference

::note

**Summary:**

- All plugins support both Kirby 4 and Kirby 5
- **Upgrade discount**: Gen 1 license holders get 50% off when upgrading
- Manage your licenses at [hub.kirby.tools](https://hub.kirby.tools)

::

## Updates vs Upgrades

### Updates (Free)

Bug fixes, security patches, and minor improvements within your licensed versions. These are always free and automatic via Composer.

### Upgrades (Paid/Discounted)

Moving to a new major plugin version that adds significant features or Kirby compatibility. Upgrades typically coincide with new Kirby releases.

**Why the distinction?** Major Kirby releases often require significant plugin rewrites. The upgrade model lets us continue development while offering existing customers generous discounts.

## Current Status

All Kirby Tools plugins support both Kirby 4 and Kirby 5:

| Plugin                   | Kirby 4 Version | Kirby 5 Version |
| ------------------------ | --------------- | --------------- |
| Kirby Copilot            | v1              | v2, v3          |
| Kirby SEO Audit          | v1, v2          | v2, v3          |
| Kirby Content Translator | v2              | v3              |
| Kirby Live Preview       | v1              | v2              |

::callout{icon="i-ri-information-line" color="info"}
Gen 2 licenses already include **Copilot v3** and **SEO Audit v3** – no upgrade needed. Gen 1 holders can upgrade at 50% off.
::

## Upgrade Discount

Gen 1 license holders receive **50% off** when upgrading to the latest plugin versions. This applies to all plugins.

::steps

### Visit the Hub

Go to [hub.kirby.tools](https://hub.kirby.tools)

### Sign In

Use the email address from your purchase

### Generate Code

Click "Upgrade Discount" on your license card

### Checkout

Your discount code is applied automatically

::

## Frequently Asked Questions

::accordion

::accordion-item{label="Do I need a new license for Kirby 5?"}
Not necessarily. If you have a Generation 2 license (purchased December 2024+), it already covers Kirby 5 versions. Check your license at [hub.kirby.tools](https://hub.kirby.tools).
::

::accordion-item{label="What's the difference between license generation and plugin version?"}
**License generation** (Gen 1, Gen 2) determines which plugin versions your license covers. **Plugin version** (v1, v2, v3) is the actual version you install.
::

::accordion-item{label="Are v3 plugin versions included with my license?"}
If you have a Gen 2 license, yes – Copilot v3, SEO Audit v3, and Content Translator v3 are all included. Gen 1 holders can upgrade to Gen 2 at 50% off to get access to the latest versions.
::

::accordion-item{label="Can I use an older plugin version with a new license?"}
Yes. Licenses are backward compatible – you can always use older versions.
::

::accordion-item{label="Can I use a newer plugin version with an old license?"}
Only if your license generation covers it. Check the [version compatibility matrix](#version-compatibility-matrix) below for exact constraints per plugin. If your version isn't covered, you can upgrade at 50% off.
::

::

## Technical Reference

This section covers implementation details for developers.

### License Key Format

License keys follow the format: `KT{generation}-{hash}-{hash}`. The digit after `KT` is your generation number.

- `KT1-xxxxx-xxxxx`: Generation 1 (before December 2024)
- `KT2-xxxxx-xxxxx`: Generation 2 (December 2024 onwards)

### Version Compatibility Matrix

| Plugin                   | Gen 1 Constraint | Gen 2 Constraint     |
| ------------------------ | ---------------- | -------------------- |
| Kirby Content Translator | `^2`             | `^2 \|\| ^3`         |
| Kirby Copilot            | `^1`             | `^1 \|\| ^2 \|\| ^3` |
| Kirby SEO Audit          | `^1`             | `^1 \|\| ^2 \|\| ^3` |
| Kirby Live Preview       | `^1`             | `^1 \|\| ^2`         |

### Generation Timeline

| Generation | Purchase Date      | Kirby Compatibility |
| ---------- | ------------------ | ------------------- |
| Gen 1      | Before Dec 1, 2024 | Kirby 4             |
| Gen 2      | Dec 1, 2024+       | Kirby 4 & 5         |
