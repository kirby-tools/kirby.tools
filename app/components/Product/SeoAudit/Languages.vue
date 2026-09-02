<script setup lang="ts">
const ANALYSIS_LANGUAGES = [
  "Arabic",
  "Catalan",
  "Czech",
  "Dutch",
  "English",
  "French",
  "German",
  "Greek",
  "Hebrew",
  "Hungarian",
  "Indonesian",
  "Italian",
  "Japanese",
  "Norwegian",
  "Persian",
  "Polish",
  "Portuguese",
  "Russian",
  "Slovak",
  "Spanish",
  "Swedish",
  "Turkish",
];
</script>

<template>
  <ul class="flex h-full flex-wrap content-center gap-1 p-6">
    <li v-for="language in ANALYSIS_LANGUAGES" :key="language">
      <UBadge
        :label="language"
        color="neutral"
        variant="outline"
        size="xl"
        class="font-display rounded-full"
      />
    </li>
  </ul>
</template>
