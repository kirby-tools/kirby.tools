<script setup lang="ts">
const page = await useProductPage();
</script>

<template>
  <PagesProduct :page="page!">
    <template #hero>
      <ProductMinimapSidebar />
    </template>

    <template #cta-image>
      <Illustration
        name="partnershapes-9"
        class="w-1/3 max-lg:mt-4 lg:mx-auto lg:w-2/5"
      />
    </template>
  </PagesProduct>
</template>
