<script setup lang="ts">
import { withLeadingSlash } from "ufo";

const props = defineProps<{
  src: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  label?: string;
}>();

const isPlaying = ref(false);

// Generate a meaningful accessible label
const accessibleLabel = computed(() => {
  if (props.label) return props.label;
  // Extract filename from src as fallback context
  const filename = props.src
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "");
  return filename ? `Video: ${filename}` : "Video content";
});
</script>

<template>
  <div class="group relative cursor-pointer rounded-xl">
    <video
      :src="withLeadingSlash(src)"
      :poster="poster ? withLeadingSlash(poster) : undefined"
      :width="width"
      :height="height"
      :aria-label="accessibleLabel"
      muted
      controls
      playsinline
      preload="metadata"
      class="rounded-xl"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="isPlaying = false"
    />

    <div
      v-show="!isPlaying"
      class="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-gray-950/50 to-25%"
      aria-hidden="true"
    />
  </div>
</template>
