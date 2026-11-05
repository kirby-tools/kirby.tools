---
title: License & Plugin Compatibility
description: Which plugin versions each license generation covers, which Kirby versions they run on, the upgrade discount, and the Composer constraints behind a license key.
navigation.icon: i-ri-key-2-line
---

Every Kirby Tools license belongs to a generation, set by the date you bought it. The generation decides which plugin versions the license covers, and with them the Kirby versions you can run:

| Generation | Purchased                        | Kirby Versions |
| ---------- | -------------------------------- | -------------- |
| Gen 1      | Before December 1, 2024          | Kirby 4        |
| Gen 2      | December 1, 2024 – July 31, 2026 | Kirby 4 & 5    |
| Gen 3      | From August 1, 2026              | Kirby 4–6      |

A newer generation covers every plugin version an older one does. Updates within the versions your license covers are free. A Gen 1 or Gen 2 license upgrades to Gen 3 at **50% off**.

::card{title="Manage Your Licenses" icon="i-ri-key-2-line" to="https://hub.kirby.tools" target="\_blank"}
View your licenses, check your generation, and get upgrade discounts.
::

## Plugin Versions per Kirby Version

Every commercial Kirby Tools plugin has one major for Kirby 6, and it runs on Kirby 6 only. The earlier majors run on Kirby 4, Kirby 5, or both:

| Plugin                   | Kirby 4 Version | Kirby 5 Version | Kirby 6 Version |
| ------------------------ | --------------- | --------------- | --------------- |
| Kirby Copilot            | v1, v2, v3      | v2, v3          | v4              |
| Kirby SEO Audit          | v1, v2, v3      | v2, v3          | v4              |
| Kirby Content Translator | v2, v3          | v3              | v4              |
| Kirby Live Preview       | v1, v2          | v2              | v3              |

A major released within a generation is part of it: a Gen 2 license covers Copilot v3, SEO Audit v3, and Content Translator v3.

## Upgrade Discount

Generation 1 and Generation 2 licenses upgrade to Generation 3 at **50% off** – the discount applies to any generation below the current one. Sign in at [hub.kirby.tools](https://hub.kirby.tools) with the email address from your purchase and click **50% Upgrade Discount → Upgrade Now** on your license card. The discount code is applied at checkout. Each license gets one single-use code, for its own plugin.

::callout{icon="i-ri-arrow-up-circle-line" to="/upgrading-to-kirby-6"}
Upgrading to Kirby 6 – the PHP versions, the license, and the blueprint change for each plugin
::

## Updates and Upgrades

An update is a minor or patch release of a major your license covers – bug fixes, security patches, and new features. `composer update` installs it at no cost.

An upgrade moves to a major your generation doesn't cover, usually the one for a new Kirby version. It buys a license of the current generation, at the upgrade discount for an older one.

## Technical Reference

### License Key Format

License keys follow the format `KT{generation}-{hash}-{hash}`: the digit after `KT` is the generation, so `KT3-xxxxx-xxxxx` is a Generation 3 key.

### Version Constraints

A license key activates a plugin version only if the version matches its generation's constraint. For any other version, the Panel shows **License does not cover this plugin version**.

| Plugin                   | Gen 1 Constraint | Gen 2 Constraint     | Gen 3 Constraint             |
| ------------------------ | ---------------- | -------------------- | ---------------------------- |
| Kirby Content Translator | `^2`             | `^2 \|\| ^3`         | `^2 \|\| ^3 \|\| ^4`         |
| Kirby Copilot            | `^1`             | `^1 \|\| ^2 \|\| ^3` | `^1 \|\| ^2 \|\| ^3 \|\| ^4` |
| Kirby SEO Audit          | `^1`             | `^1 \|\| ^2 \|\| ^3` | `^1 \|\| ^2 \|\| ^3 \|\| ^4` |
| Kirby Live Preview       | `^1`             | `^1 \|\| ^2`         | `^1 \|\| ^2 \|\| ^3`         |

Gen 3 adds each plugin's Kirby 6 major to the versions Gen 2 covers.
