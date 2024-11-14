<script setup lang="ts">
import type { HeaderLink } from "#ui-pro/types";
import type { NavItem } from "@nuxt/content";

const TOOLS_PLUGINS = [
  {
    label: "Content Translator",
    path: "content-translator",
  },
  {
    label: "Live Preview",
    path: "live-preview",
  },
];

const route = useRoute();
const isLivePreview = computed(() => route.path.includes("/live-preview"));
const currentPlugin = computed(() =>
  TOOLS_PLUGINS.find((plugin) => route.path.includes(`/${plugin.path}`)),
);

const links = computed<HeaderLink[]>(() => [
  {
    label: "Products",
    children: [
      {
        label: "Content Translator",
        to: "/content-translator",
        icon: "i-ri-translate",
        description: "Content translation in the Panel or server-side",
      },
      {
        label: "Live Preview",
        to: "/live-preview",
        icon: "i-ri-presentation-fill",
        description: "Real-time page preview",
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
    active: route.path.includes("/docs"),
    ...(currentPlugin.value
      ? {
          to: `/docs/${currentPlugin.value.path}`,
        }
      : {
          children: [
            {
              label: "Content Translator",
              to: "/docs/content-translator",
              icon: "i-ri-translate",
              description: "Documentation for the Panel section and PHP API",
            },
            {
              label: "Live Preview",
              to: "/docs/live-preview",
              icon: "i-ri-presentation-fill",
              description: "Documentation for the Panel section",
            },
            {
              label: "Headless",
              to: "/docs/headless",
              icon: "i-ri-braces-fill",
              description: "Documentation for classes and methods",
            },
          ],
        }),
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
      <UBadge v-if="currentPlugin" class="ml-1" color="primary" variant="soft">
        {{ currentPlugin.label }}
      </UBadge>
    </template>

    <template #right>
      <UButton
        v-if="route.path !== '/' && currentPlugin"
        label="Buy"
        icon="i-ri-shopping-bag-3-fill"
        trailing
        color="primary"
        :to="`/${currentPlugin.path}#pricing`"
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
