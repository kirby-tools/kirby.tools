---
title: Kirby Copilot v2.5 – Beyond Single Fields
description: Multi-field generation and custom blocks support turn Copilot into a proper content generation tool for the Kirby Panel.
date: "2025-09-05"
badge:
  label: Release
---

The first versions of Kirby Copilot had a clear limitation: one field at a time. You'd open the prompt dialog, generate text for a single writer or textarea field, and repeat the process for the next one. It was useful, but it didn't match how people actually create content. Nobody writes a page title in isolation from the intro text and meta description – they're all part of the same thought.

Version 2.4 and 2.5 change that.

## Multi-Field Generation

Copilot v2.5 introduces a Panel view button that opens the prompt dialog from anywhere in the Panel – not just from within a specific field. From there, you can select multiple fields at once: page title, meta description, intro text, whatever your blueprint defines. One prompt, multiple outputs.

The key is that Copilot understands your blueprint structure. It knows which fields exist on the current page, what types they are, and how they relate to each other. When you ask it to generate content for three fields simultaneously, the results are coherent – not three isolated pieces of text that happen to share a topic.

This is the feature that turned Copilot from a writing aid into something closer to a content assistant. Select your fields, write a prompt that describes what the page should communicate, and let it draft everything at once. Edit from there.

[Learn more about multi-field generation](/docs/copilot/usage/view-button)

## Custom Blocks Support

Before v2.4, Copilot could generate standard blocks – text, headings, images, lists. But custom blocks, the ones you define in your own project, were invisible to it. If you had a `testimonial` block with `quote`, `author`, and `role` fields, Copilot couldn't produce it.

v2.4 solves this through JSON schema-based object generation. Copilot now reads the block definitions from your Kirby project – including any custom block types – and generates structured data that matches their exact field structure. The same approach works for layout fields.

In practice, this means Copilot can now generate entire page layouts with your project's own block vocabulary. It's not guessing at a generic structure – it's working with the actual building blocks you've defined.

[Read the custom blocks documentation](/docs/copilot/advanced/blocks-and-layouts)

## What This Means

These two features – multi-field generation and custom blocks – shift what Copilot is useful for. It's no longer just about helping with a paragraph here and there. It can draft a full page structure: metadata, body content, and custom blocks, all in one pass. For content-heavy Kirby projects, that's a meaningful change in how quickly editors can get from a blank page to a working draft.

Both updates are free for anyone with a v2 license. If you're on v1, check the [Hub](https://hub.kirby.tools) for upgrade options.
