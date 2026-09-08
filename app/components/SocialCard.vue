<script setup lang="ts">
import type { ExhibitionProductId } from "#shared/exhibition";
import type { SocialCardFormat } from "#shared/social-card";
import { PRODUCTS } from "#shared/products";
import { SOCIAL_CARD_FORMATS } from "#shared/social-card";

const props = withDefaults(
  defineProps<{
    productId: ExhibitionProductId;
    format?: SocialCardFormat;
  }>(),
  { format: "og" },
);

provide(panelMockInertKey, true);

const product = computed(() => PRODUCTS[props.productId]);
const size = computed(() => SOCIAL_CARD_FORMATS[props.format]);
const isWide = computed(() => props.format === "og");
</script>

<template>
  <div
    class="social-card flex flex-col overflow-hidden bg-(--social-card-back) font-sans"
    :style="{ width: `${size.width}px`, height: `${size.height}px` }"
  >
    <div
      class="via-primary-500/50 flex shrink-0 bg-linear-to-r from-transparent to-transparent bg-size-[100%_1px] bg-top bg-no-repeat"
      :class="
        isWide
          ? 'flex-row items-center justify-between gap-12 px-[75px] pt-[75px] pb-16'
          : 'flex-col-reverse items-start gap-[110px] px-[100px] pt-[68px] pb-30'
      "
    >
      <div>
        <h1
          class="leading-none font-semibold text-(--social-card-title)"
          :class="isWide ? 'text-5xl' : 'text-8xl'"
        >
          {{ product.name }}
        </h1>
        <p
          class="leading-tight font-medium text-(--social-card-tagline)"
          :class="
            isWide
              ? 'mt-1.5 max-w-[960px] text-3xl'
              : 'mt-4 max-w-[1400px] text-5xl'
          "
        >
          {{ product.tagline }}
        </p>
      </div>
      <UIcon
        name="i-tools-favicon"
        class="shrink-0 text-(--social-card-title)"
        :class="isWide ? 'size-20' : 'size-22'"
      />
    </div>

    <div
      class="shadow-primary-500/30 min-h-0 flex-1 rounded-t-[12px] border-b-0 border-black/5 shadow-[0_0_100px]"
      :class="isWide ? 'mx-[75px] border-4' : 'mx-[100px] border-6'"
    >
      <!-- Chrome clips each layer on its own and leaves a light seam in the corners; a no-op mask clips the subtree in one pass. -->
      <div
        class="relative h-full overflow-hidden rounded-t-[8px] mask-[linear-gradient(#000_0_0)]"
      >
        <div class="h-full" :style="{ zoom: isWide ? 1 : 1.4 }">
          <ExhibitionScene :product-id="productId" theme="light" />
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

/* The mock chrome and the frame around it belong to a page; here the frame is the card's. */
.social-card .panel-mock {
  margin: 0;
  border: 0;
  border-radius: 0;
  height: 100%;
}

.social-card .panel-mock-chrome {
  display: none;
}

.social-card .panel-mock .k-panel,
.social-card .panel-mock .panel-mock-stage {
  height: 100%;
}

/* Rendered larger without reflowing, so the columns keep their layout. */
.social-card .panel-mock:has(.panel-serp-preview-snippet) {
  --social-card-zoom: 1.52;
  zoom: var(--social-card-zoom);
  width: calc(100% * var(--social-card-zoom));
}

.social-card .panel-mock:has(.panel-serp-preview-snippet) .panel-mock-stage {
  overflow: hidden;
  scroll-padding-top: var(--panel-stage-inset);
}

.social-card .k-section:has(.panel-serp-preview-snippet) {
  scroll-initial-target: nearest;
}

/* Kirby pins the header while the view scrolls; a card does not scroll, and a
   pinned header would cover a quarter of the frame. */
.social-card .panel-mock:has(.panel-serp-preview-snippet) .k-header {
  position: static;
}

.social-card .k-panel:has(> .k-panel-minimap) > .panel-mock-stage {
  filter: blur(3px);
  opacity: 0.85;
}
</style>
