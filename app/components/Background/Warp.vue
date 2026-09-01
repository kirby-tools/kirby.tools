<script lang="ts" setup>
const props = defineProps<{
  beamDuration: number;
}>();

const PERSPECTIVE = 100;
const BEAMS_PER_SIDE = 3;

/** Beam width, as a percentage of the side it rises along. */
const BEAM_SIZE = 5;

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
  return Array.from({ length: BEAMS_PER_SIDE }, (_, index) => {
    const seed = side * BEAMS_PER_SIDE + index;

    return {
      x: `${(index * 100) / BEAMS_PER_SIDE}%`,
      // Negative, so the beam is already mid-flight on the first frame.
      delay: -(scatter(seed + 1) * props.beamDuration),
      hue: BEAM_HUES[seed % BEAM_HUES.length]!,
      // A different point in the sequence, so `aspectRatio` doesn't
      // track `delay`.
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
        '--perspective': `${PERSPECTIVE}px`,
        '--beam-size': `${BEAM_SIZE}%`,
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
@keyframes beam-rise {
  from {
    transform: translateY(50cqmax);
  }
  to {
    transform: translateY(-100%);
  }
}
</style>
