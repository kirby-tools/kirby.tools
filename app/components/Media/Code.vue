<script setup lang="ts">
interface CodeFile {
  filename: string;
  language: string;
  content: string;
}

const props = defineProps<{
  files: CodeFile[];
  minHeight?: string;
}>();

const mdcContent = computed(() => {
  if (props.files.length === 0) return "";

  const codeBlocks = props.files
    .map(
      (file) =>
        `\`\`\`${file.language} [${file.filename}]\n${file.content.trim()}\n\`\`\``,
    )
    .join("\n\n");

  if (props.files.length === 1) {
    return codeBlocks;
  }

  return `::code-group\n\n${codeBlocks}\n\n::`;
});

const cssMinHeight = computed(() => props.minHeight ?? "auto");
</script>

<template>
  <div :class="[minHeight && 'mdc']">
    <LazyMDC :value="mdcContent" />
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .mdc :deep(pre) {
    min-height: v-bind(cssMinHeight);
  }
}
</style>
