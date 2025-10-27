<template>
  <div class="number-renderer" :class="{ 'rtl': isRTL }">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500 mr-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Number input with enhanced styling -->
      <input
        ref="numberRef"
        type="number"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="component.placeholder"
        :required="component.validate?.required"
        :disabled="component.disabled"
        :readonly="component.readonly"
        :min="component.validate?.min"
        :max="component.validate?.max"
        :step="component.validate?.step || 'any'"
        class="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 "
        :class="[
          component.customClass,
          {
            'border-red-300 focus:ring-red-500 bg-red-50/30': hasError,
            'border-green-300 focus:ring-green-500 bg-green-50/30': isValid && !hasError,
            'pr-12': showValidationIcon,
            'pl-12': showValidationIcon && isRTL
          }
        ]"
      />
      
      <!-- Validation icons -->
      <div v-if="showValidationIcon" class="absolute inset-y-0 right-2 flex items-center pointer-events-none" :class="{ 'right-auto left-2': isRTL }">
        <!-- Error icon -->
        <svg v-if="hasError" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <!-- Success icon -->
        <svg v-else-if="isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Description -->
    <p v-if="component.description" class="text-xs text-gray-500 mt-2">
      {{ component.description }}
    </p>

    <!-- Error message -->
    <div v-if="errorMessage" class="flex items-center mt-2 text-xs text-red-600">
      <svg class="w-4 h-4 mr-1" :class="{ 'mr-0 ml-1': isRTL }" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ errorMessage }}
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="flex items-center mt-2 text-xs text-green-600">
      <svg class="w-4 h-4 mr-1" :class="{ 'mr-0 ml-1': isRTL }" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()

const { t, locale } = useI18n()
const numberRef = ref<HTMLInputElement>()
const errorMessage = ref('')
const successMessage = ref('')
const isFocused = ref(false)

const modelValue = computed(() => props.formData[props.component.key] || '')
const hasError = computed(() => !!errorMessage.value)
const isRTL = computed(() => locale.value === 'ar')

// Enhanced validation logic
const isValid = computed(() => {
  const value = modelValue.value
  if (!value && value !== 0) return false
  
  const numValue = Number(value)
  if (isNaN(numValue)) return false
  
  const validation = props.component.validate || {}
  
  // Check min/max constraints
  if (validation.min !== undefined && numValue < validation.min) return false
  if (validation.max !== undefined && numValue > validation.max) return false
  
  return true
})

const showValidationIcon = computed(() => {
  return (hasError.value || (isValid.value && modelValue.value !== '' && modelValue.value !== null))
})

const validateInput = (value: any) => {
  const validation = props.component.validate || {}
  
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Required validation
  if (validation.required && (!value && value !== 0)) {
    errorMessage.value = t('validation.required')
    return false
  }
  
  // If empty and not required, it's valid
  if (!value && value !== 0 && !validation.required) {
    return true
  }
  
  const numValue = Number(value)
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    errorMessage.value = t('validation.invalidNumber')
    return false
  }
  
  // Min value validation
  if (validation.min !== undefined && numValue < validation.min) {
    errorMessage.value = t('validation.minValue', { min: validation.min })
    return false
  }
  
  // Max value validation
  if (validation.max !== undefined && numValue > validation.max) {
    errorMessage.value = t('validation.maxValue', { max: validation.max })
    return false
  }
  
  // If all validations pass
  if (value || value === 0) {
    successMessage.value = 'مدخل صحيح ✓'
  }
  
  return true
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value ? Number(target.value) : ''
  
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
  focus: () => numberRef.value?.focus(),
  blur: () => numberRef.value?.blur(),
  validate: () => validateInput(modelValue.value),
  clear: () => {
    emit('update:value', props.component.key, '')
    errorMessage.value = ''
    successMessage.value = ''
  }
})
</script>

<style scoped>
.number-renderer {
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

.rtl .right-2 {
  right: auto;
  left: 0.5rem;
}

.rtl .right-auto {
  right: auto;
}

.rtl .left-2 {
  left: 0.5rem;
}

/* Enhanced focus styles */
.number-renderer input:focus {
  transform: translateY(-1px);
}

/* Smooth transitions */
.number-renderer input {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success and error message animations */
.number-renderer div[class*="text-red-600"],
.number-renderer div[class*="text-green-600"] {
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

/* Remove number input arrows in webkit browsers */
.number-renderer input[type="number"]::-webkit-outer-spin-button,
.number-renderer input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove number input arrows in Firefox */
.number-renderer input[type="number"] {
  -moz-appearance: textfield;
}
</style>
