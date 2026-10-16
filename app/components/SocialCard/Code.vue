<script setup lang="ts">
import type { SocialCardSnippet } from "~/utils/social-card-code";

const props = defineProps<{
  source: SocialCardSnippet;
  result: SocialCardSnippet;
}>();

const { data: highlightedLines } = await useAsyncData(
  `social-card-code-${props.source.label}`,
  () =>
    Promise.all([
      highlightCode(props.source.code, props.source.language),
      highlightCode(props.result.code, props.result.language),
    ]),
);
</script>

<template>
  <div class="social-card-code relative grid h-full grid-cols-2">
    <div
      v-for="(snippet, index) in [source, result]"
      :key="snippet.label"
      class="relative min-w-0 overflow-hidden bg-(--social-card-code-back)"
      :class="
        index === 0
          ? 'px-6 [--social-card-code-back:#f6f6f6]'
          : 'border-l border-black/8 px-8 [--social-card-code-back:white]'
      "
    >
      <div
        class="social-card-code-mono pt-5 pb-3 text-[14px]"
        :class="
          index === 0 ? 'text-neutral-500' : 'text-primary-700 font-semibold'
        "
      >
        {{ snippet.label }}
      </div>
      <pre
        class="social-card-code-mono text-[15.5px] leading-[1.7] text-(--code-foreground)"
      ><code><template v-for="(line, lineIndex) in highlightedLines?.[index]" :key="lineIndex"><span
        v-for="(token, tokenIndex) in line"
        :key="tokenIndex"
        :style="{ color: token.color }"
      >{{ token.content }}</span>{{ "\n" }}</template></code></pre>
      <div
        class="absolute inset-y-0 right-0 w-16 bg-linear-to-r from-transparent to-(--social-card-code-back)"
      />
    </div>

    <div
      class="bg-primary-500 absolute top-1/2 left-1/2 flex size-9 -translate-1/2 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white"
    >
      <UIcon name="i-ri-arrow-right-line" class="size-5" />
    </div>
  </div>
</template>

<style>
.social-card-code {
  --code-foreground: var(--ui-color-neutral-700);
  --code-token-keyword: var(--color-primary-600);
  --code-token-function: var(--ui-color-neutral-900);
  --code-token-parameter: var(--color-primary-700);
  --code-token-string: var(--color-primary-800);
  --code-token-string-expression: var(--color-primary-800);
  --code-token-constant: var(--color-primary-600);
  --code-token-punctuation: var(--ui-color-neutral-400);
  --code-token-comment: var(--ui-color-neutral-400);
  --code-token-link: var(--color-primary-600);
}

.social-card-code-mono {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-variant-ligatures: none;
  white-space: pre;
}
</style>
