<template>
  <PanelMock label="Deutsch">
    <PanelField label="Text" name="text" type="textarea">
      <PanelInput
        value="Die Öffnungszeiten stehen im (link: page://exhibitions text: vollständigen Programm)."
        :buttons="true"
      />
    </PanelField>

    <PanelNotification text="Content translated" />
  </PanelMock>
</template>
