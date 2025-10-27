<template>
  <div class="formio-renderer relative">
    <!-- Professional Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-16">
      <div class="relative">
        <!-- Animated Loader -->
        <div
          class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        ></div>
        <div
          class="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin animate-reverse"
        ></div>
      </div>
      <div class="mt-6 text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('form.loading') }}</h3>
        <p class="text-sm text-gray-500">
          {{ isRTLSync() ? 'جاري تحضير النموذج...' : 'Preparing your form...' }}
        </p>
      </div>
      <!-- Loading Progress Bar -->
      <div class="w-64 bg-gray-200 rounded-full h-2 mt-4">
        <div
          class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse"
          style="width: 70%"
        ></div>
      </div>
    </div>

    <!-- Professional Error State -->
    <div
      v-if="error"
      class="relative overflow-hidden bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-6 mb-6 shadow-lg"
    >
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2523ef4444%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
      ></div>

      <div class="relative flex items-start">
        <div class="flex-shrink-0">
          <div
            class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <svg class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-bold text-red-900 mb-2">{{ $t('form.error') }}</h3>
          <p class="text-red-700 leading-relaxed">{{ error }}</p>
          <button
            @click="createForm"
            class="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ $t('common.retry') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Form Container with Professional Styling -->
    <div
      ref="formContainer"
      class="formio-form-container relative"
      :class="{ 'arabic-text': isRTLDirection }"
    >
      <!-- Form will be injected here -->
    </div>

    <!-- Professional Success State -->
    <div
      v-if="showSuccess"
      class="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-6 mt-6 shadow-lg animate-slide-in-up"
    >
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%252310b981%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
      ></div>

      <div class="relative flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow"
          >
            <svg class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-bold text-green-900 mb-1">{{ $t('form.success') }}</h3>
          <p class="text-green-700">
            {{ isRTLSync() ? 'تم إرسال النموذج بنجاح!' : 'Form submitted successfully!' }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <button
            @click="showSuccess = false"
            class="text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form } from '@formio/js'
import { isRTLSync } from '../i18n'

// Props
interface Props {
  formUrl?: string
  formJson?: object
  language?: string
  options?: object
}

const props = withDefaults(defineProps<Props>(), {
  formUrl: '',
  formJson: undefined,
  language: 'ar',
  options: () => ({}),
})

// Emits
const emit = defineEmits<{
  submit: [submission: any]
  change: [changed: any]
  error: [error: any]
  ready: [form: any]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const formContainer = ref<HTMLElement>()
const loading = ref(false)
const error = ref<string>('')
const showSuccess = ref(false)
let formInstance: any = null

// Computed
const isRTLDirection = computed(() => {
  return props.language === 'ar' || isRTLSync()
})

// Methods
const createForm = async () => {
  if (!formContainer.value) return

  loading.value = true
  error.value = ''

  try {
    // Clear previous form
    if (formInstance) {
      formInstance.destroy()
      formInstance = null
    }

    // Clear container
    formContainer.value.innerHTML = ''

    // Default options with i18n support
    const defaultOptions = {
      language: props.language,
      i18n: {
        ar: {
          submit: t('form.submit'),
          cancel: t('form.cancel'),
          reset: t('form.reset'),
          save: t('form.save'),
        },
        en: {
          submit: t('form.submit'),
          cancel: t('form.cancel'),
          reset: t('form.reset'),
          save: t('form.save'),
        },
      },
      template: 'bootstrap',
      iconset: 'fontawesome',
      ...props.options,
    }

    // Create form from URL or JSON
    if (props.formUrl) {
      formInstance = new Form(formContainer.value, props.formUrl, defaultOptions)
      await formInstance.ready
    } else if (props.formJson) {
      formInstance = new Form(formContainer.value, props.formJson, defaultOptions)
      await formInstance.ready
    } else {
      throw new Error('Either formUrl or formJson must be provided')
    }

    // Set up event listeners
    formInstance.on('submit', (submission: any) => {
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
      emit('submit', submission)
    })

    formInstance.on('change', (changed: any) => {
      emit('change', changed)
    })

    formInstance.on('error', (err: any) => {
      error.value = err.message || 'An error occurred'
      emit('error', err)
    })

    formInstance.on('ready', () => {
      emit('ready', formInstance)
    })

    loading.value = false
  } catch (err: any) {
    loading.value = false
    error.value = err.message || 'Failed to load form'
    emit('error', err)
  }
}

const destroyForm = () => {
  if (formInstance) {
    formInstance.destroy()
    formInstance = null
  }
}

// Watchers
watch(
  [() => props.formUrl, () => props.formJson, () => props.language],
  () => {
    createForm()
  },
  { immediate: false },
)

// Lifecycle
onMounted(() => {
  createForm()
})

onUnmounted(() => {
  destroyForm()
})

// Expose methods for parent components
defineExpose({
  getForm: () => formInstance,
  refresh: createForm,
  destroy: destroyForm,
})
</script>

<style scoped>
/* Professional FormioRenderer Styling */
.formio-renderer {
  width: 100%;
  min-height: 200px;
}

/* Professional Loading Animation */
@keyframes animate-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-reverse {
  animation: animate-reverse 1s linear infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slide-in-up 0.5s ease-out;
}

/* RTL Support */
.arabic-text :deep(.form-group) {
  text-align: right;
  direction: rtl;
}

.arabic-text :deep(.form-control) {
  text-align: right;
  direction: rtl;
}

.arabic-text :deep(label) {
  text-align: right;
  direction: rtl;
  font-family: 'Noto Sans Arabic', 'Cairo', Arial, sans-serif;
}

/* Professional Form Container */
.formio-form-container {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  /* box-shadow:
    0 20px 40px -12px rgba(139, 92, 246, 0.15),
    0 8px 16px -4px rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(196, 181, 253, 0.4);*/
  position: relative;
  overflow: hidden;
}

.formio-form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4);
  background-size: 400% 100%;
  animation: gradient-shift 4s ease infinite;
  border-radius: 24px 24px 0 0;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Enhanced Form Styling */
:deep(.formio-form) {
  font-family: inherit;
}

/* Professional Button Styling */
:deep(.btn-primary) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px 0 rgba(139, 92, 246, 0.4);
  position: relative;
  overflow: hidden;
  text-transform: none;
  letter-spacing: 0.025em;
}

:deep(.btn-primary:hover) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px 0 rgba(139, 92, 246, 0.5);
}

:deep(.btn-primary:active) {
  transform: translateY(0);
}

:deep(.btn-secondary) {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px 0 rgba(107, 114, 128, 0.3);
}

:deep(.btn-secondary:hover) {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(107, 114, 128, 0.4);
}

/* Professional Input Styling */
:deep(.form-control) {
  border: 2px solid #cbd5e1;
  border-radius: 16px;
  padding: 14px 18px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

:deep(.form-control:focus) {
  outline: none;
  border-color: #8b5cf6;
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.15),
    0 8px 25px 0 rgba(139, 92, 246, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #faf5ff 100%);
  transform: translateY(-2px);
}

:deep(.form-control:hover) {
  border-color: #9ca3af;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

/* Professional Label Styling */
:deep(.form-group label) {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  position: relative;
  letter-spacing: 0.025em;
}

:deep(.form-group label.field-required::after) {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
  font-weight: bold;
}

/* Help Text Styling */
:deep(.help-block) {
  font-size: 13px;
  color: #6b7280;
  margin-top: 6px;
  line-height: 1.4;
}

/* Error State Styling */
:deep(.has-error .form-control) {
  border-color: #ef4444;
  background: #fef2f2;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

:deep(.has-error .help-block) {
  color: #dc2626;
  font-weight: 500;
}

:deep(.has-error label) {
  color: #dc2626;
}

/* Success State Styling */
:deep(.has-success .form-control) {
  border-color: #10b981;
  background: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Select Styling */
:deep(select.form-control) {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  padding-right: 40px;
  appearance: none;
}

/* Checkbox and Radio Styling */
:deep(.form-check-input) {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  transition: all 0.2s ease;
}

:deep(.form-check-input:checked) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Textarea Styling */
:deep(textarea.form-control) {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

/* Form Group Spacing */
:deep(.form-group) {
  margin-bottom: 24px;
}

/* Responsive Design */
@media (max-width: 640px) {
  .formio-form-container {
    padding: 20px;
    border-radius: 16px;
  }

  :deep(.btn-primary),
  :deep(.btn-secondary) {
    width: 100%;
    padding: 14px 24px;
  }

  :deep(.form-control) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Dark Mode Support */
/*@media (prefers-color-scheme: dark) {
  .formio-form-container {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border-color: rgba(75, 85, 99, 0.3);
  }

  :deep(.form-control) {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  :deep(.form-group label) {
    color: #f3f4f6;
  }

  :deep(.help-block) {
    color: #9ca3af;
  }
}*/

/* Loading State */
.formio-renderer.loading {
  pointer-events: none;
  opacity: 0.7;
}

/* Accessibility Improvements */
:deep(.form-control:focus-visible) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

:deep(.btn:focus-visible) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Animation for form appearance */
.formio-form-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
