<template>
  <PanelMock label="Deutsch">
    <PanelField label="Text" name="text">
      <PanelInput
        value="Die Öffnungszeiten stehen im (link: page://exhibitions text: vollständigen Programm)."
        :buttons="true"
      />
    </PanelField>

    <PanelNotification text="Content translated" />
  </PanelMock>
</template>
