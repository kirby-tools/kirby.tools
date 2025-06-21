<script lang="ts" setup>
import Beam from "./Beam.vue";

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

function generateBeams() {
  const beams: { x: number; delay: number }[] = [];
  const cellsPerSide = Math.floor(100 / props.beamSize);
  const step = cellsPerSide / props.beamsPerSide;

  for (let i = 0; i < props.beamsPerSide; i++) {
    const x = Math.floor(i * step);
    const delay =
      Math.random() * (props.beamDelayMax - props.beamDelayMin) +
      props.beamDelayMin;
    beams.push({ x, delay });
  }

  return beams;
}

const topBeams = generateBeams();
const bottomBeams = generateBeams();
const leftBeams = generateBeams();
const rightBeams = generateBeams();
</script>

<template>
  <div class="relative">
    <ClientOnly>
      <div
        :style="{
          '--perspective': `${perspective}px`,
          '--beam-size': `${beamSize}%`,
        }"
        class="[container-type:size] pointer-events-none absolute inset-0 overflow-hidden [clip-path:inset(0)] [perspective:var(--perspective)] [transform-style:preserve-3d]"
      >
        <!-- TOP -->
        <div
          class="[container-type:inline-size] absolute [height:100cqmax] [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [transform-style:preserve-3d]"
        >
          <Beam
            v-for="(beam, index) in topBeams"
            :key="`top-${index}`"
            :width="`${beamSize}%`"
            :x="`${beam.x * beamSize}%`"
            :delay="beam.delay"
            :duration="beamDuration"
          />
        </div>

        <!-- BOTTOM -->
        <div
          class="[container-type:inline-size] absolute top-full [height:100cqmax] [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [transform-style:preserve-3d]"
        >
          <Beam
            v-for="(beam, index) in bottomBeams"
            :key="`bottom-${index}`"
            :width="`${beamSize}%`"
            :x="`${beam.x * beamSize}%`"
            :delay="beam.delay"
            :duration="beamDuration"
          />
        </div>

        <!-- LEFT -->
        <div
          class="[container-type:inline-size] absolute top-0 left-0 [height:100cqmax] [width:100cqh] [transform-origin:0%_0%] [transform:rotate(90deg)_rotateX(-90deg)] [transform-style:preserve-3d]"
        >
          <Beam
            v-for="(beam, index) in leftBeams"
            :key="`left-${index}`"
            :width="`${beamSize}%`"
            :x="`${beam.x * beamSize}%`"
            :delay="beam.delay"
            :duration="beamDuration"
          />
        </div>

        <!-- RIGHT -->
        <div
          class="[container-type:inline-size] absolute top-0 right-0 [height:100cqmax] [width:100cqh] [transform-origin:100%_0%] [transform:rotate(-90deg)_rotateX(-90deg)] [transform-style:preserve-3d]"
        >
          <Beam
            v-for="(beam, index) in rightBeams"
            :key="`right-${index}`"
            :width="`${beamSize}%`"
            :x="`${beam.x * beamSize}%`"
            :delay="beam.delay"
            :duration="beamDuration"
          />
        </div>
      </div>
    </ClientOnly>

    <slot />
  </div>
</template>
