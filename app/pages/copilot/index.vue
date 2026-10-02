<script setup lang="ts">
const page = await useProductPage();
</script>

<template>
  <PagesProduct :page="page!">
    <template #hero>
      <div
        class="absolute inset-0 z-[-1] flex items-start justify-center overflow-hidden"
      >
        <BackgroundCopilot
          class="h-full w-full scale-[2] transform lg:scale-[1.2]"
        />
      </div>
    </template>

    <template #scene>
      <ProductCopilotScene crop="hero" />
    </template>

    <template #feature-skills>
      <ProductCopilotSkills />
    </template>
    <template #feature-inline-suggestions>
      <ProductCopilotSuggestions />
    </template>
    <template #feature-toolbar-buttons>
      <ProductCopilotToolbarButton />
    </template>
    <template #feature-blocks-and-layouts>
      <ProductCopilotBlocks />
    </template>
  </PagesProduct>
</template>
