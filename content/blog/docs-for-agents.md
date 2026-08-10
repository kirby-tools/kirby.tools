---
title: Docs Your Agent Can Read
description: Every page here has a Markdown twin, llms.txt indexes them, and each plugin ships an agent skill you can install in one command.
date: "2026-08-09"
badge:
  label: News
---

Coding agents know Kirby well. They know these plugins less well, and it shows in a way you might have run into: a config block that looks right – right nesting, right keys, one option that doesn't exist.

Everything needed to get it right is on this site. It just wasn't in a form an agent could read, so every page is now published twice – once rendered for you, once as plain Markdown for agents.

## Append `.md` to Any Page

Every documentation page, blog post, changelog and license page has a Markdown twin. Same URL, `.md` on the end:

```bash
curl https://kirby.tools/docs/content-translator/configuration/global.md
```

No navigation, no components, no markup to work around.

Documentation pages and blog posts also carry a **Copy page** button. One click puts the Markdown on your clipboard for the next chat; the dropdown beside it opens the page in ChatGPT or Claude with the prompt already written.

## An Index, Not a Dump

Your agent's context is better spent on your code than on my documentation. [`llms.txt`](/llms.txt) is an index: every plugin, every page, one line each. The agent reads that, then fetches the two pages the task needs.

If you would rather hand over everything at once, [`llms-full.txt`](/llms-full.txt) is there too.

## One Skill per Plugin

The index helps once an agent decides to look something up. A skill loads on its own, whenever the task matches.

Each plugin now ships one: what it does, what it deliberately does not do, and the handful of options that decide the outcome. That Copilot's inline suggestions need the `copilot-suggestions` mark as soon as a writer field defines its own marks, or Kirby filters them out and nothing appears. That Content Translator falls back to DeepL when `strategy` is left out, whether or not DeepL is what the project intended.

```bash
npx skills add https://kirby.tools
```

That installs one skill per plugin into whichever agent your project uses. Each of them links to the Markdown pages behind it, so the agent can read the full reference when the summary isn't enough.

Writing them was worth it for the documentation alone. Compressing a plugin into one page of instructions shows you which decisions you never actually wrote down – a few pages here read better now because of it.

## Point Your Agent at It

Whichever fits how you work: append `.md` while you read, hand over `llms.txt` at the start of a task, or install the skills once and forget about them.

If your agent still gets something wrong, that is worth an [issue](https://github.com/kirby-tools/community/issues) – it usually means the page it read was unclear.

[Read the reference for AI agents](/ai)
