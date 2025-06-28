<script setup lang="ts">
import type { Place } from '~/types/Place'
const props = defineProps<{ place: Place }>()

const heroImage = computed(() => {
  return props.place.image_url ?? '/img/placeholder.png'
})

const directionsUrl = computed(() => {
  return props.place.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        props.place.address
      )}`
    : undefined
})
</script>

<template>
  <section v-if="place" class="container mx-auto px-4 py-8">
    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Main column -->
      <div class="lg:col-span-2 space-y-6">
        <HeroImage :src="heroImage" />
        <!-- <RestaurantHeader :place="place" />
        <ActionButtons
          :phone="place.phone_number"
          :website="place.website"
          :directions-url="directionsUrl"
        /> -->
      </div>
      <!-- <MapEmbed
        v-if="place.lat !== null && place.lng !== null"
        :lat="place.lat"
        :lng="place.lng"
        class="h-64 lg:h-full rounded-xl shadow"
      /> -->
    </div>
  </section>
</template>
