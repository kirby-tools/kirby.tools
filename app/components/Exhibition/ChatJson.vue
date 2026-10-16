<script setup lang="ts">
// A tool call's request or response, colored as claude.ai prints it.
const props = defineProps<{
  value: unknown;
  isCompact?: boolean;
}>();

type JsonTokenKind = "key" | "string" | "literal" | "punctuation";

const TOKEN_CLASSES: Record<JsonTokenKind, string> = {
  key: "text-(--client-json-key)",
  string: "text-(--client-json-string)",
  literal: "text-(--client-json-literal)",
  punctuation: "text-(--client-json-punctuation)",
};

const TOKEN =
  /("(?:[^"\\]|\\.)*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?/g;

const tokens = computed(() => {
  const source = props.isCompact
    ? JSON.stringify(props.value)
    : JSON.stringify(props.value, null, 2);
  const result: { kind: JsonTokenKind; text: string }[] = [];
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    if (match.index > last)
      result.push({
        kind: "punctuation",
        text: source.slice(last, match.index),
      });
    // claude.ai colors a key without its quotes, a string with them.
    if (match[1] && match[2]) {
      result.push({ kind: "punctuation", text: '"' });
      result.push({ kind: "key", text: match[1].slice(1, -1) });
      result.push({ kind: "punctuation", text: `"${match[2]}` });
    } else {
      result.push({ kind: match[1] ? "string" : "literal", text: match[0] });
    }
    last = match.index + match[0].length;
  }
  if (last < source.length)
    result.push({ kind: "punctuation", text: source.slice(last) });
  return result;
});
</script>

<template>
  <pre
    class="font-mono text-xs/4 wrap-break-word whitespace-pre-wrap"
  ><span v-for="(token, index) in tokens" :key="index" :class="TOKEN_CLASSES[token.kind]">{{ token.text }}</span></pre>
</template>
