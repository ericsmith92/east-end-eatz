<script setup lang="ts">
defineProps<{
  phone?: string | null
  website?: string | null
  directionsUrl?: string
}>()
</script>

<template>
  <div class="flex flex-wrap gap-3 py-3">
    <a
      v-if="phone"
      :href="`tel:${phone}`"
      class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Call
    </a>

    <a
      v-if="directionsUrl"
      :href="directionsUrl"
      target="_blank"
      rel="noopener"
      class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Directions
    </a>

    <a
      v-if="website"
      :href="website"
      target="_blank"
      rel="noopener"
      class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Website
    </a>
  </div>
</template>
