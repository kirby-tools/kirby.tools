---
title: Going Open Source with Commercial Plugins
description: How and why Kirby Tools plugins moved from a private Composer repo to Packagist and open source.
date: "2024-06-18"
badge:
  label: Update
---

When I first added Composer support to Kirby Tools in April 2024, the approach was straightforward: a private Satis repository at `repo.kirby.tools` that required authentication for every install. You'd log into the [Hub](https://hub.kirby.tools), grab a license code, configure the repository in your `composer.json`, and authenticate. It worked, but it was cumbersome – especially for teams where multiple developers needed access.

Two months later, I rethought the whole thing.

## From Private Repo to Packagist

The private Composer registry was the safe choice. Commercial plugins behind authentication – makes sense on paper. In practice, it created friction at every step: initial setup, CI pipelines, onboarding new team members. Every `composer install` on a fresh machine meant configuring credentials first.

The fix was simpler than expected. All plugins are now available on [Packagist](https://packagist.org) and can be installed without authentication. A standard `composer require` is all it takes. License keys are still required in production environments, but the installation itself is open.

## In-Panel License Activation

With the move to Packagist, the license activation needed to change too. Instead of managing credentials in `auth.json` at the project root, each plugin now handles activation directly in the Kirby Panel. Buy a plugin, install it via Composer, open the Panel – and you'll see an activation form right in the plugin's section.

For existing users, the migration is automatic: open a Panel page that contains a plugin section, and the license key moves from `auth.json` to its new location in `/site/config/.kirby-tools-licenses`. One less thing to think about.

## Opening the Source

This was the bigger decision. Kirby itself has always been open source with a commercial license – you can read every line of code, but you need a license to use it in production. It's a model that works well and one the community respects.

I wanted to follow the same approach. All plugin source code is now available on the [Kirby Tools GitHub organization](https://github.com/kirby-tools). You can browse the code, open issues, and submit pull requests. The commercial license still applies – viewing the source doesn't mean free use – but transparency is better for everyone. Developers can evaluate what they're buying, debug issues in their own projects, and contribute fixes back.

## What Stayed the Same

License keys haven't changed. If you bought a plugin before this update, your key still works. The [Hub](https://hub.kirby.tools) still manages everything. The only difference is how plugins reach your project – and that part got simpler.
