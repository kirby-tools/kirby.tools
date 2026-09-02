<script setup lang="ts">
import type { ProductCollectionItem } from "@nuxt/content";
import { isObject } from "@vue/shared";

defineProps<{
  page: ProductCollectionItem;
}>();

const SECTION_SLOT_WIDTHS: Record<string, string> = {
  video: "max-w-4xl",
};

const FEATURE_SLOTS = new Set(["features", "feature-cards"]);

const NuxtLink = resolveComponent("NuxtLink");

const { isLoading } = useLoadingIndicator();
const isEntering = ref(false);
const hasEntered = ref(false);

onMounted(() => {
  setTimeout(() => {
    isEntering.value = true;
    setTimeout(() => {
      hasEntered.value = true;
    }, 1000);
  }, 0);
});
</script>

<template>
  <div v-if="page" class="relative">
    <AppHeaderBackground
      class="text-primary pointer-events-none absolute -top-px z-10 w-full shrink-0 transition-opacity"
      :class="[
        isLoading ? 'animate-pulse' : isEntering ? '' : 'opacity-0',
        hasEntered ? 'duration-400' : 'duration-1000',
      ]"
    />

    <UPageHero :orientation="page.hero.orientation" :links="page.hero.links">
      <template #headline>
        <UBadge
          v-if="page.hero.headline"
          :as="NuxtLink"
          :label="page.hero.headline.label"
          :icon="
            isObject(page.hero.headline.icon)
              ? page.hero.headline.icon.name
              : page.hero.headline.icon
          "
          :to="page.hero.headline.to"
          :color="page.hero.headline.color"
          :variant="page.hero.headline.variant ?? 'subtle'"
          class="rounded-full"
          :ui="{
            leadingIcon: isObject(page.hero.headline.icon)
              ? page.hero.headline.icon.class
              : undefined,
          }"
        />
      </template>

      <template v-if="page.hero.title" #title>
        <slot name="hero-title">
          <span v-html="page.hero.title" />
        </slot>
      </template>

      <template v-if="page.hero.description" #description>
        <span v-html="page.hero.description" />
      </template>

      <slot name="hero" />

      <MediaVideo v-if="page.hero.video" v-bind="page.hero.video" />
    </UPageHero>

    <slot name="sections-cta" />

    <template v-for="(section, index) of page.sections" :key="index">
      <USeparator
        v-if="FEATURE_SLOTS.has(section.slot!)"
        :ui="{ border: 'border-primary/25' }"
      />

      <UPageSection
        :id="section.slot"
        :links="section.links"
        :orientation="section.orientation"
        :reverse="section.reverse"
        :features="
          section.orientation === 'horizontal' ? section.features : undefined
        "
        :class="[
          FEATURE_SLOTS.has(section.slot!) && 'relative overflow-hidden',
          index % 2 === 1 && 'bg-muted/25',
          index === 0 &&
            !$slots['sections-cta'] &&
            'border-default lg:border-t',
        ]"
        :ui="{
          container:
            SECTION_SLOT_WIDTHS[section.slot!] ?? 'max-w-(--ui-container)',
        }"
      >
        <template #top>
          <BackgroundContainerRules />
          <BackgroundDots
            v-if="FEATURE_SLOTS.has(section.slot!)"
            class="mx-4 sm:mx-6 lg:mx-8"
          />
        </template>

        <template v-if="section.title" #title>
          <span v-html="section.title" />
        </template>

        <template v-if="section.description" #description>
          <span v-html="section.description" />
        </template>

        <!-- Horizontal sections: media in default slot, features as prop -->
        <template v-if="section.orientation === 'horizontal'">
          <MediaVideo v-if="section.video" v-bind="section.video" />
          <MediaCode v-else-if="section.code" v-bind="section.code" />
        </template>

        <!-- Vertical features section: render feature cards grid -->
        <UPageGrid v-else-if="section.slot === 'features' && section.features">
          <UPageCard
            v-for="(item, itemIndex) in section.features"
            :key="itemIndex"
            v-bind="item"
            variant="soft"
            :orientation="item.orientation"
          >
            <UColorModeImage
              v-if="item.image"
              :light="item.image.src"
              :dark="item.image.src"
              :width="item.image.width"
              :height="item.image.height"
              :alt="item.image.alt || undefined"
              class="w-full object-contain"
              :class="item.image.class"
            />
          </UPageCard>
        </UPageGrid>

        <MediaVideo
          v-else-if="section.slot === 'video' && section.video"
          v-bind="section.video"
        />

        <MediaCode
          v-else-if="section.slot === 'code' && section.code"
          v-bind="section.code"
        />

        <UPageGrid
          v-else-if="section.slot === 'feature-cards' && section.cards"
          class="gap-4"
        >
          <ProductFeatureCard
            v-for="card in section.cards"
            :key="card.id"
            v-bind="card"
          >
            <slot :name="`feature-${card.id}`" />
          </ProductFeatureCard>
        </UPageGrid>
      </UPageSection>

      <USeparator
        v-if="FEATURE_SLOTS.has(section.slot!)"
        :ui="{ border: 'border-primary/25' }"
      />
    </template>

    <UPageCTA v-bind="page.cta" variant="subtle" class="relative rounded-none">
      <BackgroundContainerRules />

      <template v-if="page.cta.title" #title>
        <span v-html="page.cta.title" />
      </template>

      <slot name="cta-image" />
    </UPageCTA>
  </div>
</template>
