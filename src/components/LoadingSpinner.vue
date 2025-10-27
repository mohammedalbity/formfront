<template>
  <div class="loading-spinner-container" :class="containerClass">
    <div class="flex flex-col items-center justify-center" :class="contentClass">
      <!-- Spinner -->
      <div class="relative">
        <div 
          class="animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          :class="spinnerClass"
        ></div>
        <div 
          v-if="showPulse"
          class="absolute inset-0 animate-ping rounded-full border-2 border-current opacity-20"
          :class="pulseClass"
        ></div>
      </div>
      
      <!-- Loading Text -->
      <div v-if="text" class="mt-3 sm:mt-4 text-center">
        <p class="text-sm sm:text-base font-medium" :class="textClass">
          {{ text }}
        </p>
        <p v-if="subtext" class="text-xs sm:text-sm mt-1 opacity-75" :class="subtextClass">
          {{ subtext }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  text?: string
  subtext?: string
  fullscreen?: boolean
  overlay?: boolean
  showPulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'blue',
  fullscreen: false,
  overlay: false,
  showPulse: false
})

// Computed classes
const containerClass = computed(() => {
  const classes = []
  
  if (props.fullscreen) {
    classes.push('fixed inset-0 z-50 flex items-center justify-center')
    if (props.overlay) {
      classes.push('bg-white/80 backdrop-blur-sm')
    }
  } else {
    classes.push('flex items-center justify-center p-8')
  }
  
  return classes.join(' ')
})

const contentClass = computed(() => {
  const classes = []
  
  if (props.fullscreen) {
    classes.push('max-w-sm sm:max-w-md mx-auto px-4 sm:px-6')
  }
  
  return classes.join(' ')
})

const spinnerClass = computed(() => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  }
  
  return `${sizeClasses[props.size]} ${colorClasses[props.color]}`
})

const pulseClass = computed(() => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600'
  }
  
  return `${sizeClasses[props.size]} ${colorClasses[props.color]}`
})

const textClass = computed(() => {
  const colorClasses = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    red: 'text-red-900',
    yellow: 'text-yellow-900',
    purple: 'text-purple-900',
    gray: 'text-gray-900'
  }
  
  return colorClasses[props.color]
})

const subtextClass = computed(() => {
  const colorClasses = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
    purple: 'text-purple-700',
    gray: 'text-gray-700'
  }
  
  return colorClasses[props.color]
})
</script>

<style scoped>
.loading-spinner-container {
  min-height: 120px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
