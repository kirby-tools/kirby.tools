<script setup lang="ts">
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
).map(toNavigationItem);
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
          icon: "i-ri-folder-5-line",
          children: moreProducts,
        },
        {
          label: "Blog",
          icon: "i-ri-article-line",
          to: "/blog",
        },
      ],
);

const { data: docsNavigation } = await useDocsNavigation();
const { data: version } = await useLatestProductVersion(productId);

function toNavigationItem(listed: Product & { id: ProductId }) {
  return {
    label: listed.label,
    description: listed.description,
    icon: listed.icon,
    to: productPath(listed.id),
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
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        class="-mx-2.5"
      />

      <template v-if="docsNavigation?.length">
        <USeparator class="my-6" />

        <UContentNavigation
          :navigation="docsNavigation"
          default-open
          highlight
        />
      </template>

      <USeparator class="my-6" />

      <UContentSearchButton
        v-if="!product"
        :collapsed="false"
        :kbds="[]"
        class="mb-3 w-full"
      />
      <UButton
        v-if="productId && version"
        :label="version.title"
        icon="i-ri-download-line"
        color="neutral"
        variant="ghost"
        :to="productChangelogPath(productId)"
        block
        class="mb-3"
      />
      <UButton
        v-if="productId && product?.license === 'commercial'"
        label="Buy"
        trailing-icon="i-ri-shopping-bag-3-fill"
        color="primary"
        variant="subtle"
        :to="`${productPath(productId)}/buy`"
        block
        class="mb-3"
      />
      <UButton
        label="Hub"
        trailing-icon="i-ri-arrow-right-line"
        to="https://hub.kirby.tools"
        target="_blank"
        block
      />
    </template>
  </UHeader>
</template>
