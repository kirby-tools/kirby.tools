<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import type { NavigationMenuItem } from "@nuxt/ui";
import { PRODUCT_ITEMS } from "#shared/constants";
import { withoutTrailingSlash } from "ufo";

defineProps<{
  docsNavigation?: ContentNavigationItem[] | undefined;
}>();

const route = useRoute();
const { currentProductId, currentProduct } = useProduct();

const visibleProducts = PRODUCT_ITEMS.filter((product) => !product.isHidden);

const navigationItems = computed<NavigationMenuItem[]>(() =>
  currentProduct.value
    ? [
        {
          label: "Features",
          to: currentProduct.value.to,
          active: withoutTrailingSlash(route.path) === currentProduct.value.to,
        },
        {
          label: "Documentation",
          to: currentProduct.value.docsTo,
          active: route.path.startsWith(`/docs${currentProduct.value.to}`),
        },
        ...(currentProduct.value.isPaid
          ? [
              {
                label: "Buy",
                to: `${currentProduct.value.to}/buy`,
              },
            ]
          : []),
        ...(currentProduct.value.playground
          ? [
              {
                label: "Playground",
                to: currentProduct.value.playground,
                target: "_blank",
              },
            ]
          : []),
      ]
    : visibleProducts,
);

const { data: version } = await useAsyncData(
  () => `${currentProductId.value}-version`,
  () =>
    queryCollection("versions")
      .where("path", "LIKE", `%${currentProductId.value}/%`)
      .order("date", "DESC")
      .first(),
  {
    immediate: !!currentProductId.value,
  },
);
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <UIcon name="i-tools-favicon" class="text-primary size-6" />
        <span class="text-default text-lg font-bold">Kirby Tools</span>
      </NuxtLink>

      <UDropdownMenu
        v-if="currentProduct"
        v-slot="{ open }"
        :modal="false"
        :items="
          PRODUCT_ITEMS.map((product) => ({
            label: product.label,
            to: product.to,
            ...(product.to === currentProduct?.to && {
              type: 'checkbox',
              color: 'primary',
              checked: true,
            }),
          }))
        "
      >
        <UButton
          :label="currentProduct.label"
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
        v-if="!currentProduct"
        :collapsed="false"
        :kbds="[]"
        variant="ghost"
        class="max-lg:hidden"
      />
      <UButton
        v-if="currentProduct && version"
        :label="version.title"
        icon="i-ri-download-line"
        color="neutral"
        variant="ghost"
        :to="`${currentProduct.to}/changelog`"
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

    <UNavigationMenu :items="navigationItems" />

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
        v-if="!currentProduct"
        :collapsed="false"
        :kbds="[]"
        class="mb-3 w-full"
      />
      <UButton
        v-if="currentProduct && version"
        :label="version.title"
        icon="i-ri-download-line"
        color="neutral"
        variant="ghost"
        :to="`${currentProduct.to}/changelog`"
        block
        class="mb-3"
      />
      <UButton
        v-if="currentProduct?.isPaid"
        label="Buy"
        trailing-icon="i-ri-shopping-bag-3-fill"
        color="primary"
        variant="subtle"
        :to="`${currentProduct.to}/buy`"
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
