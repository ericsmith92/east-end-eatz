<template>
  <button
    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  onClick: {
    type: Function as PropType<() => void>,
    required: true,
  },
  ariaLabel: {
    type: String,
    required: false,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
