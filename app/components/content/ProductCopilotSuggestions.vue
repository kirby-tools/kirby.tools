<script setup lang="ts">
import { withKeys, withModifiers } from "vue";

const mock = useTemplateRef("mock");
const {
  value,
  acceptedValue,
  suggestion,
  isFading,
  isPaused,
  canPause,
  togglePause,
} = useCopilotSuggestionLoop(() => mock.value?.$el);

// The loop takes no input, so the Panel it plays in answers nothing.
provide(panelMockInertKey, true);

// The Mock's `<figure>` is the toggle, since the Panel inside it is inert.
const pauseButton = computed(() =>
  canPause.value
    ? {
        role: "button",
        tabindex: 0,
        "aria-label": "Pause animation",
        "aria-pressed": isPaused.value,
        class:
          "group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        onClick: togglePause,
        onKeydown: withKeys(withModifiers(togglePause, ["prevent"]), [
          "enter",
          "space",
        ]),
      }
    : {},
);
</script>

<template>
  <PanelMock ref="mock" v-bind="pauseButton">
    <template v-if="canPause" #chrome>
      <UIcon
        :name="isPaused ? 'i-ri-play-fill' : 'i-ri-pause-fill'"
        class="text-dimmed ms-auto size-5 transition-opacity"
        :class="
          !isPaused &&
          'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
        "
      />
    </template>

    <PanelSection>
      <PanelFieldset>
        <PanelField label="Text" name="text" type="writer">
          <!-- The accepted text, laid out unseen beneath, holds the field at
               its final height through the cycle; `items-start` keeps the
               typed text at the top, where it sits in Kirby's growing field. -->
          <div class="grid *:col-start-1 *:row-start-1">
            <PanelInput :value="acceptedValue" class="invisible" />
            <PanelInput
              :value="value"
              :suggestion="suggestion"
              has-caret
              class="items-start transition-opacity duration-400"
              :class="isFading && 'opacity-0'"
            />
          </div>
        </PanelField>
      </PanelFieldset>
    </PanelSection>
  </PanelMock>
</template>

<style>
.panel-mock[aria-pressed="true"] .k-copilot-suggestion-indicator {
  animation-play-state: paused;
}
</style>
