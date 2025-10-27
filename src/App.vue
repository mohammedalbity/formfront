<template>
  <ErrorBoundary
    :can-retry="true"
    :retry-callback="handleRetry"
    @error="handleGlobalError"
    @retry="handleRetryAttempt"
  >
    <Layout>
      <RouterView />
    </Layout>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Layout from './components/Layout.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import { getCurrentLanguage } from './i18n'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

// Error handling functions
const handleGlobalError = (error: Error, errorInfo: any) => {
  console.error('Global error caught by ErrorBoundary:', error)
  console.error('Error info:', errorInfo)

  // You can add additional error reporting here
  // For example, send to error tracking service
}

const handleRetryAttempt = () => {
  console.log('User initiated retry from ErrorBoundary')
}

const handleRetry = async () => {
  try {
    // Re-initialize the app
    await initializeApp()
  } catch (error) {
    console.error('Retry failed:', error)
    throw error
  }
}

// Initialize app function
const initializeApp = async () => {
  // Set initial document direction and language
  const currentLang = getCurrentLanguage()
  const direction = currentLang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', direction)
  document.documentElement.setAttribute('lang', currentLang)

  // Initialize Sanctum authentication
  await authStore.initializeAuth()
}

// Initialize app on mount
onMounted(async () => {
  await initializeApp()
})
</script>

<style>
/* Global styles */
html {
  font-family:
    'Inter',
    'Noto Sans Arabic',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

/* RTL support */
[dir='rtl'] {
  direction: rtl;
}

[dir='ltr'] {
  direction: ltr;
}

/* Smooth transitions for direction changes */
* {
  transition:
    margin 0.2s ease,
    padding 0.2s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
