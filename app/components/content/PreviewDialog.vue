<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
}>();
</script>

<template>
  <div class="inline-block rounded-lg bg-[#F0F0F0]">
    <NuxtImg
      :src="src"
      :alt="alt || 'Kirby Tools section preview'"
      class="!my-0 w-full max-w-[30rem] rounded-lg"
    />
  </div>
</template>
