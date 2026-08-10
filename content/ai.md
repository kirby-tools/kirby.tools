---
title: Kirby Tools for AI Agents
description: Every page of this site is available as Markdown, and each plugin ships an agent skill. Here is how to point your coding agent at them.
navigation.icon: i-ri-robot-2-line
---

Setting up a plugin goes faster when the agent you are working with has read its documentation. So all of it is published as Markdown as well – single pages, the whole site as one index, and a skill per plugin.

## Any Page as Markdown

Append `.md` to any documentation, blog, changelog or license URL and you get its Markdown source instead of the rendered page:

```bash
curl https://kirby.tools/docs/copilot/getting-started.md
```

Documentation pages and blog posts carry a **Copy page** button that puts the Markdown on your clipboard, ready to paste into a chat. The dropdown beside it copies the link instead, or opens the page in ChatGPT or Claude with a prompt already filled in.

## The Whole Site at Once

Three files describe the site as a whole:

- [`/llms.txt`](https://kirby.tools/llms.txt) – an index: every plugin, every page, with one-line descriptions. Small enough to paste anywhere.
- [`/llms-full.txt`](https://kirby.tools/llms-full.txt) – every documentation page concatenated. Reach for it when the agent has room and the task spans several plugins.
- [`/sitemap.md`](https://kirby.tools/sitemap.md) – the Markdown links, grouped by plugin, in the order the sidebar uses.

Start with `llms.txt`. It lists the paths, and the agent fetches the two or three pages it actually needs.

## Agent Skills

A skill is a set of instructions an agent loads when the task matches, rather than something you paste in each time. We ship one per plugin: what the plugin does, what it deliberately does not do, the configuration that actually matters, and the mistakes we see in support.

Install them with the [`skills`](https://skills.sh) CLI:

```bash
npx skills add https://kirby.tools
```

It writes them into whichever agent your project uses – Claude Code, Cursor, Codex. To pick a single one, or install for every project at once:

```bash
npx skills add https://kirby.tools --agent claude-code
npx skills add https://kirby.tools --global
```

Each skill links back to the Markdown pages it summarizes, so an agent can read the full reference when the summary runs out. The index lives at [`/.well-known/agent-skills/index.json`](https://kirby.tools/.well-known/agent-skills/index.json) if you would rather wire it up yourself.

## Support

[Discussions](https://github.com/kirby-tools/community/discussions) for open-ended questions, [Issues](https://github.com/kirby-tools/community/issues) for bugs.
