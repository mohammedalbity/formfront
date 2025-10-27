<template>
  <div class="email-renderer" :class="{ 'rtl': isRTL }">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500 mr-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Email input with enhanced styling -->
      <input
        ref="emailRef"
        type="email"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="component.placeholder"
        :required="component.validate?.required"
        :disabled="component.disabled"
        :readonly="component.readonly"
        class="w-full px-3 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
        :class="[
          component.customClass,
          {
            'border-red-300 focus:ring-red-500 bg-red-50/30': hasError,
            'border-green-300 focus:ring-green-500 bg-green-50/30': isValid && !hasError
          }
        ]"
      />
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mt-2 text-xs text-red-600">
      {{ errorMessage }}
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="mt-2 text-xs text-green-600">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()

const { t, locale } = useI18n()
const emailRef = ref<HTMLInputElement>()
const errorMessage = ref('')
const successMessage = ref('')
const isFocused = ref(false)

const modelValue = computed(() => props.formData[props.component.key] || '')
const hasError = computed(() => !!errorMessage.value)
const isRTL = computed(() => locale.value === 'ar')

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Enhanced validation logic
const isValid = computed(() => {
  const value = modelValue.value
  if (!value) return false
  return emailRegex.test(value)
})

const showValidationIcon = computed(() => {
  return (hasError.value || (isValid.value && modelValue.value !== ''))
})

const validateInput = (value: string) => {
  const validation = props.component.validate || {}
  
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Required validation
  if (validation.required && !value) {
    errorMessage.value = t('validation.required')
    return false
  }
  
  // If empty and not required, it's valid
  if (!value && !validation.required) {
    return true
  }
  
  // Email format validation
  if (value && !emailRegex.test(value)) {
    errorMessage.value = t('validation.invalidEmail')
    return false
  }
  
  // If all validations pass
  if (value && emailRegex.test(value)) {
    successMessage.value = 'مدخل صحيح ✓'
  }
  
  return true
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  validateInput(value)
  emit('update:value', props.component.key, value)
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
  validateInput(modelValue.value)
}

// Expose methods for external control
defineExpose({
  focus: () => emailRef.value?.focus(),
  blur: () => emailRef.value?.blur(),
  validate: () => validateInput(modelValue.value),
  clear: () => {
    emit('update:value', props.component.key, '')
    errorMessage.value = ''
    successMessage.value = ''
  }
})
</script>

<style scoped>
.email-renderer {
  width: 100%;
}

.rtl {
  direction: rtl;
}

.rtl .mr-1 {
  margin-right: 0;
  margin-left: 0.25rem;
}

.rtl .mr-0 {
  margin-right: 0;
}

.rtl .ml-1 {
  margin-left: 0;
  margin-right: 0.25rem;
}

.rtl .left-3 {
  left: 0.75rem;
}

.rtl .right-3 {
  right: 0.75rem;
}

.rtl .left-auto {
  left: auto;
}

.rtl .right-auto {
  right: auto;
}

/* Enhanced focus styles */
.email-renderer input:focus {
  transform: translateY(-1px);
}

/* Smooth transitions */
.email-renderer input {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success and error message animations */
.email-renderer div[class*="text-red-600"],
.email-renderer div[class*="text-green-600"] {
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

/* Icon styling */
.email-renderer .absolute svg {
  transition: color 0.2s ease;
}

.email-renderer input:focus + .absolute svg {
  color: rgb(59 130 246);
}
</style>
