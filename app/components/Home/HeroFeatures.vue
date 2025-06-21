<script setup lang="ts">
const tabs = [
  {
    title: 'Zeitsparend',
    description: 'Generierung in < 30 Sekunden',
    icon: 'i-ph-clock-countdown-duotone',
    image: 'kirotte-entwicklungsbericht',
  },
  {
    title: 'Übersichtlich',
    description: 'Fähigkeiten je Altersbereich',
    icon: 'i-ph-person-arms-spread-duotone',
    image: 'faehigkeiten-erfassen',
  },
  {
    title: 'Übersetzbar',
    description: 'Für nultilinguale KiTas',
    icon: 'i-ph-translate-duotone',
    image: 'entwicklungsbericht-uebersetzen',
  },
  {
    title: 'Bereit für Träger',
    description: 'Mitglieder-Verwaltung leicht gemacht',
    icon: 'i-ph-users-three-duotone',
    image: 'kirotte-teams',
  },
]

const activeFeature = ref(0)
const container = useTemplateRef('container')
const indicatorLeft = ref(0)

watch(activeFeature, () => {
  nextTick(setIndicatorPosition)
})

onMounted(() => {
  setIndicatorPosition()
})

function setIndicatorPosition() {
  if (!container.value) return

  const items = [...container.value.querySelectorAll('[data-tab-item]')]
  const activeElement = items[activeFeature.value]
  if (!activeElement) return

  // Get container and active card positions
  const containerRect = container.value.getBoundingClientRect()
  const activeRect = activeElement.getBoundingClientRect()

  // Calculate center of active card relative to container
  const center = activeRect.left - containerRect.left + activeRect.width / 2
  indicatorLeft.value = center
}
</script>

<template>
  <section ref="container">
    <!-- Border line and the moving span -->
    <div class="relative border-t border-(--ui-border)">
      <div
        class="absolute top-full h-px w-8 -translate-x-1/2 -translate-y-full bg-(--ui-primary) transition-[left] duration-300 max-md:hidden"
        :style="{ left: `${indicatorLeft}px` }"
      />
    </div>

    <!-- Tabs -->
    <div
      class="flex w-full snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-4 md:gap-4"
    >
      <div
        v-for="(item, index) in tabs"
        :key="index"
        class="flex shrink-0 cursor-pointer snap-center flex-col items-center justify-center gap-2 px-4 py-6 max-md:w-full"
        data-tab-item
        @click="activeFeature = index"
      >
        <UButton
          :icon="item.icon"
          variant="soft"
          :color="activeFeature === index ? 'primary' : 'neutral'"
        />

        <div class="text-center">
          <p class="text-sm font-semibold text-(--ui-text-muted-highlighted)">
            {{ item.title }}
          </p>
          <p class="text-sm text-(--ui-text-muted)">{{ item.description }}</p>
        </div>

        <div class="mt-2 rounded-md bg-(--ui-bg-muted) p-1.5 md:hidden">
          <img
            data-theme="light"
            :src="`/images/${item.image}-light.png`"
            class="rounded-sm bg-(--ui-bg) shadow-sm dark:hidden"
          />
          <img
            data-theme="dark"
            :src="`/images/${item.image}-dark.png`"
            class="hidden rounded-sm bg-(--ui-bg) shadow-sm dark:block"
          />
        </div>
      </div>
    </div>

    <div class="max-md:hidden">
      <div class="rounded-xl bg-(--ui-bg-muted) p-1.5">
        <template v-for="(item, index) in tabs" :key="index">
          <img
            v-show="activeFeature === index"
            data-theme="light"
            :src="`/images/${item.image}-light.png`"
            class="rounded-lg bg-(--ui-bg) shadow-sm dark:hidden"
          />
          <img
            v-show="activeFeature === index"
            data-theme="dark"
            :src="`/images/${item.image}-dark.png`"
            class="hidden rounded-lg bg-(--ui-bg) shadow-sm dark:block"
          />
        </template>
      </div>
    </div>
  </section>
</template>
