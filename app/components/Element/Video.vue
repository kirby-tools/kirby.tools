<script setup lang="ts">
defineProps<{
  src: string;
  poster: string;
}>();

const prefersReducedMotion = import.meta.client
  ? matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;
const hasTouchCapability = import.meta.client
  ? matchMedia("(hover: none)").matches
  : false;
const video = useTemplateRef("video");
const isPlaying = ref(false);
const hasAutoplay = ref(true);

useIntersectionObserver(
  video,
  ([entry]) => {
    if (
      entry?.isIntersecting &&
      hasAutoplay.value &&
      !prefersReducedMotion &&
      !hasTouchCapability
    ) {
      video.value?.play();
      isPlaying.value = true;
      hasAutoplay.value = false;
    } else if (isPlaying.value) {
      video.value?.pause();
      isPlaying.value = false;
    }
  },
  { threshold: 1 },
);

function handleVideoClick(event: MouseEvent) {
  const player = event.target as HTMLVideoElement;

  if (isPlaying.value) {
    player.pause();
    isPlaying.value = false;
  } else {
    player.play();
    isPlaying.value = true;
  }
}
</script>

<template>
  <div
    class="group relative cursor-pointer rounded-xl shadow ring ring-(--ui-border)"
    :class="[!isPlaying && 'hover:shadow-md hover:ring-(--ui-secondary)']"
  >
    <video
      ref="video"
      :src="src"
      :poster="poster"
      muted
      class="rounded-xl"
      @ended="isPlaying = false"
      @click="handleVideoClick"
    />

    <div
      v-show="!isPlaying"
      class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-b from-gray-950/50 to-20%"
    >
      <div class="inline-flex rounded-full bg-(--ui-bg)/75 shadow-md">
        <UIcon
          name="i-ri-play-circle-fill"
          class="size-14 text-(--ui-secondary) group-hover:text-(--ui-color-secondary-600) lg:size-22 dark:group-hover:text-(--ui-color-secondary-500)"
        />
      </div>
    </div>
  </div>
</template>
