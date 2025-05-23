<script setup lang="ts">
defineProps<{
  path: string;
  poster: string;
}>();

const prefersReducedMotion = import.meta.client
  ? matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;
const hasTouchCapability = import.meta.client
  ? matchMedia("(hover: none)").matches
  : false;
const video = ref<HTMLVideoElement | undefined>();
const isPlaying = ref(false);
const hasAutoplay = ref(true);

useIntersectionObserver(
  video,
  ([{ isIntersecting }]) => {
    if (
      isIntersecting &&
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
    class="group relative cursor-pointer rounded-xl shadow ring-1 ring-gray-200 dark:ring-gray-800"
    :class="[
      !isPlaying &&
        'hover:ring-neon-carrot-500 dark:hover:ring-neon-carrot-400',
    ]"
  >
    <video
      ref="video"
      :src="path"
      :poster="poster"
      muted
      class="rounded-xl"
      @ended="isPlaying = false"
      @click="handleVideoClick"
    />

    <div
      v-show="!isPlaying"
      class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-b from-gray-950/50 to-[rgba(0,0,0,0)] to-20%"
    >
      <UIcon
        name="i-ri-play-circle-fill"
        class="size-[min(16vw,6rem)] text-gray-900 group-hover:text-neon-carrot-600"
      />
    </div>
  </div>
</template>
