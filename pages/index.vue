<script setup lang="ts">
const placesStore = usePlacesStore()

/**
 * callOnce() is a Nuxt composable that:
 *  → Executes the callback during server-side rendering
 *  → Caches the promise so client-side route changes don’t re-fetch
 */
await callOnce(() => placesStore.fetchAll())
</script>

<template>
    <div>Home Page</div>
</template>