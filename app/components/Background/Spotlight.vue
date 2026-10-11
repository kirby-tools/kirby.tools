<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-x-0 top-0 z-[-1] h-(--spotlight-reach) overflow-x-clip [--spotlight-reach:22rem] sm:[--spotlight-reach:28rem] lg:[--spotlight-reach:34rem]"
  >
    <div
      class="from-primary/15 absolute left-1/2 aspect-square w-full max-w-[52rem] -translate-x-1/2 -translate-y-1/3 animate-[spotlight-fade_900ms_ease-out_320ms_both] bg-radial to-transparent to-65% motion-reduce:animate-none"
    />

    <div
      class="from-primary/10 dark:from-primary/15 absolute inset-y-0 left-1/2 w-[calc(8rem+2*var(--spotlight-reach))] -translate-x-1/2 animate-[spotlight-aperture_1100ms_cubic-bezier(0.16,1,0.3,1)_120ms_both] bg-linear-to-b to-transparent to-70% [clip-path:polygon(calc(50%-4rem)_0,calc(50%+4rem)_0,100%_100%,0_100%)] motion-reduce:animate-none"
    />

    <div
      class="via-primary/50 absolute inset-x-0 top-0 h-px animate-[spotlight-fade_250ms_ease-out_both] bg-linear-to-r from-transparent to-transparent motion-reduce:animate-none"
    />
  </div>
</template>

<style>
@keyframes spotlight-fade {
  from {
    opacity: 0;
  }
}

/* The end state is the element's own, so only the closed aperture is written. */
@keyframes spotlight-aperture {
  from {
    opacity: 0;
    transform: scaleX(0.1);
  }
}
</style>
