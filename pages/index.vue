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
      v-for="(product, index) of page.products"
      :key="index"
      :orientation="product.orientation"
      :links="product.links"
      :class="[index > 0 && '!pt-16']"
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
        <div :class="[index % 2 === 1 && 'order-[-1]']">
          <ElementVideo v-if="product.video" v-bind="product.video" />
          <div v-else-if="product.image" class="rounded-xl shadow">
            <img
              :src="product.image.src"
              :alt="product.image.alt"
              class="rounded-xl"
            />
          </div>
          <NuxtLink
            v-else-if="product.icon"
            :to="product.icon.to"
            class="group hidden items-center justify-center lg:flex"
          >
            <UIcon
              :name="product.icon.name"
              class="group-hover:text-primary dark:group-hover:text-primary h-24 w-24 text-gray-500 dark:text-gray-400"
            />
          </NuxtLink>
        </div>
      </template>
    </ULandingHero>
  </div>
</template>
