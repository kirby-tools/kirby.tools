<script lang="ts" setup>
import { Motion } from "motion-v";

interface Props {
  width: string | number;
  x: string | number;
  delay: number;
  duration: number;
}

defineProps<Props>();

const hue = computed(() => Math.floor(Math.random() * 360));
const ar = computed(() => Math.floor(Math.random() * 10) + 1);
</script>

<template>
  <Motion
    :style="{
      '--x': `${x}`,
      '--width': `${width}`,
      '--aspect-ratio': `${ar}`,
      '--background': `linear-gradient(hsl(${hue} 80% 60%), transparent)`,
    }"
    class="absolute top-0 left-[var(--x)] [aspect-ratio:1/var(--aspect-ratio)] [width:var(--width)] [background:var(--background)]"
    :initial="{
      x: '-50%',
      y: '50cqmax',
    }"
    :animate="{
      x: '-50%',
      y: '-100%',
    }"
    :transition="{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }"
  />
</template>
