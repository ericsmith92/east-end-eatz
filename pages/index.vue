<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'

const placesStore = usePlacesStore()
const { fetchPage, getNextPage, getPreviousPage } = placesStore

await callOnce(() => fetchPage())
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">East End Restaurants</h1>
    <RestaurantList :restaurants="placesStore.list" />
    <div class="flex justify-center gap-4 mt-8 max-w-6xl mx-auto">
      <PaginationButton
        :onClick="getPreviousPage"
        ariaLabel="Previous"
        label="Previous"
        :disabled="!placesStore.offset"
      />
      <PaginationButton
        :onClick="getNextPage"
        ariaLabel="Next"
        label="Next"
        :disabled="!placesStore.hasNextPage"
      />
    </div>
  </div>
</template>
