<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const places = ref([])

async function getPlaces() {
  const { data } = await supabase.from('places').select()
  places.value = data
}

onMounted(() => {
  getPlaces()
})
</script>

<template>
  <ul>
    <li v-for="place in places" :key="place.id">{{ place.name }}</li>
  </ul>
</template>