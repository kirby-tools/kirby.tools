<script setup lang="ts">
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

defineOgImageComponent("Default", {
  headline: "Kirby Tools",
  title: page.value?.title,
  description: page.value?.description,
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <main v-if="page" class="relative flex flex-col min-h-[calc(100vh-var(--ui-header-height))]">
    <UPageHero :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }">
      <BackgroundSky />

      <div
        aria-hidden="true"
        class="absolute inset-0 z-[-1] mx-4 border-x border-default sm:mx-6 lg:mx-8"
      />

      <template #title>
        <MDC
          :value="page.hero.title"
          unwrap="p"
          cache-key="blog-hero-title"
        />
      </template>

      <template #description>
        {{ page.hero.description }}
      </template>
    </UPageHero>

    <UPageBody class="my-0! py-0! border-y border-default">
      <UContainer>
        <div class="border-x border-default">
          <Motion
            v-for="(post, index) in posts"
            :key="post.path"
            :initial="{ opacity: 0, x: -20 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{
              delay: index * 0.05,
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }"
            class="group border-b border-default last:border-b-0"
          >
            <ULink
              :to="post.path"
              class="flex flex-col gap-4 p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 hover:bg-muted/30"
            >
              <div
                class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
              >
                <div class="min-w-0 flex-1">
                  <div class="mb-1 shrink-0 text-xs font-mono text-muted">
                    {{ formatDate(post.date) }}
                  </div>

                  <h2
                    class="truncate font-medium text-highlighted transition-colors duration-200 sm:text-base group-hover:text-primary"
                  >
                    {{ post.title }}
                  </h2>
                  <p class="mt-1 line-clamp-2 text-sm text-muted sm:line-clamp-1">
                    {{ post.description }}
                  </p>
                </div>
              </div>

              <div
                class="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:gap-2"
              >
                <UAvatar
                  src="https://github.com/johannschopplich.png"
                  alt="Johann Schopplich"
                  size="sm"
                />

                <UIcon
                  name="i-ri-arrow-right-s-line"
                  class="size-4 shrink-0 text-muted transition-colors duration-200 group-hover:text-highlighted"
                />
              </div>
            </ULink>
          </Motion>
        </div>
      </UContainer>
    </UPageBody>

    <UContainer class="relative min-h-24 grow">
      <div
        aria-hidden="true"
        class="absolute inset-0 z-[-1] mx-4 border-x border-default sm:mx-6 lg:mx-8"
      />
    </UContainer>
  </main>
</template>
