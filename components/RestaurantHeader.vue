<script setup lang="ts">
defineProps<{
  name: string
  rating: number
  ratingsTotal: number
  address: string
  hours: string[]
}>()
</script>

<template>
  <header class="space-y-2">
    <h1 class="text-3xl font-semibold">{{ name }}</h1>
    <div class="flex items-center gap-2 text-sm" v-if="rating">
      <StarRating :rating="rating" />
      <span class="font-medium">{{ rating.toFixed(1) }}</span>
      <span class="text-gray-500">({{ ratingsTotal ?? 0 }} reviews)</span>
    </div>
    <address v-if="address" class="not-italic text-gray-700">{{ address }}</address>
    <Hours v-if="hours?.length" :hours="hours" />
  </header>
</template>
