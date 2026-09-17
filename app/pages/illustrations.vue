<script setup lang="ts">
import { resolveThemeColor, THEME_COLORS } from "#shared/theme";

useSeoMeta({ title: "Illustrations" });

const appConfig = useAppConfig();
const themeTabs = Object.keys(THEME_COLORS).map((color) => ({
  label: color,
  value: color,
}));
const illustrationPacks = Object.entries(
  Object.groupBy(
    Object.keys(ILLUSTRATION_LOADERS).sort((firstName, secondName) =>
      firstName.localeCompare(secondName, "en", { numeric: true }),
    ),
    // A partial like `lucky-unlucky-1-stickman` joins its illustration's pack.
    (illustrationName) => illustrationName.replace(/-\d+(?:-[a-z-]+)?$/, ""),
  ),
);

// `app.vue` reapplies the route's color only when it differs from the last route's.
onBeforeRouteLeave((to) => {
  appConfig.ui.colors.primary = resolveThemeColor(to.path);
});
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Illustrations"
        description="Every SVG in app/assets/illustrations, drawn in the picked theme color."
      >
        <template #links>
          <UTabs
            v-model="appConfig.ui.colors.primary"
            :items="themeTabs"
            :content="false"
            size="sm"
          />
        </template>
      </UPageHeader>

      <UPageBody class="space-y-16">
        <section
          v-for="[packName, illustrationNames] in illustrationPacks"
          :key="packName"
        >
          <h2 class="text-highlighted mb-6 text-lg font-semibold">
            {{ packName }}
            <span class="text-dimmed font-normal">{{
              illustrationNames!.length
            }}</span>
          </h2>

          <UPageGrid class="gap-4 lg:grid-cols-4 xl:grid-cols-5">
            <UPageCard
              v-for="illustrationName in illustrationNames"
              :key="illustrationName"
              :title="illustrationName"
              variant="subtle"
              reverse
              :ui="{
                container: 'sm:p-4',
                title: 'text-muted font-mono text-xs font-normal',
              }"
            >
              <Illustration
                :name="illustrationName"
                class="aspect-square p-4"
              />
            </UPageCard>
          </UPageGrid>
        </section>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
