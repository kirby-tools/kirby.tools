<script setup lang="ts">
import { withLeadingSlash } from "ufo";

const props = defineProps<{
  src: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  label?: string;
}>();

const accessibleLabel = computed(() => {
  if (props.label) return props.label;
  const filename = props.src
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "");
  return filename ? `Video: ${filename}` : "Video content";
});
</script>

<template>
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
    class="w-full rounded-xl"
  />
</template>
