<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <figure class="w-full overflow-hidden rounded-xl shadow">
    <img :src="src" alt="Restaurant hero image" class="w-full h-64 sm:h-80 object-cover" />
  </figure>
</template>
