<script setup lang="ts">
import type { NavItem } from "@nuxt/content";
import type { HeaderLink } from "#ui-pro/types";

const route = useRoute();
const commercialPlugins = ["live-preview", "content-translator"];
const isLivePreview = computed(() => route.path.includes("/live-preview"));

const links = computed<HeaderLink[]>(() => [
  {
    label: "Products",
    children: [
      {
        label: "Live Preview",
        to: "/live-preview",
        icon: "i-ri-presentation-fill",
        description: "Real-time page preview",
      },
      {
        label: "Content Translator",
        to: "/content-translator",
        icon: "i-ri-translate",
        description: "Content translation in the Panel or server-side",
      },
      {
        label: "Kirby Copilot",
        to: "https://kirbycopilot.com",
        icon: "i-ri-sparkling-fill",
        description: "AI-powered content generation",
        target: "_blank",
      },
      {
        label: "Kirby SEO Audit",
        to: "https://kirbyseo.com",
        icon: "i-ri-seo-fill",
        description: "State-of-the-art SEO analysis",
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
        icon: "i-ri-presentation-fill",
      },
      {
        label: "Content Translator",
        to: "/docs/content-translator",
        icon: "i-ri-translate",
      },
      {
        label: "Headless",
        to: "/docs/headless",
        icon: "i-ri-braces-fill",
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
        to="/"
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
        v-if="
          route.path !== '/' &&
          commercialPlugins.some((plugin) => route.path.includes(`/${plugin}`))
        "
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
