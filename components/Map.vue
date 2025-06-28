<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  lat: number
  lng: number
  zoom?: number
}>()

const mapUrl = computed(() => {
  const googleApiKey = useRuntimeConfig().public.googleMapsApiKey
  return `https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${props.lat},${props.lng}&zoom=${props.zoom ?? 15}`
})
</script>

<template>
  <iframe
    class="w-full h-full rounded-xl border-none"
    :src="mapUrl"
    allowfullscreen
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  />
</template>
