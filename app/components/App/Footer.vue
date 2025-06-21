<script setup lang="ts">
import { PRODUCT_ITEMS } from "#shared/constants";

const columns = [
  {
    label: "Resources",
    children: [
      {
        label: "License & Plugin Compatibility",
        to: "/license-compatibility",
      },
      ...PRODUCT_ITEMS.map((plugin) => ({
        label: `${plugin.label} Docs`,
        to: `/docs${plugin.to}`,
      })),
    ],
  },
  {
    label: "Legal",
    children: [
      {
        label: "License",
        to: "/license",
      },
      {
        label: "Privacy Policy",
        to: "/privacy-policy",
      },
      {
        label: "Legal Notice",
        to: "/legal-notice",
      },
    ],
  },
  {
    label: "Support",
    children: [
      {
        label: "Contact",
        to: "/contact",
      },
      {
        label: "GitHub Discussions",
        to: "https://github.com/kirby-tools/community/discussions",
        target: "_blank",
      },
      {
        label: "GitHub Issues",
        to: "https://github.com/kirby-tools/community/issues",
        target: "_blank",
      },
    ],
  },
];
</script>

<template>
  <USeparator icon="i-tools-logo" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-[var(--ui-border)]' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <div
              class="prose prose-primary dark:prose-invert text-(length:--text-sm)"
            >
              Kirby Tools is not affiliated with the developers of Kirby CMS.
              Having said that, we love Kirby. Our plugins wouldn't exist
              without it. 🧡
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-sm text-(--ui-text-muted)">
        © {{ new Date().getFullYear() }}
        <NuxtLink
          to="https://byjohann.link"
          target="_blank"
          class="text-(--ui-text-highlighted)"
          >Johann Schopplich</NuxtLink
        >. All rights reserved.
      </p>
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        aria-label="Kirby Tools on GitHub"
        icon="i-ri-github-fill"
        color="neutral"
        variant="ghost"
        to="https://github.com/kirby-tools/community"
        target="_blank"
      />
    </template>
  </UFooter>
</template>
