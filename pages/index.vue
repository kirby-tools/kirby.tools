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
          size="md"
          class="hover:bg-primary-100 dark:bg-primary-950/100 dark:hover:bg-primary-900 relative rounded-full font-medium shadow-none"
        >
          <NuxtLink
            :to="page.hero.headline.to"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span class="absolute inset-0" aria-hidden="true" />
          </NuxtLink>

          <span class="flex items-center gap-1">
            <UIcon
              v-if="page.hero.headline.icon"
              :name="page.hero.headline.icon"
              class="pointer-events-none h-4 w-4"
              :class="page.hero.headline.iconClass"
            />
            {{ page.hero.headline.label }}
          </span>
        </UBadge>
      </template>

      <template #title>
        <span class=""
          >The Kirby<br />
          <span
            class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-rhino-700 to-rhino-500/40 bg-clip-text text-center text-transparent dark:from-rhino-500 dark:to-rhino-700/40"
            >Plugin System</span
          ></span
        >
      </template>

      <template #description>
        <span v-html="page.hero.description" />

        <div
          class="relative mt-8 flex h-[24rem] w-full flex-col items-center justify-center overflow-hidden md:h-[26rem]"
        >
          <span class="pointer-events-none text-center leading-none">
            <UIcon
              name="i-logos-kirby-icon"
              class="size-20 md:size-24 dark:invert"
            />
          </span>

          <!-- Inner Circles -->
          <ElementOrbit
            :as="NuxtLink"
            to="#products"
            class="!size-12 items-center justify-center border-none bg-transparent"
            direction="counterClockwise"
            :duration="20"
            :delay="10"
            :radius="90"
            has-path
          >
            <Logo class="text-primary h-8 w-auto md:h-10" />
          </ElementOrbit>

          <!-- Outer Circles (mobile) -->
          <ElementOrbit
            :as="NuxtLink"
            to="#seo-audit"
            class="!size-12 items-center justify-center border-none bg-transparent md:hidden"
            :radius="140"
            :duration="20"
            has-path
            path-class="md:hidden"
          >
            <LogosKirbySeo class="h-8 w-auto text-[#75c932]" />
          </ElementOrbit>
          <ElementOrbit
            :as="NuxtLink"
            to="#copilot"
            class="!size-12 items-center justify-center border-none bg-transparent md:hidden"
            direction="counterClockwise"
            :radius="140"
            :duration="20"
            :delay="200"
          >
            <LogosKirbyCopilot class="h-8 w-auto text-[#c66bdf]" />
          </ElementOrbit>

          <!-- Outer Circles -->
          <ElementOrbit
            :as="NuxtLink"
            to="#seo-audit"
            class="hidden !size-12 items-center justify-center border-none bg-transparent md:block"
            :radius="180"
            :duration="20"
            has-path
            path-class="hidden md:block"
          >
            <LogosKirbySeo class="h-10 w-auto text-[#75c932]" />
          </ElementOrbit>
          <ElementOrbit
            :as="NuxtLink"
            to="#copilot"
            class="hidden !size-12 items-center justify-center border-none bg-transparent md:block"
            direction="counterClockwise"
            :radius="180"
            :duration="20"
            :delay="200"
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
      :ui="{
        wrapper: 'rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50',
        container: '[&>:first-child]:relative',
        title: 'hover:underline',
        description: 'text-base/6 text-gray-500 dark:text-gray-400',
      }"
    >
      <template #title>
        <NuxtLink v-if="section.links?.[0]?.to" :to="section.links[0].to">
          <span class="absolute inset-0 z-10" />
          <span v-html="section.title" />
        </NuxtLink>
        <span v-else v-html="section.title" />
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
