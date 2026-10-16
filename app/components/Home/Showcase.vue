<script setup lang="ts">
import type { ShowcaseProductId } from "#shared/exhibition";
import { SHOWCASE_PRODUCT_IDS } from "#shared/exhibition";
import { PRODUCTS } from "#shared/products";

const COLOR_CLASSES: Record<
  ShowcaseProductId,
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

const SHOWCASE_TABS = SHOWCASE_PRODUCT_IDS.map((id) => ({
  value: id,
  label: PRODUCTS[id].name,
  description: PRODUCTS[id].description,
  icon: PRODUCTS[id].icon,
  ...COLOR_CLASSES[id],
}));

const PANEL_TABS = [PANEL_TAB];
// A phone keeps the height the Content Translator dialog needs for its buttons.
const BODY_CLASS = "h-120 sm:h-112";

const activeProductId = ref<ShowcaseProductId>("copilot");
const activeTab = ref("panel");
// Bumping it remounts the Scene, so the Window's Replay plays it from the start.
const replayCount = ref(0);

provide(sceneAutoplayKey, true);

const accentClass = computed(
  () => COLOR_CLASSES[activeProductId.value].accentClass,
);
</script>

<template>
  <div>
    <div class="mx-auto max-w-4xl">
      <UTabs
        v-model="activeProductId"
        :items="SHOWCASE_TABS"
        :content="false"
        variant="link"
        :ui="{
          list: 'gap-2 mb-0 -mt-px border-t border-b-0',
          indicator: `bottom-auto -top-px h-px w-8 translate-x-[calc(var(--reka-tabs-indicator-position)+var(--reka-tabs-indicator-size)/2-calc(var(--spacing)*4))] ${accentClass}`,
          trigger:
            'flex-1 cursor-pointer flex-col justify-start gap-2 px-4 py-6 after:hidden',
          label: 'block w-full whitespace-normal',
        }"
      >
        <template #leading="{ item }">
          <!-- The indicator's spot until Reka mounts it on the client. -->
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
          <span
            class="text-highlighted block text-sm font-semibold text-pretty"
          >
            {{ item.label }}
          </span>
          <span class="text-muted mt-1 hidden text-sm text-pretty sm:block">
            {{ item.description }}
          </span>
        </template>
      </UTabs>
    </div>

    <div class="relative">
      <div
        aria-hidden="true"
        class="absolute -inset-4 -z-10 hidden rounded-sm opacity-25 blur-3xl transition-colors duration-500 dark:block"
        :class="accentClass"
      />

      <!-- Copilot's Window has a second tab, where Claude writes what Copilot
           writes in the Panel tab. -->
      <ProductCopilotAgents
        v-if="activeProductId === 'copilot'"
        start="panel"
        :body-class="BODY_CLASS"
        class="shadow-2xl shadow-black/10 dark:shadow-black/60"
      >
        <template #idle>
          <ProductCopilotScene />
        </template>
      </ProductCopilotAgents>
      <ExhibitionWindow
        v-else
        v-model="activeTab"
        :tabs="PANEL_TABS"
        :body-class="BODY_CLASS"
        class="shadow-2xl shadow-black/10 dark:shadow-black/60"
        @replay="replayCount++"
      >
        <template #panel>
          <component
            :is="EXHIBITION_SCENES[activeProductId]"
            :key="`${activeProductId}-${replayCount}`"
          />
        </template>
      </ExhibitionWindow>
    </div>
  </div>
</template>
