<script setup lang="ts">
import { PRODUCTS } from "#shared/constants";

// #region Showcase
const COLOR_CLASSES: Record<
  ExhibitionProductId,
  { chipClass: string; accentClass: string }
> = {
  copilot: {
    chipClass: "bg-copilot/10 text-copilot",
    accentClass: "bg-copilot",
  },
  "content-translator": {
    chipClass: "bg-content-translator/10 text-content-translator",
    accentClass: "bg-content-translator",
  },
  "seo-audit": {
    chipClass: "bg-seo-audit/10 text-seo-audit",
    accentClass: "bg-seo-audit",
  },
};

const SHOWCASE_TABS = EXHIBITION_PRODUCT_IDS.map((id) => ({
  value: id,
  label: PRODUCTS[id].name,
  description: PRODUCTS[id].description,
  icon: PRODUCTS[id].icon,
  ...COLOR_CLASSES[id],
}));
// #endregion

const activeProductId = ref<ExhibitionProductId>("copilot");

const accentClass = computed(
  () => COLOR_CLASSES[activeProductId.value].accentClass,
);
</script>

<template>
  <div>
    <UTabs
      v-model="activeProductId"
      :items="SHOWCASE_TABS"
      :content="false"
      variant="link"
      :ui="{
        list: 'gap-2 mb-0 -mt-px border-t border-b-0',
        indicator: `bottom-auto -top-px h-px w-8 translate-x-[calc(var(--reka-tabs-indicator-position)+var(--reka-tabs-indicator-size)/2-calc(var(--spacing)*4))] ${accentClass}`,
        trigger: 'flex-1 cursor-pointer flex-col gap-2 px-4 py-6 after:hidden',
        label: 'block w-full whitespace-normal',
      }"
    >
      <template #leading="{ item }">
        <!-- Holds the indicator's spot until Reka mounts it on the client. -->
        <span
          aria-hidden="true"
          class="absolute -top-[calc(var(--spacing)+1px)] left-1/2 hidden h-px w-8 -translate-x-1/2 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:group-data-[state=active]:block"
          :class="item.accentClass"
        />

        <!-- What the indicator's `w-8` is measured against. -->
        <span
          class="flex size-8 items-center justify-center rounded-md transition-colors"
          :class="
            activeProductId === item.value
              ? item.chipClass
              : 'bg-elevated text-dimmed'
          "
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
        </span>
      </template>

      <template #default="{ item }">
        <span class="text-highlighted block text-sm font-semibold text-pretty">
          {{ item.label }}
        </span>
        <span class="text-muted mt-1 hidden text-sm text-pretty sm:block">
          {{ item.description }}
        </span>
      </template>
    </UTabs>

    <div class="relative">
      <div
        aria-hidden="true"
        class="absolute -inset-4 -z-10 hidden rounded-sm opacity-25 blur-3xl transition-colors duration-500 dark:block"
        :class="accentClass"
      />

      <HomeShowcaseScene
        :product-id="activeProductId"
        class="my-0! rounded-sm shadow-2xl shadow-black/10 dark:shadow-black/60 [&_.panel-mock-stage]:min-h-104 max-sm:[&_.panel-mock-stage]:h-104 max-sm:[&_.panel-mock-stage]:overflow-hidden"
      />
    </div>
  </div>
</template>
