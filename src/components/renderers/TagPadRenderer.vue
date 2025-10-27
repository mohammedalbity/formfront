<template>
  <div class="tagpad-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- TagPad Title -->
    <div v-if="component.label" class="tagpad-title mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
        </svg>
        {{ component.label }}
        <span v-if="component.validate?.required" class="text-red-500 ml-1">*</span>
      </label>
      <p v-if="component.description" class="text-gray-600 text-sm mb-3">
        {{ component.description }}
      </p>
    </div>

    <!-- Tag Input Container -->
    <div class="tagpad-container">
      <!-- Tags Display -->
      <div class="tags-display bg-transparent border border-gray-300 rounded-lg p-3 min-h-[120px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
        <!-- Existing Tags -->
        <div v-if="tags.length > 0" class="tags-list flex flex-wrap gap-2 mb-3">
          <div
            v-for="(tag, index) in tags"
            :key="index"
            class="tag-item inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full group hover:bg-indigo-200 transition-colors"
          >
            <span class="tag-text">{{ tag }}</span>
            <button
              type="button"
              @click="removeTag(index)"
              class="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
              :aria-label="$t('tagpad.removeTag', { tag })"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tag Input -->
        <div class="tag-input-container">
          <input
            ref="tagInput"
            v-model="currentTag"
            type="text"
            :placeholder="tags.length === 0 ? (component.placeholder || $t('tagpad.placeholder')) : $t('tagpad.addMore')"
            class="w-full border-none outline-none bg-transparent text-sm placeholder-gray-400"
            @keydown="handleKeyDown"
            @blur="addCurrentTag"
            @paste="handlePaste"
          />
        </div>
      </div>

      <!-- Tag Suggestions -->
      <div v-if="showSuggestions && filteredSuggestions.length > 0" class="suggestions-dropdown mt-1 bg-transparent border border-gray-300 rounded-lg max-h-48 overflow-y-auto z-10">
        <button
          type="button"
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          @click="addTag(suggestion)"
          class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 focus:outline-none focus:bg-indigo-50 focus:text-indigo-800"
        >
          {{ suggestion }}
        </button>
      </div>

      <!-- Tag Controls -->
      <div class="tag-controls mt-3 flex items-center justify-between text-sm text-gray-600">
        <div class="tag-info flex items-center space-x-4">
          <span>{{ $t('tagpad.tagCount', { count: tags.length }) }}</span>
          <span v-if="component.maxTags" class="text-xs">
            {{ $t('tagpad.maxTags', { max: component.maxTags }) }}
          </span>
        </div>
        
        <div class="tag-actions flex items-center space-x-2">
          <button
            type="button"
            v-if="tags.length > 0"
            @click="clearAllTags"
            class="text-red-600 hover:text-red-800 text-xs font-medium focus:outline-none"
          >
            {{ $t('tagpad.clearAll') }}
          </button>
        </div>
      </div>

      <!-- Predefined Tags -->
      <div v-if="predefinedTags.length > 0" class="predefined-tags mt-4">
        <div class="text-sm font-medium text-gray-700 mb-2">{{ $t('tagpad.suggestions') }}:</div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            v-for="(predefinedTag, index) in predefinedTags"
            :key="index"
            @click="addTag(predefinedTag)"
            :disabled="tags.includes(predefinedTag)"
            class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ predefinedTag }}
          </button>
        </div>
      </div>
    </div>

    <!-- Validation Error -->
    <div v-if="validationError" class="mt-2 text-red-600 text-sm">
      {{ validationError }}
    </div>

    <!-- Help Text -->
    <div v-if="component.tooltip" class="mt-2 text-gray-500 text-xs">
      {{ component.tooltip }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'

// Props
interface Props {
  component: any
  formData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:value': [key: string, value: any]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const tags = ref<string[]>([])
const currentTag = ref<string>('')
const tagInput = ref<HTMLInputElement | null>(null)
const showSuggestions = ref<boolean>(false)
const validationError = ref<string>('')

// Computed
const componentKey = computed(() => {
  return props.component.key || 'tagpad'
})

const predefinedTags = computed(() => {
  return props.component.data?.values || []
})

const maxTags = computed(() => {
  return props.component.maxTags || null
})

const allowDuplicates = computed(() => {
  return props.component.allowDuplicates || false
})

const caseSensitive = computed(() => {
  return props.component.caseSensitive || false
})

const filteredSuggestions = computed(() => {
  if (!currentTag.value.trim()) return []
  
  const query = caseSensitive.value ? currentTag.value : currentTag.value.toLowerCase()
  
  return predefinedTags.value.filter((suggestion: string) => {
    const suggestionText = caseSensitive.value ? suggestion : suggestion.toLowerCase()
    const isMatch = suggestionText.includes(query)
    const isNotAlreadySelected = allowDuplicates.value || !tags.value.includes(suggestion)
    return isMatch && isNotAlreadySelected
  })
})

// Methods
const addTag = (tagText: string) => {
  const trimmedTag = tagText.trim()
  if (!trimmedTag) return

  // Check for duplicates
  if (!allowDuplicates.value && tags.value.includes(trimmedTag)) {
    return
  }

  // Check max tags limit
  if (maxTags.value && tags.value.length >= maxTags.value) {
    return
  }

  tags.value.push(trimmedTag)
  currentTag.value = ''
  showSuggestions.value = false
  updateFormData()
  clearValidationError()
  
  // Focus back to input
  nextTick(() => {
    tagInput.value?.focus()
  })
}

const addCurrentTag = () => {
  if (currentTag.value.trim()) {
    addTag(currentTag.value)
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
  updateFormData()
}

const clearAllTags = () => {
  tags.value = []
  currentTag.value = ''
  updateFormData()
}

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case 'Tab':
    case ',':
      event.preventDefault()
      addCurrentTag()
      break
    case 'Backspace':
      if (!currentTag.value && tags.value.length > 0) {
        removeTag(tags.value.length - 1)
      }
      break
    case 'Escape':
      showSuggestions.value = false
      break
    case 'ArrowDown':
      if (showSuggestions.value && filteredSuggestions.value.length > 0) {
        event.preventDefault()
        // Focus first suggestion (could be enhanced with keyboard navigation)
      }
      break
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') || ''
  
  // Split by common delimiters
  const newTags = pastedText
    .split(/[,;\n\t]/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
  
  newTags.forEach(tag => addTag(tag))
}

const updateFormData = () => {
  emit('update:value', componentKey.value, [...tags.value])
}

const validate = (): boolean => {
  // Required validation
  if (props.component.validate?.required && tags.value.length === 0) {
    validationError.value = t('validation.required')
    return false
  }

  // Min tags validation
  if (props.component.minTags && tags.value.length < props.component.minTags) {
    validationError.value = t('tagpad.validation.minTags', { min: props.component.minTags })
    return false
  }

  // Max tags validation
  if (maxTags.value && tags.value.length > maxTags.value) {
    validationError.value = t('tagpad.validation.maxTags', { max: maxTags.value })
    return false
  }

  return true
}

const clearValidationError = () => {
  validationError.value = ''
}

// Watch for input changes to show/hide suggestions
watch(currentTag, (newValue) => {
  showSuggestions.value = newValue.trim().length > 0 && predefinedTags.value.length > 0
})

// Watch for external form data changes
watch(
  () => props.formData?.[componentKey.value],
  (newValue) => {
    if (Array.isArray(newValue)) {
      tags.value = [...newValue]
    } else if (newValue === null || newValue === undefined) {
      tags.value = []
    }
  },
  { immediate: true }
)

// Lifecycle
onMounted(() => {
  // Initialize tags from form data
  const formValue = props.formData?.[componentKey.value]
  if (Array.isArray(formValue)) {
    tags.value = [...formValue]
  }
})

// Expose methods for parent component
defineExpose({
  validate,
  focus: () => tagInput.value?.focus(),
  addTag,
  clearTags: clearAllTags,
  getFormData: () => ({
    [componentKey.value]: [...tags.value]
  })
})
</script>

<style scoped>
.tagpad-renderer {
  width: 100%;
}

.tagpad-container {
  position: relative;
}

.tags-display {
  transition: border-color 0.2s ease;
}

.tags-display:hover {
  border-color: #9ca3af;
}

.tag-item {
  transition: all 0.2s ease;
  max-width: 200px;
}

.tag-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
}

.rtl {
  direction: rtl;
}

.rtl .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

.rtl .mr-1 {
  margin-right: 0;
  margin-left: 0.25rem;
}

.rtl .ml-1 {
  margin-left: 0;
  margin-right: 0.25rem;
}

.rtl .ml-2 {
  margin-left: 0;
  margin-right: 0.5rem;
}

.rtl .space-x-2 > * + * {
  margin-left: 0;
  margin-right: 0.5rem;
}

.rtl .space-x-4 > * + * {
  margin-left: 0;
  margin-right: 1rem;
}

/* Custom scrollbar for suggestions */
.suggestions-dropdown::-webkit-scrollbar {
  width: 6px;
}

.suggestions-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.suggestions-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.suggestions-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Focus styles */
.tag-input-container input:focus {
  outline: none;
}

/* Animation for tag removal */
.tag-item {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .tag-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .tag-actions {
    align-self: flex-end;
  }
}
</style>
