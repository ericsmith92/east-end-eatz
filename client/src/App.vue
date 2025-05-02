<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const gmapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const PAGE_SIZE = 15;
const offset = ref(0);
const places = ref([]);

async function getPlaces() {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .range(offset.value, offset.value + PAGE_SIZE - 1);

  if(error){
    return error;
  }

  places.value = [...data];
  offset.value += PAGE_SIZE;
}

onMounted(() => {
  getPlaces()
});
</script>

<template>
  <ul>
    <li v-for="place in places" :key="place.id">
      <h2>{{ place.name }}</h2>
      <img :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_ref}&key=${gmapKey}`" :alt="`${place.name}`"/>
    </li>
  </ul>
  <button @click="getPlaces">Load Next</button>
</template>