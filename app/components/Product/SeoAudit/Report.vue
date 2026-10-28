<script setup lang="ts">
import type { Report } from "#kirby-plugin/seo-audit";

const RATINGS: Report["ratings"] = {
  seo: { score: 70, rating: "ok" },
  readability: { score: 90, rating: "good" },
};

const RESULTS: Report["results"] = {
  seo: [
    {
      score: 9,
      rating: "good",
      text: '<a href="https://yoa.st/34h">SEO title width</a>: Good job.',
    },
    {
      score: 9,
      rating: "good",
      text: '<a href="https://yoa.st/33z">Internal links</a>: You have enough internal links. Good job.',
    },
    {
      score: 6,
      rating: "ok",
      text: '<a href="https://yoa.st/33v">Keyphrase density</a>: The keyphrase was found 3 times. That\'s less than the recommended minimum of 5 times for a text of this length. <a href="https://yoa.st/33w">Focus on your keyphrase</a>!',
    },
  ],
  readability: [
    {
      score: 9,
      rating: "good",
      text: '<a href="https://yoa.st/35d">Paragraph length</a>: There are no paragraphs that are too long. Great job.',
    },
  ],
};
</script>

<template>
  <PanelMock label="SEO Audit">
    <PanelSeoAuditReportDialog
      :ratings="RATINGS"
      :results="RESULTS"
      version="changes"
      :timestamp="SEO_REPORT_TIMESTAMP"
    />
  </PanelMock>
</template>
