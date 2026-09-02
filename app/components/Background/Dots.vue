<script setup lang="ts">
withDefaults(
  defineProps<{
    mask?: "radial" | "fade-bottom";
  }>(),
  { mask: "radial" },
);
</script>

<template>
  <div
    aria-hidden="true"
    class="background-dots pointer-events-none absolute inset-x-0 top-0 z-[-1] h-full"
    :data-mask="mask"
  />
</template>

<style>
.background-dots {
  background-image: radial-gradient(
    circle,
    --alpha(currentColor / 15%) 0.75px,
    transparent 1px
  );
  background-size: 8px 8px;
}

.background-dots[data-mask="radial"] {
  mask-image: radial-gradient(ellipse at center, black 25%, transparent 72%);
}

.background-dots[data-mask="fade-bottom"] {
  mask-image: linear-gradient(to bottom, black 40%, transparent);
}
</style>
