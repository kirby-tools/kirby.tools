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

    <template #mock-agents-consent>
      <!-- claude.ai asks for every permission, so the two beyond the defaults
           read as requested. -->
      <PanelMock class="shadow-2xl shadow-black/10 dark:shadow-black/60">
        <PanelCopilotAgentsAuthorizeView
          :site="EXHIBITION_SITE.title"
          :account="CHAT_ACCOUNT"
          :client="{ host: 'claude.ai' }"
          :redirect="{ label: 'claude.ai' }"
          :default-permissions="['content:read', 'content:prepare']"
          :requested-permissions="['content:publish', 'content:delete']"
        />
      </PanelMock>
    </template>

    <template #mock-agents>
      <ProductCopilotAgents
        class="shadow-2xl shadow-black/10 dark:shadow-black/60"
      />
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
