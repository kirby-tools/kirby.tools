<script setup lang="ts">
const page = await useProductPage();
</script>

<template>
  <PagesProduct :page="page!">
    <template #hero>
      <ProductTranslatorScene crop="hero" />
    </template>

    <template #feature-batch-translation>
      <ProductTranslatorDialog />
    </template>
    <template #feature-kirbytags>
      <ProductTranslatorKirbyTags />
    </template>
    <template #feature-view-button>
      <ProductTranslatorViewButton />
    </template>
    <template #feature-translation-coverage>
      <ProductTranslatorCoverage />
    </template>

    <template #cta-image>
      <Illustration
        name="partnershapes-7"
        class="w-1/3 max-lg:mt-4 lg:mx-auto"
      />
    </template>
  </PagesProduct>
</template>
