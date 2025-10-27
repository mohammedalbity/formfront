<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo and Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 tracking-tight">
          {{ isLogin ? $t('auth.signIn') : $t('auth.signUp') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          {{ isLogin ? $t('auth.signInSubtitle') : $t('auth.signUpSubtitle') }}
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 space-y-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name field (only for registration) -->
          <div v-if="!isLogin" class="space-y-2">
            <label for="name" class="block text-sm font-medium text-gray-700">{{ $t('auth.name') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="name"
                v-model="form.name"
                name="name"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                :class="{ 'border-red-300 focus:ring-red-500': errors.name }"
                :placeholder="$t('auth.name')"
              />
            </div>
            <p v-if="errors.name" class="text-sm text-red-600 flex items-center">
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.name[0] }}
            </p>
          </div>

          <!-- Email field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700">{{ $t('auth.email') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                :class="{ 'border-red-300 focus:ring-red-500': errors.email }"
                :placeholder="$t('auth.email')"
              />
            </div>
            <p v-if="errors.email" class="text-sm text-red-600 flex items-center">
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.email[0] }}
            </p>
          </div>

          <!-- Password field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">{{ $t('auth.password') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                :class="{ 'border-red-300 focus:ring-red-500': errors.password }"
                :placeholder="$t('auth.password')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-sm text-red-600 flex items-center">
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.password[0] }}
            </p>
          </div>

          <!-- Confirm Password field (only for registration) -->
          <div v-if="!isLogin" class="space-y-2">
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">{{ $t('auth.confirmPassword') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                name="password_confirmation"
                type="password"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                :class="{ 'border-red-300 focus:ring-red-500': errors.password_confirmation }"
                :placeholder="$t('auth.confirmPassword')"
              />
            </div>
            <p v-if="errors.password_confirmation" class="text-sm text-red-600 flex items-center">
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.password_confirmation[0] }}
            </p>
          </div>

          <!-- Language selection (only for registration) -->
          <div v-if="!isLogin" class="space-y-2">
            <CustomSelect
              v-model="form.language"
              :label="t('auth.language')"
              :options="languageOptions"
            />
          </div>

          <!-- Error message -->
          <div v-if="hasError" class="rounded-xl bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
                
                <!-- Network Error Indicator -->
                <div v-if="isNetworkError" class="mt-2 flex items-center text-xs text-red-600">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ $t('errors.networkError') }}
                </div>
                
                <!-- Retry Button -->
                <button 
                  v-if="canRetry" 
                  @click="handleRetry"
                  :disabled="isLoading"
                  class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ $t('common.retry') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="space-y-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg v-if="isLoading" class="animate-spin h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-blue-200 group-hover:text-blue-100 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              {{ isLoading ? $t('auth.loading') : (isLogin ? $t('auth.signIn') : $t('auth.signUp')) }}
            </button>

            <!-- Toggle Mode Button -->
            <div class="text-center">
              <button
                type="button"
                @click="toggleMode"
                class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                {{ isLogin ? $t('auth.needAccount') : $t('auth.haveAccount') }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center text-xs text-gray-500 space-y-2">
        <p>{{ $t('auth.secureLogin') }}</p>
        <div class="flex justify-center space-x-4">
          <span class="inline-flex items-center">
            <svg class="h-3 w-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ $t('auth.encrypted') }}
          </span>
          <span class="inline-flex items-center">
            <svg class="h-3 w-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
            </svg>
            {{ $t('auth.privacy') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import CustomSelect from '@/components/CustomSelect.vue'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// Use enhanced auth composable
const {
  login,
  register,
  isLoading,
  hasError,
  errorMessage,
  canRetry,
  isNetworkError,
  clearError,
  retryLastOperation
} = useAuth()

const isLogin = ref(true)
const showPassword = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  language: 'en'
})

// Language options for CustomSelect
const languageOptions = computed(() => [
  { value: 'en', label: `🇺🇸 ${t('nav.switchToEnglish')}` },
  { value: 'ar', label: '🇸🇦 العربية' }
])

const toggleMode = () => {
  isLogin.value = !isLogin.value
  clearError()
  errors.value = {}
  // Reset form
  Object.assign(form, {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    language: 'en'
  })
}

const handleSubmit = async () => {
  clearError()
  errors.value = {}

  try {
    let result
    
    if (isLogin.value) {
      result = await login({
        email: form.email,
        password: form.password
      })
    } else {
      result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        language: form.language as 'en' | 'ar'
      })
    }

    if (result && !result.success) {
      if (result.errors) {
        errors.value = result.errors
      }
    }
  } catch (err) {
    console.error('Login/Register error:', err)
  }
}

// Retry last operation
const handleRetry = async () => {
  await retryLastOperation(handleSubmit)
}
</script>

<style scoped>
/* Custom animations */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Enhanced focus states */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Smooth transitions for form elements */
input, select, button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hover effects for interactive elements */
.hover-lift {
  transition: transform 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* RTL support for Arabic */
[dir="rtl"] .form-input {
  text-align: right;
}

[dir="rtl"] .icon-left {
  left: auto;
  right: 0.75rem;
}

[dir="rtl"] .icon-right {
  right: auto;
  left: 0.75rem;
}

/* Loading animation enhancement */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

.loading-button {
  animation: pulse-glow 2s infinite;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
