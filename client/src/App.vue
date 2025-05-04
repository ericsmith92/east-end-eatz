<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const gmapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const PAGE_SIZE = 15;
const offset = ref(0);
const places = ref([]);
let totalCount = 0;

async function loadPage (start) {
  const end = start + PAGE_SIZE - 1;
  const { data, error, count } = await supabase
    .from('places')
    .select('*', { count: 'exact' })
    .range(start, end)

  if (error) throw error;

  totalCount = count;
  places.value = data;
  offset.value = start;
}

function getNextPlaces () {
  const start = offset.value + PAGE_SIZE;
  if(start > totalCount) return;
  return loadPage(start);
}

function getPreviousPlaces () {
  if (offset.value === 0) return;
  return loadPage(Math.max(0, offset.value - PAGE_SIZE));
}

onMounted(() => {
  loadPage(0);
});
</script>

<template>
  <ul>
    <li v-for="place in places" :key="place.id">
      <h2>{{ place.name }}</h2>
      <img :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_ref}&key=${gmapKey}`" :alt="`${place.name}`"/>
    </li>
  </ul>
  <button @click="getPreviousPlaces">Previous</button>
  <button @click="getNextPlaces">Next</button>
</template>