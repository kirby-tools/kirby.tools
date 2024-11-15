<script setup lang="ts">
import { NuxtLink } from "#components";

const { data: page } = await useAsyncData("index", () =>
  queryContent("/").findOne(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  titleTemplate: "",
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImageComponent("Default", {
  title: page.value.title,
  description: page.value.description,
});
</script>

<template>
  <div v-if="page">
    <ULandingHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{
        wrapper: '!py-24',
        container: 'max-w-4xl',
      }"
    >
      <div
        class="landing-grid absolute inset-0 z-[-1] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      />

      <template #headline>
        <UBadge
          v-if="page.hero.headline"
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          <NuxtLink
            :to="page.hero.headline.to"
            target="_blank"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span class="absolute inset-0" aria-hidden="true" />
          </NuxtLink>
          {{ page.hero.headline.label }}
          <UIcon
            v-if="page.hero.headline.icon"
            :name="page.hero.headline.icon"
            class="pointer-events-none ml-1 h-4 w-4"
          />
        </UBadge>
      </template>

      <template #title>
        <span v-html="page.hero.title" />
      </template>

      <template #description>
        <span v-html="page.hero.description" />

        <div
          class="relative my-8 flex h-[26rem] w-full flex-col items-center justify-center overflow-hidden"
        >
          <span class="pointer-events-none text-center leading-none">
            <UIcon
              name="i-logos-kirby-icon"
              class="h-[6rem] w-[6rem] dark:invert"
            />
          </span>

          <!-- Inner Circles -->
          <ElementOrbit
            :as="NuxtLink"
            to="#products"
            class="!size-12 items-center justify-center border-none bg-transparent"
            :duration="20"
            :delay="10"
            :radius="90"
            path
            direction="counterClockwise"
          >
            <Logo class="text-primary h-10 w-auto" />
          </ElementOrbit>

          <!-- Outer Circles (reverse) -->
          <ElementOrbit
            :as="NuxtLink"
            to="#seo-audit"
            class="!size-12 items-center justify-center border-none bg-transparent"
            :radius="180"
            :duration="20"
            path
          >
            <LogosKirbySeo class="h-10 w-auto text-[#75c932]" />
          </ElementOrbit>
          <ElementOrbit
            :as="NuxtLink"
            to="#copilot"
            class="!size-12 items-center justify-center border-none bg-transparent"
            :radius="180"
            :duration="20"
            :delay="200"
            direction="counterClockwise"
          >
            <LogosKirbyCopilot class="h-10 w-auto text-[#c66bdf]" />
          </ElementOrbit>
        </div>
      </template>
    </ULandingHero>

    <div id="products" />

    <ULandingSection
      v-for="(section, index) in page.sections"
      :id="section.id"
      :key="index"
      :title="section.title"
      :description="section.description"
      :align="section.align"
      :features="section.features"
      :links="section.links"
    >
      <template #title>
        <span v-html="section.title" />
      </template>

      <template #description>
        <span v-html="section.description" />
      </template>

      <template #default>
        <ElementVideo v-if="section.video" v-bind="section.video" />
      </template>
    </ULandingSection>

    <ULandingSection v-if="page.outro">
      <ULandingCTA
        v-bind="page.outro"
        class="bg-gray-100/50 dark:bg-gray-800/50"
      >
        <template #title>
          <span v-html="page.outro.title" />
        </template>

        <template #default>
          <div class="align-start flex h-full justify-center">
            <UIcon
              v-if="page.outro.icon"
              :name="page.outro.icon.name"
              class="h-48 w-48 text-gray-300 dark:text-gray-600"
            />
          </div>
        </template>
      </ULandingCTA>
    </ULandingSection>
  </div>
</template>

<style scoped>
.landing-grid {
  background-size: 100px 100px;
  background-image: linear-gradient(
      to right,
      rgb(var(--color-gray-200)) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgb(var(--color-gray-200)) 1px, transparent 1px);
}
.dark {
  .landing-grid {
    background-image: linear-gradient(
        to right,
        rgb(var(--color-gray-800)) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        rgb(var(--color-gray-800)) 1px,
        transparent 1px
      );
  }
}
</style>
