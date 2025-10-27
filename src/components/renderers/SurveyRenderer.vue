<template>
  <div class="survey-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Survey Title -->
    <div v-if="component.label" class="survey-title mb-6">
      <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
        <svg class="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        {{ component.label }}
      </h3>
      <p v-if="component.description" class="text-gray-600 text-sm">
        {{ component.description }}
      </p>
    </div>

    <!-- Survey Questions -->
    <div v-if="surveyQuestions.length > 0" class="survey-questions space-y-6">
      <div
        v-for="(question, index) in surveyQuestions"
        :key="question.id || `question-${index}`"
        class="question-container bg-transparent rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
      >
        <!-- Question Header -->
        <div class="question-header mb-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <span class="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-bold mr-3">
                  {{ index + 1 }}
                </span>
                {{ question.label || question.question }}
              </h4>
              <p v-if="question.description" class="text-gray-600 text-sm">
                {{ question.description }}
              </p>
            </div>
            <div v-if="question.validate?.required" class="text-red-500 text-sm font-medium">
              {{ tr('common.required', 'إلزامي') }}
            </div>
          </div>
        </div>

        <!-- Question Input Based on Type -->
        <div class="question-input">
          <!-- Radio (Single Choice) -->
          <div v-if="question.type === 'radio'" class="space-y-3">
            <div
              v-for="(option, optionIndex) in getOptions(question)"
              :key="optionIndex"
              class="flex items-center"
            >
              <input
                :id="`${getQuestionKey(index, question)}-${optionIndex}`"
                :name="getQuestionKey(index, question)"
                type="radio"
                :value="option.value"
                v-model="formData[getQuestionKey(index, question)]"
                @change="updateValue(getQuestionKey(index, question), ($event.target as HTMLInputElement).value)"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 focus:ring-2"
              />
              <label
                :for="`${getQuestionKey(index, question)}-${optionIndex}`"
                class="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {{ option.label }}
              </label>
            </div>
          </div>

          <!-- Checkbox (Multiple Choice) -->
          <div v-else-if="question.type === 'checkbox'" class="space-y-3">
            <div
              v-for="(option, optionIndex) in getOptions(question)"
              :key="optionIndex"
              class="flex items-center"
            >
              <input
                :id="`${getQuestionKey(index, question)}-${optionIndex}`"
                type="checkbox"
                :value="option.value"
                v-model="checkboxValues[getQuestionKey(index, question)]"
                @change="updateCheckboxValue(getQuestionKey(index, question), option.value, ($event.target as HTMLInputElement).checked)"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label
                :for="`${getQuestionKey(index, question)}-${optionIndex}`"
                class="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {{ option.label }}
              </label>
            </div>
          </div>

          <!-- Select (Dropdown) -->
          <div v-else-if="question.type === 'select'" class="w-full">
            <select
              v-model="formData[getQuestionKey(index, question)]"
              @change="updateValue(getQuestionKey(index, question), ($event.target as HTMLSelectElement).value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-transparent"
            >
              <option value="">{{ tr('common.selectOption', 'اختر خياراً') }}</option>
              <option
                v-for="(option, optionIndex) in getOptions(question)"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Text Field -->
          <div v-else-if="question.type === 'textfield' || question.type === 'text'" class="w-full">
            <input
              type="text"
              v-model="formData[getQuestionKey(index, question)]"
              @input="updateValue(getQuestionKey(index, question), ($event.target as HTMLInputElement | HTMLTextAreaElement).value)"
              :placeholder="getPlaceholder(question)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <!-- Text Area -->
          <div v-else-if="question.type === 'textarea'" class="w-full">
            <textarea
              v-model="formData[getQuestionKey(index, question)]"
              @input="updateValue(getQuestionKey(index, question), ($event.target as HTMLInputElement | HTMLTextAreaElement).value)"
              :placeholder="getPlaceholder(question)"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
            ></textarea>
          </div>

          <!-- Number -->
          <div v-else-if="question.type === 'number'" class="w-full">
            <input
              type="number"
              v-model.number="formData[getQuestionKey(index, question)]"
              @input="updateValue(getQuestionKey(index, question), ($event.target as HTMLInputElement | HTMLTextAreaElement).value)"
              :placeholder="getPlaceholder(question)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <!-- Email -->
          <div v-else-if="question.type === 'email'" class="w-full">
            <input
              type="email"
              v-model="formData[getQuestionKey(index, question)]"
              @input="updateValue(getQuestionKey(index, question), ($event.target as HTMLInputElement | HTMLTextAreaElement).value)"
              :placeholder="getPlaceholder(question)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <!-- Rating -->
          <div v-else-if="question.type === 'rating'" class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">{{ tr('survey.rating.poor', 'سيء') }}</span>
            <div class="flex space-x-1">
              <button
                v-for="rating in 5"
                :key="rating"
                type="button"
                @click="updateValue(question.key, rating)"
                class="w-8 h-8 rounded-full border-2 transition-colors"
                :class="formData[question.key] >= rating 
                  ? 'bg-yellow-400 border-yellow-400 text-white' 
                  : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'"
              >
                <svg class="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
            <span class="text-sm text-gray-600">{{ tr('survey.rating.excellent', 'ممتاز') }}</span>
          </div>

          <!-- Default fallback -->
          <div v-else class="text-gray-500 italic">
            {{ tr('survey.unsupportedQuestionType', 'نوع السؤال غير مدعوم') }}: {{ question.type }}
          </div>
        </div>

        <!-- Validation Error -->
        <div v-if="validationErrors[question.key]" class="mt-2 text-red-600 text-sm">
          {{ validationErrors[question.key] }}
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ tr('survey.noQuestions', 'لا توجد أسئلة') }}</h3>
      <p class="text-gray-500">{{ tr('survey.addQuestionsToStart', 'أضف أسئلة للبدء في الاستطلاع') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'

// Props
interface SurveyQuestion {
  id?: string
  key: string
  type: 'radio' | 'checkbox' | 'text' | 'textarea' | 'select' | 'rating' | 'textfield' | 'number' | 'email'
  label?: string
  question?: string
  description?: string
  placeholder?: string
  values?: Array<{ label: string; value: any }>
  validate?: { required?: boolean }
}

interface SurveyComponent {
  type: 'survey'
  label?: string
  description?: string
  questions: SurveyQuestion[]
}

interface Props {
  component: SurveyComponent
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

// i18n helper with safe fallback
const tr = (key: string, fallback: string) => {
  const translated = t(key) as string
  return translated !== key ? translated : fallback
}

// Reactive state
const internalFormData = ref<Record<string, any>>({ ...props.formData })
const checkboxValues = ref<Record<string, any[]>>({})
const validationErrors = ref<Record<string, string>>({})

// Computed
const formData = computed({
  get: () => internalFormData.value,
  set: (value) => {
    internalFormData.value = value
  }
})

const surveyQuestions = computed(() => {
  // Fallback to component.data?.questions if questions is missing
  const questions = (props.component as any).questions || (props.component as any).data?.questions || []
  return Array.isArray(questions) ? questions : []
})

// Methods
// Helpers
const getQuestionKey = (index: number, question: SurveyQuestion): string => {
  return (question.key && String(question.key)) || `question_${index + 1}`
}

const getOptions = (question: SurveyQuestion): Array<{ label: string; value: any }> => {
  const vals = (question as any).values || (question as any).options || []
  return Array.isArray(vals) ? vals : []
}

const getPlaceholder = (question: SurveyQuestion): string => {
  return (question.placeholder as string) || ''
}

const updateValue = (key: string, value: any) => {
  internalFormData.value[key] = value
  emit('update:value', key, value)
  
  // Clear validation error when user starts typing
  if (validationErrors.value[key]) {
    delete validationErrors.value[key]
  }
}

const updateCheckboxValue = (key: string, optionValue: any, checked: boolean) => {
  if (!checkboxValues.value[key]) {
    checkboxValues.value[key] = []
  }
  
  if (checked) {
    if (!checkboxValues.value[key].includes(optionValue)) {
      checkboxValues.value[key].push(optionValue)
    }
  } else {
    const index = checkboxValues.value[key].indexOf(optionValue)
    if (index > -1) {
      checkboxValues.value[key].splice(index, 1)
    }
  }
  
  internalFormData.value[key] = checkboxValues.value[key]
  emit('update:value', key, checkboxValues.value[key])
  
  // Clear validation error
  if (validationErrors.value[key]) {
    delete validationErrors.value[key]
  }
}

const validateQuestion = (question: SurveyQuestion): boolean => {
  const key = question.key
  const value = internalFormData.value[key]
  
  // Check required validation
  if (question.validate?.required) {
    if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
      validationErrors.value[key] = t('validation.required')
      return false
    }
  }
  
  // Clear any existing error
  if (validationErrors.value[key]) {
    delete validationErrors.value[key]
  }
  
  return true
}

const validateAllQuestions = (): boolean => {
  let isValid = true
  
  surveyQuestions.value.forEach((question: SurveyQuestion) => {
    if (!validateQuestion(question)) {
      isValid = false
    }
  })
  
  return isValid
}

// Initialize checkbox values
const initializeCheckboxValues = () => {
  surveyQuestions.value.forEach((question: SurveyQuestion, idx: number) => {
    if (question.type === 'checkbox') {
      const k = getQuestionKey(idx, question)
      checkboxValues.value[k] = internalFormData.value[k] || []
    }
  })
}

// Watch for external form data changes
watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      internalFormData.value = { ...newData }
      initializeCheckboxValues()
    }
  },
  { deep: true, immediate: true }
)

// Lifecycle
onMounted(() => {
  initializeCheckboxValues()
})

// Expose methods for parent component
defineExpose({
  validate: validateAllQuestions,
  getFormData: () => internalFormData.value
})
</script>

<style scoped>
.survey-renderer {
  width: 100%;
}

.question-container {
  transition: all 0.2s ease;
}

.question-container:hover {
  border-color: #d1d5db;
}

.rtl {
  direction: rtl;
}

.rtl .mr-3 {
  margin-right: 0;
  margin-left: 0.75rem;
}

.rtl .ml-3 {
  margin-left: 0;
  margin-right: 0.75rem;
}

.rtl .space-x-1 > * + * {
  margin-left: 0;
  margin-right: 0.25rem;
}

.rtl .space-x-2 > * + * {
  margin-left: 0;
  margin-right: 0.5rem;
}

/* Custom radio and checkbox styles */
input[type="radio"]:checked {
  background-color: #9333ea;
  border-color: #9333ea;
}

input[type="checkbox"]:checked {
  background-color: #9333ea;
  border-color: #9333ea;
}

/* Focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

/* Rating buttons */
.rating-button {
  transition: all 0.2s ease;
}

.rating-button:hover {
  transform: scale(1.1);
}
</style>
