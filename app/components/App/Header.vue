<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import type { NavigationMenuItem } from "@nuxt/ui";
import type { Product, ProductId } from "#shared/products";
import { withoutTrailingSlash } from "ufo";
import {
  PRODUCT_LIST,
  productChangelogPath,
  productDocsPath,
  productPath,
} from "#shared/products";
import { DEFAULT_THEME_COLOR } from "#shared/theme";

const route = useRoute();
const colorMode = useColorMode();
const { productId, product } = useProduct();

const headerProducts = PRODUCT_LIST.filter((listed) => listed.id !== "helpers");

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
const moreProducts = headerProducts
  .filter((listed) => !featuredProductIds.has(listed.id))
  .map(toNavigationItem);

const productSwitcherGroups = [
  {
    id: useId(),
    label: "Commercial",
    products: headerProducts.filter(
      (listed) => listed.license === "commercial",
    ),
  },
  {
    id: useId(),
    label: "Free",
    products: headerProducts.filter((listed) => listed.license === "free"),
  },
];
const isProductSwitcherOpen = ref(false);

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

function toNavigationItem(item: Product & { id: ProductId }) {
  return {
    label: item.label,
    description: item.description,
    icon: item.icon,
    to: productPath(item.id),
  };
}

/** Resolves the color of the product's own pages, in the shade Nuxt UI uses for the color mode. */
function productColor(item: Product) {
  const shade = colorMode.value === "dark" ? 400 : 500;
  return `var(--color-${item.color ?? DEFAULT_THEME_COLOR}-${shade})`;
}
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
            <div
              class="divide-default w-[min(34rem,calc(100vw-2rem))] divide-y"
            >
              <div
                v-for="group in productSwitcherGroups"
                :key="group.id"
                class="p-2"
              >
                <p
                  :id="group.id"
                  class="text-highlighted px-3 py-1.5 text-xs font-semibold"
                >
                  {{ group.label }}
                </p>
                <ul
                  :aria-labelledby="group.id"
                  class="grid gap-2 sm:grid-cols-2"
                >
                  <li v-for="listed in group.products" :key="listed.id">
                    <NuxtLink
                      :to="productPath(listed.id)"
                      :aria-current="
                        listed.id === productId ? 'true' : undefined
                      "
                      class="group flex items-start gap-3 px-3 py-2 text-sm"
                      @click="isProductSwitcherOpen = false"
                    >
                      <span
                        class="flex size-9 shrink-0 items-center justify-center transition-colors"
                        :class="
                          listed.id === productId
                            ? 'bg-(--product-color)/15 text-(--product-color)'
                            : 'bg-elevated text-dimmed group-hover:bg-(--product-color)/15 group-hover:text-(--product-color)'
                        "
                        :style="{ '--product-color': productColor(listed) }"
                      >
                        <UIcon :name="listed.icon" class="size-5" />
                      </span>
                      <span class="min-w-0">
                        <span
                          class="block font-medium transition-colors"
                          :class="
                            listed.id === productId
                              ? 'text-highlighted'
                              : 'text-default group-hover:text-highlighted'
                          "
                          >{{ listed.label }}</span
                        >
                        <span class="text-muted block">{{
                          listed.description
                        }}</span>
                      </span>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
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
      :items="navigationItems"
      color="neutral"
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
