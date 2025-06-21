<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="mx-auto max-w-3xl space-y-4 text-center sm:space-y-8">
    <h1
      class="font-display text-5xl font-bold tracking-tight text-pretty text-(--ui-text-highlighted) sm:text-7xl"
      v-html="title"
    />

    <p class="text-lg text-balance text-(--ui-text-muted) sm:text-xl/8">
      {{ description }}
    </p>

    <div>
      <UButton
        label="Ersten Bericht generieren"
        size="xl"
        to="https://app.kirotte.de"
        class="rounded-2xl px-6 ring-4 ring-(--ui-bg-elevated) transition-shadow duration-300 hover:bg-(--ui-color-primary-600) hover:ring-2 hover:ring-(--ui-primary)/25"
      />

      <p class="mt-4 text-xs text-(--ui-text-muted)">
        14 Tage kostenlos testbar
      </p>
    </div>
  </section>
</template>
