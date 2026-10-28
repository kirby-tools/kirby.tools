<script setup lang="ts">
import type { Report } from "#kirby-plugin/seo-audit";

const KEYPHRASE_REPORT: Report = {
  results: {
    seo: [
      {
        score: 9,
        rating: "good",
        text: '<a href="https://yoa.st/33g">Keyphrase in SEO title</a>: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!',
      },
      {
        score: 6,
        rating: "ok",
        text: '<a href="https://yoa.st/33v">Keyphrase density</a>: The keyphrase was found 3 times. That\'s less than the recommended minimum of 5 times for a text of this length. <a href="https://yoa.st/33w">Focus on your keyphrase</a>!',
      },
    ],
    readability: [],
  },
  ratings: {
    seo: { score: 83, rating: "good" },
    readability: undefined,
  },
  version: "changes",
  timestamp: SEO_REPORT_TIMESTAMP,
};
</script>

<template>
  <PanelMock>
    <PanelFieldset>
      <k-column>
        <PanelSeoAuditField v-bind="KEYPHRASE_REPORT" />
      </k-column>
    </PanelFieldset>
  </PanelMock>
</template>
