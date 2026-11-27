<template>
  <PanelMock>
    <PanelCopilotPromptDialog
      :file-previews="COPILOT_FILE_PREVIEWS"
      :fields="[
        { name: 'text', label: 'Text' },
        { name: 'description', label: 'Description' },
        { name: 'dates', label: 'Dates' },
        { name: 'credits', label: 'Credits' },
      ]"
      user-prompt="Write the text and the description from the attached press release."
      :dropdown="{ under: 'fields', value: ['text', 'description'] }"
    />
  </PanelMock>
</template>
