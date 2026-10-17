---
title: Agents Prepare, Editors Publish
description: Copilot v3.14 connects Claude, ChatGPT, Cursor, and other agents to your Kirby site. They work as your Kirby user, within your role, and by default their edits wait as unsaved changes until you publish them.
date: "2026-10-10"
product: copilot
---

Copy a page into Claude, ask for a tighter version, paste the result back field by field – until now, that's how a chat with an AI edited a Kirby page. The AI never saw the blueprint, the other languages, or the block next to the one it rewrote, and you were the clipboard in between.

Copilot v3.14 removes the clipboard. Your site now runs an MCP server, and the agent you already use – Claude, ChatGPT, Cursor, or any other with remote MCP support – connects to it through the Panel's login. It reads your pages with their fields and blocks, and it writes where your own edits go: into the page's unsaved changes, or into a new draft.

What it doesn't do is publish on its own.

## One Site, Several Ways In

In the Panel, Copilot fills fields, blocks, and layouts with the AI provider you set up. A developer's coding agent gets the project itself – blueprints, templates, a running Kirby – through Bruno Meilick's [Kirby MCP](https://github.com/bnomei/kirby-mcp). Copilot's agents are for whoever writes the content, from the chat they already have open. The agent brings its own model, so the site needs no AI provider for it.

## Connected Through the Panel's Login

Turning agents on takes one option:

```php [site/config/config.php]
return [
    'johannschopplich.copilot' => [
        'agents' => true
    ]
];
```

The Panel's new **Agents** view shows the MCP URL. Add it to your agent, and it sends you to the Panel. You log in as yourself and decide what the connection may do:

:::panel-mock
::panel-copilot-agents-authorize-view
---
site: Kunsthalle Leipzig
account: hanna@kunsthalle-leipzig.de
client:
  host: claude.ai
redirect:
  label: claude.ai
defaultPermissions:
  - content:read
  - content:prepare
---
::
:::

Nobody creates an API token, pastes it into a chat, or shares it across the team. The login is the Panel's own, two-factor codes included, and each editor connects as themselves. The Agents view lists your connections, and an admin can revoke the team's. Where each agent takes the URL is in [Connect an Agent Over MCP](/docs/copilot/agents).

## Going Live Is a Permission of Its Own

A new connection may read content and prepare changes. Whatever goes live at once – publishing, changing a page's status, slug, or parent, uploading outside a draft – takes **Publish changes**, and deleting takes **Delete content**. Both stay off until you tick them, and an agent only sees the tools its connection allows.

On a team site, that decision doesn't have to rest with each editor: a [role blueprint](/docs/copilot/agents#limit-agents-by-role) can keep publishing and deleting away from agents, even for a role that publishes in the Panel. [Permissions & Review](/docs/copilot/agents/permissions-and-review) lists what each permission allows.

## Your Role Is the Ceiling

The agent works as the user who connected it, on every request. A page your role can't update, the agent can't change, and a page your role can't see, it doesn't find. A connection ends when you revoke it, change your password, or leave it unused for 30 days.

## Review Where You Already Review

Each write hands the agent a link to pass on to you. Where the page has a preview, it opens Kirby's comparison of the unsaved changes and the published page, and you publish or discard them as you would your own edits.

To see what's waiting, ask the agent: it finds the pages with unsaved changes.

::product-copilot-agents-chat{chat="waiting"}
::

If you have the page open while the agent works, the view reloads and tells you why. An edit you type before the reload saves your form over what the agent wrote. If a colleague is editing the page, Kirby keeps the agent from changing it until they leave, and the agent tells you whom it's waiting for.

Give an agent **Publish changes**, and it publishes the way the Panel's **Save** button does: all unsaved changes of the page in that language, whoever made them. In my tests, an agent asked to publish a new intro spotted a half-finished teaser in the same page's changes and asked before publishing both. I still wouldn't leave unfinished edits on a page you hand to an agent.

::product-copilot-agents-chat{chat="publish-guard"}
::

## Content Is Data, Not Instructions

A page can hold text that reads like an instruction to an AI – a pasted email, a form submission. The site tells every agent to treat what it reads as data, never as instructions, and it checks what the agent writes: no `<script>`, `<iframe>`, or similar elements, no event attributes or `javascript:` URLs, whether written out or produced by KirbyText.

::product-copilot-agents-chat{chat="script"}
::

## From a Chat Window, Not Just a Terminal

An agent in claude.ai or ChatGPT can't hand over a file from your disk the way a terminal can, so it uploads from a public HTTPS URL or sends a small file itself. Before it writes an image's alt text, it can look at the image. [Tools](/docs/copilot/agents/tools) lists everything an agent can do, and which permission each tool takes.

claude.ai, Claude Desktop, and ChatGPT connect from their own servers, so they need a site that's reachable from the internet.

## What It Changes

The agent works on the real page, with its blueprint, its languages, and its blocks, and the Panel stays the place where content goes live. You decide per connection, and per role, whether an agent may take that last step.

Agents come with Copilot v3.14, a free update for every v3 license.

[Connect your first agent](/docs/copilot/agents)
