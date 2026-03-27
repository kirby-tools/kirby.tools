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
  <main
    v-if="page"
    class="relative flex min-h-[calc(100vh-var(--ui-header-height))] flex-col"
  >
    <UPageHero :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }">
      <BackgroundSky />

      <div
        aria-hidden="true"
        class="border-default absolute inset-0 z-[-1] mx-4 hidden border-x sm:mx-6 lg:mx-8 lg:block"
      />

      <template #title>
        <MDC :value="page.hero.title" unwrap="p" cache-key="blog-hero-title" />
      </template>

      <template #description>
        {{ page.hero.description }}
      </template>
    </UPageHero>

    <UPageBody class="border-default my-0! border-y py-0!">
      <UContainer>
        <div class="border-default border-x">
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
            class="group border-default border-b last:border-b-0"
          >
            <ULink
              :to="post.path"
              class="hover:bg-muted/30 flex flex-col gap-4 p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
            >
              <div
                class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
              >
                <div class="min-w-0 flex-1">
                  <div class="text-muted mb-1 shrink-0 font-mono text-xs">
                    {{ formatDate(post.date) }}
                  </div>

                  <h2
                    class="text-highlighted group-hover:text-primary truncate font-medium transition-colors duration-200 sm:text-base"
                  >
                    {{ post.title }}
                  </h2>
                  <p
                    class="text-muted mt-1 line-clamp-2 text-sm sm:line-clamp-1"
                  >
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
                  class="text-muted group-hover:text-highlighted size-4 shrink-0 transition-colors duration-200"
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
        class="border-default absolute inset-0 z-[-1] mx-4 hidden border-x sm:mx-6 lg:mx-8 lg:block"
      />
    </UContainer>
  </main>
</template>
