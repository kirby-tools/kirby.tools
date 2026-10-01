<script setup lang="ts">
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Forms/Field/BlocksField.vue?vue&type=style&index=0&lang.css";

defineProps<{
  name?: string;
  label?: string;
  value?: PanelBlock[];
}>();

const emit = defineEmits<{ input: [value: PanelBlock[]] }>();
</script>

<template>
  <k-column>
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
            :text="translate('add')"
            icon="add"
            variant="filled"
            size="xs"
            :responsive="true"
          />
          <k-button
            :title="translate('options')"
            icon="dots"
            variant="filled"
            size="xs"
          />
        </k-button-group>
      </template>

      <PanelBlocks :value="value" @input="emit('input', $event)" />

      <footer v-if="value?.length">
        <k-button
          :title="translate('add')"
          icon="add"
          variant="filled"
          size="xs"
        />
      </footer>
    </k-field>
  </k-column>
</template>
