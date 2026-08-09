---
title: Docs Your Agent Can Read
description: Every page here has a Markdown twin, llms.txt indexes them, and each plugin ships an agent skill you can install in one command.
date: "2026-08-09"
badge:
  label: News
---

Ask a coding agent how to configure one of these plugins and you usually get a config block that looks right – right shape, right nesting, an option that doesn't exist. Content Translator scopes translation with `fieldTypes`, and a model that has read a hundred other plugins reaches for `fields` instead.

The documentation has always said `fieldTypes`. Getting an agent to read it was the problem: every page here is HTML built for a browser, and pulling two config keys out of that is more work than filling the gap from memory.

So every page is now published twice – once rendered for you, once as plain Markdown.

## Append `.md` to Any Page

Every documentation page, blog post, changelog and license page has a Markdown twin. Same URL, `.md` on the end:

```bash
curl https://kirby.tools/docs/content-translator/configuration/global.md
```

No navigation, no components, no markup to work around. Title, description and canonical URL sit in the frontmatter, so whatever fetched the file knows where it came from, and each page points at its twin with a `<link rel="alternate">` in the head.

Documentation pages and blog posts also carry a **Copy page** button. One click puts the Markdown on your clipboard for the next chat; the dropdown beside it opens the page in ChatGPT or Claude with the prompt already written.

## An Index, Not a Dump

Pasting the entire documentation into a chat is rarely the right move – it spends context you would rather keep for your own code. [`llms.txt`](/llms.txt) is the index instead: every plugin, every page, one line each. The agent reads it, then fetches the two pages the task actually needs.

It also states what no individual page does: that Kirby is a flat-file CMS with no npm package, that commercial plugins run unlicensed in local development, that each plugin is licensed separately. Without that, an agent will cheerfully suggest an npm install for a plugin that only exists on Packagist.

If you would rather have it all at once, [`llms-full.txt`](/llms-full.txt) is there too.

## One Skill per Plugin

The index helps once an agent decides to look something up. A skill loads on its own, whenever the task matches.

Each plugin now ships one: what it does, what it deliberately does not do, the handful of options that decide the outcome, and the mistakes that keep coming up in support. That `buttons` in a blueprint is an allow-list, so adding `content-translator` there drops Kirby's own buttons unless you name them alongside it. That batch translation wants `batchConcurrency` set to `1` when the provider rate-limits.

```bash
npx skills add https://kirby.tools
```

That installs one skill per plugin into whichever agent your project uses – Claude Code, Cursor, Codex, Windsurf and the rest. Each skill links to the Markdown pages behind it, so the agent can read the full reference when the summary isn't enough.

Writing them changed the documentation as well. Compressing a plugin into a page of instructions makes it obvious which decisions were never written down anywhere, and I fixed several pages because a skill wouldn't come together without them.

## Nothing to Set Up

No account, no API key, no server of mine between your agent and the docs. These are static files over HTTP, generated from the same content this site renders, so they can't fall behind the pages you read.

If your agent still gets a config wrong, that is worth an [issue](https://github.com/kirby-tools/community/issues) – it usually means the page it read was unclear.

[Read the reference for AI agents](/ai)
