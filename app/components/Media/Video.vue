<script setup lang="ts">
const props = defineProps<{
  src: string;
  poster: string;
  label?: string;
  glow?: boolean;
  loop?: boolean;
}>();

const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const hasTouchCapability = useMediaQuery("(hover: none)");
const video = useTemplateRef("video");
const isPlaying = ref(false);
const canAutoplay = ref(true);

useIntersectionObserver(
  video,
  ([entry]) => {
    if (
      entry?.isIntersecting &&
      canAutoplay.value &&
      !prefersReducedMotion.value &&
      !hasTouchCapability.value
    ) {
      play();
      canAutoplay.value = false;
    } else if (isPlaying.value) {
      pause();
    }
  },
  { threshold: 1 },
);

async function play() {
  try {
    await video.value?.play();
    isPlaying.value = true;
  } catch {
    // Autoplay blocked by browser, user can still click to play
  }
}

function pause() {
  video.value?.pause();
  isPlaying.value = false;
}

function togglePlay() {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    togglePlay();
  }
}

function handleEnded() {
  if (!props.loop) {
    isPlaying.value = false;
  }
}
</script>

<template>
  <div class="relative">
    <NuxtImg
      v-if="glow"
      :src="poster"
      alt=""
      aria-hidden="true"
      loading="lazy"
      class="pointer-events-none absolute -inset-4 -z-10 size-full rounded-2xl object-cover blur-2xl saturate-150 transition-opacity duration-500 lg:-inset-6"
      :class="[isPlaying ? 'opacity-50' : 'opacity-25']"
    />

    <div
      role="button"
      tabindex="-1"
      class="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-shadow duration-300"
      :class="[
        isPlaying ? 'shadow-xl' : 'hover:shadow-primary/20 hover:shadow-2xl',
      ]"
      @click="togglePlay"
    >
      <video
        ref="video"
        :src="src"
        :poster="poster"
        :loop="loop"
        :aria-label="label"
        muted
        playsinline
        class="focus-visible:ring-primary block w-full rounded-xl focus:outline-none focus-visible:ring-2"
        tabindex="0"
        @ended="handleEnded"
        @keydown="handleKeydown"
      />

      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-linear-to-b from-gray-950/60 via-transparent to-gray-950/40 transition-opacity duration-200"
        :class="[isPlaying && 'opacity-0']"
      >
        <div
          class="flex rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:bg-white/95"
        >
          <UIcon
            name="i-ri-play-circle-fill"
            class="text-primary size-14 lg:size-22"
          />
        </div>
      </div>
    </div>

    <!-- Screen reader announcements -->
    <div aria-live="polite" class="sr-only">
      {{ label || "Video" }}: {{ isPlaying ? "playing" : "paused" }}
    </div>
  </div>
</template>
