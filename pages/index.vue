<script setup lang="ts">
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
      v-for="(product, index) of page.products"
      :key="index"
      :orientation="product.orientation"
      :links="product.links"
      :class="[index > 0 && '!pt-0']"
    >
      <template #headline>
        <UBadge
          v-if="product.headline"
          variant="subtle"
          size="md"
          class="hover:bg-primary-100 dark:bg-primary-950/100 dark:hover:bg-primary-900 relative rounded-full font-medium shadow-none"
        >
          <NuxtLink
            :to="product.headline.to"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span class="absolute inset-0" aria-hidden="true" />
          </NuxtLink>

          <span class="flex items-center gap-1">
            <UIcon
              v-if="product.headline.icon"
              :name="product.headline.icon"
              class="pointer-events-none h-4 w-4"
            />
            {{ product.headline.label }}
          </span>
        </UBadge>
      </template>

      <template #title>
        <span v-html="product.title" />
      </template>

      <template #description>
        <span v-html="product.description" />
      </template>

      <template #default>
        <ElementVideo v-bind="product.video" />
      </template>
    </ULandingHero>
  </div>
</template>
