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

      <ElementVideo v-if="page.hero.video" v-bind="page.hero.video" />
    </UPageHero>

    <slot name="sections-cta" />

    <template v-for="(section, index) of page.sections" :key="index">
      <USeparator
        v-if="section.slot === 'features'"
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
        :class="[section.slot === 'features' && 'relative overflow-hidden']"
        :ui="{
          container:
            SECTION_SLOT_WIDTHS[section.slot!] ?? 'max-w-(--ui-container)',
        }"
      >
        <div
          v-if="section.slot === 'features'"
          class="bg-primary absolute top-10 -left-10 z-10 size-[300px] rounded-full opacity-10 blur-[200px]"
        />
        <div
          v-if="section.slot === 'features'"
          class="bg-primary absolute -right-10 -bottom-10 z-10 size-[300px] rounded-full opacity-10 blur-[200px]"
        />

        <template v-if="section.title" #title>
          <span v-html="section.title" />
        </template>

        <template v-if="section.description" #description>
          <span v-html="section.description" />
        </template>

        <!-- Horizontal sections: media in default slot, features as prop -->
        <template v-if="section.orientation === 'horizontal'">
          <ElementVideo v-if="section.video" v-bind="section.video" />
          <ElementCode v-else-if="section.code" v-bind="section.code" />
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

        <ElementVideo
          v-else-if="section.slot === 'video' && section.video"
          v-bind="section.video"
        />

        <ElementCode
          v-else-if="section.slot === 'code' && section.code"
          v-bind="section.code"
        />

        <UPageGrid v-else-if="section.slot === 'cards' && section.cards">
          <UPageCard
            v-for="card in section.cards"
            :key="card.id"
            :title="card.title"
            :description="card.description"
            :icon="card.icon"
            :to="card.to"
            :class="card.gradient"
          />
        </UPageGrid>
      </UPageSection>

      <USeparator
        v-if="section.slot === 'features'"
        :ui="{ border: 'border-primary/25' }"
      />
    </template>

    <UPageCTA v-bind="page.cta" variant="subtle" class="rounded-none">
      <template v-if="page.cta.title" #title>
        <span v-html="page.cta.title" />
      </template>

      <slot name="cta-image" />
    </UPageCTA>
  </div>
</template>
