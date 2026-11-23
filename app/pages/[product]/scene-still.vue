<script setup lang="ts">
import type { ExhibitionProductId } from "#shared/exhibition";
import { isExhibitionProductId } from "#shared/exhibition";

definePageMeta({
  layout: false,
  standalone: true,
  validate(route) {
    const { product } = route.params;
    return (
      import.meta.dev &&
      typeof product === "string" &&
      isExhibitionProductId(product)
    );
  },
});

const route = useRoute();
const productId = computed(() => route.params.product as ExhibitionProductId);

provide(panelMockInertKey, true);
provide(panelMockFramedKey, true);
provide(sceneInPngKey, true);

useSeoMeta({ title: "Scene Still" });
</script>

<template>
  <!-- About as wide as the Scene in a 4:3 SocialCard. -->
  <div class="scene-still w-[1000px]">
    <component :is="EXHIBITION_SCENES[productId]" theme="light" />
  </div>
</template>
