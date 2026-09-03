<template>
  <PanelMock>
    <PanelCopilotPromptDialog
      :files="1"
      :fields="2"
      prompt="Write the text and the description from the attached press release."
      :dropdown="{
        under: 'fields',
        value: ['text', 'description'],
        options: [
          { value: 'text', text: 'Text' },
          { value: 'description', text: 'Description' },
          { value: 'dates', text: 'Dates' },
          { value: 'credits', text: 'Credits' },
        ],
      }"
    />
  </PanelMock>
</template>
