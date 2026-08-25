<script setup lang="ts">
import { withLeadingSlash } from "ufo";

const props = defineProps<{
  src: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  label?: string;
}>();

const POSTER_WIDTH = 1280;

const img = useImage();

const videoUrl = useAssetUrl(() => withLeadingSlash(props.src));

// The `poster` attribute bypasses `NuxtImg`, so the URL has to be built by hand.
const posterUrl = computed(() =>
  props.poster
    ? img(withLeadingSlash(props.poster), { width: POSTER_WIDTH })
    : undefined,
);

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
    :src="videoUrl"
    :poster="posterUrl"
    :width="width"
    :height="height"
    :aria-label="accessibleLabel"
    muted
    controls
    playsinline
    preload="none"
    class="w-full rounded-xl"
  />
</template>
