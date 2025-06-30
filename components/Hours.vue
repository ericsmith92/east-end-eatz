<script setup lang="ts">
defineProps<{ hours: string[] }>()
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold">Hours</h2>
    <ul class="space-y-0.5">
      <li v-for="(line, i) in hours" :key="i">{{ line }}</li>
    </ul>
  </div>
</template>
