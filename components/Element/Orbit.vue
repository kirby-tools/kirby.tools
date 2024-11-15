<script lang="ts" setup>
import type { Component } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    direction?: "clockwise" | "counterClockwise";
    duration?: number;
    delay?: number;
    radius?: number;
    path?: boolean;
  }>(),
  {
    as: "div",
    direction: "clockwise",
    duration: 20,
    delay: 10,
    radius: 50,
    path: false,
  },
);

const ORBIT_DIRECTION = {
  clockwise: "normal",
  counterClockwise: "reverse",
} as const;

const animationDirection = computed(() => ORBIT_DIRECTION[props.direction]);
const negativeDelay = computed(() => -props.delay);
</script>

<template>
  <svg v-if="path" class="pointer-events-none absolute inset-0 size-full">
    <circle
      class="stroke-foreground/20 stroke-1"
      cx="50%"
      cy="50%"
      :r="radius"
      fill="none"
    />
  </svg>
  <component
    :is="as"
    v-bind="$attrs"
    class="animate-orbit absolute flex size-full transform-gpu"
  >
    <slot />
  </component>
</template>

<style scoped>
@keyframes orbit {
  0% {
    transform: rotate(0deg) translateY(calc(v-bind(radius) * 1px)) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateY(calc(v-bind(radius) * 1px))
      rotate(-360deg);
  }
}

.animate-orbit {
  animation: orbit calc(v-bind(duration) * 1s) linear infinite;
  animation-delay: calc(v-bind(negativeDelay) * 1s);
  animation-direction: v-bind(animationDirection);
}
</style>
