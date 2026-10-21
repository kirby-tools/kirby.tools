<script setup lang="ts">
import { translate } from "#panel-mock/translate";
import "#kirby-panel/components/Forms/Field/LayoutField.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Layouts/Layout.vue?vue&type=style&index=0&lang.css";
import "#kirby-panel/components/Forms/Layouts/LayoutColumn.vue?vue&type=style&index=0&lang.css";

defineProps<{
  name?: string;
  label?: string;
  help?: string;
  value?: PanelLayout[];
}>();
</script>

<template>
  <k-column>
    <k-field
      :label="label"
      :help="help"
      :input="false"
      :name="name"
      class="k-layout-field"
    >
      <template #options>
        <k-button-group layout="collapsed">
          <k-button
            :text="translate('add')"
            icon="add"
            variant="filled"
            size="xs"
          />
          <k-button icon="dots" variant="filled" size="xs" />
        </k-button-group>
      </template>

      <div v-if="value?.length" class="k-layouts">
        <!-- Kirby's look for a layout without its toolbar, which no Mock
             stages. -->
        <section
          v-for="(layout, index) in value"
          :key="index"
          data-disabled="true"
          class="k-layout"
        >
          <k-grid class="k-layout-columns">
            <div
              v-for="(column, columnIndex) in layout.columns"
              :key="columnIndex"
              :style="{ '--width': column.width }"
              class="k-column k-layout-column"
            >
              <PanelBlocks :value="column.blocks" />
            </div>
          </k-grid>
        </section>
      </div>
      <k-empty v-else icon="dashboard" class="k-layout-empty">
        {{ translate("field.layout.empty") }}
      </k-empty>

      <footer>
        <k-button
          :title="translate('add')"
          icon="add"
          size="xs"
          variant="filled"
        />
      </footer>
    </k-field>
  </k-column>
</template>
