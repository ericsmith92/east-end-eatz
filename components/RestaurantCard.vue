<script setup lang="ts">
import type { PropType } from 'vue'
import type { Place } from '~/types/Place'

defineProps({
  restaurant: {
    type: Object as PropType<Place>,
    required: true,
  },
})
</script>

<template>
  <div class="border rounded-2xl shadow p-4 hover:shadow-lg transition">
    <img
      v-if="restaurant.photo_ref"
      :src="restaurant.image_url ?? '/img/placeholder.png'"
      :alt="`Photo of ${restaurant.name}`"
      class="w-full h-48 object-cover rounded-xl mb-3"
    />
    <div>
      <h2 class="text-lg font-semibold">{{ restaurant.name }}</h2>
      <p class="text-sm text-gray-600">{{ restaurant.address }}</p>
      <p class="mt-1 text-sm">
        ⭐ {{ restaurant.rating }} | {{ restaurant.user_ratings_total }} reviews
      </p>
      <p v-if="restaurant.price_level" class="text-sm text-gray-600">
        {{ '$'.repeat(restaurant.price_level) }}
      </p>
    </div>
  </div>
</template>
