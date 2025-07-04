<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}>();
</script>

<template>
  <div class="inline-block rounded-lg bg-[#F0F0F0]">
    <NuxtImg
      :src="src"
      sizes="100vw sm:480px"
      densities="x1 x2"
      :alt="alt || 'Kirby Tools section preview'"
      :width="width"
      :height="height"
      class="!my-0 w-full max-w-[30rem] rounded-lg"
    />
  </div>
</template>
