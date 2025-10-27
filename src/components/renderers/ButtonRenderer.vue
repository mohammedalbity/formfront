<template>
  <div class="button-renderer">
    <button
      type="button"
      @click="handleClick"
      :disabled="component.disabled"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
      :class="getButtonClasses()"
    >
      <svg v-if="component.leftIcon" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="component.leftIcon" />
      </svg>
      {{ component.label || component.key }}
      <svg v-if="component.rightIcon" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="component.rightIcon" />
      </svg>
    </button>
    <p v-if="component.description" class="text-xs text-gray-500 mt-2">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any], 'submit': [buttonInfo: { action: string, isFormSubmit: boolean }] }>()

const getButtonClasses = () => {
  const theme = props.component.theme || 'primary'
  const baseClasses = 'disabled:opacity-50 disabled:cursor-not-allowed'
  
  switch (theme) {
    case 'primary':
      return `${baseClasses} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`
    case 'secondary':
      return `${baseClasses} text-gray-700 bg-transparent border-gray-300 hover:bg-gray-50 focus:ring-blue-500`
    case 'success':
      return `${baseClasses} text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`
    case 'danger':
      return `${baseClasses} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`
    case 'warning':
      return `${baseClasses} text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500`
    default:
      return `${baseClasses} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`
  }
}

const handleClick = () => {
  if (props.component.action === 'submit') {
    emit('submit', { 
      action: props.component.action, 
      isFormSubmit: true 
    })
  } else {
    // For non-submit buttons, just update the value without triggering submit
    emit('update:value', props.component.key, true)
  }
}
</script>
