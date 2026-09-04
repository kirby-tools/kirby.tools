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

const product = computed(() => PRODUCTS[props.productId]);
const size = computed(() => SOCIAL_CARD_FORMATS[props.format]);
const isWide = computed(() => props.format === "og");
</script>

<template>
  <div
    class="social-card relative overflow-hidden bg-(--social-card-back) font-sans"
    :style="{ width: `${size.width}px`, height: `${size.height}px` }"
  >
    <div
      class="absolute flex"
      :class="
        isWide
          ? 'inset-x-[75px] top-[75px] flex-row items-center justify-between gap-12'
          : 'top-[68px] left-[100px] flex-col-reverse items-start gap-[110px]'
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
              ? 'mt-1.5 max-w-[960px] text-4xl'
              : 'mt-4 max-w-[1400px] text-5xl'
          "
        >
          {{ product.tagline }}
        </p>
      </div>
      <UIcon
        name="i-tools-favicon"
        class="shrink-0 text-(--social-card-title)"
        :class="isWide ? 'size-20' : 'size-23'"
      />
    </div>

    <div
      class="absolute bottom-0 rounded-t-[12px] border-4 border-b-0 border-black/5 shadow-[0_0_100px] shadow-white/12"
      :class="
        isWide ? 'inset-x-[75px] top-[233px]' : 'inset-x-[100px] top-[564px]'
      "
    >
      <!-- Chrome clips each layer on its own and leaves a light seam in the corners; a no-op mask clips the subtree in one pass. -->
      <div
        class="relative h-full overflow-hidden rounded-t-[8px] mask-[linear-gradient(#000_0_0)]"
      >
        <div class="h-full" :style="{ zoom: isWide ? 1 : 1.4 }">
          <HomeShowcaseScene :product-id="productId" theme="light" />
        </div>
        <div
          class="absolute inset-x-0 bottom-0 h-1/5 bg-linear-to-b from-transparent to-black/50"
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
</style>
