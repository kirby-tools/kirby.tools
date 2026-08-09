<script setup lang="ts">
import type { ChangelogCollectionItem } from "@nuxt/content";
defineProps<{
  page: ChangelogCollectionItem;
}>();

const { copy, copied } = useClipboard();
const { productId, product } = useProduct();

if (!productId.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const { composerPackage, githubRepo } = product.value;

const { data: versions } = await useAsyncData(
  `${productId.value}-versions`,
  () =>
    queryCollection("versions")
      .where("path", "LIKE", `%${productId.value}/%`)
      .order("date", "DESC")
      .all(),
);

const latestVersion = computed(() => versions.value?.[0]);

const latestReleaseUrl = computed(() =>
  latestVersion.value
    ? `https://github.com/${githubRepo}/releases/tag/${latestVersion.value.title}`
    : undefined,
);
</script>

<template>
  <div class="min-h-screen xl:grid xl:grid-cols-2">
    <UPageSection
      :title="page.title"
      :description="page.description"
      orientation="vertical"
      :ui="{
        root: 'border-b border-default xl:border-b-0 xl:sticky xl:inset-y-0 xl:h-screen overflow-hidden',
        container: 'h-full items-center justify-center',
        title: 'text-left text-4xl',
        description: 'text-left max-w-lg',
        links: 'justify-start flex-col items-start sm:-ms-2.5',
      }"
    >
      <template #top>
        <BackgroundSky :star-count="30" speed="slow" />

        <div
          class="bg-primary/25 pointer-events-none absolute top-1/2 left-full z-[-1] size-60 -translate-x-30 -translate-y-1/2 transform rounded-full blur-[300px] sm:size-100"
        />
      </template>

      <template #links>
        <UButton
          :label="`composer require ${composerPackage}`"
          color="neutral"
          variant="subtle"
          size="md"
          :icon="copied ? 'i-ri-check-line' : 'i-ri-file-copy-line'"
          :ui="{ base: 'max-w-[calc(100vw-3rem)]' }"
          @click="copy(`composer require ${composerPackage}`)"
        />

        <UButton
          v-if="latestReleaseUrl"
          :to="latestReleaseUrl"
          :label="`Download ${latestVersion?.title}`"
          target="_blank"
          color="primary"
          variant="soft"
          size="md"
          icon="i-ri-github-line"
        />
      </template>

      <template #default />
    </UPageSection>

    <section class="px-4 sm:px-6 xl:-ms-30 xl:flex-1 xl:px-0">
      <UChangelogVersions
        :indicator-motion="false"
        :ui="{
          root: 'py-16 sm:py-24 lg:py-32',
          indicator: 'inset-y-0',
        }"
      >
        <UChangelogVersion
          v-for="version in versions"
          :key="version.title"
          :title="version.title"
          :date="version.date"
          :ui="{
            root: 'flex items-start',
            container: 'max-w-xl',
            header: 'border-default border-b pb-4',
            title: 'text-3xl',
            date: 'text-highlighted font-mono text-xs/9',
            indicator:
              'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32',
          }"
        >
          <template #body>
            <ContentRenderer :value="version" />
          </template>
        </UChangelogVersion>
      </UChangelogVersions>
    </section>
  </div>
</template>
