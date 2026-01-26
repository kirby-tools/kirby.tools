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

defineOgImageComponent("Default", {
  headline: "Kirby Tools",
  title: page.value.title,
  description: page.value.description,
});
</script>

<template>
  <div v-if="page" class="relative">
    <AppHeaderBackground
      class="text-primary pointer-events-none absolute top-[-1px] w-full shrink-0 transition-opacity"
      :class="[
        isLoading ? 'animate-pulse' : isEntering ? '' : 'opacity-0',
        hasEntered ? 'duration-400' : 'duration-1000',
      ]"
    />

    <ElementWarpBackground :beam-duration="6">
      <UPageHero
        :description="page.description"
        :links="page.hero.links"
        class="from-default bg-radial from-30%"
        :ui="{
          container: 'relative py-24 sm:py-24 lg:py-24',
        }"
      >
        <template #top>
          <div
            class="bg-primary absolute left-1/2 z-[-1] size-60 -translate-x-1/2 -translate-y-80 rounded-full opacity-50 blur-[300px] sm:size-80"
          />
        </template>

        <!-- <div
          aria-hidden="true"
          class="border-default absolute inset-0 z-[-1] mx-4 hidden border-x sm:mx-6 lg:mx-8 lg:block"
        /> -->

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
            :variant="page.hero.headline.variant || 'subtle'"
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

    <UPageSection
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      class="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        class="border-default absolute inset-0 z-[-1] mx-4 hidden border-x sm:mx-6 lg:mx-8 lg:block"
      />

      <UMarquee pause-on-hover>
        <UTooltip
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          :text="testimonial.brand"
          :delay-duration="100"
        >
          <UColorModeImage
            v-if="isObject(testimonial.logo)"
            :light="testimonial.logo.light"
            :dark="testimonial.logo.dark"
            :alt="`Logo for ${testimonial.brand}`"
            class="h-10 w-auto shrink-0"
          />
          <img
            v-else
            :src="testimonial.logo"
            :alt="`Logo for ${testimonial.brand}`"
            class="h-10 w-auto shrink-0"
          />
        </UTooltip>
      </UMarquee>
    </UPageSection>

    <div id="products" />

    <template v-for="type in ['commercial', 'free']" :key="type">
      <USeparator v-if="type === 'commercial'" />

      <UPageSection
        v-if="type === 'free'"
        icon="i-ri-gift-line"
        title="Free Plugins"
        description="Not all of our plugins are commercial. Some of them are free to use and can be used without any restrictions."
        :ui="{
          container: 'pb-16 sm:pb-16 lg:pb-16',
          description: 'max-w-2xl mx-auto',
        }"
      />

      <UPageSection
        v-for="(product, index) in page.products.filter(
          (product) => product.type === type,
        )"
        :id="product.id"
        :key="index"
        :title="product.title"
        :description="product.description"
        :features="product.features"
        :links="product.links"
        orientation="horizontal"
        :reverse="product.reverse"
        class="border-default lg:border-t"
        :class="index % 2 === 1 ? 'bg-muted/25' : ''"
      >
        <template #top>
          <div
            aria-hidden="true"
            class="border-default absolute inset-0 z-[-1] mx-4 hidden border-x sm:mx-6 lg:mx-8 lg:block"
          />
        </template>

        <template #headline>
          <UBadge
            v-if="product.headline"
            :as="NuxtLink"
            :label="product.headline.label"
            :icon="
              isObject(product.headline.icon)
                ? product.headline.icon.name
                : product.headline.icon
            "
            :to="product.headline.to"
            :color="product.headline.color"
            :variant="product.headline.variant || 'subtle'"
            class="rounded-full"
            :ui="{
              leadingIcon: isObject(product.headline.icon)
                ? product.headline.icon.class
                : undefined,
            }"
          />
        </template>

        <template #description>
          <span v-html="product.description" />
        </template>

        <ElementVideo v-if="product.video" v-bind="product.video" />
      </UPageSection>
    </template>

    <UPageCTA v-bind="page.cta" variant="subtle" class="rounded-none">
      <template v-if="page.cta.title" #title>
        <span v-html="page.cta.title" />
      </template>

      <slot name="cta-image" />
    </UPageCTA>
  </div>
</template>
