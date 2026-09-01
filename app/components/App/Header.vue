<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import type { NavigationMenuItem } from "@nuxt/ui";
import type { Product, ProductId } from "#shared/constants";
import { withoutTrailingSlash } from "ufo";
import {
  PRODUCT_LIST,
  productChangelogPath,
  productDocsPath,
  productPath,
} from "#shared/constants";

const route = useRoute();
const { productId, product } = useProduct();

const featuredProductIds = new Set<ProductId>([
  "copilot",
  "content-translator",
  "seo-audit",
]);
const featuredProducts = PRODUCT_LIST.filter((listed) =>
  featuredProductIds.has(listed.id),
).map((item) => ({
  label: item.label,
  description: item.description,
  to: productPath(item.id),
}));
const moreProducts = PRODUCT_LIST.filter(
  (listed) => !featuredProductIds.has(listed.id),
).map(toNavigationItem);

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
        ...featuredProducts,
        {
          label: "More Plugins",
          children: moreProducts,
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
        children: PRODUCT_LIST.map((listed) => ({
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

function toNavigationItem(item: Product & { id: ProductId }) {
  return {
    label: item.label,
    description: item.description,
    icon: item.icon,
    to: productPath(item.id),
  };
}
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <UIcon name="i-tools-favicon" class="text-primary size-6" />
        <span class="text-default text-lg font-bold">Kirby Tools</span>
      </NuxtLink>

      <UDropdownMenu
        v-if="product"
        v-slot="{ open }"
        :modal="false"
        :items="
          PRODUCT_LIST.map((listed) => ({
            label: listed.label,
            to: productPath(listed.id),
            ...(listed.id === productId && {
              type: 'checkbox',
              color: 'primary',
              checked: true,
            }),
          }))
        "
      >
        <UButton
          :label="product.label"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          size="sm"
          class="ms-1 truncate rounded-full font-semibold"
          :class="[open && 'bg-(--ui-primary)/15']"
          :ui="{
            trailingIcon: [
              'transition-transform duration-200',
              open ? 'rotate-180' : undefined,
            ]
              .filter(Boolean)
              .join(' '),
          }"
        />
      </UDropdownMenu>
    </template>

    <template #right>
      <UContentSearchButton
        v-if="!product"
        :collapsed="false"
        :kbds="[]"
        variant="ghost"
        class="max-lg:hidden"
      />
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
      :items="navigationItems"
      content-orientation="vertical"
      :ui="{ content: 'w-72' }"
      class="hidden lg:flex"
    />

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
