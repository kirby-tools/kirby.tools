<script setup lang="ts">
const route = useRoute();

const { data: post } = await useAsyncData(route.path, () =>
  queryCollection("posts").path(route.path).first(),
);
if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

useSeoMeta({
  title: post.value.title,
  ogTitle: `${post.value.title} – Kirby Tools`,
  description: post.value.description,
  ogDescription: post.value.description,
  ...(post.value.image?.src ? { ogImage: post.value.image.src } : {}),
});

if (!post.value.image?.src) {
  defineOgImage("Default", {
    headline: "Blog",
    title: post.value.title,
    description: post.value.description,
  });
}

const productBadge = computed(() => getProductBadge(post.value?.product));
</script>

<template>
  <UContainer v-if="post">
    <UPageHeader :title="post.title" :description="post.description">
      <template #headline>
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            icon="i-ri-arrow-left-line"
            label="Back to blog"
            to="/blog"
            variant="link"
            class="p-0"
            :ui="{ leadingIcon: 'size-4' }"
          />
          <span class="text-muted">&middot;</span>

          <UBadge
            v-if="productBadge"
            v-bind="productBadge"
            variant="subtle"
            size="sm"
            class="rounded-full"
          />
          <span v-if="productBadge && post.badge" class="text-muted"
            >&middot;</span
          >
          <UBadge v-if="post.badge" v-bind="post.badge" variant="subtle" />

          <span v-if="productBadge || post.badge" class="text-muted"
            >&middot;</span
          >
          <time class="text-muted">{{
            new Date(post.date).toLocaleDateString("en", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }}</time>
        </div>
      </template>

      <div class="mt-6 flex items-center gap-6">
        <ULink
          to="https://byjohann.link"
          target="_blank"
          class="group flex items-center gap-3"
        >
          <UAvatar
            src="https://github.com/johannschopplich.png"
            alt="Johann Schopplich"
            size="lg"
          />
          <div class="flex flex-col">
            <span class="text-highlighted text-sm font-medium"
              >Johann Schopplich</span
            >
            <span
              class="text-muted group-hover:text-primary text-xs transition-colors"
              >@johannschopplich</span
            >
          </div>
        </ULink>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer v-if="post.body" :value="post" />
      </UPageBody>

      <template v-if="post?.body?.toc?.links?.length" #right>
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
