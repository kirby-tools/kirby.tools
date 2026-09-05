<script setup lang="ts">
import { kebabCase } from "scule";

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleDelay: number;
  id: string;
}

const props = withDefaults(
  defineProps<{
    starCount?: number;
    color?: string;
    size?: { min: number; max: number };
    speed?: "slow" | "normal" | "fast";
  }>(),
  {
    starCount: 50,
    color: "var(--ui-primary)",
    size: () => ({
      min: 1,
      max: 3,
    }),
    speed: "normal",
  },
);

const route = useRoute();

const stars = useState<Star[]>(`${kebabCase(route.path)}-sky`, () =>
  generateStars(props.starCount),
);

const twinkleDuration = computed(() => {
  const speedMap: Record<string, string> = {
    slow: "4s",
    normal: "2s",
    fast: "1s",
  };
  return speedMap[props.speed];
});

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const size =
      Math.random() * (props.size.max - props.size.min) + props.size.min;
    const twinkleDelay = Math.random() * 5;

    return {
      x,
      y,
      size,
      twinkleDelay,
      id: Math.random().toString(36).substring(2, 9),
    };
  });
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-[-1] overflow-hidden">
    <div
      v-for="star in stars"
      :key="star.id"
      class="absolute size-(--star-size) animate-[sky-twinkle_var(--twinkle-duration)_ease-in-out_var(--twinkle-delay)_infinite] rounded-full bg-(--star-color) will-change-[opacity] motion-reduce:animate-none"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        transform: 'translate(-50%, -50%)',
        '--star-size': `${star.size}px`,
        '--star-color': color,
        '--twinkle-delay': `${star.twinkleDelay}s`,
        '--twinkle-duration': twinkleDuration,
      }"
    />
  </div>
</template>

<style>
@keyframes sky-twinkle {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>
