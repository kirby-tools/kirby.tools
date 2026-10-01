<script setup lang="ts">
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Forms/Blocks/Blocks.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Block.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Types/Heading.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Types/Text.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Types/Quote.vue?vue&type=style&index=0&lang.css";

const props = defineProps<{ value?: PanelBlock[] }>();

const emit = defineEmits<{ input: [blocks: PanelBlock[]] }>();

const HEADING_LEVEL_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6"].map(
  (level) => ({ value: level, text: level.toUpperCase() }),
);

// The writers keep what the reader types instead of rendering it, so the value
// they report is collected here. Like Kirby's writer, the list skips a value
// that comes back as reported, since rendering it again would reset the caret.
let value = props.value ?? [];
const renderedBlocks = shallowRef(value);
watch(
  () => props.value,
  (blocks = []) => {
    if (blocks === value) return;
    value = blocks;
    renderedBlocks.value = blocks;
  },
);

// Kirby selects the block focus enters and deselects it once focus moves
// outside the list, which a click elsewhere in the page also does.
const selectedIndex = ref<number>();

function deselectOnFocusOut(event: FocusEvent) {
  const blocks = event.currentTarget as HTMLElement;
  if (!blocks.contains(event.relatedTarget as Node | null))
    selectedIndex.value = undefined;
}

// The heading's size follows its level, so the list renders the new level
// alone: every writer keeps the text it last rendered, not what was typed.
function selectLevel(index: number, level: string) {
  update(index, { level });
  renderedBlocks.value = renderedBlocks.value.map((block, blockIndex) =>
    blockIndex === index ? { ...block, level } : block,
  );
}

function update(index: number, fields: Partial<PanelBlock>) {
  value = value.map((block, blockIndex) =>
    blockIndex === index ? { ...block, ...fields } : block,
  );
  emit("input", value);
}
</script>

<template>
  <div
    class="k-blocks"
    :data-empty="renderedBlocks.length === 0"
    @focusout="deselectOnFocusOut"
  >
    <div class="k-blocks-list">
      <div
        v-for="(block, index) in renderedBlocks"
        :key="index"
        class="k-block-container"
        :class="[
          `k-block-container-fieldset-${block.type}`,
          `k-block-container-type-${block.type}`,
        ]"
        :data-selected="selectedIndex === index"
        tabindex="0"
        @focusin="selectedIndex = index"
      >
        <div class="k-block" :class="`k-block-type-${block.type}`">
          <div
            v-if="block.type === 'heading'"
            class="k-block-type-heading-input"
            :data-level="block.level ?? 'h2'"
          >
            <!-- Kirby's heading answers Enter by adding a block or splitting
                 itself, never with a line break; the list adds no block. -->
            <PanelWriter
              :value="block.text"
              :placeholder="translate('field.blocks.heading.placeholder')"
              inline
              @input="update(index, { text: $event })"
              @keydown.enter.exact.prevent
            />
            <k-input
              :empty="false"
              :options="HEADING_LEVEL_OPTIONS"
              :value="block.level ?? 'h2'"
              type="select"
              class="k-block-type-heading-level"
              @input="selectLevel(index, $event)"
            />
          </div>

          <div
            v-else-if="block.type === 'quote'"
            class="k-block-type-quote-editor"
          >
            <PanelWriter
              :value="block.text"
              :placeholder="translate('field.blocks.quote.text.placeholder')"
              inline
              class="k-block-type-quote-text"
              @input="update(index, { text: $event })"
            />
            <PanelWriter
              :value="block.citation"
              :placeholder="
                translate('field.blocks.quote.citation.placeholder')
              "
              inline
              class="k-block-type-quote-citation"
              @input="update(index, { citation: $event })"
            />
          </div>

          <PanelWriter
            v-else
            :value="block.text"
            :placeholder="translate('field.blocks.text.placeholder')"
            class="k-block-type-text-input"
            @input="update(index, { text: $event })"
          />
        </div>
      </div>
    </div>

    <k-empty class="k-blocks-empty" icon="box">
      {{ translate("field.blocks.empty") }}
    </k-empty>
  </div>
</template>
