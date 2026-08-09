<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { isProductId, PRODUCTS } from "#shared/constants";

// Blog posts name their product in frontmatter; docs pages carry it in the route.
const props = defineProps<{
  product?: string;
}>();

const toast = useToast();
const appConfig = useAppConfig();
const { copy, copied } = useClipboard();
const { product: routeProduct } = useProduct();
const { path: markdownPath, url: markdownUrl } = useMarkdownPath();

const product = computed(() =>
  isProductId(props.product) ? PRODUCTS[props.product] : routeProduct.value,
);

const aiPrompt = computed(() => {
  const subject = product.value
    ? `${product.value.name}, a plugin for the Kirby CMS`
    : "Kirby Tools, a suite of plugins for the Kirby CMS";
  return `Read ${markdownUrl.value}. It documents ${subject}. Help me apply it: explain the concepts, give PHP examples, or debug my config.php.`;
});

const items = computed<DropdownMenuItem[]>(() => [
  {
    label: "Copy Markdown link",
    icon: "i-ri-link",
    onSelect() {
      copy(markdownUrl.value);
      toast.add({
        title: "Copied to clipboard",
        icon: appConfig.ui.icons.copyCheck,
      });
    },
  },
  {
    label: "View as Markdown",
    icon: "i-simple-icons:markdown",
    to: markdownPath.value,
    target: "_blank",
  },
  {
    label: "Open in ChatGPT",
    icon: "i-simple-icons:openai",
    to: `https://chatgpt.com/?prompt=${encodeURIComponent(aiPrompt.value)}`,
    target: "_blank",
  },
  {
    label: "Open in Claude",
    icon: "i-simple-icons:claude",
    to: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt.value)}`,
    target: "_blank",
  },
]);

async function copyPage() {
  copy(await $fetch<string>(markdownPath.value));
}
</script>

<template>
  <UFieldGroup>
    <UButton
      label="Copy page"
      :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
      color="neutral"
      variant="outline"
      :ui="{ leadingIcon: copied ? 'text-primary' : undefined }"
      @click="copyPage"
    />

    <UDropdownMenu
      :items="items"
      :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
      :ui="{ content: 'w-52' }"
    >
      <UButton
        :icon="appConfig.ui.icons.chevronDown"
        color="neutral"
        variant="outline"
        aria-label="More Markdown actions"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
