<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search restaurants...',
  },
  ariaLabel: {
    type: String,
    default: 'Search',
  },
})

const emit = defineEmits(['update:modelValue'])

const input = ref(props.modelValue)

watch(input, val => {
  emit('update:modelValue', val)
})

watch(
  () => props.modelValue,
  val => {
    if (val !== input.value) input.value = val
  }
)

function onInput() {
  /* immediate updates via v-model already handled */
}
</script>

<template>
  <div class="relative w-full max-w-3xl mx-auto">
    <input
      v-model="input"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      class="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      @input="onInput"
    />
    <svg
      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-4.35-4.35M18 10a8 8 0 11-16 0 8 8 0 0116 0z"
      />
    </svg>
  </div>
</template>
