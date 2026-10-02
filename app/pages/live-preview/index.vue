<script setup lang="ts">
const page = await useProductPage();
</script>

<template>
  <PagesProduct :page="page!">
    <template #hero>
      <ProductLivePreviewScene />
    </template>

    <template #cta-image>
      <Illustration
        name="partnershapes-20"
        class="w-1/3 max-lg:mt-4 lg:mx-auto lg:w-1/2"
      />
    </template>
  </PagesProduct>
</template>
