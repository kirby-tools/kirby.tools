<template>
  <div aria-hidden="true" class="absolute inset-0 z-[-1]">
    <UContainer class="h-full">
      <!-- A pixel out, so the rules sit beside the content column, never under it. -->
      <div class="border-default relative -mx-px h-full lg:border-x">
        <slot />
      </div>
    </UContainer>
  </div>
</template>
