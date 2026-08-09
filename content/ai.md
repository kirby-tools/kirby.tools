---
title: Kirby Tools for AI Agents
description: Every page of this site is available as Markdown, and each plugin ships an agent skill. Here is how to point your coding agent at them.
navigation.icon: i-ri-robot-2-line
---

Most of the questions our plugins get asked – which config key does this, does that field type translate, why is the preview blank – are questions a coding agent could answer if it had read the documentation. So we publish it in a form agents can read.

Nothing here needs an account or an API key. It is the same documentation you are reading, in plain Markdown.

## Any Page as Markdown

Append `.md` to any documentation, blog, changelog or license URL and you get its Markdown source instead of the rendered page:

```bash
curl https://kirby.tools/docs/copilot/getting-started.md
```

Each file carries its title, description and canonical URL in the frontmatter, so an agent that fetched one knows where it came from. Every page with a twin announces it in the HTML head:

```
<link rel="alternate" type="text/markdown" href="https://kirby.tools/docs/copilot/getting-started.md">
```

Documentation pages and blog posts carry a **Copy page** button that puts the Markdown on your clipboard, ready to paste into a chat. The dropdown beside it copies the link instead, or opens the page in ChatGPT or Claude with a prompt already filled in.

## The Whole Site at Once

Three files describe the site as a whole:

- [`/llms.txt`](https://kirby.tools/llms.txt) – an index: every plugin, every page, with one-line descriptions. Small enough to paste anywhere.
- [`/llms-full.txt`](https://kirby.tools/llms-full.txt) – every documentation page concatenated. Reach for it when the agent has room and the task spans several plugins.
- [`/sitemap.md`](https://kirby.tools/sitemap.md) – the Markdown links, grouped by plugin, in the order the sidebar uses.

Start with `llms.txt`. It lists the paths, and the agent fetches the two or three pages it actually needs.

::note
In Cursor or Windsurf, add these URLs under `@docs`. In ChatGPT or Claude, pasting the URL into the conversation is enough – both fetch it.
::

## Agent Skills

A skill is a set of instructions an agent loads when the task matches, rather than something you paste in each time. We ship one per plugin: what the plugin does, what it deliberately does not do, the configuration that actually matters, and the mistakes we see in support.

Install them with the [`skills`](https://skills.sh) CLI:

```bash
npx skills add https://kirby.tools
```

The CLI supports Claude Code, Cursor, Codex, Windsurf, Cline and the rest, and writes the skills into whichever one your project uses. To pick a single agent, or install for every project at once:

```bash
npx skills add https://kirby.tools --agent claude-code
npx skills add https://kirby.tools --global
```

Each skill links back to the Markdown pages it summarizes, so an agent can read the full reference when the summary runs out. The index lives at [`/.well-known/agent-skills/index.json`](https://kirby.tools/.well-known/agent-skills/index.json) if you would rather wire it up yourself.

## Nothing to Set Up

There is no MCP server. Everything here is a static file fetched over HTTP, generated from the same content the site renders, so there is nothing between your agent and the docs that can be down when you need it.

Support questions still reach a human: [Discussions](https://github.com/kirby-tools/community/discussions) for the open-ended ones, [Issues](https://github.com/kirby-tools/community/issues) for bugs.
