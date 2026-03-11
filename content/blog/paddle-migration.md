---
title: Moving to Paddle
description: Kirby Tools is switching from Lemon Squeezy to Paddle for payment processing. Existing licenses are unaffected.
date: "2026-03-10"
badge:
  label: Update
---

When I launched Kirby Tools, Lemon Squeezy was the obvious choice for handling payments. It was built for indie developers, the integration was quick, and as a Merchant of Record it handled all the tax complexity I didn't want to deal with. It worked well for a long time.

Then Stripe acquired Lemon Squeezy in mid-2024. Since then, the platform has largely stagnated – fewer updates, persistent checkout bugs, slower support responses, and an unclear roadmap. I wasn't the only one noticing. Many indie developers have been quietly migrating away over the past year.

So I did the same.

## Why Paddle

[Paddle](https://www.paddle.com) is an established Merchant of Record that powers over 4,000 software companies. It handles global VAT and sales tax, supports more payment methods, and has a mature API that's a pleasure to work with.

The most visible improvement: checkout is now an overlay that stays on kirby.tools. No more redirecting to a third-party page to complete your purchase. It's a small thing, but it makes the experience feel more cohesive.

## What Changes for New Customers

If you're buying a plugin license going forward:

- **Checkout stays on kirby.tools** – an overlay instead of a redirect to Lemon Squeezy.
- **Receipt emails come from Paddle** – not Lemon Squeezy. Your receipt contains your order number, which you'll need to manage your license in the [Hub](https://hub.kirby.tools).
- **Order numbers look different** – something like `81357-10001` instead of a plain number. No functional difference.

Pricing, the 30-day money-back guarantee, and all license terms remain the same. It's a one-time purchase, same as before.

## What Changes for Existing Customers

Nothing. Your license key is unchanged. The [Hub](https://hub.kirby.tools) works exactly as before – log in with your email and the order number from your original Lemon Squeezy receipt.

If you ever need to look up your order number, check the receipt email you got when you purchased. It came from Lemon Squeezy.

## Updated Legal Docs

The [license agreement](/license) and [privacy policy](/privacy-policy) now reference Paddle as the Authorized Reseller. The terms themselves haven't changed in any meaningful way.

## Business as Usual

That's it. Same plugins, same pricing, better checkout. If you run into any issues, [reach out](/contact).
