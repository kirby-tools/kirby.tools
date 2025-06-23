<script setup lang="ts">
defineProps<{
  src: string;
  poster: string;
  title?: string;
  ariaLabel?: string;
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

function togglePlay() {
  if (isPlaying.value) {
    video.value?.pause();
    isPlaying.value = false;
  } else {
    video.value?.play();
    isPlaying.value = true;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    togglePlay();
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
      :title="title || 'Video content'"
      :aria-label="ariaLabel || title || 'Interactive video player'"
      muted
      class="rounded-xl"
      tabindex="0"
      @ended="isPlaying = false"
      @click="togglePlay"
      @keydown="handleKeydown"
    />

    <div
      v-show="!isPlaying"
      class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-b from-gray-950/50 to-20%"
    >
      <div class="inline-flex rounded-full bg-white/75 shadow-md">
        <UIcon
          name="i-ri-play-circle-fill"
          class="size-14 text-(--ui-secondary) group-hover:text-(--ui-color-secondary-600) lg:size-22 dark:group-hover:text-(--ui-color-secondary-500)"
        />
      </div>
    </div>

    <!-- Screen reader status announcements -->
    <div aria-live="polite" class="sr-only">
      {{ isPlaying ? "Video playing" : "Video paused" }}
    </div>
  </div>
</template>
