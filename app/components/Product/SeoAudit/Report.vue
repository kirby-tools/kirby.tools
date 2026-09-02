<script setup lang="ts">
const REPORT: PanelSeoAuditResultEntry[] = [
  {
    rating: "good",
    text: '<a href="https://yoa.st/34h">SEO title width</a>: Good job.',
  },
  {
    rating: "good",
    text: '<a href="https://yoa.st/33z">Internal links</a>: You have enough internal links. Good job.',
  },
  {
    rating: "good",
    text: '<a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.',
  },
  {
    rating: "ok",
    text: '<a href="https://yoa.st/33v">Keyphrase density</a>: The keyphrase was found 3 times. That\'s less than the recommended minimum of 5 times for a text of this length. <a href="https://yoa.st/33w">Focus on your keyphrase</a>!',
  },
  {
    rating: "bad",
    text: '<a href="https://yoa.st/34d">Meta description length</a>: No meta description has been specified. Search engines will display copy from the page instead. <a href="https://yoa.st/34e">Make sure to write one</a>!',
  },
];
</script>

<template>
  <PanelPreview label="SEO Audit">
    <PanelDialog size="large">
      <PanelSeoAuditResult title="SEO & Readability Scores" :report="REPORT" />
    </PanelDialog>
  </PanelPreview>
</template>
