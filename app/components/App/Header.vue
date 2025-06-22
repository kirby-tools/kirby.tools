<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { PRODUCT_ITEMS } from "#shared/constants";

const route = useRoute();
const { currentProductId, currentProduct } = useProduct();

const navigationItems = computed<NavigationMenuItem[]>(() =>
  currentProduct.value
    ? [
        {
          label: "Features",
          to: currentProduct.value.to,
          active: route.path === currentProduct.value.to,
        },
        {
          label: "Documentation",
          to: `/docs${currentProduct.value.to}`,
          active: route.path.startsWith(`/docs${currentProduct.value.to}`),
        },
        {
          label: "Buy",
          to: `${currentProduct.value.to}/buy`,
        },
        ...(currentProduct.value.hasPlayground
          ? [
              {
                label: "Playground",
                to:
                  currentProduct.value.to === "/live-preview"
                    ? "https://play.kirby.tools"
                    : `${currentProduct.value.to}/playground`,
                target:
                  currentProduct.value.to === "/live-preview"
                    ? "_blank"
                    : undefined,
              },
            ]
          : []),
      ]
    : PRODUCT_ITEMS,
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
        <UIcon name="i-tools-logo" class="size-6 text-(--ui-primary)" />
        <span class="text-lg font-bold text-(--ui-text)">Kirby Tools</span>
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
          :class="[open && 'bg-[var(--ui-primary)]/15']"
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
      <UButton
        v-if="currentProduct && version"
        :label="version.title"
        color="neutral"
        variant="ghost"
        :to="`${currentProduct.to}/changelog`"
        class="hidden lg:inline-flex"
      />
      <UButton
        label="Hub"
        trailing-icon="i-ri-arrow-right-line"
        to="https://hub.kirby.tools"
        target="_blank"
        class="hidden lg:inline-flex"
      />
    </template>

    <UNavigationMenu :items="navigationItems" />

    <template #body>
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        v-if="route.path !== '/' && currentProduct"
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
