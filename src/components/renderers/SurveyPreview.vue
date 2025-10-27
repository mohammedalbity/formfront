<template>
  <div class="form-group">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
    </label>

    <!-- Survey Container -->
    <div class="border-2 border-orange-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- Survey Header -->
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || tr('formBuilder.componentLabels.survey', 'استطلاع') }}</h3>
              <p class="text-orange-100 text-sm">{{ tr('formBuilder.componentDescriptions.survey', 'أسئلة واستطلاعات الرأي') }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ surveyQuestions.length }} {{ tr('formBuilder.questions', 'سؤال') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Survey Content -->
      <div class="p-6 max-h-80 overflow-y-auto overflow-x-hidden">
        <!-- Questions Display -->
        <div v-if="surveyQuestions.length > 0" class="space-y-4">
          <div class="text-xs font-medium text-gray-600 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ tr('formBuilder.surveyQuestions', 'أسئلة الاستطلاع') }}
          </div>

          <!-- Questions Grid -->
          <div class="grid grid-cols-1 gap-4 mb-6">
            <div v-for="(question, questionIndex) in surveyQuestions"
                 :key="`survey-question-${questionIndex}-${forceUpdateKey}`"
                 class="bg-gradient-to-br from-orange-50 to-orange-50 border-2 border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
              
              <!-- Question Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-2 flex-1">
                  <div class="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                    {{ questionIndex + 1 }}
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-orange-800 mb-1">
                      {{ question.label || question.question || `${tr('formBuilder.question', 'سؤال')} ${questionIndex + 1}` }}
                    </h4>
                    <p v-if="question.description" class="text-xs text-gray-600">{{ question.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                    {{ getQuestionTypeLabel(question.type) }}
                  </span>
                  <span v-if="question.validate?.required" class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    {{ tr('common.required', 'إلزامي') }}
                  </span>
                </div>
              </div>

              <!-- Question Preview -->
              <div class="bg-white border border-orange-200 rounded-lg p-3 mb-3">
                <div class="text-xs text-gray-600 mb-2">{{ tr('formBuilder.preview', 'معاينة') }}</div>
                <div class="text-sm text-gray-800">
                  <div v-if="['radio', 'checkbox', 'select'].includes(question.type)" class="space-y-1">
                    <div v-for="(option, idx) in getOptions(question).slice(0, 3)" :key="idx" class="text-xs text-gray-600">
                      • {{ option.label }}
                    </div>
                    <div v-if="getOptions(question).length > 3" class="text-xs text-gray-400">
                      ... و {{ getOptions(question).length - 3 }} {{ tr('formBuilder.moreOptions', 'خيارات أخرى') }}
                    </div>
                  </div>
                  <div v-else-if="question.type === 'rating'" class="flex items-center space-x-1">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div v-else class="text-xs text-gray-500 italic">
                    {{ question.placeholder || getQuestionTypePlaceholder(question.type) }}
                  </div>
                </div>
              </div>

              <!-- Question Actions -->
              <div class="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex space-x-1">
                  <button @click.stop="editQuestion(questionIndex, question)"
                          class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click.stop="deleteQuestion(questionIndex, question)"
                          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          :title="$t('common.delete')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                <div class="text-xs text-orange-600">
                  {{ questionIndex + 1 }}/{{ surveyQuestions.length }}
                </div>
              </div>
            </div>

            <!-- Add Question Card -->
            <div @click="openAddQuestionModal"
                 class="border-2 border-dashed border-orange-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group min-h-[140px]">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="text-sm text-orange-700 font-medium mb-1">{{ tr('formBuilder.addQuestion', 'إضافة سؤال') }}</div>
              <div class="text-xs text-orange-600">{{ tr('formBuilder.clickToAddQuestion', 'انقر لإضافة سؤال جديد') }}</div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8" @click.stop="openAddQuestionModal">
          <div class="flex flex-col items-center cursor-pointer hover:bg-orange-50 rounded-lg p-4 transition-colors">
            <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h4 class="text-sm font-medium text-gray-700 mb-1">{{ tr('survey.noQuestions', 'لا توجد أسئلة') }}</h4>
            <p class="text-xs text-gray-500 mb-4">{{ tr('survey.clickToAddQuestions', 'انقر لإضافة أسئلة للاستطلاع') }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="component.description" class="text-xs text-gray-500 mt-2">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  component: Record<string, any>
  readonly?: boolean
  forceUpdateKey?: number
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  forceUpdateKey: 0
})

const { t } = useI18n()

// i18n helper with safe fallback
const tr = (key: string, fallback: string) => {
  const translated = t(key) as string
  return translated !== key ? translated : fallback
}

const emit = defineEmits<{
  'edit-survey-question': [data: { questionIndex: number; question: Record<string, any> }]
  'delete-survey-question': [data: { questionIndex: number; question: Record<string, any> }]
  'open-add-survey-question-modal': []
}>()

// Computed
const surveyQuestions = computed(() => {
  const questions = (props.component as any).questions || (props.component as any).data?.questions || []
  return Array.isArray(questions) ? questions : []
})

// Helper functions
const getOptions = (question: Record<string, any>): Array<{ label: string; value: any }> => {
  const vals = question.values || question.options || []
  return Array.isArray(vals) ? vals : []
}

const getQuestionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    radio: tr('survey.types.radio', 'اختيار واحد'),
    checkbox: tr('survey.types.checkbox', 'اختيار متعدد'),
    select: tr('survey.types.select', 'قائمة منسدلة'),
    textfield: tr('survey.types.textfield', 'نص'),
    text: tr('survey.types.text', 'نص'),
    textarea: tr('survey.types.textarea', 'نص طويل'),
    number: tr('survey.types.number', 'رقم'),
    email: tr('survey.types.email', 'بريد إلكتروني'),
    rating: tr('survey.types.rating', 'تقييم')
  }
  return labels[type] || type
}

const getQuestionTypePlaceholder = (type: string): string => {
  const placeholders: Record<string, string> = {
    textfield: tr('survey.placeholders.textfield', 'أدخل النص هنا...'),
    text: tr('survey.placeholders.text', 'أدخل النص هنا...'),
    textarea: tr('survey.placeholders.textarea', 'أدخل إجابة مفصلة...'),
    number: tr('survey.placeholders.number', 'أدخل رقماً...'),
    email: tr('survey.placeholders.email', 'أدخل البريد الإلكتروني...')
  }
  return placeholders[type] || ''
}

// Event handlers
const editQuestion = (questionIndex: number, question: Record<string, any>) => {
  emit('edit-survey-question', { questionIndex, question })
}

const deleteQuestion = (questionIndex: number, question: Record<string, any>) => {
  emit('delete-survey-question', { questionIndex, question })
}

const openAddQuestionModal = () => {
  emit('open-add-survey-question-modal')
}
</script>
