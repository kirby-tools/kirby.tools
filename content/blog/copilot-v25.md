---
title: Kirby Copilot v2.5 – Beyond Single Fields
description: Multi-field generation fills several fields from one prompt, and custom blocks generate from your own blueprints.
date: "2025-09-05"
product: copilot
badge:
  label: Release
---

The first versions of Kirby Copilot had a limitation I felt every time I used it myself: one field at a time. Open the prompt dialog, generate text for a single writer or textarea field, repeat for the next one. That is not how anyone writes a page. The title, the intro and the meta description are one thought, not three.

Versions 2.4 and 2.5 change that.

## Multi-Field Generation

v2.5 adds a Panel view button that opens the prompt dialog from anywhere in the Panel, not just from within a field. From there you select the fields you want filled: page title, meta description, intro text, whatever your blueprint defines. One prompt, several outputs.

Copilot reads your blueprint for this. It knows which fields exist on the current page, what types they are, and how they relate to each other. Ask for three fields at once and the results fit together, instead of three isolated texts that happen to share a topic. Write a prompt that says what the page should communicate, let it draft everything, edit from there.

[Learn more about multi-field generation](/docs/copilot/usage/view-button)

## Custom Blocks Support

Before v2.4, Copilot could generate standard blocks – text, headings, images, lists. But custom blocks, the ones you define in your own project, were invisible to it. If you had a `testimonial` block with `quote`, `author`, and `role` fields, Copilot couldn't produce it.

v2.4 solves this with JSON schema-based object generation. Copilot reads the block definitions from your Kirby project, custom block types included, and generates structured data that matches their field structure exactly. The same approach works for layout fields.

In practice, Copilot can now generate entire page layouts in your project's own block vocabulary.

[Read the custom blocks documentation](/docs/copilot/advanced/blocks-and-layouts)

## What This Means

Together, the two change what I use Copilot for. Instead of a paragraph here and there, it drafts a full page in one pass: metadata, body content and custom blocks. Editors start from a draft of the whole page instead of a blank one.

Both updates are free for anyone with a v2 license. If you're on v1, check the [Hub](https://hub.kirby.tools) for upgrade options.
