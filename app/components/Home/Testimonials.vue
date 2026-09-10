<script setup lang="ts">
import type { IndexCollectionItem } from "@nuxt/content";
import { isObject } from "utilful/object";
import logoMetrics from "~/data/logo-metrics.json";

const props = defineProps<{
  items: IndexCollectionItem["testimonials"]["items"];
}>();

const LOGO_SCALE = 1.25;

const root = useTemplateRef("root");
const isVisible = useElementVisibility(root, { threshold: 0.5, once: true });
const reducedMotion = usePreferredReducedMotion();

// Auto-scroll options, false until the carousel is in view and motion is allowed – Nuxt UI
// loads the plugin on the first truthy value, so scrolling starts from the first logo.
const autoScroll = computed(
  () =>
    isVisible.value &&
    reducedMotion.value !== "reduce" && {
      speed: 1,
      startDelay: 250,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    },
);

const logos = computed(() =>
  props.items.map((testimonial) => {
    const logoPath = isObject(testimonial.logo)
      ? testimonial.logo.light
      : testimonial.logo;
    const filename = logoPath.split("/").pop()!;
    const metrics = logoMetrics[filename as keyof typeof logoMetrics];

    return {
      ...testimonial,
      width: metrics && Math.round(metrics.width * LOGO_SCALE),
      height: metrics && Math.round(metrics.height * LOGO_SCALE),
    };
  }),
);

// Places the first logo where the `mask-x-from-85%` fade ends.
function alignAfterFade(viewSize: number) {
  return viewSize * 0.15;
}
</script>

<template>
  <div ref="root" class="min-w-0">
    <UCarousel
      v-slot="{ item }"
      :items="logos"
      :auto-scroll="autoScroll"
      :align="alignAfterFade"
      drag-free
      loop
      aria-label="Customer logos"
      :ui="{
        viewport: 'mask-x-from-85%',
        container: 'items-center -ms-16 sm:-ms-20',
        item: 'basis-auto ps-16 sm:ps-20',
      }"
    >
      <span class="block">
        <UColorModeImage
          v-if="isObject(item.logo)"
          :light="item.logo.light"
          :dark="item.logo.dark"
          :alt="item.brand"
          :width="item.width"
          :height="item.height"
        />
        <img
          v-else
          :src="item.logo"
          :alt="item.brand"
          :width="item.width"
          :height="item.height"
        />
      </span>
    </UCarousel>
  </div>
</template>
