<script setup lang="ts">
// Kirby's `k-textarea-input` pulls in a toolbar component and a `direction`
// directive. Import only the style block it carries and restate its markup
// below.
import "#kirby-panel/components/Forms/Input/TextareaInput.vue?vue&type=style&index=0&lang.css";

defineProps<{
  value?: string;
  placeholder?: string;
}>();
</script>

<template>
  <k-input type="textarea">
    <div class="k-textarea-input">
      <div class="k-textarea-input-wrapper">
        <textarea
          class="k-textarea-input-native"
          :placeholder="placeholder"
          :value="value"
          readonly
        />
      </div>
    </div>
  </k-input>
</template>
