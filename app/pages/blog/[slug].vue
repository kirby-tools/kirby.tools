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

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings("posts", route.path, {
    fields: ["description"],
  });
});

useSeoMeta({
  title: post.value.title,
  ogTitle: `${post.value.title} – Kirby Tools`,
  description: post.value.description,
  ogDescription: post.value.description,
});

if (post.value.image?.src) {
  defineOgImage({
    url: post.value.image.src,
  });
} else {
  defineOgImageComponent("Default", {
    headline: "Blog",
    title: post.value.title,
    description: post.value.description,
  });
}
</script>

<template>
  <UContainer v-if="post">
    <UPageHeader :title="post.title" :description="post.description">
      <template #headline>
        <UBadge v-if="post.badge" v-bind="post.badge" variant="subtle" />
        <span v-if="post.badge" class="text-muted">&middot;</span>
        <time class="text-muted">{{
          new Date(post.date).toLocaleDateString("en", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        }}</time>
      </template>

      <div class="mt-4 flex flex-wrap items-center gap-3">
        <UButton
          to="https://byjohann.link"
          color="neutral"
          variant="subtle"
          target="_blank"
          size="sm"
          label="Johann Schopplich"
        />
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer v-if="post.body" :value="post" />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template v-if="post?.body?.toc?.links?.length" #right>
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
