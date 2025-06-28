<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'

const route = useRoute()
const placesStore = usePlacesStore()

const { fetchPlace } = placesStore
const id = Number(route.params.id)

await fetchPlace(id)

const place = computed(() => placesStore.current)
</script>

<template>
  <div>
    <Restaurant :restaurant="place" />
  </div>
</template>
