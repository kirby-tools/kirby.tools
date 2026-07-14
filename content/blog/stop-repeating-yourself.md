---
title: Stop Repeating Yourself
description: Skills let you save the tone and rules you'd otherwise retype, then drop them into any prompt with a single mention.
date: "2026-07-13"
product: copilot
---

Every prompt you write says two things at once: what you want, and how you want it said. The _what_ changes all the time – a product tagline, an intro paragraph, a meta description. The _how_ barely moves. Keep it warm. Skip the jargon. Short sentences. After a while I noticed I was typing the same handful of rules into prompt after prompt, and I doubt I'm the only one.

On your own, it's a small thing you stop noticing. On a team it's a quieter kind of trouble: everyone describes the tone a little differently, someone forgets it on a busy day, and the writing slowly drifts apart – three editors, three slightly different voices, none of them quite the one you agreed on.

Skills let you write that _how_ down once, so nobody has to remember it again.

![Prompt editor showing a green @skill://brand-voice token and the open skill typeahead dropdown](/img/kirby-copilot-skills.png)

## Define It Once

A skill is a small, named set of instructions you keep in your Kirby config. It has an `id`, a `label`, and the `instructions` themselves:

```php [config.php]
'skills' => [
    [
        'id' => 'brand-voice',
        'label' => 'Brand Voice',
        'instructions' => 'Write in a warm, conversational tone. Avoid corporate jargon. Prefer short sentences.'
    ]
]
```

That's the whole thing. Add one for each rule you keep reaching for – a brand voice, a "keep it concise" preset, the tone you use for product copy as opposed to support articles. They live in the project, in version control, next to everything else that describes the site. When the way you write changes, you update it in one place and everyone gets the new version.

If you run a multilingual Panel, both the label and the instructions can be localized, so your German editors read German instructions and the AI is steered in the language they're actually working in.

## A Mention Away

Editors never touch the config. In the prompt dialog, they start typing `@skill://` and a dropdown lists everything you've defined. Pick one and it drops in as a green token. Add as many as the task needs – `@skill://brand-voice` and `@skill://concise` together, say.

The prompt itself stays about the content – _write a tagline for the new mixer_ – while the skills quietly carry the _how_. When you send the request, their instructions are folded into the system prompt behind the scenes and the tokens are stripped back out, so the AI is shaped by your rules without ever seeing `@skill://` as part of the ask.

## Presets, Not Agents

If you've met "skills" elsewhere in the AI world, set that mental model aside. These aren't agent capabilities that load tools or run code. A Copilot skill is plain text – a preset concatenated into the system prompt, nothing more. That's the point: predictable, readable, and entirely yours to control.

It's also a middle ground you didn't have before. A [prompt template](/docs/copilot/prompt-dialog/templates) is a complete, reusable prompt; the [system prompt](/docs/copilot/configuration/system-prompt) applies to every request whether the editor wants it or not. A skill sits between the two – a named instruction the editor opts into, one prompt at a time.

## What It Changes

On most projects, the way a team writes isn't written down anywhere useful. It lives in a couple of people's heads and in a style guide nobody opens. I wanted it somewhere people would actually reach for – and that's really all a skill is: your tone, kept where the writing happens, a mention away.

You write it down once. Everyone reaches for the same words. The writing stops drifting, and nobody has to play editor-in-chief to keep it that way.

Skills are available in Kirby Copilot. Update to the latest version, open the prompt dialog on any field, and type `@skill://` to see the ones you've defined.

[Read the Skills documentation](/docs/copilot/prompt-dialog/skills)
