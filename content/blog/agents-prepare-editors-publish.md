---
title: Agents Prepare, Editors Publish
description: Copilot v3.14 connects Claude, ChatGPT, Cursor, and other agents to your Kirby site. They work as your Kirby user, within your role, and their edits wait as unsaved changes until you publish them.
date: "2026-10-09"
product: copilot
---

Copy a page into Claude, ask for a tighter version, paste the result back field by field – until now, that's how a chat with an AI edited a Kirby page. The AI never saw the blueprint, the other languages, or the block next to the one it rewrote, and you were the clipboard in between.

Copilot v3.14 removes the clipboard. Your site now runs an MCP server, and the agent you already use – Claude, ChatGPT, Cursor, or any other with remote MCP support – connects to it through the Panel's login. It reads your pages with their fields and blocks, and it writes where your own edits go: into the page's unsaved changes, or into a new draft.

What it doesn't do is publish on its own.

## Connected Through the Panel's Login

Turning agents on takes one option:

```php [site/config/config.php]
return [
    'johannschopplich.copilot' => [
        'agents' => true
    ]
];
```

The Panel's new **Agents** view shows the MCP URL and checks whether agents can reach it. Add the URL to your agent, and it sends you to the Panel. You log in as yourself and decide what the connection may do:

:::panel-mock
::panel-copilot-agents-authorize-view
---
site: Kunsthalle Leipzig
account: editor@kunsthalle-leipzig.de
client:
  name: Claude
  host: claude.ai
redirect:
  label: claude.ai
---
::
:::

The agent brings its own model, so the site needs no AI provider for it.

## Going Live Is a Permission of Its Own

A new connection may read content and prepare changes. Publishing or discarding unsaved changes, uploading a file, and changing a page's status, slug, or parent are live at once and take **Publish changes**; deleting takes **Delete content**. Both stay off until you tick them, and an agent only sees the tools its connection allows.

You change a connection's permissions later with **Change permissions** in its menu in the Agents view. On a team site, that decision doesn't have to rest with each editor: a role blueprint can keep publishing and deleting away from agents, even for a role that publishes in the Panel.

```yaml [site/blueprints/users/editor.yml]
title: Editor
permissions:
  johannschopplich.copilot:
    agentsPublish: false
    agentsDelete: false
```

## Your Role Is the Ceiling

The agent works as the user who connected it, on every request. A page your role can't update, the agent can't change, and a page your role can't see, it doesn't find. A change to your role applies on the agent's next request. A connection ends when you revoke it in the Agents view, change your password, or leave it unused for 30 days.

## Review Where You Already Review

Each write hands the agent a link to pass on to you. Where the page has a preview, the link opens Kirby's comparison of the unsaved changes and the published page. From there, you publish or discard as you would your own edits, one language at a time.

To see what's waiting, ask the agent: it finds the pages with unsaved changes.

If you have the page open while the agent works, the view reloads – within 10 seconds while its tab is visible – and tells you why. An edit you type before the reload saves your form over what the agent wrote, so pause typing until the view has reloaded. If a colleague is editing the page, Kirby keeps the agent from changing it until they leave, and the agent tells you whom it's waiting for.

Give an agent **Publish changes**, and it publishes the way the Panel's **Save** button does: all unsaved changes of the page in that language, whoever made them. Changes that fail the blueprint's validation stay unpublished, as they would in the Panel. The agent sees which fields the page's unsaved changes touch. In my tests, an agent asked to publish a new intro spotted a half-finished teaser in the same page's changes and asked before publishing both. I still wouldn't leave unfinished edits on a page you hand to an agent.

## Content Is Data, Not Instructions

A page can hold text that reads like an instruction to an AI – a pasted email, a form submission. The site tells every agent to treat what it reads as data, never as instructions.

What an agent writes is checked too. It can't add `<script>`, `<iframe>`, or similar elements, event attributes, or `javascript:` URLs to a field, whether written out or produced by KirbyText. Markup an editor placed there before survives a rewrite.

## From a Chat Window, Not Just a Terminal

An agent in claude.ai or ChatGPT can't hand over a file from your disk the way a terminal can. So it uploads from a public HTTPS URL, up to the file template's `accept.maxsize`, or 20 MB without one, or sends a small file of up to 100 KB itself. Before it writes an image's alt text, it can look at the image.

A file is live once it's uploaded, so uploading takes **Publish changes**. Only its fields, like the alt text, wait for review.

## Where It Stops

An agent doesn't schedule, duplicate pages, or replace a file in place – those stay in the Panel. Translating a page into three languages means three reviews, since every language publishes on its own.

claude.ai, Claude Desktop, and ChatGPT connect from their own servers, so they need a site that's reachable from the internet.

## What It Changes

The agent works on the real page, with its blueprint, its languages, and its blocks, and the Panel stays the place where content goes live. You decide per connection, and per role, whether an agent may take that last step.

Agents come with Copilot v3.14, a free update for every v3 license.

[Connect your first agent](/docs/copilot/agents)
