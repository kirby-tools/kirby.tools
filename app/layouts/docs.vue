<script setup lang="ts">
const { currentProductId } = useProduct();

const { data: navigation } = await useAsyncData(
  () => `${currentProductId.value}-navigation`,
  async () => {
    const navigation = await queryCollectionNavigation("docs");
    const docsItems = navigation?.[0]?.children;
    const productItem = docsItems?.find(
      (item) => item.path === `/docs/${currentProductId.value}`,
    );

    if (productItem?.stem?.endsWith("index")) {
      return productItem ? [productItem] : undefined;
    }

    if (productItem?.children?.length) {
      return productItem.children;
    }
  },
);
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <template #left>
            <UPageAside>
              <template #top>
                <UContentSearchButton :collapsed="false" variant="outline" />
              </template>

              <UContentNavigation :navigation="navigation" highlight />
            </UPageAside>
          </template>

          <slot />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>
