<script setup lang="ts">
import type { NavItem } from "@nuxt/content/dist/runtime/types";
import type { HeaderLink } from "#ui-pro/types";

const links: HeaderLink[] = [
  {
    label: "Products",
    children: [
      {
        label: "Live Preview",
        to: "/live-preview",
        description: "Real-time page preview",
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
    to: "/docs/live-preview",
  },
  {
    label: "Playground",
    to: "https://play.kirby.tools",
    target: "_blank",
  },
];

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
      <UButton
        label="Try it"
        color="gray"
        to="https://play.kirby.tools"
        target="_blank"
      />
      <UButton
        label="Buy"
        icon="i-ri-arrow-right-line"
        trailing
        color="black"
        to="#pricing"
        class="hidden lg:flex"
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
