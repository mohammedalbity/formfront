<template>
  <div :class="containerClass">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="handleChange"
        :disabled="disabled"
        :required="required"
        class="block w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 appearance-none text-sm sm:text-base py-2 sm:py-3"
        :class="[
          selectClasses,
          { 
            'px-3 sm:px-4 pr-8 sm:pr-10': !isRTLSync, 
            'px-3 sm:px-4 pl-8 sm:pl-10': isRTLSync,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="getOptionValue(option)" 
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      <div
        class="absolute inset-y-0 flex items-center pointer-events-none"
        :class="{ 'right-0 pr-3': !isRTLSync, 'left-0 pl-3': isRTLSync }"
      >
        <svg
          class="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          :class="{ 'transform rotate-0': !isRTLSync, 'transform rotate-180': isRTLSync }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isRTLSync } from '../i18n'

// Types
interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

type OptionType = string | number | SelectOption

// Props
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  options: OptionType[]
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  containerClass?: string
  selectClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
  containerClass: 'w-full',
  selectClasses: ''
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

// Methods
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const getOptionValue = (option: OptionType): string | number => {
  if (typeof option === 'object' && option !== null) {
    return option.value
  }
  return option
}

const getOptionLabel = (option: OptionType): string => {
  if (typeof option === 'object' && option !== null) {
    return option.label
  }
  return String(option)
}
</script>

<style scoped>
/* Custom styles for the select component */
select::-ms-expand {
  display: none;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Focus styles */
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Disabled styles */
select:disabled {
  background-color: #f9fafb;
  color: #6b7280;
}
</style>
