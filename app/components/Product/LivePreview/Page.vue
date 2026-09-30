<script setup lang="ts">
defineProps<{
  title: string;
  dates: string;
  description: string;
  text: PanelBlock[];
}>();
</script>

<template>
  <div class="@container min-h-full bg-white text-black">
    <!-- Sizes are steps on a whole-tone scale, the space between blocks is
         counted in lines. -->
    <article
      class="px-5 py-6 font-sans text-sm/[1.45] text-pretty wrap-break-word [--ratio:pow(2,1/6)] @2xl:p-12 @2xl:text-base/[1.5]"
    >
      <header class="grid gap-x-6 @2xl:grid-cols-[1fr_2fr]">
        <p class="font-bold">{{ EXHIBITION_SITE.title }}</p>
        <p>{{ dates }}</p>
      </header>

      <div class="mt-[3lh] grid gap-x-6 @2xl:mt-[4lh] @2xl:grid-cols-[1fr_2fr]">
        <h1
          class="text-[length:calc(1em*pow(var(--ratio),6))]/[1.05] tracking-tight text-balance @2xl:col-span-2 @2xl:text-[length:calc(1em*pow(var(--ratio),11))]/none"
        >
          {{ title }}
        </h1>
        <p
          class="mt-[1lh] text-[length:calc(1em*pow(var(--ratio),2))]/[1.3] whitespace-pre-line @2xl:col-start-2 @2xl:mt-[1.5lh]"
        >
          {{ description }}
        </p>

        <div class="mt-[2lh] @2xl:col-start-2 [&>*+*]:mt-[1lh] [&>h2+*]:mt-0">
          <template v-for="(block, index) in text" :key="index">
            <h2 v-if="block.type === 'heading'" class="font-bold">
              {{ block.text }}
            </h2>
            <blockquote v-else-if="block.type === 'quote'">
              <p
                class="text-[length:calc(1em*pow(var(--ratio),2))]/[1.3] whitespace-pre-line before:absolute before:-translate-x-full before:content-[open-quote] after:content-[close-quote]"
              >
                {{ block.text }}
              </p>
              <footer class="mt-2">{{ block.citation }}</footer>
            </blockquote>
            <p v-else class="whitespace-pre-line">{{ block.text }}</p>
          </template>
        </div>
      </div>
    </article>
  </div>
</template>
