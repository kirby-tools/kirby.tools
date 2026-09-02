<script setup lang="ts">
import "#kirby-panel/components/Forms/Field/BlocksField.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Blocks.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Block.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Types/Heading.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Types/Text.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Blocks/Types/Quote.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Input/WriterInput.vue?vue&type=style&index=0&lang.css";

defineProps<{
  name?: string;
  label?: string;
  blocks?: PanelBlock[];
}>();

const HEADING_LEVEL_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6"].map(
  (level) => ({ value: level, text: level.toUpperCase() }),
);
</script>

<template>
  <k-field
    :label="label"
    :input="false"
    :name="name"
    type="blocks"
    class="k-blocks-field"
  >
    <template #options>
      <k-button-group layout="collapsed">
        <k-button
          text="Add"
          icon="add"
          variant="filled"
          size="xs"
          :responsive="true"
        />
        <k-button icon="dots" variant="filled" size="xs" />
      </k-button-group>
    </template>

    <div class="k-blocks">
      <div class="k-blocks-list">
        <div
          v-for="(block, index) in blocks"
          :key="index"
          class="k-block-container"
          :class="[
            `k-block-container-fieldset-${block.type}`,
            `k-block-container-type-${block.type}`,
          ]"
          tabindex="0"
        >
          <div class="k-block" :class="`k-block-type-${block.type}`">
            <div
              v-if="block.type === 'heading'"
              class="k-block-type-heading-input"
              :data-level="block.level ?? 'h2'"
            >
              <div class="k-writer k-writer-input">
                <div class="ProseMirror k-text" contenteditable="true">
                  {{ block.text }}
                </div>
              </div>
              <k-input
                :empty="false"
                :options="HEADING_LEVEL_OPTIONS"
                :value="block.level ?? 'h2'"
                type="select"
                class="k-block-type-heading-level"
              />
            </div>

            <div
              v-else-if="block.type === 'quote'"
              class="k-block-type-quote-editor"
            >
              <div class="k-writer k-writer-input k-block-type-quote-text">
                <div class="ProseMirror k-text" contenteditable="true">
                  {{ block.text }}
                </div>
              </div>
              <div class="k-writer k-writer-input k-block-type-quote-citation">
                <div class="ProseMirror k-text" contenteditable="true">
                  {{ block.citation }}
                </div>
              </div>
            </div>

            <div v-else class="k-writer k-writer-input k-block-type-text-input">
              <div class="ProseMirror k-text" contenteditable="true">
                <p>{{ block.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <k-button title="Add" icon="add" variant="filled" size="xs" />
    </footer>
  </k-field>
</template>
