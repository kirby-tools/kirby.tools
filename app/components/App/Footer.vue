<script setup lang="ts">
import type { ThemeColor } from "#shared/theme";
import { PRODUCT_LIST, productDocsPath, productPath } from "#shared/products";
import { DEFAULT_THEME_COLOR } from "#shared/theme";

withDefaults(
  defineProps<{
    /** Edge the side rules sit on: the container's, or its padded content's. */
    frame?: "container" | "content";
  }>(),
  { frame: "container" },
);

interface FooterLink {
  label: string;
  to: string;
  icon?: string;
  iconColor?: ThemeColor;
}

interface FooterGroup {
  label: string;
  links: FooterLink[];
}

const cells: FooterGroup[][] = [
  [
    {
      label: "Plugins",
      links: PRODUCT_LIST.map((product) => ({
        label: product.label,
        to: productPath(product.id),
        icon: product.icon,
        iconColor: product.color ?? DEFAULT_THEME_COLOR,
      })),
    },
  ],
  [
    {
      label: "Documentation",
      links: PRODUCT_LIST.map((product) => ({
        label: product.label,
        to: productDocsPath(product.id),
      })),
    },
  ],
  [
    {
      label: "Resources",
      links: [
        { label: "Blog", to: "/blog" },
        { label: "License & Compatibility", to: "/license-compatibility" },
        { label: "Upgrading to Kirby 6", to: "/upgrading-to-kirby-6" },
        { label: "For AI Agents", to: "/ai" },
        { label: "Contact", to: "/contact" },
      ],
    },
    {
      label: "Legal",
      links: [
        { label: "License", to: "/license" },
        { label: "Privacy Policy", to: "/privacy-policy" },
        { label: "Legal Notice", to: "/legal-notice" },
      ],
    },
  ],
];

const aboutText = `
Kirby Tools is built on [Kirby](https://getkirby.com) – with gratitude to the team and community who make it. Help me improve the plugins: share feedback in [Discussions](https://github.com/kirby-tools/community/discussions) or report bugs via [Issues](https://github.com/kirby-tools/community/issues).
`;
</script>

<template>
  <footer class="border-default border-t">
    <div
      class="mx-auto max-w-(--ui-container)"
      :class="frame === 'content' && 'lg:px-8'"
    >
      <div class="border-default lg:-mx-px lg:border-x">
        <div
          class="border-default grid grid-cols-2 gap-px border-b bg-(--ui-border) lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
        >
          <div
            class="bg-default relative col-span-2 px-4 py-8 sm:px-6 lg:col-span-1 lg:px-8 lg:py-12"
          >
            <BackgroundRuleCross class="top-0 left-0 max-lg:hidden" />
            <UIcon name="i-tools-favicon" class="text-primary size-10" />
            <MDC
              :value="aboutText"
              class="prose dark:prose-invert text-muted mt-6 max-w-sm text-sm [&_p]:leading-relaxed!"
            />
          </div>

          <div
            v-for="(groups, index) in cells"
            :key="index"
            class="bg-default relative space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
            :class="index === cells.length - 1 && 'col-span-2 lg:col-span-1'"
          >
            <!-- Below `lg`, only a right-column cell's corner sits on an inner rule. -->
            <BackgroundRuleCross
              class="top-0 left-0"
              :class="
                (index % 2 === 0 || index === cells.length - 1) &&
                'max-lg:hidden'
              "
            />
            <BackgroundRuleCross
              v-if="index === cells.length - 1"
              class="top-0 left-[calc(100%+1px)] max-lg:hidden"
            />
            <div v-for="group in groups" :key="group.label">
              <h3
                class="text-dimmed font-mono text-xs tracking-widest uppercase"
              >
                {{ group.label }}
              </h3>
              <ul class="mt-6 space-y-4">
                <li v-for="link in group.links" :key="link.to">
                  <ULink
                    :to="link.to"
                    inactive-class="text-toned hover:text-highlighted"
                    class="group flex items-center gap-1.5 text-sm"
                  >
                    <UIcon
                      v-if="link.icon"
                      :name="link.icon"
                      class="size-5 shrink-0 text-(--icon-color) opacity-60 transition-opacity group-hover:opacity-100 dark:text-(--icon-color-dark)"
                      :style="{
                        '--icon-color': `var(--color-${link.iconColor}-500)`,
                        '--icon-color-dark': `var(--color-${link.iconColor}-400)`,
                      }"
                    />
                    {{ link.label }}
                  </ULink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between gap-x-3 px-4 sm:px-6 lg:px-8"
        >
          <p class="text-muted py-4 font-mono text-xs">
            © {{ new Date().getFullYear() }}
            <NuxtLink
              to="https://byjohann.link"
              target="_blank"
              class="text-highlighted"
              >Johann Schopplich</NuxtLink
            >
          </p>
          <div class="flex items-center gap-x-1.5">
            <UColorModeButton />
            <UButton
              aria-label="Kirby Tools on GitHub"
              icon="i-ri-github-fill"
              color="neutral"
              variant="ghost"
              to="https://github.com/kirby-tools/community"
              target="_blank"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
