<script setup lang="ts">
import type { BuyCollectionItem } from "@nuxt/content";
import { withQuery } from "ufo";

const props = defineProps<{
  page: BuyCollectionItem;
}>();

const licenseHolder = ref("");
const checkoutUrl = computed(() =>
  withQuery(props.page.plan.button.to, {
    "checkout[custom][licenseHolder]": licenseHolder.value || undefined,
  }),
);

const [DefinePricingPlanTemplate, ReusePricingPlanTemplate] =
  createReusableTemplate();
</script>

<template>
  <DefinePricingPlanTemplate>
    <UPricingPlan v-bind="page.plan" class="relative shadow-md max-lg:max-w-lg">
      <template #button>
        <UFormField
          label="Licensee"
          help="Who will own this license (e.g. your full name, organization, or client)? Will be you by default."
          :ui="{
            container: 'mt-2',
          }"
        >
          <UInput
            v-model="licenseHolder"
            placeholder="License holder"
            class="w-full"
          />
        </UFormField>

        <UButton v-bind="page.plan.button" :to="checkoutUrl" size="lg" block />

        <div
          class="absolute top-0 left-6 flex translate-y-[-50%] justify-center lg:left-8 xl:left-10"
        >
          <div class="inline-flex rounded-full bg-(--ui-bg)">
            <UButton
              label="50% off for Returning Customers"
              size="xs"
              variant="outline"
              to="https://hub.kirby.tools"
              class="rounded-full"
            />
          </div>
        </div>
      </template>
    </UPricingPlan>
  </DefinePricingPlanTemplate>

  <div v-if="page">
    <UPageSection
      :title="page.hero.title"
      :description="page.hero.description"
      :ui="{ container: 'py-16 sm:py-16 lg:py-16' }"
    />

    <UContainer :class="$slots['image-pricing'] ? 'max-w-6xl' : 'max-w-lg'">
      <div
        v-if="$slots['image-pricing']"
        class="flex justify-center lg:grid lg:grid-cols-2 lg:items-end lg:gap-16 lg:rounded-xl lg:bg-(--ui-color-primary-500) lg:p-12 dark:lg:bg-(--ui-color-primary-600)"
      >
        <div class="max-lg:hidden">
          <slot name="image-pricing" />
        </div>

        <ReusePricingPlanTemplate />
      </div>
      <ReusePricingPlanTemplate v-else />
    </UContainer>

    <UPageSection
      :title="page.faq.title"
      :description="page.faq.description"
      :ui="{ container: 'max-w-4xl' }"
    >
      <UPageAccordion
        :items="page.faq.items"
        multiple
        class="mx-auto max-w-4xl"
      >
        <template #content="{ item }">
          <MDC
            :value="item.content"
            class="text-muted prose dark:prose-invert max-w-none pb-3.5 text-base [&_p.my-5]:!my-0"
          />
        </template>
      </UPageAccordion>
    </UPageSection>
  </div>
</template>
