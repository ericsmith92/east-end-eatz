<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const PAGE_SIZE = 15;
const gmapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const places = ref([]);

async function getPlaces() {
  const { data, error } = await supabase.from('places').select('*').range(0, PAGE_SIZE - 1);
  places.value = data
}

onMounted(() => {
  getPlaces()
});

console.log(gmapKey)
</script>

<template>
  <ul>
    <li v-for="place in places" :key="place.id">
      <h2>{{ place.name }}</h2>
      <img :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_ref}&key=${gmapKey}`" :alt="`${place.name}`"/>
    </li>
  </ul>
</template>