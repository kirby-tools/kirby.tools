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

    <template #mock-multi-field>
      <ProductCopilotScene crop="hero" />
    </template>
    <template #mock-agents-consent>
      <PanelMock>
        <PanelCopilotAgentsAuthorizeView
          :site="EXHIBITION_SITE.title"
          account="editor@kunsthalle-leipzig.de"
          :client="{ name: 'Claude', host: 'claude.ai' }"
          :redirect="{ label: 'claude.ai' }"
        />
      </PanelMock>
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
