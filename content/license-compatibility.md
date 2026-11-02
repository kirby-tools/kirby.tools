---
title: License & Plugin Compatibility
description: Which Kirby versions each license generation covers, the plugin versions per Kirby version, the upgrade discount, and the Composer constraints behind a license key.
navigation.icon: i-ri-key-2-line
---

Every Kirby Tools license belongs to a generation, set by the date you bought it. The generation decides which Kirby versions you can run the plugin on:

| Generation | Purchased                        | Kirby Versions                      |
| ---------- | -------------------------------- | ----------------------------------- |
| Gen 1      | Before December 1, 2024          | Kirby 4                             |
| Gen 2      | December 1, 2024 – July 31, 2026 | Kirby 4 & 5                         |
| Gen 3      | From August 1, 2026              | Kirby 4 & 5 (Kirby 6 when released) |

A newer generation covers every plugin version an older one does. Updates within the versions your license covers are free. A Gen 1 license upgrades to Gen 3 at **50% off**.

::card{title="Manage Your Licenses" icon="i-ri-key-2-line" to="https://hub.kirby.tools" target="\_blank"}
View your licenses, check your generation, and get upgrade discounts.
::

## Plugin Versions per Kirby Version

The current version of every commercial Kirby Tools plugin runs on Kirby 4 and Kirby 5. The older majors run on Kirby 4 only:

| Plugin                   | Kirby 4 Version | Kirby 5 Version |
| ------------------------ | --------------- | --------------- |
| Kirby Copilot            | v1, v2, v3      | v2, v3          |
| Kirby SEO Audit          | v1, v2, v3      | v2, v3          |
| Kirby Content Translator | v2, v3          | v3              |
| Kirby Live Preview       | v1, v2          | v2              |

A major released within a generation is part of it: a Gen 2 license covers Copilot v3, SEO Audit v3, and Content Translator v3.

## Upgrade Discount

Generation 1 licenses upgrade to Generation 3 at **50% off**. Generation 2 licenses get the same discount once the plugin versions for Kirby 6 are released. Sign in at [hub.kirby.tools](https://hub.kirby.tools) with the email address from your purchase and click **50% Upgrade Discount → Upgrade Now** on your license card. The discount code is applied at checkout. Each license gets one single-use code, for its own plugin.

## Updates and Upgrades

An update is a minor or patch release of a major your license covers – bug fixes, security patches, and new features. `composer update` installs it at no cost.

An upgrade moves to a major your generation doesn't cover, usually the one for a new Kirby version. It buys a license of the current generation, at the upgrade discount for an older one.

## Technical Reference

### License Key Format

License keys follow the format `KT{generation}-{hash}-{hash}`: the digit after `KT` is the generation, so `KT3-xxxxx-xxxxx` is a Generation 3 key.

### Version Constraints

A license key activates a plugin version only if the version matches its generation's constraint. For any other version, the Panel shows **License does not cover this plugin version**.

| Plugin                   | Gen 1 Constraint | Gen 2 Constraint     | Gen 3 Constraint     |
| ------------------------ | ---------------- | -------------------- | -------------------- |
| Kirby Content Translator | `^2`             | `^2 \|\| ^3`         | `^2 \|\| ^3`         |
| Kirby Copilot            | `^1`             | `^1 \|\| ^2 \|\| ^3` | `^1 \|\| ^2 \|\| ^3` |
| Kirby SEO Audit          | `^1`             | `^1 \|\| ^2 \|\| ^3` | `^1 \|\| ^2 \|\| ^3` |
| Kirby Live Preview       | `^1`             | `^1 \|\| ^2`         | `^1 \|\| ^2`         |

Gen 3 covers the same versions as Gen 2 until Kirby 6 ships. Each plugin's Kirby 6 major then joins its Gen 3 constraint, while Gen 2 stays where it is.
