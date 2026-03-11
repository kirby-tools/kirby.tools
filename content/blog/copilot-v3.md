---
title: Kirby Copilot v3 – Your Quiet Co-Writer
description: A major update with server-side API proxy, inline suggestions, prompt templates, and more. Free upgrade for all users.
date: "2026-01-01"
badge:
  label: Release
image:
  src: /vid/kirby-copilot-inline-suggestions-poster.jpg
---

When I first built Kirby Copilot in early 2024, there was essentially one AI provider anyone talked about. OpenAI had the market, and the idea of AI-assisted content editing inside a CMS was still novel. I wanted to be the first to bring it to the Kirby Panel – partly out of curiosity, partly because I wanted to see if it could actually be useful.

Honestly? Early sales were low. The product was rough around the edges, and most people weren't yet sure where AI fit into their daily workflows. For a while, Copilot was more of a playground for me than a product – a way to learn how large language models work, how to build good UIs around them, and how to ship something real.

That changed over the course of 2025. AI stopped being a novelty and started becoming infrastructure. People weren't asking "should I use AI?" anymore – they were asking "which tool fits my workflow?" That shift made all the difference.

## What v3 Is

Kirby Copilot v3 is what the plugin was always meant to be: a quiet co-writer, right where content is created. Not flashy, not intrusive – just helpful. It sits in the background until you need it, then gets out of the way when you don't.

v3 is a **free upgrade for all existing users**. If you have a license, you already have access.

## What's New

### Server-Side API Proxy

All AI requests now route through a PHP proxy on your server. This means API keys never leave your backend – they're no longer visible in browser network requests. There's nothing to configure. It just works out of the box, and it's a significant improvement for security-conscious setups.

### Inline Suggestions

This is probably the most visible change. As you type in a writer or textarea field, ghost text appears after a brief pause – a suggestion for how your sentence might continue. Press **Tab** to accept, **Escape** to dismiss. You can also trigger suggestions manually with **Cmd+,** (or **Ctrl+,** on Windows/Linux).

Inline suggestions use a lightweight completion model optimized for speed, so they feel responsive even on longer documents. They're designed to reduce friction, not take over your writing.

![Inline suggestions appearing as ghost text in a textarea field](/vid/kirby-copilot-inline-suggestions-poster.jpg)

[Read more about inline suggestions](/docs/copilot/usage/inline-suggestions)

### Prompt Templates

v3 ships with five built-in prompt templates: **Fix Grammar**, **Make Concise**, **Simplify**, **Extend**, and **Summarize**. Each one is a single click from the prompt dialog.

You can also create your own templates, stored in your browser's local storage. Custom templates support the same placeholder syntax as built-in ones, so they integrate seamlessly with your fields.

All templates are available in English, German, French, and Dutch.

![The prompt templates dropdown showing built-in templates](/img/kirby-copilot-templates-dropdown.png)

[Explore prompt templates](/docs/copilot/prompt-dialog/templates)

### Prompt Preview

Ever wondered what the AI actually receives when you hit send? The new prompt preview lets you expand a **Preview** section in the prompt dialog to see all placeholders resolved with your actual field values. It's a small addition, but it makes debugging custom prompts much easier.

[Learn about prompt preview](/docs/copilot/prompt-dialog/placeholders#prompt-preview)

### Writer Mark Preservation

When you select text in a writer field and replace it via Copilot, all formatting is now preserved – bold, italic, links, custom marks. Previous versions could strip formatting during replacement. That's fixed.

## Looking Ahead

For me, Kirby Copilot is still partly a playground – a place to learn, experiment, and ship ideas. But for everyone creating content with Kirby, it should be one thing above all: an unobtrusive writing aid that respects your workflow.

If you're new to Copilot, the [documentation](/docs/copilot) covers everything you need to get started. If you're upgrading, check the [full changelog](/copilot/changelog) for every detail in v3.
