<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ rating: number }>()
const rounded = computed(() => Math.round(props.rating))
</script>

<template>
  <div class="flex">
    <svg
      v-for="n in 5"
      :key="n"
      class="w-4 h-4"
      :class="n <= rounded ? 'text-yellow-400' : 'text-gray-300'"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z"
      />
    </svg>
  </div>
</template>
