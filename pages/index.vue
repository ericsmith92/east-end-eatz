<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'

const searchQuery = ref('')

const placesStore = usePlacesStore()
const { fetchPage, getNextPage, getPreviousPage, fetchBasedOnTerm } = placesStore

watch(searchQuery, async query => {
  try {
    await fetchBasedOnTerm(query)
  } catch (error) {
    console.error(error)
  }
})

await callOnce(() => fetchPage())
</script>

<template>
  <div class="p-4">
    <div class="max-w-3xl mx-auto mb-6 px-4">
      <Searchbar placeholder="Search" ariaLabel="Search" v-model="searchQuery" />
    </div>
    <h1 class="text-2xl font-bold mb-4">East End Restaurants</h1>
    <RestaurantList :restaurants="placesStore.list" />
    <div class="flex justify-center gap-4 mt-8 max-w-6xl mx-auto">
      <PaginationButton
        :onClick="
          () =>
            getPreviousPage(searchQuery ? start => fetchBasedOnTerm(searchQuery, start) : undefined)
        "
        ariaLabel="Previous"
        label="Previous"
        :disabled="!placesStore.offset"
      />
      <PaginationButton
        :onClick="
          () => getNextPage(searchQuery ? start => fetchBasedOnTerm(searchQuery, start) : undefined)
        "
        ariaLabel="Next"
        label="Next"
        :disabled="!placesStore.hasNextPage"
      />
    </div>
  </div>
</template>
