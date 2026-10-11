<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import type { NavigationMenuItem } from "@nuxt/ui";
import { withoutTrailingSlash } from "ufo";
import {
  PRODUCT_LIST,
  productChangelogPath,
  productDocsPath,
  productPath,
} from "#shared/products";

const route = useRoute();
const { productId, product } = useProduct();

const headerProducts = PRODUCT_LIST.filter((listed) => listed.id !== "helpers");

const isProductSwitcherOpen = ref(false);
const openNavigationItem = ref("");

const navigationItems = computed<NavigationMenuItem[]>(() =>
  product.value && productId.value
    ? [
        {
          label: "Features",
          to: productPath(productId.value),
          active:
            withoutTrailingSlash(route.path) === productPath(productId.value),
        },
        {
          label: "Documentation",
          to: productDocsPath(productId.value),
          active: route.path.startsWith(`/docs/${productId.value}`),
        },
        ...(product.value.license === "commercial"
          ? [
              {
                label: "Buy",
                to: `${productPath(productId.value)}/buy`,
              },
            ]
          : []),
        ...(product.value.playground
          ? [
              {
                label: "Playground",
                to: product.value.playground,
                target: "_blank",
              },
            ]
          : []),
      ]
    : [
        {
          label: "Plugins",
          slot: "plugins" as const,
        },
        {
          label: "Blog",
          to: "/blog",
        },
      ],
);

const { data: docsNavigation } = await useDocsNavigation();
const { data: version } = await useLatestProductVersion(productId);

const mobileNavigation = computed<ContentNavigationItem[]>(() => {
  if (!product.value || !productId.value) {
    return [
      {
        title: "Plugins",
        path: "/",
        children: headerProducts.map((listed) => ({
          title: listed.label,
          path: productPath(listed.id),
          icon: listed.icon,
        })),
      },
      {
        title: "Resources",
        path: "/blog",
        children: [{ title: "Blog", path: "/blog", icon: "i-ri-article-line" }],
      },
    ];
  }

  const id = productId.value;

  return [
    {
      title: product.value.label,
      path: productPath(id),
      children: [
        { title: "Features", path: productPath(id), icon: "i-ri-shapes-line" },
        {
          title: "Documentation",
          path: productDocsPath(id),
          icon: "i-ri-book-2-line",
        },
        ...(version.value
          ? [
              {
                title: `Changelog ${version.value.title}`,
                path: productChangelogPath(id),
                icon: "i-ri-download-line",
              },
            ]
          : []),
        ...(product.value.license === "commercial"
          ? [
              {
                title: "Buy",
                path: `${productPath(id)}/buy`,
                icon: "i-ri-shopping-bag-3-line",
              },
            ]
          : []),
        ...(product.value.playground
          ? [
              {
                title: "Playground",
                path: product.value.playground,
                icon: "i-ri-play-circle-line",
                target: "_blank",
              },
            ]
          : []),
      ],
    },
    ...(docsNavigation.value ?? []),
  ];
});
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <UIcon name="i-tools-favicon" class="text-primary size-6" />
        <span
          class="text-default text-lg font-bold whitespace-nowrap"
          :class="product && 'max-sm:sr-only'"
          >Kirby Tools</span
        >
      </NuxtLink>

      <template v-if="product">
        <span
          class="ms-2.5 h-5 w-px rotate-20 bg-(--ui-border-accented)"
          aria-hidden="true"
        />
        <UPopover
          v-model:open="isProductSwitcherOpen"
          :modal="false"
          :content="{ align: 'start' }"
        >
          <UButton
            :icon="product.icon"
            :label="product.label"
            color="neutral"
            variant="ghost"
            trailing-icon="i-ri-expand-up-down-line"
            class="text-highlighted text-base font-semibold"
            :class="isProductSwitcherOpen && 'bg-elevated'"
            :ui="{
              leadingIcon: 'text-primary',
              trailingIcon: 'text-dimmed size-4',
            }"
          />

          <template #content>
            <AppProductGrid @select="isProductSwitcherOpen = false" />
          </template>
        </UPopover>
      </template>
    </template>

    <template #right>
      <UContentSearchButton v-if="!product" class="max-lg:hidden" />
      <UButton
        v-if="productId && version"
        :label="version.title"
        icon="i-ri-download-line"
        color="neutral"
        variant="ghost"
        :to="productChangelogPath(productId)"
        class="max-lg:hidden"
      />
      <UButton
        label="Hub"
        trailing-icon="i-ri-arrow-right-line"
        to="https://hub.kirby.tools"
        target="_blank"
        class="max-lg:hidden"
      />
    </template>

    <UNavigationMenu
      v-model="openNavigationItem"
      :items="navigationItems"
      color="neutral"
      content-orientation="vertical"
      :ui="{ viewport: 'shrink-0', content: 'w-auto' }"
      class="hidden lg:flex"
    >
      <template #plugins-content>
        <AppProductGrid @select="openNavigationItem = ''" />
      </template>
    </UNavigationMenu>

    <template #body>
      <UContentSearchButton :collapsed="false" :kbds="[]" class="mb-4 w-full" />

      <UContentNavigation :navigation="mobileNavigation" highlight />

      <UButton
        label="Hub"
        trailing-icon="i-ri-arrow-right-line"
        to="https://hub.kirby.tools"
        target="_blank"
        block
        class="mt-6"
      />
    </template>
  </UHeader>
</template>
