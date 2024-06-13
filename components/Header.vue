<script setup lang="ts">
import type { NavItem } from "@nuxt/content/dist/runtime/types";
import type { HeaderLink } from "#ui-pro/types";

const route = useRoute();
const isLivePreview = computed(() => route.path.includes("/live-preview"));
const indexPath = computed(() => {
  const product = route.path.split("/").slice(2, 3).join("/");
  if (product) return `/${product}`;
  return "/";
});

const links = computed<HeaderLink[]>(() => [
  {
    label: "Products",
    children: [
      {
        label: "Live Preview",
        to: "/live-preview",
        description: "Real-time page preview",
      },
      {
        label: "Content Translator",
        to: "/content-translator",
        description: "DeepL-powered translations",
      },
      {
        label: "Kirby Copilot",
        to: "https://kirbycopilot.com",
        description: "AI-powered content generation",
        target: "_blank",
      },
      {
        label: "Kirby SEO Audit",
        description: "State-of-the-art SEO analysis",
        to: "https://kirbyseo.com",
        target: "_blank",
      },
    ],
  },
  {
    label: "Documentation",
    children: [
      {
        label: "Live Preview",
        to: "/docs/live-preview",
        description: "Integrate the Panel section",
      },
      {
        label: "Content Translator",
        to: "/docs/content-translator",
        description: "Translate your content in the Panel or with the PHP API",
      },
    ],
  },
  ...(isLivePreview.value
    ? [
        {
          label: "Playground",
          to: "https://play.kirby.tools",
          target: "_blank",
        },
      ]
    : []),
]);

const navigation = inject<Ref<NavItem[]>>("navigation", ref([]));
</script>

<template>
  <UHeader :links="links">
    <template #left>
      <NuxtLink
        :to="indexPath"
        class="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white"
      >
        <Logo class="text-primary h-6 w-auto" />
        Kirby Tools
      </NuxtLink>
    </template>

    <template #right>
      <!-- <UButton
        v-if="isLivePreview"
        label="Try it"
        color="gray"
        to="https://play.kirby.tools"
        target="_blank"
      /> -->
      <UButton
        v-if="route.path !== '/'"
        label="Buy"
        icon="i-ri-shopping-bag-3-fill"
        trailing
        color="primary"
        :to="`${isLivePreview ? '/live-preview' : '/content-translator'}#pricing`"
        class="hidden lg:flex"
      />
      <UButton
        label="Hub"
        icon="i-ri-arrow-right-line"
        trailing
        color="gray"
        to="https://hub.kirby.tools"
        target="_blank"
      />
    </template>

    <template #panel>
      <UNavigationTree
        :links="mapContentNavigation(navigation)"
        :multiple="false"
        default-open
      />
    </template>
  </UHeader>
</template>
