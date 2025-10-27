<template>
  <div class="text-field-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Label with enhanced styling -->
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Input container with enhanced features -->
    <div class="relative">
      <input
        ref="inputRef"
        :type="getInputType()"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="component.placeholder || getDefaultPlaceholder()"
        :required="component.validate?.required"
        :disabled="component.disabled"
        :readonly="component.readonly"
        :minlength="component.validate?.minLength"
        :maxlength="component.validate?.maxLength"
        :pattern="component.validate?.pattern"
        :autocomplete="component.autocomplete"
        class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
        :class="[
          component.customClass,
          {
            'border-red-300 focus:ring-red-500': hasError,
            'border-green-300 focus:ring-green-500': isValid && modelValue,
            'pr-10': showValidationIcon
          }
        ]"
      />
      
      <!-- Validation icon -->
      <div v-if="showValidationIcon" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <svg v-if="hasError" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="isValid && modelValue" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <!-- Character count -->
      <div v-if="component.validate?.maxLength && showCharCount" class="absolute -bottom-5 right-0 text-xs text-gray-500">
        {{ modelValue.length }}/{{ component.validate.maxLength }}
      </div>
    </div>
    
    <!-- Error message with enhanced styling -->
    <div v-if="errorMessage" class="mt-2 flex items-center text-xs text-red-600">
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ errorMessage }}
    </div>
    
    <!-- Success message -->
    <div v-if="successMessage" class="mt-2 flex items-center text-xs text-green-600">
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'

// Props
interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:value': [key: string, value: any]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const errorMessage = ref('')
const successMessage = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const showCharCount = ref(false)

// Computed
const modelValue = computed(() => {
  return props.formData[props.component.key] || ''
})

const hasError = computed(() => !!errorMessage.value)

const isValid = computed(() => {
  if (!modelValue.value) return false
  const validation = validateInput(modelValue.value)
  return validation.isValid
})

const showValidationIcon = computed(() => {
  return props.component.showValidationIcon !== false && (hasError.value || (isValid.value && modelValue.value))
})

const hasPrefix = computed(() => {
  return ['email', 'password', 'tel', 'url'].includes(props.component.type)
})

// Methods
const getInputType = () => {
  switch (props.component.type) {
    case 'email':
      return 'email'
    case 'password':
      return 'password'
    case 'number':
      return 'number'
    case 'tel':
      return 'tel'
    case 'url':
      return 'url'
    default:
      return 'text'
  }
}

const getFieldIcon = () => {
  switch (props.component.type) {
    case 'email':
      return 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
    case 'password':
      return 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    case 'tel':
      return 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
    case 'url':
      return 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    default:
      return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  }
}

const getPrefixIcon = () => {
  return getFieldIcon()
}

const getDefaultPlaceholder = () => {
  switch (props.component.type) {
    case 'email':
      return t('placeholders.enterEmail')
    case 'password':
      return t('placeholders.enterPassword')
    case 'tel':
      return t('placeholders.enterPhone')
    case 'url':
      return t('placeholders.enterUrl')
    default:
      return t('placeholders.enterText')
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validate input
  if (props.component.validate) {
    const validation = validateInput(value)
    if (!validation.isValid) {
      errorMessage.value = validation.message
    } else if (value && props.component.showSuccessMessage !== false) {
      successMessage.value = 'مدخل صحيح ✓'
    }
  }
  
  // Emit value change
  emit('update:value', props.component.key, value)
}

const handleFocus = () => {
  isFocused.value = true
  showCharCount.value = true
}

const handleBlur = () => {
  isFocused.value = false
  showCharCount.value = false
  
  // Final validation on blur
  if (modelValue.value && props.component.validate) {
    const validation = validateInput(modelValue.value)
    if (validation.isValid && props.component.showSuccessMessage !== false) {
      successMessage.value = 'مدخل صحيح ✓'
      // Clear success message after 2 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 2000)
    }
  }
}

const validateInput = (value: string) => {
  const validate = props.component.validate
  
  // If no validation rules are defined, consider it valid
  if (!validate) {
    return { isValid: true, message: '' }
  }
  
  // Required validation
  if (validate.required && !value.trim()) {
    return {
      isValid: false,
      message: t('validation.required', { field: props.component.label || props.component.key })
    }
  }
  
  // Min length validation
  if (validate.minLength && value.length < validate.minLength) {
    return {
      isValid: false,
      message: t('validation.minLength', { field: props.component.label || props.component.key, min: validate.minLength })
    }
  }
  
  // Max length validation
  if (validate.maxLength && value.length > validate.maxLength) {
    return {
      isValid: false,
      message: t('validation.maxLength', { field: props.component.label || props.component.key, max: validate.maxLength })
    }
  }
  
  // Pattern validation
  if (validate.pattern && value && !new RegExp(validate.pattern).test(value)) {
    return {
      isValid: false,
      message: t('validation.pattern', { field: props.component.label || props.component.key })
    }
  }
  
  // Email validation for email type
  if (props.component.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return {
        isValid: false,
        message: t('validation.email', { field: props.component.label || props.component.key })
      }
    }
  }
  
  return { isValid: true, message: '' }
}

// Expose methods for parent component
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  validate: () => validateInput(modelValue.value),
  clear: () => {
    emit('update:value', props.component.key, '')
    errorMessage.value = ''
    successMessage.value = ''
  }
})

// Watch for external form data changes
watch(
  () => props.formData[props.component.key],
  (newValue) => {
    if (newValue !== undefined && props.component.validate) {
      const validation = validateInput(newValue)
      errorMessage.value = validation.isValid ? '' : validation.message
    }
  }
)
</script>

<style scoped>
.text-field-renderer {
  width: 100%;
}

.rtl {
  direction: rtl;
}

.rtl .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

.rtl .ml-1 {
  margin-left: 0;
  margin-right: 0.25rem;
}

.rtl .mr-1 {
  margin-right: 0;
  margin-left: 0.25rem;
}

.rtl .pl-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.rtl .pr-3 {
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

.rtl .pl-10 {
  padding-left: 2.5rem;
  padding-right: 1rem;
}

.rtl .pr-10 {
  padding-right: 2.5rem;
  padding-left: 1rem;
}

.rtl .left-0 {
  left: auto;
  right: 0;
}

.rtl .right-0 {
  right: auto;
  left: 0;
}

/* Enhanced focus styles */
.text-field-renderer input:focus {
  transform: translateY(-1px);
}

/* Smooth transitions */
.text-field-renderer input {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Character count positioning */
.text-field-renderer .relative {
  position: relative;
}

/* Success and error message animations */
.text-field-renderer div[class*="text-red-600"],
.text-field-renderer div[class*="text-green-600"] {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
