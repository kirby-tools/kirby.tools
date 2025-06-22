<script setup lang="ts">
const route = useRoute();
const { currentProductId, currentProduct } = useProduct();

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection("changelog").path(route.path).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const { data: versions } = await useAsyncData(
  `${currentProductId.value}-versions`,
  () =>
    queryCollection("versions")
      .where("path", "LIKE", `%${currentProductId.value}/%`)
      .order("date", "DESC")
      .all(),
);

const { format } = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} – Kirby Tools`,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImageComponent("Default", {
  headline: currentProduct.value?.label
    ? `Kirby ${currentProduct.value.label}`
    : "Kirby Tools",
  title: page.value.title,
  description: page.value.description,
});
</script>

<template>
  <UContainer v-if="page">
    <UPageHeader :title="page.title" :description="page.description" />

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" class="max-w-prose" />

      <div class="divide-y divide-(--ui-border)">
        <div
          v-for="version in versions"
          :key="version.title"
          class="grid gap-4 py-8 md:grid-cols-3"
        >
          <div>
            <h2 class="text-highlighted text-base font-semibold text-pretty">
              {{ version.title }}
            </h2>
            <p class="text-muted mt-1 text-[15px] text-pretty">
              {{ format(new Date(version.date)) }}
            </p>
          </div>

          <div class="prose dark:prose-invert max-w-none md:col-span-2">
            <ContentRenderer
              :value="version"
              class="[&>:first-child]:first:mt-0"
            />
          </div>
        </div>
      </div>
    </UPageBody>
  </UContainer>
</template>
