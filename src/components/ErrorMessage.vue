<template>
  <div class="error-message-container" :class="containerClass">
    <div class="flex items-start" :class="{ 'flex-row-reverse': isRTLSync }">
      <!-- Error Icon -->
      <div class="flex-shrink-0">
        <svg 
          class="h-5 w-5"
          :class="iconClass"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            v-if="type === 'error'"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
          <path 
            v-else-if="type === 'warning'"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
          <path 
            v-else-if="type === 'info'"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
          <path 
            v-else
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <!-- Error Content -->
      <div class="ml-3" :class="{ 'ml-3': !isRTLSync, 'mr-3': isRTLSync }">
        <h3 v-if="title" class="text-sm font-medium" :class="titleClass">
          {{ title }}
        </h3>
        <div class="text-sm" :class="[messageClass, { 'mt-1': title }]">
          <p v-if="typeof message === 'string'">{{ message }}</p>
          <ul v-else-if="Array.isArray(message)" class="list-disc list-inside space-y-1">
            <li v-for="(msg, index) in message" :key="index">{{ msg }}</li>
          </ul>
        </div>
        
        <!-- Actions -->
        <div v-if="showRetry || showDismiss || $slots.actions" class="mt-4">
          <div class="flex space-x-2" :class="{ 'space-x-2': !isRTLSync, 'space-x-reverse': isRTLSync }">
            <button
              v-if="showRetry"
              @click="$emit('retry')"
              class="bg-white px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="retryButtonClass"
            >
              {{ retryText || $t('common.retry') }}
            </button>
            <button
              v-if="showDismiss"
              @click="$emit('dismiss')"
              class="bg-white px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {{ dismissText || $t('common.dismiss') }}
            </button>
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
      
      <!-- Close Button -->
      <div v-if="closable" class="ml-auto pl-3" :class="{ 'ml-auto pl-3': !isRTLSync, 'mr-auto pr-3': isRTLSync }">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="$emit('close')"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="closeButtonClass"
          >
            <span class="sr-only">{{ $t('common.close') }}</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../i18n'

interface Props {
  type?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  message: string | string[]
  showRetry?: boolean
  showDismiss?: boolean
  closable?: boolean
  retryText?: string
  dismissText?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  showRetry: false,
  showDismiss: false,
  closable: false,
  size: 'md'
})

const emit = defineEmits<{
  retry: []
  dismiss: []
  close: []
}>()

const { t } = useI18n()

// Computed classes
const containerClass = computed(() => {
  const baseClasses = 'rounded-md p-4'
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  const typeClasses = {
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]} ${typeClasses[props.type]}`
})

const iconClass = computed(() => {
  const typeClasses = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    success: 'text-green-400'
  }
  
  return typeClasses[props.type]
})

const titleClass = computed(() => {
  const typeClasses = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
    success: 'text-green-800'
  }
  
  return typeClasses[props.type]
})

const messageClass = computed(() => {
  const typeClasses = {
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
    success: 'text-green-700'
  }
  
  return typeClasses[props.type]
})

const retryButtonClass = computed(() => {
  const typeClasses = {
    error: 'text-red-700 border-red-300 hover:bg-red-50 focus:ring-red-500',
    warning: 'text-yellow-700 border-yellow-300 hover:bg-yellow-50 focus:ring-yellow-500',
    info: 'text-blue-700 border-blue-300 hover:bg-blue-50 focus:ring-blue-500',
    success: 'text-green-700 border-green-300 hover:bg-green-50 focus:ring-green-500'
  }
  
  return typeClasses[props.type]
})

const closeButtonClass = computed(() => {
  const typeClasses = {
    error: 'text-red-400 hover:bg-red-100 hover:text-red-500 focus:ring-red-500',
    warning: 'text-yellow-400 hover:bg-yellow-100 hover:text-yellow-500 focus:ring-yellow-500',
    info: 'text-blue-400 hover:bg-blue-100 hover:text-blue-500 focus:ring-blue-500',
    success: 'text-green-400 hover:bg-green-100 hover:text-green-500 focus:ring-green-500'
  }
  
  return typeClasses[props.type]
})
</script>

<style scoped>
.error-message-container {
  word-wrap: break-word;
}
</style>
