---
title: License & Plugin Compatibility
description: About license and plugin compatibility with Kirby versions.
navigation.icon: i-ri-discount-percent-line
---

Kirby 5 is just around the corner (expected early 2025). You are probably wondering how the new Kirby version will affect your Kirby Tools plugins and when they will be compatible with Kirby 5. Wonder no more! This page explains how the license and plugin compatibility with Kirby versions works.

## Updates & Upgrades

We add new features and improvements to each plugin as we get ideas and feedback. You will receive these updates for the major version you have purchased. When a new major plugin version is released, you will be able to upgrade to that version at a generous discount.

A typical major plugin version is released along with a new major Kirby version. This way, you can upgrade your plugins when you upgrade your Kirby installation.

### Status Quo

As of late 2024, all Kirby Tools plugins are compatible for Kirby 4.

### Upgrade to Kirby 5

Originally, the upgrade to Kirby 5 was supposed to be a free upgrade. In fact, the plugins are compatible up to Kirby 5.0.0-alpha.3. However, during the alpha phase, Kirby introduced breaking changes that will require substantial rework of all plugins. Therefore, the upgrade to Kirby 5 will be a paid upgrade.

::callout{icon="i-ri-discount-percent-fill"}
All customers who have purchased a license for Kirby 4 will receive a **75% discount** on the upgrade to Kirby 5. Go to the [Kirby Tools Hub](https://hub.kirby.tools) to generate your discount code.
::

We will start working on the plugin updates for Kirby 5 as soon as the new Kirby version reaches release candidate status (it may still introduce breaking changes during the beta phase). The updates will be released as soon as possible after the final release of Kirby 5.

## License Compatibility

Licenses you purchase are valid for the current major plugin version and all past versions of the same plugin. This means that you can register past plugin versions with your license, but you cannot register future versions. (Note that past plugin versions might not be actively maintained or supported.)

### License Versioning

Licenses contain a version number that determines which plugin versions you can register with them. The license version is tied to the plugin versions you can register with it. The license version is raised at a specific point in time, and all licenses purchased after that point will be of the new version.

For example, the license key `KT1-ABC-123` has license version 1. It is compatible with Kirby Copilot v1, but not with Kirby Copilot v2. The license key `KT2-DEF-456` has license version 2. It is compatible with Kirby Copilot v1 and v2.

The following table shows the license compatibility for each plugin and license version:

| Plugin                   | License v1 (2024) | License v2 (2025) |
| ------------------------ | ----------------- | ----------------- |
| Kirby Copilot            | `^1`              | `^1 \|\| ^2`      |
| Kirby SEO Audit          | `^1`              | `^1 \|\| ^2`      |
| Kirby Live Preview       | `^1`              | `^1 \|\| ^2`      |
| Kirby Content Translator | `^2`              | `^2 \|\| ^3`      |

### Current License Version

The current license version is `1`.

### Future License Versions

From **January 2025**, all new license purchases will be of license version 2. This means that all new licenses will be compatible with Kirby Copilot v2, Kirby SEO Audit v2, and Kirby Content Translator v3.

## Plugin Compatibility

The license version will be roughly in sync with major Kirby releases. Since potentially breaking changes with each major Kirby release require updates to the plugins, the license version and plugin versions will be updated accordingly.

| Kirby Version | License Version | Plugin Version                                                                           |
| ------------- | --------------- | ---------------------------------------------------------------------------------------- |
| 4.0           | 1               | Kirby Copilot v1, Kirby SEO Audit v1, Kirby Live Preview v1, Kirby Content Translator v2 |
| 5.0           | 2               | Kirby Copilot v2, Kirby SEO Audit v2, Kirby Live Preview v2, Kirby Content Translator v3 |
