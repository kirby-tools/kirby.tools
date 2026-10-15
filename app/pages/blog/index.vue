<script setup lang="ts">
import type { ProductTile } from "~/utils/product-tile";

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

const route = useRoute();

const { data: page } = await useAsyncData("blog", () =>
  queryCollection("blog").first(),
);
const { data: posts } = await useAsyncData(route.path, () =>
  queryCollection("posts").order("date", "DESC").all(),
);

useSeoMeta({
  title: page.value?.title,
  ogTitle: `${page.value?.title} – Kirby Tools`,
  description: page.value?.description,
  ogDescription: page.value?.description,
});

defineOgImage("Default", {
  headline: "Kirby Tools",
  title: page.value?.title,
  description: page.value?.description,
});

const decoratedPosts = computed(() =>
  (posts.value ?? []).map((post) => ({
    ...post,
    productTile: getProductTile(post.product),
  })),
);
const latestPost = computed(() => decoratedPosts.value[0]);
const olderPosts = computed(() => decoratedPosts.value.slice(1));

function productColorStyle(tile?: ProductTile) {
  return tile ? { "--product-color": `var(--ui-${tile.color})` } : undefined;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function productTileClass(tile?: ProductTile) {
  return tile
    ? "bg-(--product-color)/15 text-(--product-color)"
    : "bg-elevated text-dimmed";
}
</script>

<template>
  <main
    v-if="page"
    class="relative flex min-h-[calc(100vh-var(--ui-header-height))] flex-col"
  >
    <UPageHero :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }">
      <template #top>
        <BackgroundContainerRules />
      </template>

      <BackgroundSky />

      <template #title>
        <MDC :value="page.hero.title" unwrap="p" cache-key="blog-hero-title" />
      </template>

      <template #description>
        {{ page.hero.description }}
      </template>
    </UPageHero>

    <UPageBody class="border-default my-0! border-y py-0!">
      <div class="mx-auto max-w-(--ui-container)">
        <div class="border-default lg:-mx-px lg:border-x">
          <Motion
            v-if="latestPost"
            :initial="{ opacity: 0, y: 12 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="SPRING_TRANSITION"
            class="border-default border-b"
          >
            <NuxtLink
              :to="latestPost.path"
              class="group hover:bg-muted/30 grid gap-6 px-4 py-6 transition-colors sm:px-6 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8"
              :style="productColorStyle(latestPost.productTile)"
            >
              <div>
                <p class="text-muted mb-4 font-mono text-xs">
                  Latest &middot;
                  <time :datetime="latestPost.date">{{
                    formatDate(latestPost.date)
                  }}</time>
                </p>
                <h2
                  class="font-display text-highlighted text-4xl/tight text-balance sm:text-5xl/tight"
                >
                  {{ latestPost.title }}
                </h2>
                <p class="text-muted mt-4 max-w-2xl text-base/7 text-pretty">
                  {{ latestPost.description }}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <span
                  class="flex size-10 items-center justify-center"
                  :class="productTileClass(latestPost.productTile)"
                >
                  <UIcon
                    :name="latestPost.productTile?.icon ?? 'i-tools-favicon'"
                    class="size-5"
                  />
                  <span v-if="latestPost.productTile" class="sr-only">{{
                    latestPost.productTile.label
                  }}</span>
                </span>
                <span
                  class="text-highlighted group-hover:text-primary inline-flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  Read the post
                  <UIcon name="i-ri-arrow-right-line" class="size-4" />
                </span>
              </div>
            </NuxtLink>
          </Motion>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3">
            <Motion
              v-for="(post, index) in olderPosts"
              :key="post.path"
              :initial="{ opacity: 0, y: 12 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ ...SPRING_TRANSITION, delay: (index + 1) * 0.05 }"
              class="border-default -mb-px border-b sm:border-r sm:nth-[2n]:border-r-0 lg:nth-[2n]:border-r lg:nth-[3n]:border-r-0"
            >
              <NuxtLink
                :to="post.path"
                class="group hover:bg-muted/30 flex h-full flex-col px-4 py-6 transition-colors sm:px-6 lg:px-8"
                :style="productColorStyle(post.productTile)"
              >
                <div class="mb-4 flex items-center gap-2">
                  <span
                    class="flex size-7 items-center justify-center"
                    :class="productTileClass(post.productTile)"
                  >
                    <UIcon
                      :name="post.productTile?.icon ?? 'i-tools-favicon'"
                      class="size-4"
                    />
                    <span v-if="post.productTile" class="sr-only">{{
                      post.productTile.label
                    }}</span>
                  </span>
                  <time
                    :datetime="post.date"
                    class="text-muted font-mono text-xs"
                  >
                    {{ formatDate(post.date) }}
                  </time>
                </div>
                <h2
                  class="font-display text-highlighted text-2xl/tight text-balance"
                >
                  {{ post.title }}
                </h2>
                <p class="text-muted mt-2 line-clamp-3 text-sm/6 text-pretty">
                  {{ post.description }}
                </p>
              </NuxtLink>
            </Motion>
          </div>
        </div>
      </div>
    </UPageBody>

    <div class="relative min-h-24 grow">
      <BackgroundContainerRules />
    </div>
  </main>
</template>
