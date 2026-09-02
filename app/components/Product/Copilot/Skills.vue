<script setup lang="ts">
const SKILLS_PROMPT = `Write the teaser for "${EXHIBITION_PAGE.title}" @skill://brand-voice
@skill://`;
</script>

<template>
  <PanelPreview>
    <PanelCopilotPromptDialog
      :prompt="SKILLS_PROMPT"
      :dropdown="{
        under: 'skills',
        selected: 1,
        items: [
          { text: 'Brand Voice', info: 'brand-voice' },
          { text: 'Concise', info: 'concise' },
          { text: 'Formal Address', info: 'formal-address' },
        ],
      }"
    />
  </PanelPreview>
</template>
