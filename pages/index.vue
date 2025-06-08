<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'

const placesStore = usePlacesStore()

await callOnce(() => placesStore.fetchPage())
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">East End Restaurants</h1>
    <RestaurantList :restaurants="placesStore.list" />
  </div>
</template>
