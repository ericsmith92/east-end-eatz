<script setup lang="ts">
import type { Place } from '~/types/Place'
const props = defineProps<{ restaurant: Place }>()

const heroImage = computed(() => {
  return props.restaurant.image_url ?? '/img/placeholder.png'
})

const directionsUrl = computed(() => {
  return props.restaurant.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        props.restaurant.address
      )}`
    : undefined
})
</script>

<template>
  <section v-if="restaurant" class="container mx-auto px-4 py-8">
    <div class="grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <HeroImage :src="heroImage" />
        <RestaurantHeader
          :name="restaurant.name ?? ''"
          :address="restaurant.address ?? ''"
          :rating="restaurant.rating ?? 0"
          :ratings-total="restaurant.user_ratings_total ?? 0"
        />
        <!-- 
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
