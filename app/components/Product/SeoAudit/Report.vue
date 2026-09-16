<script setup lang="ts">
const RATINGS: PanelSeoAuditRatings = {
  seo: { rating: "ok" },
  readability: { rating: "good" },
};

const RESULTS: PanelSeoAuditResults = {
  seo: [
    {
      rating: "good",
      text: '<a href="https://yoa.st/34h">SEO title width</a>: Good job.',
    },
    {
      rating: "good",
      text: '<a href="https://yoa.st/33z">Internal links</a>: You have enough internal links. Good job.',
    },
    {
      rating: "ok",
      text: '<a href="https://yoa.st/33v">Keyphrase density</a>: The keyphrase was found 3 times. That\'s less than the recommended minimum of 5 times for a text of this length. <a href="https://yoa.st/33w">Focus on your keyphrase</a>!',
    },
  ],
  readability: [
    {
      rating: "good",
      text: '<a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.',
    },
  ],
};
</script>

<template>
  <PanelMock label="SEO Audit">
    <PanelDialog size="large">
      <PanelSeoAuditResult
        title="SEO Audit"
        :ratings="RATINGS"
        :results="RESULTS"
        version="changes"
        timestamp="2026-09-01T08:40"
      />
    </PanelDialog>
  </PanelMock>
</template>
