<script setup lang="ts">
import type { Product } from "#shared/products";
import { PRODUCT_LIST, productPath } from "#shared/products";
import { DEFAULT_THEME_COLOR } from "#shared/theme";

const colorMode = useColorMode();
const { productId } = useProduct();

const gridProducts = PRODUCT_LIST.filter((listed) => listed.id !== "helpers");

const groups = [
  {
    id: useId(),
    label: "Commercial",
    products: gridProducts.filter((listed) => listed.license === "commercial"),
  },
  {
    id: useId(),
    label: "Free",
    products: gridProducts.filter((listed) => listed.license === "free"),
  },
];

/** Resolves the color of the product's own pages, in the shade Nuxt UI uses for the color mode. */
function productColor(item: Product) {
  const shade = colorMode.value === "dark" ? 400 : 500;
  return `var(--color-${item.color ?? DEFAULT_THEME_COLOR}-${shade})`;
}
</script>

<template>
  <div class="divide-default w-[min(34rem,calc(100vw-2rem))] divide-y">
    <div v-for="group in groups" :key="group.id" class="p-2">
      <p
        :id="group.id"
        class="text-highlighted px-3 py-1.5 text-xs font-semibold"
      >
        {{ group.label }}
      </p>
      <ul :aria-labelledby="group.id" class="grid gap-2 sm:grid-cols-2">
        <li v-for="listed in group.products" :key="listed.id">
          <NuxtLink
            :to="productPath(listed.id)"
            :aria-current="listed.id === productId ? 'true' : undefined"
            class="group flex items-start gap-3 px-3 py-2 text-sm"
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
              <span class="text-muted block">{{ listed.description }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
