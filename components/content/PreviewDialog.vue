<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>

<template>
  <div class="inline-block rounded-md bg-[#F0F0F0]">
    <NuxtImg
      :src="src"
      alt="Kirby Tools section preview"
      class="!my-0 w-[22rem] rounded-md"
    />
  </div>
</template>
