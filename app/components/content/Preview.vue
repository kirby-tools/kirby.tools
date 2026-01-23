<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}>();
</script>

<template>
  <div class="inline-block rounded-md bg-[#F0F0F0] px-6 py-5">
    <NuxtImg
      :src="src"
      sizes="352px"
      densities="x1 x2"
      :alt="alt || undefined"
      :width="width"
      :height="height"
      class="my-0! w-[22rem] rounded-md"
    />
  </div>
</template>
