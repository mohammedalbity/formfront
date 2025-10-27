<template>
  <div class="textarea-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Label with enhanced styling -->
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
      {{ component.label }}
      <span v-if="component.validate && component.validate.required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Textarea container with enhanced features -->
    <div class="relative">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="component.placeholder || $t('placeholders.enterText')"
        :required="component.validate && component.validate.required"
        :disabled="component.disabled"
        :readonly="component.readonly"
        :rows="component.rows || 4"
        :minlength="component.validate && component.validate.minLength"
        :maxlength="component.validate && component.validate.maxLength"
        class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical transition-all duration-200"
        :class="[
          component.customClass,
          {
            'border-red-300 focus:ring-red-500': hasError,
            'border-green-300 focus:ring-green-500': isValid && modelValue,
            'pr-16': showValidationIcon || showCharCount
          }
        ]"
      ></textarea>
      
      <!-- Validation icon -->
      <div v-if="showValidationIcon" class="absolute top-2 right-2 flex items-center">
        <svg v-if="hasError" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="isValid && modelValue" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <!-- Character count -->
      <div v-if="component.validate && component.validate.maxLength && (showCharCount || isFocused)" class="absolute bottom-2 right-2 text-xs text-gray-500 px-1 rounded">
        {{ modelValue.length }}/{{ component.validate.maxLength }}
      </div>
    </div>
    
    <!-- Description -->
    <p v-if="component.description" class="text-xs text-gray-500 mt-2">
      {{ component.description }}
    </p>
    
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
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()
const { t } = useI18n()

const errorMessage = ref('')
const successMessage = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isFocused = ref(false)
const showCharCount = ref(false)

const modelValue = computed(() => props.formData[props.component.key] || '')
const hasError = computed(() => !!errorMessage.value)

const isValid = computed(() => {
  if (!modelValue.value) return false
  const validation = validateInput(modelValue.value)
  return validation.isValid
})

const showValidationIcon = computed(() => {
  return props.component.showValidationIcon !== false && (hasError.value || (isValid.value && modelValue.value))
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
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
  
  // Check if validate exists
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
  
  return { isValid: true, message: '' }
}

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

// Expose methods for parent component
defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  validate: () => validateInput(modelValue.value),
  clear: () => {
    emit('update:value', props.component.key, '')
    errorMessage.value = ''
    successMessage.value = ''
  }
})
</script>

<style scoped>
.textarea-renderer {
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

.rtl .right-2 {
  right: auto;
  left: 0.5rem;
}

/* Enhanced focus styles */
.textarea-renderer textarea:focus {
  transform: translateY(-1px);
}

/* Smooth transitions */
.textarea-renderer textarea {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success and error message animations */
.textarea-renderer div[class*="text-red-600"],
.textarea-renderer div[class*="text-green-600"] {
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
