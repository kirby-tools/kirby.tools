<script setup lang="ts">
interface CodeFile {
  filename: string;
  language: string;
  content: string;
}

const props = defineProps<{
  files: CodeFile[];
  defaultFile?: string;
}>();

const mdcContent = computed(() => {
  if (props.files.length === 0) return "";

  if (props.files.length === 1) {
    const file = props.files[0]!;
    return `\`\`\`${file.language} [${file.filename}]\n${file.content.trim()}\n\`\`\``;
  }

  // Multiple files: use code-group for tabs
  const codeBlocks = props.files
    .map(
      (file) =>
        `\`\`\`${file.language} [${file.filename}]\n${file.content.trim()}\n\`\`\``,
    )
    .join("\n\n");

  return `::code-group\n\n${codeBlocks}\n\n::`;
});
</script>

<template>
  <LazyMDC :value="mdcContent" />
</template>
