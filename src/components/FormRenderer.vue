<template>
  <div class="form-renderer">
    <!-- Form Container -->
    <div ref="formContainer" class="formio-container"></div>
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div class="flex flex-col items-center px-4">
        <div class="relative">
          <div class="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-4 border-purple-200"></div>
          <div class="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p class="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 font-medium text-center">{{ $t('formRenderer.submitting') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../i18n'

// Props
interface Props {
  formSchema: any
  loading?: boolean
  formData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  formData: () => ({})
})

// Emits
const emit = defineEmits<{
  submit: [data: any]
  error: [error: string]
  'data-change': [data: any]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const formContainer = ref<HTMLElement>()
let formioInstance: any = null

// Methods
const getCurrentFormData = () => {
  console.log('FormRenderer - getCurrentFormData called')
  if (formioInstance && formioInstance.submission) {
    console.log('FormRenderer - Current form data:', formioInstance.submission.data)
    return formioInstance.submission.data || {}
  }
  
  // If no form instance data, try to get from props
  if (props.formData && Object.keys(props.formData).length > 0) {
    console.log('FormRenderer - Returning props.formData:', props.formData)
    return props.formData
  }
  
  console.log('FormRenderer - No form instance or submission data')
  return {}
}

// This will be merged with the other defineExpose below

const loadFormioFromCDN = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).Formio) {
      resolve()
      return
    }

    // Create script element
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@formio/js@latest/dist/formio.full.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Form.io library'))
    
    // Create CSS link element
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/@formio/js@latest/dist/formio.full.min.css'
    
    // Add to document head
    document.head.appendChild(link)
    document.head.appendChild(script)
  })
}

const initializeForm = async () => {
  console.log('FormRenderer - initializeForm called')
  console.log('FormRenderer - formContainer.value:', !!formContainer.value)
  console.log('FormRenderer - props.formSchema:', props.formSchema)
  console.log('FormRenderer - props.formData:', props.formData)
  
  if (!formContainer.value || !props.formSchema) {
    console.log('FormRenderer - Missing container or schema, returning')
    return
  }

  try {
    // Clear previous form
    if (formioInstance) {
      console.log('FormRenderer - Destroying previous form instance')
      formioInstance.destroy()
      formioInstance = null
    }

    // Clear container
    formContainer.value.innerHTML = ''

    // Load Form.io from CDN if not already loaded
    if (!(window as any).Formio) {
      console.log('FormRenderer - Loading Form.io from CDN')
      await loadFormioFromCDN()
    } else {
      console.log('FormRenderer - Form.io already loaded')
    }
    
    const Formio = (window as any).Formio
    
    // Configure Form.io for RTL if needed
    const options = {
      language: isRTLSync() ? 'ar' : 'en',
      i18n: {
        ar: {
          submit: 'إرسال',
          cancel: 'إلغاء',
          previous: 'السابق',
          next: 'التالي',
          required: 'هذا الحقل مطلوب',
          invalid_email: 'البريد الإلكتروني غير صحيح',
          invalid_date: 'التاريخ غير صحيح',
          invalid_day: 'اليوم غير صحيح',
          invalid_month: 'الشهر غير صحيح',
          invalid_year: 'السنة غير صحيحة',
          invalid_maxLength: 'النص طويل جداً',
          invalid_minLength: 'النص قصير جداً',
          invalid_pattern: 'التنسيق غير صحيح'
        }
      },
      hooks: {
        beforeSubmit: (submission: any, next: Function) => {
          // Custom validation or processing before submit
          next()
        }
      }
    }

    // Create form instance
    console.log('FormRenderer - Creating form with schema:', props.formSchema)
    console.log('FormRenderer - Form options:', options)
    
    formioInstance = await Formio.createForm(formContainer.value, props.formSchema, options)
    
    console.log('FormRenderer - Form instance created:', !!formioInstance)
    
    // Set initial form data if provided
    if (props.formData && Object.keys(props.formData).length > 0) {
      console.log('FormRenderer - Setting initial form data:', props.formData)
      formioInstance.submission = { data: props.formData }
    } else {
      console.log('FormRenderer - No initial form data provided')
    }

    // Handle form submission
    formioInstance.on('submit', (submission: any) => {
      emit('submit', submission.data)
    })

    // Handle form errors
    formioInstance.on('error', (error: any) => {
      console.error('Form error:', error)
      emit('error', error.message || t('formRenderer.errors.validationFailed'))
    })

    // Handle form data changes
    formioInstance.on('change', (changed: any) => {
      console.log('FormRenderer - change event triggered')
      console.log('FormRenderer - changed object:', changed)
      if (changed && changed.data) {
        console.log('FormRenderer - emitting data-change with:', changed.data)
        console.log('FormRenderer - data keys:', Object.keys(changed.data))
        emit('data-change', changed.data)
      } else {
        console.log('FormRenderer - no data in change event')
      }
    })

    // Handle form ready
    formioInstance.on('render', () => {
      // Apply RTL styles if needed
      if (isRTLSync()) {
        const formElement = formContainer.value?.querySelector('.formio-form')
        if (formElement) {
          formElement.classList.add('rtl-form')
        }
      }

      // Set initial form data if provided
      if (props.formData && Object.keys(props.formData).length > 0) {
        formioInstance.submission = { data: props.formData }
      }
    })

  } catch (error) {
    console.error('Error initializing form:', error)
    emit('error', t('formRenderer.errors.initializationFailed'))
  }
}

const resetForm = () => {
  if (formioInstance) {
    formioInstance.submission = { data: {} }
  }
}

// Watch for schema changes
watch(() => props.formSchema, () => {
  nextTick(() => {
    initializeForm()
  })
}, { deep: true })

// Watch for form data changes
watch(() => props.formData, (newData) => {
  if (formioInstance && newData) {
    formioInstance.submission = { data: newData }
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  initializeForm()
})

onUnmounted(() => {
  if (formioInstance) {
    formioInstance.destroy()
    formioInstance = null
  }
})

// Expose methods
defineExpose({
  resetForm,
  getCurrentFormData
})
</script>

<style scoped>
.form-renderer {
  position: relative;
  min-height: 200px;
}

.formio-container {
  width: 100%;
}

/* Custom Form.io styles */
:deep(.formio-form) {
  font-family: inherit;
}

:deep(.formio-form .btn-primary) {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.formio-form .btn-primary:hover) {
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.formio-form .btn-secondary) {
  background: #6b7280;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.2s;
}

:deep(.formio-form .btn-secondary:hover) {
  background: #4b5563;
  transform: translateY(-1px);
}

:deep(.formio-form .form-control) {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  transition: all 0.2s;
}

:deep(.formio-form .form-control:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  outline: none;
}

:deep(.formio-form .form-group label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

:deep(.formio-form .has-error .form-control) {
  border-color: #ef4444;
}

:deep(.formio-form .has-error .help-block) {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* RTL Support */
:deep(.rtl-form) {
  direction: rtl;
  text-align: right;
}

:deep(.rtl-form .form-group label) {
  text-align: right;
}

:deep(.rtl-form .btn-group) {
  direction: ltr;
}

:deep(.rtl-form .btn-group .btn:first-child) {
  margin-left: 0.5rem;
  margin-right: 0;
}

/* Loading overlay */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Responsive design */
@media (max-width: 640px) {
  :deep(.formio-form .btn) {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  :deep(.formio-form .btn-group) {
    flex-direction: column;
  }
  
  :deep(.formio-form .btn-group .btn) {
    margin: 0 0 0.5rem 0;
  }
}

/* Print styles */
@media print {
  .form-renderer {
    background: white !important;
  }
  
  :deep(.formio-form .btn) {
    display: none !important;
  }
}
</style>
