---
title: License & Plugin Compatibility
description: About license and plugin compatibility with Kirby versions.
navigation.icon: i-ri-discount-percent-line
---

Kirby 5 is just around the corner (expected early 2025). You are probably wondering how the new Kirby version will affect your Kirby Tools plugins and when they will be compatible with Kirby 5. Wonder no more! This page explains how the license and plugin compatibility with Kirby versions works.

::callout{icon="i-ri-information-line"}
**tl;dr**:

- **License Key Version**: All new licenses purchased after 1. December 2024 will be valid for Kirby Copilot v2, Kirby SEO Audit v2, and Kirby Content Translator v3. (The license key version will be raised, see below for details.)
- **Upgrade Discount**: All customers who have purchased a license for Kirby 4 will receive a **50% discount** on the upgrade to Kirby 5. Your discount code will be available on the [Kirby Tools Hub](https://hub.kirby.tools) in early 2025.

::

## Updates & Upgrades

We add new features and improvements to each plugin as we get ideas and feedback. You will receive these updates for the major version you have purchased. When a new major plugin version is released, you will be able to upgrade to that version at a generous discount.

A typical major plugin version is released along with a new major Kirby version. This way, you can upgrade your plugins when you upgrade your Kirby installation.

### Status Quo

As of late 2024, all Kirby Tools plugins are compatible for Kirby 4.

### Upgrade to Kirby 5

Originally, the upgrade to Kirby 5 was supposed to be a free upgrade. In fact, the plugins are compatible up to Kirby `5.0.0-alpha.3`. However, during the alpha phase, Kirby introduced breaking changes that will require substantial rework of all plugins. Therefore, the upgrade to Kirby 5 will be a paid upgrade. We are sorry for the inconvenience this may cause.

::card{icon="i-ri-discount-percent-fill" to="https://hub.kirby.tools"}
Go to [Kirby Tools Hub](https://hub.kirby.tools) to generate your **50% discount code** for the upgrade to Kirby 5.
::

We will start working on the plugin updates for Kirby 5 as soon as the new Kirby version reaches release candidate status (it may still introduce breaking changes during the beta phase). The updates will be released as soon as possible after the final release of Kirby 5.

## License Compatibility

Licenses you purchase are valid for the current major plugin version and all past versions of the same plugin. This means that you can register past plugin versions with your license, but you cannot register future versions. (Note that past plugin versions might not be actively maintained or supported.)

### License Key Versioning

Licenses contain a version number that determines which plugin versions you can register with them. The license key version is tied to the plugin versions you can register with it. The license key version is raised at a specific point in time, and all licenses purchased after that point will be of the new version.

For example, the license key `KT1-ABC-123` has license version `1`. It is compatible with Kirby Copilot v1, but not with Kirby Copilot v2. The license key `KT2-DEF-456` has license version `2`. It is compatible with Kirby Copilot v1 _and_ v2.

The following table shows the license compatibility for each plugin and license version:

| Plugin                   | License Key v1 (until 2024-11-30) | License Key v2 (from 2024-12-01) |
| ------------------------ | --------------------------------- | -------------------------------- |
| Kirby Copilot            | `^1`                              | `^1 \|\| ^2`                     |
| Kirby SEO Audit          | `^1`                              | `^1 \|\| ^2`                     |
| Kirby Live Preview       | `^1`                              | `^1 \|\| ^2`                     |
| Kirby Content Translator | `^2`                              | `^2 \|\| ^3`                     |

### Current License Key Version

The current license key version is `1`.

### Future License Key Versions

From **1. December 2024**, all new license purchases will be of license key version `2`. This means that all new licenses will be compatible with Kirby Copilot v2, Kirby SEO Audit v2, and Kirby Content Translator v3 when they are released.

## Plugin Compatibility

The license key version will be roughly in sync with major Kirby releases. Since potentially breaking changes with each major Kirby release require updates to the plugins, the license key version and plugin versions will be updated accordingly.

| Kirby Version | License Key Version | Plugin Version                                                                                            |
| ------------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| 4.0           | 1                   | Kirby&nbsp;Copilot&nbsp;v1, Kirby&nbsp;SEO&nbsp;Audit&nbsp;v1, Kirby&nbsp;Content&nbsp;Translator&nbsp;v2 |
| 5.0           | 2                   | Kirby&nbsp;Copilot&nbsp;v2, Kirby&nbsp;SEO&nbsp;Audit&nbsp;v2, Kirby&nbsp;Content&nbsp;Translator&nbsp;v3 |

### Kirby Live Preview

Since Kirby 5 introduces a live preview as a core feature, the Kirby Live Preview plugin will probably be discontinued. The plugin will still be available for download, but it will not receive any updates or support.

Do you require support for Kirby 5? Please let us know by [contacting us](/contact) and we will update the plugin accordingly.
