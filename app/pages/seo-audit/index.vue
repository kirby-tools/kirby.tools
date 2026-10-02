<script setup lang="ts">
const page = await useProductPage();
</script>

<template>
  <PagesProduct :page="page!">
    <template #hero>
      <ProductSeoAuditScene crop="hero" />
    </template>

    <template #feature-ratings>
      <ProductSeoAuditReport />
    </template>
    <template #feature-entry-points>
      <ProductSeoAuditEntryPoints />
    </template>
    <template #feature-keyphrase>
      <ProductSeoAuditKeyphrase />
    </template>
    <template #feature-languages>
      <ProductSeoAuditLanguages />
    </template>
    <template #feature-local-analysis>
      <ProductSeoAuditLocalAnalysis />
    </template>

    <template #cta-image>
      <Illustration
        name="lucky-unlucky-6"
        class="w-1/4 max-lg:mt-4 lg:mx-auto lg:w-1/3"
      />
    </template>
  </PagesProduct>
</template>
