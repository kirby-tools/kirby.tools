<script setup lang="ts">
import type { ProductCollectionItem } from "@nuxt/content";
// eslint-disable-next-line vue/prefer-import-from-vue
import { isObject } from "@vue/shared";

defineProps<{
  page: ProductCollectionItem;
}>();

const SECTION_SLOT_WIDTHS: Record<string, string> = {
  video: "max-w-4xl",
};

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
      class="pointer-events-none absolute -top-px z-10 w-full shrink-0 text-(--ui-primary) transition-opacity"
      :class="[
        isLoading ? 'animate-pulse' : isEntering ? '' : 'opacity-0',
        hasEntered ? 'duration-[400ms]' : 'duration-1000',
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
        <span v-html="page.hero.title" />
      </template>

      <template v-if="page.hero.description" #description>
        <span v-html="page.hero.description" />
      </template>

      <slot name="hero" />

      <ElementVideo v-if="page.hero.video" v-bind="page.hero.video" />
    </UPageHero>

    <slot name="sections-cta" />

    <UPageSection
      v-for="(section, index) of page.sections"
      :id="section.slot"
      :key="index"
      :links="section.links"
      :orientation="section.orientation"
      :reverse="section.reverse"
      :ui="{
        container:
          SECTION_SLOT_WIDTHS[section.slot!] ?? 'max-w-(--ui-container)',
      }"
    >
      <template v-if="section.title" #title>
        <span v-html="section.title" />
      </template>

      <template v-if="section.description" #description>
        <span v-html="section.description" />
      </template>

      <UPageGrid v-if="section.slot === 'features'">
        <UPageCard
          v-for="(item, itemIndex) in section.features"
          :key="itemIndex"
          v-bind="item"
          variant="soft"
          :orientation="item.orientation"
        >
          <UColorModeImage
            v-if="item.image"
            :light="`${item.image.src}-light.svg`"
            :dark="`${item.image.src}-dark.svg`"
            :width="item.image.width"
            :height="item.image.height"
            :alt="section.title"
            class="w-full object-cover"
          />
        </UPageCard>
      </UPageGrid>
      <ElementVideo
        v-else-if="section.slot === 'video'"
        v-bind="section.video"
      />
    </UPageSection>

    <UPageCTA v-bind="page.cta" variant="subtle" class="rounded-none">
      <template v-if="page.cta.title" #title>
        <span v-html="page.cta.title" />
      </template>

      <slot name="cta-image" />
    </UPageCTA>
  </div>
</template>
