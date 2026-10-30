<script setup lang="ts">
import type { ProductId } from "#shared/products";
import type { SocialCardFormat } from "#shared/social-card";
import { isExhibitionProductId } from "#shared/exhibition";
import { PRODUCTS } from "#shared/products";
import { SOCIAL_CARD_FORMATS } from "#shared/social-card";

const props = withDefaults(
  defineProps<{
    productId: ProductId;
    format?: SocialCardFormat;
  }>(),
  { format: "og" },
);

provide(panelMockInertKey, true);
provide(panelMockFramedKey, true);
provide(socialCardKey, true);

const product = computed(() => PRODUCTS[props.productId]);
const size = computed(() => SOCIAL_CARD_FORMATS[props.format]);
const isWide = computed(() => props.format === "og");
</script>

<template>
  <div
    class="social-card flex flex-col overflow-hidden bg-(--social-card-back) font-sans"
    :style="{ width: `${size.width}px`, height: `${size.height}px` }"
  >
    <!-- On 4:3 the two `1fr` rows keep the gap between logo and title equal to the one between Tagline and frame. -->
    <div
      class="via-primary-500/50 grid min-h-0 flex-1 bg-linear-to-r from-transparent to-transparent bg-size-[100%_1px] bg-top bg-no-repeat"
      :class="
        isWide
          ? 'grid-cols-[1fr_auto] content-end items-center gap-12 px-[75px] pb-16'
          : 'grid-rows-[auto_1fr_auto_1fr] justify-items-start px-[100px] pt-[68px]'
      "
    >
      <div :class="[!isWide && 'row-start-3']">
        <h1
          class="leading-none font-semibold text-(--social-card-title)"
          :class="isWide ? 'text-5xl' : 'text-8xl'"
        >
          {{ product.name }}
        </h1>
        <p
          v-if="isWide"
          class="mt-1.5 max-w-[960px] text-3xl leading-tight font-medium text-balance text-(--social-card-tagline)"
        >
          {{ product.tagline.join(" ") }}
        </p>
        <p
          v-else
          class="mt-4 text-5xl leading-tight font-medium text-(--social-card-tagline)"
        >
          <span v-for="line in product.tagline" :key="line" class="block">
            {{ line }}
          </span>
        </p>
      </div>
      <UIcon
        name="i-tools-favicon"
        class="text-(--social-card-title)"
        :class="isWide ? 'size-20' : 'row-start-1 size-22'"
      />
    </div>

    <!-- The frame keeps its height, so a Tagline that wraps takes its room from the header and lifts the title. -->
    <div
      class="shadow-primary-500/30 flex-none rounded-t-[12px] border-b-0 border-black/5 shadow-[0_0_100px]"
      :class="
        isWide
          ? 'mx-[75px] h-[400px] border-4'
          : 'mx-[100px] h-[640px] border-6'
      "
    >
      <!-- Chrome clips each layer on its own and leaves a light seam in the corners; a no-op mask clips the subtree in one pass. -->
      <div
        class="relative h-full overflow-hidden rounded-t-[8px] mask-[linear-gradient(#000_0_0)]"
      >
        <div class="h-full" :style="{ zoom: isWide ? 1 : 1.4 }">
          <component
            :is="EXHIBITION_SCENES[productId]"
            v-if="isExhibitionProductId(productId)"
            theme="light"
          />
          <SocialCardCode v-else v-bind="SOCIAL_CARD_CODE[productId]" />
        </div>
        <div
          class="absolute inset-x-0 bottom-0 h-14 bg-linear-to-b from-transparent to-black/50"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* On a full-bleed ground the site's ramps read louder than on a page, so the
   card takes them at reduced chroma. */
.social-card {
  --social-card-chroma: 0.8;
  --social-card-back: oklch(
    from var(--color-primary-950) l calc(c * var(--social-card-chroma)) h
  );
  --social-card-title: oklch(
    from var(--color-primary-400) l calc(c * var(--social-card-chroma)) h
  );
  --social-card-tagline: oklch(
    from var(--color-primary-500) l calc(c * var(--social-card-chroma)) h
  );
}

/* Rendered larger without reflowing, so the columns keep their layout. */
.social-card .panel-mock:has(.k-serp-preview-field) {
  --social-card-zoom: 1.52;
  zoom: var(--social-card-zoom);
  width: calc(100% * var(--social-card-zoom));
}

.social-card .panel-mock:has(.k-serp-preview-field) .panel-mock-stage {
  overflow: hidden;
  scroll-padding-top: var(--panel-stage-inset);
}

.social-card .k-serp-preview-field {
  scroll-initial-target: nearest;
}

/* Kirby pins the header while the view scrolls; a card does not scroll, and a
   pinned header would cover a quarter of the frame. */
.social-card .panel-mock:has(.k-serp-preview-field) .k-header {
  position: static;
}

/* Anchored right, so the header's view buttons stay in the frame. */
.social-card .panel-mock:has(.panel-deploy-trigger-button) {
  --social-card-zoom: 1.35;
  zoom: var(--social-card-zoom);
  width: calc(100% * var(--social-card-zoom));
  margin-inline-start: calc(100% - 100% * var(--social-card-zoom));
}

.social-card .k-panel:has(> .k-panel-minimap) > .panel-mock-stage {
  filter: blur(3px);
  opacity: 0.85;
}
</style>
