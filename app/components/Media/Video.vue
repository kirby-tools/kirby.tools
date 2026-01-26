<script setup lang="ts">
defineProps<{
  src: string;
  poster: string;
  label?: string;
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
    class="group ring-default relative cursor-pointer rounded-xl shadow ring"
    :class="[!isPlaying && 'hover:ring-secondary hover:shadow-md']"
    @click="togglePlay"
  >
    <video
      ref="video"
      :src="src"
      :poster="poster"
      :aria-label="label || 'Demonstration video'"
      muted
      playsinline
      class="focus-visible:ring-primary rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      tabindex="0"
      @ended="isPlaying = false"
      @keydown="handleKeydown"
    />

    <div
      v-show="!isPlaying"
      class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-linear-to-b from-gray-950/50 to-20%"
    >
      <div class="inline-flex rounded-full bg-white/75 shadow-md">
        <UIcon
          name="i-ri-play-circle-fill"
          class="text-secondary group-hover:text-secondary-600 dark:group-hover:text-secondary-500 size-14 lg:size-22"
        />
      </div>
    </div>

    <!-- Screen reader status announcements -->
    <div aria-live="polite" class="sr-only">
      {{ label || "Video" }}: {{ isPlaying ? "playing" : "paused" }}
    </div>
  </div>
</template>
