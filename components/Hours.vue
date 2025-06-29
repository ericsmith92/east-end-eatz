<script setup lang="ts">
defineProps<{ hours: string[] }>()
</script>

<template>
  <ul class="space-y-0.5">
    <li v-for="(line, i) in hours" :key="i">{{ line }}</li>
  </ul>
</template>
