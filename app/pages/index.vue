<script setup lang="ts">
// eslint-disable-next-line vue/prefer-import-from-vue
import { isObject } from "@vue/shared";

const { data: page } = await useAsyncData("index", () =>
  queryCollection("index").first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

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

useSeoMeta({
  titleTemplate: "",
  title: page.value.seo?.title || page.value.title,
  ogTitle: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
  ogDescription: page.value.seo?.description || page.value.description,
});
</script>

<template>
  <div v-if="page" class="relative">
    <AppHeaderBackground
      class="pointer-events-none absolute top-[-1px] w-full shrink-0 text-(--ui-primary) transition-opacity"
      :class="[
        isLoading ? 'animate-pulse' : isEntering ? '' : 'opacity-0',
        hasEntered ? 'duration-[400ms]' : 'duration-1000',
      ]"
    />

    <ElementWarpBackground :beam-duration="6">
      <UPageHero
        :description="page.description"
        :links="page.hero.links"
        class="bg-radial from-(--ui-bg) from-30%"
        :ui="{
          container: 'py-24 sm:py-24 lg:py-24',
        }"
      >
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

        <template #title>
          <span v-html="page.hero.title" />
        </template>

        <template #description>
          <span v-html="page.hero.description" />
        </template>
      </UPageHero>
    </ElementWarpBackground>

    <USeparator />
    <div id="products" />

    <UPageSection
      v-for="(section, index) in page.sections"
      :id="section.id"
      :key="index"
      :title="section.title"
      :description="section.description"
      :features="section.features"
      orientation="horizontal"
      :reverse="section.reverse"
      :ui="{
        root: 'py-16 sm:py-24 lg:py-24',
        container:
          'rounded-lg py-8 transition-[background-color] hover:bg-(--ui-bg-elevated) sm:py-8 lg:py-8 dark:hover:bg-(--ui-bg-elevated)/50 [&>:first-child]:relative',
        title: 'hover:underline',
      }"
    >
      <template #title>
        <NuxtLink v-if="section.to" :to="section.to">
          <span class="absolute inset-0 z-10" />
          <span v-html="section.title" />
        </NuxtLink>
        <span v-else v-html="section.title" />
      </template>

      <template #description>
        <span v-html="section.description" />
      </template>

      <ElementVideo v-if="section.video" v-bind="section.video" />
    </UPageSection>

    <UPageCTA v-bind="page.cta" variant="subtle" class="rounded-none">
      <template v-if="page.cta.title" #title>
        <span v-html="page.cta.title" />
      </template>

      <slot name="cta-image" />
    </UPageCTA>
  </div>
</template>
