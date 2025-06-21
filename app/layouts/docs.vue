<script setup lang="ts">
const { currentProductId } = useProduct();

const { data: navigation } = await useAsyncData(
  () => `navigation-${currentProductId.value}`,
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
                <UContentSearchButton
                  label="Search…"
                  variant="outline"
                  class="w-full"
                >
                  <template #trailing>
                    <div class="ms-auto flex items-center gap-0.5">
                      <UKbd value="meta" />
                      <UKbd value="k" />
                    </div>
                  </template>
                </UContentSearchButton>
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
