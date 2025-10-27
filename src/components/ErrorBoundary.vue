<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />
    
    <!-- Error State -->
    <div v-else class="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        <div class="text-center">
          <!-- Error Icon -->
          <div class="mx-auto h-16 sm:h-24 w-16 sm:w-24 text-red-500 mb-4 sm:mb-6">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          
          <!-- Error Title -->
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            {{ $t('errors.boundary.title') }}
          </h2>
          
          <!-- Error Message -->
          <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {{ errorMessage || $t('errors.boundary.defaultMessage') }}
          </p>
          
          <!-- Error Details (Development Only) -->
          <details v-if="isDevelopment && errorDetails" class="text-left mb-4 sm:mb-6">
            <summary class="cursor-pointer text-xs sm:text-sm text-gray-500 hover:text-gray-700">
              {{ $t('errors.boundary.showDetails') }}
            </summary>
            <pre class="mt-2 p-3 sm:p-4 bg-gray-100 rounded-lg text-xs text-gray-800 overflow-auto max-h-32 sm:max-h-40">{{ errorDetails }}</pre>
          </details>
          
          <!-- Action Buttons -->
          <div class="space-y-3 sm:space-y-4">
            <!-- Retry Button -->
            <button
              v-if="canRetry"
              @click="handleRetry"
              :disabled="isRetrying"
              class="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isRetrying" class="animate-spin -ml-1 mr-3 h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isRetrying ? $t('errors.boundary.retrying') : $t('errors.boundary.retry') }}
            </button>
            
            <!-- Reload Page Button -->
            <button
              @click="reloadPage"
              class="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('errors.boundary.reload') }}
            </button>
            
            <!-- Go Home Button -->
            <button
              @click="goHome"
              class="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('errors.boundary.goHome') }}
            </button>
          </div>
          
          <!-- Contact Support -->
          <div class="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
            {{ $t('errors.boundary.contactSupport') }}
            <a href="mailto:support@example.com" class="text-blue-600 hover:text-blue-500 break-all">
              support@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Props {
  fallbackComponent?: string
  onError?: (error: Error, errorInfo: any) => void
  canRetry?: boolean
  retryCallback?: () => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  fallbackComponent: '',
  canRetry: true
})

const emit = defineEmits<{
  error: [error: Error, errorInfo: any]
  retry: []
}>()

const router = useRouter()
const { t } = useI18n()

// State
const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const isRetrying = ref(false)
const retryCount = ref(0)

// Computed
const isDevelopment = computed(() => {
  return import.meta.env.DEV
})

// Error handling
onErrorCaptured((error: Error, instance, errorInfo) => {
  console.error('ErrorBoundary caught an error:', error)
  console.error('Error info:', errorInfo)
  
  hasError.value = true
  errorMessage.value = error.message
  errorDetails.value = `${error.stack}\n\nComponent: ${errorInfo}`
  
  // Call custom error handler if provided
  if (props.onError) {
    props.onError(error, errorInfo)
  }
  
  // Emit error event
  emit('error', error, errorInfo)
  
  // Prevent the error from propagating further
  return false
})

// Global error handler for unhandled promise rejections
onMounted(() => {
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  window.addEventListener('error', handleGlobalError)
})

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason)
  
  hasError.value = true
  errorMessage.value = event.reason?.message || 'An unexpected error occurred'
  errorDetails.value = event.reason?.stack || String(event.reason)
}

const handleGlobalError = (event: ErrorEvent) => {
  console.error('Global error:', event.error)
  
  hasError.value = true
  errorMessage.value = event.error?.message || event.message || 'An unexpected error occurred'
  errorDetails.value = event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`
}

// Actions
const handleRetry = async () => {
  if (!props.canRetry || isRetrying.value) return
  
  isRetrying.value = true
  retryCount.value++
  
  try {
    if (props.retryCallback) {
      await props.retryCallback()
    }
    
    // Reset error state
    hasError.value = false
    errorMessage.value = ''
    errorDetails.value = ''
    
    emit('retry')
  } catch (error) {
    console.error('Retry failed:', error)
    // Keep error state
  } finally {
    isRetrying.value = false
  }
}

const reloadPage = () => {
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}

// Reset error state when component is unmounted
const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  retryCount.value = 0
}

// Expose methods for parent components
defineExpose({
  resetError,
  hasError: computed(() => hasError.value),
  errorMessage: computed(() => errorMessage.value)
})
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
}

/* Animation for retry button */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
