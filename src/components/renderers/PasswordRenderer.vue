<template>
  <div class="password-renderer" :class="{ 'rtl': isRTL }">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500 mr-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Password icon prefix -->
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none" :class="{ 'left-auto right-3': isRTL }">
        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Password input with enhanced styling -->
      <input
        ref="passwordRef"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="component.placeholder"
        :required="component.validate?.required"
        :disabled="component.disabled"
        :readonly="component.readonly"
        class="w-full pl-10 pr-20 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 "
        :class="[
          component.customClass,
          {
            'border-red-300 focus:ring-red-500 bg-red-50/30': hasError,
            'border-green-300 focus:ring-green-500 bg-green-50/30': isValid && !hasError,
            'pl-20 pr-10': isRTL
          }
        ]"
      />
      
      <!-- Show/Hide password toggle and validation icons -->
      <div class="absolute inset-y-0 right-3 flex items-center space-x-1" :class="{ 'right-auto left-3 space-x-reverse': isRTL }">
        <!-- Toggle password visibility -->
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
          :disabled="component.disabled"
        >
          <svg v-if="showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- Validation icon -->
        <div v-if="showValidationIcon" class="pointer-events-none">
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
    </div>

    <!-- Password strength indicator -->
    <div v-if="modelValue && !hasError" class="mt-2">
      <div class="flex items-center justify-between text-xs mb-1">
        <span class="text-gray-600">{{ t('validation.passwordStrength') }}</span>
        <span :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="passwordStrengthBarColor"
          :style="{ width: passwordStrengthPercentage + '%' }"
        ></div>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()

const { t, locale } = useI18n()
const passwordRef = ref<HTMLInputElement>()
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const isFocused = ref(false)

const modelValue = computed(() => props.formData[props.component.key] || '')
const hasError = computed(() => !!errorMessage.value)
const isRTL = computed(() => locale.value === 'ar')

// Password strength calculation
const passwordStrength = computed(() => {
  const password = modelValue.value
  if (!password) return 0
  
  let score = 0
  
  // Length check
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 25
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[^A-Za-z0-9]/.test(password)) score += 20
  
  return Math.min(score, 100)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return t('validation.passwordWeak')
  if (strength < 60) return t('validation.passwordFair')
  if (strength < 80) return t('validation.passwordGood')
  return t('validation.passwordStrong')
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'text-red-600'
  if (strength < 60) return 'text-orange-600'
  if (strength < 80) return 'text-yellow-600'
  return 'text-green-600'
})

const passwordStrengthBarColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'bg-red-500'
  if (strength < 60) return 'bg-orange-500'
  if (strength < 80) return 'bg-yellow-500'
  return 'bg-green-500'
})

const passwordStrengthPercentage = computed(() => passwordStrength.value)

// Enhanced validation logic
const isValid = computed(() => {
  const value = modelValue.value
  if (!value) return false
  
  const validation = props.component.validate || {}
  
  // Check minimum length
  if (validation.minLength && value.length < validation.minLength) return false
  
  // Check maximum length
  if (validation.maxLength && value.length > validation.maxLength) return false
  
  // Check pattern if provided
  if (validation.pattern) {
    const regex = new RegExp(validation.pattern)
    if (!regex.test(value)) return false
  }
  
  return true
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
  
  // Minimum length validation
  if (validation.minLength && value.length < validation.minLength) {
    errorMessage.value = t('validation.minLength', { min: validation.minLength })
    return false
  }
  
  // Maximum length validation
  if (validation.maxLength && value.length > validation.maxLength) {
    errorMessage.value = t('validation.maxLength', { max: validation.maxLength })
    return false
  }
  
  // Pattern validation
  if (validation.pattern) {
    const regex = new RegExp(validation.pattern)
    if (!regex.test(value)) {
      errorMessage.value = t('validation.invalidPattern')
      return false
    }
  }
  
  // If all validations pass
  if (value) {
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

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Expose methods for external control
defineExpose({
  focus: () => passwordRef.value?.focus(),
  blur: () => passwordRef.value?.blur(),
  validate: () => validateInput(modelValue.value),
  clear: () => {
    emit('update:value', props.component.key, '')
    errorMessage.value = ''
    successMessage.value = ''
  },
  toggleVisibility: () => togglePasswordVisibility()
})
</script>

<style scoped>
.password-renderer {
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

.rtl .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Enhanced focus styles */
.password-renderer input:focus {
  transform: translateY(-1px);
}

/* Smooth transitions */
.password-renderer input {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success and error message animations */
.password-renderer div[class*="text-red-600"],
.password-renderer div[class*="text-green-600"] {
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
.password-renderer .absolute svg {
  transition: color 0.2s ease;
}

.password-renderer input:focus + .absolute svg {
  color: rgb(59 130 246);
}

/* Password toggle button styling */
.password-renderer button:hover svg {
  transform: scale(1.1);
}

.password-renderer button svg {
  transition: all 0.2s ease;
}

/* Password strength bar animation */
.password-renderer .h-2 {
  transition: width 0.3s ease-in-out;
}
</style>
