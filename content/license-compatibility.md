---
title: License & Plugin Compatibility
description: About license and plugin compatibility with Kirby versions.
navigation.icon: i-ri-discount-percent-line
---

Kirby 5 has been released! You are probably wondering how the new Kirby version will affect your Kirby Tools plugins and when they will be compatible with Kirby 5. Wonder no more! This page explains how the license and plugin compatibility with Kirby versions works.

::note
**tl;dr**:

- **License Key Version**: All new licenses purchased after 1. December 2024 will be valid for Kirby Copilot v2, Kirby SEO Audit v2, and Kirby Content Translator v3. (The license key version will be raised, see below for details.)
- **Free Upgrade**: Customers who purchased a license after September 1st, 2024 will receive a **free upgrade** to Kirby 5 compatible versions (except Content Translator v3).
- **Upgrade Discount**: All customers will receive a **50% discount** on the upgrade to Kirby Content Translator v3. For other plugins, this discount applies to customers who purchased before September 1st, 2024.

::

## Updates & Upgrades

We add new features and improvements to each plugin as we get ideas and feedback. You will receive these updates for the major version you have purchased. When a new major plugin version is released, you will be able to upgrade to that version at a generous discount.

A typical major plugin version is released along with a new major Kirby version. This way, you can upgrade your plugins when you upgrade your Kirby installation.

### Status Quo

All Kirby Tools plugins are compatible with Kirby 4 and recently have been updated to support Kirby 5.

### Upgrade to Kirby 5 Compatible Versions

The upgrade is available for all plugins and you can upgrade each plugin individually.

#### Free Upgrade for Recent Customers

If you purchased a Kirby Tools plugin license after September 1, 2024, you will receive a **free upgrade** to Kirby 5 compatible versions when they become available (except Content Translator v3). Visit the [Kirby Tools Hub](https://hub.kirby.tools) to generate your upgrade code, which will give you a 100% discount.

::callout{icon="i-ri-information-line" color="info" to="/content-translator"}
Kirby Content Translator v3 is a major update that not only brings compatibility with Kirby 5, but also introduces new features. Therefore, a free upgrade is not available. However, you can upgrade to Content Translator v3 at a 50% discount.
::

#### Upgrade Discount

All customers can get a **50% discount** on the upgrade to Content Translator v3. For other plugins, this discount applies to customers who purchased before September 1st, 2024. Generate your discount code on the [Kirby Tools Hub](https://hub.kirby.tools).

## License Compatibility

Licenses you purchase are valid for the current major plugin version and all past versions of the same plugin. This means that you can register past plugin versions with your license, but you cannot register future versions. (Note that past plugin versions might not be actively maintained or supported.)

### License Key Versioning

Licenses contain a version number that determines which plugin versions you can register with them. The license key version is tied to the plugin versions you can register with it. The license key version is raised at a specific point in time, and all licenses purchased after that point will be of the new version.

For example, the license key `KT1-ABC-123` has license version `1`. It is compatible with Kirby Copilot v1, but not with Kirby Copilot v2. The license key `KT2-DEF-456` has license version `2`. It is compatible with Kirby Copilot v1 _and_ v2.

The following table shows the license compatibility for each plugin and license version:

| Plugin                   | License Key v1 (until 2024-11-30) | License Key v2 (from 2024-12-01) |
| ------------------------ | --------------------------------- | -------------------------------- |
| Kirby Content Translator | `^2`                              | `^2 \|\| ^3`                     |
| Kirby Copilot            | `^1`                              | `^1 \|\| ^2`                     |
| Kirby SEO Audit          | `^1`                              | `^1 \|\| ^2 \|\| ^3`             |
| Kirby Live Preview       | `^1`                              | `^1 \|\| ^2`                     |

### Current License Key Version

The current license key version is `2` (as of 1. December 2024). This means that all new licenses are be compatible with Kirby Copilot v2, Kirby SEO Audit v2, and Kirby Content Translator v3.

## Plugin Compatibility

The license key version will be roughly in sync with major Kirby releases. Since potentially breaking changes with each major Kirby release require updates to the plugins, the license key version and plugin versions will be updated accordingly.

| Kirby Version | License Key Version | Plugin Version                                                                                                                                  |
| ------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.0           | 1                   | Kirby&nbsp;Content&nbsp;Translator&nbsp;v2, Kirby&nbsp;Copilot&nbsp;v1, Kirby&nbsp;SEO&nbsp;Audit&nbsp;v1, Kirby&nbsp;Live&nbsp;Preview&nbsp;v1 |
| 5.0           | 2                   | Kirby&nbsp;Content&nbsp;Translator&nbsp;v3, Kirby&nbsp;Copilot&nbsp;v2, Kirby&nbsp;SEO&nbsp;Audit&nbsp;v2, Kirby&nbsp;Live&nbsp;Preview&nbsp;v2 |
