import type { Component } from "vue";
import type { ExhibitionProductId } from "#shared/exhibition";
import {
  ProductCopilotScene,
  ProductLivePreviewScene,
  ProductMinimapScene,
  ProductSeoAuditScene,
  ProductSerpPreviewScene,
  ProductTranslatorScene,
} from "#components";

export const EXHIBITION_SCENES: Record<ExhibitionProductId, Component> = {
  copilot: ProductCopilotScene,
  "content-translator": ProductTranslatorScene,
  "seo-audit": ProductSeoAuditScene,
  "serp-preview": ProductSerpPreviewScene,
  minimap: ProductMinimapScene,
  "live-preview": ProductLivePreviewScene,
};
