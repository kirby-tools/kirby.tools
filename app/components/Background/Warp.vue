<script lang="ts" setup>
interface Props {
  perspective?: number;
  beamsPerSide?: number;
  beamSize?: number;
  beamDelayMax?: number;
  beamDelayMin?: number;
  beamDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  perspective: 100,
  beamsPerSide: 3,
  beamSize: 5,
  beamDelayMax: 3,
  beamDelayMin: 0,
  beamDuration: 3,
});

/** OKLCH hues of danube, orchid, lima and pumpkin. */
const BEAM_HUES = [250.8, 318.6, 134.6, 48.7];

const SIDE_LAYOUTS = [
  {
    key: "top",
    class: "absolute h-[100cqmax] w-[100cqi] origin-top rotate-x-[-90deg]",
  },
  {
    key: "bottom",
    class:
      "absolute top-full h-[100cqmax] w-[100cqi] origin-top rotate-x-[-90deg]",
  },
  {
    key: "left",
    // Rotating around Z before X is what stands this side on edge. Tailwind's
    // `rotate-*` utilities always compose in X, Y, Z order, so they cannot
    // express it.
    class:
      "absolute top-0 left-0 h-[100cqmax] w-[100cqh] origin-top-left [transform:rotate(90deg)_rotateX(-90deg)]",
  },
  {
    key: "right",
    class:
      "absolute top-0 right-0 h-[100cqmax] w-[100cqh] origin-top-right [transform:rotate(-90deg)_rotateX(-90deg)]",
  },
];

/**
 * Distributes values over [0, 1) via the golden ratio: spread evenly enough to
 * read as random, but identical on the server and the client, so the beams can
 * be rendered into the initial HTML instead of waiting for hydration.
 */
function scatter(n: number) {
  return (n * 0.618033988749895) % 1;
}

function generateBeams(side: number) {
  const delayRange = props.beamDelayMax - props.beamDelayMin;

  return Array.from({ length: props.beamsPerSide }, (_, index) => {
    const seed = side * props.beamsPerSide + index;

    return {
      x: `${(index * 100) / props.beamsPerSide}%`,
      // Negative, so the beam is already mid-flight on the first frame.
      delay: -(props.beamDelayMin + scatter(seed + 1) * delayRange),
      hue: BEAM_HUES[seed % BEAM_HUES.length]!,
      // A different point in the sequence, so the aspect ratio doesn't
      // track the delay.
      aspectRatio: 2 + Math.floor(scatter(seed + 17) * 8),
    };
  });
}

const sides = computed(() =>
  SIDE_LAYOUTS.map((layout, index) => ({
    ...layout,
    beams: generateBeams(index),
  })),
);
</script>

<template>
  <div class="relative">
    <div
      :style="{
        '--perspective': `${perspective}px`,
        '--beam-size': `${beamSize}%`,
        '--beam-duration': `${beamDuration}s`,
      }"
      class="@container-size pointer-events-none absolute inset-0 overflow-hidden [clip-path:inset(0)] perspective-(--perspective) transform-3d"
    >
      <div
        v-for="side in sides"
        :key="side.key"
        class="@container transform-3d"
        :class="side.class"
      >
        <div
          v-for="(beam, index) in side.beams"
          :key="index"
          :style="{
            '--beam-x': beam.x,
            '--beam-delay': `${beam.delay}s`,
            '--beam-aspect-ratio': beam.aspectRatio,
            '--beam-color': `oklch(74% 0.16 ${beam.hue})`,
          }"
          class="absolute top-0 left-(--beam-x) aspect-[1/var(--beam-aspect-ratio)] w-(--beam-size) -translate-x-1/2 animate-[beam-rise_var(--beam-duration)_linear_infinite] bg-linear-to-b from-(--beam-color) to-transparent [animation-delay:var(--beam-delay)] motion-reduce:translate-y-[20cqmax] motion-reduce:animate-none"
        />
      </div>
    </div>

    <slot />
  </div>
</template>

<style>
/*
 * Not scoped: Vue rewrites `@keyframes` names in scoped styles but leaves the
 * name inside a Tailwind utility class untouched, so the animation would never
 * resolve.
 */
@keyframes beam-rise {
  from {
    transform: translateY(50cqmax);
  }
  to {
    transform: translateY(-100%);
  }
}
</style>
