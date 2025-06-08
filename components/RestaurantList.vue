<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <RestaurantCard
      v-for="restaurant in restaurants"
      :key="restaurant.id"
      :restaurant="restaurant"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Place } from '~/types/Place'
import RestaurantCard from './RestaurantCard.vue'

defineProps({
  restaurants: {
    type: Array as PropType<Place[]>,
    required: true,
  },
})
</script>
