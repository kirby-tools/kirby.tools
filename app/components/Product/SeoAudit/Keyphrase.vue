<script setup lang="ts">
const KEYPHRASE_RESULTS: PanelSeoAuditResultEntry[] = [
  {
    rating: "good",
    text: '<a href="https://yoa.st/33g">Keyphrase in SEO title</a>: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!',
  },
  {
    rating: "ok",
    text: '<a href="https://yoa.st/33v">Keyphrase density</a>: The keyphrase was found 3 times. That\'s less than the recommended minimum of 5 times for a text of this length. <a href="https://yoa.st/33w">Focus on your keyphrase</a>!',
  },
];
</script>

<template>
  <PanelPreview>
    <PanelSection>
      <PanelFieldset>
        <PanelField label="Focus Keyphrase" name="keyphrase" type="text">
          <PanelInput value="large-format photography" />
        </PanelField>
      </PanelFieldset>
    </PanelSection>
    <PanelSection>
      <PanelBox theme="passive">
        <PanelSeoAuditResult :report="KEYPHRASE_RESULTS" />
      </PanelBox>
    </PanelSection>
  </PanelPreview>
</template>
