<template>
  <div class="form-preview-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" :class="{ 'rtl': isRTLDirection }">
    <!-- Enhanced Header -->
    <div class="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-6">
            <button
              @click="goBack"
              class="group flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ $t('common.back') }}
            </button>
            <div class="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {{ formData?.title || $t('formBuilder.previewTitle') }}
                </h1>
                <p class="text-sm text-slate-500 mt-1">{{ $t('formBuilder.livePreview') }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click="resetForm"
              class="group px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              <svg class="w-4 h-4 inline mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('form.reset') }}
            </button>
            <button
              @click="exportForm"
              class="group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <svg class="w-4 h-4 inline mr-2 group-hover:translate-y-[-2px] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ $t('formBuilder.export') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Enhanced Form Info Card -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mb-8 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl"></div>
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full translate-y-12 -translate-x-12"></div>

        <div class="relative z-10">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div class="mb-4 lg:mb-0">
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm font-medium text-green-600">{{ $t('formBuilder.livePreview') }}</span>
              </div>
              <h2 class="text-3xl font-bold text-slate-800 mb-2">{{ formData?.title || $t('formBuilder.untitledForm') }}</h2>
              <p class="text-slate-600 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {{ formData?.name || 'preview-form' }}
              </p>
            </div>

            <!-- Form Statistics -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40">
                <div class="text-2xl font-bold text-blue-600 mb-1">{{ componentCount }}</div>
                <div class="text-xs text-slate-600">{{ $t('formBuilder.components') }}</div>
              </div>
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40">
                <div class="text-2xl font-bold text-green-600 mb-1">{{ requiredFieldsCount }}</div>
                <div class="text-xs text-slate-600">{{ $t('formBuilder.requiredFields') }}</div>
              </div>
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40">
                <div class="text-2xl font-bold text-purple-600 mb-1">{{ estimatedTime }}</div>
                <div class="text-xs text-slate-600">{{ $t('formBuilder.estimatedTime') }}</div>
              </div>
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40">
                <div class="text-2xl font-bold text-orange-600 mb-1">{{ formComplexity }}</div>
                <div class="text-xs text-slate-600">{{ $t('formBuilder.complexityLabel') }}</div>
              </div>
            </div>
          </div>

          <!-- Form Description -->
          <div v-if="formData?.description" class="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
            <p class="text-slate-700 leading-relaxed">{{ formData.description }}</p>
          </div>
        </div>
      </div>

      <!-- Enhanced Form Preview -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 relative overflow-hidden">
        <!-- Form Header -->
        <div class="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-slate-200/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-slate-800">{{ $t('formBuilder.interactivePreview') }}</h3>
                <p class="text-sm text-slate-600">{{ $t('formBuilder.testYourForm') }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {{ $t('formBuilder.ready') }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Empty State -->
          <div v-if="!formData || !formData.components || formData.components.length === 0"
               class="text-center py-16">
            <div class="relative">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div class="w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 mb-3">
              {{ $t('formBuilder.emptyState.title') }}
            </h3>
            <p class="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              {{ $t('formBuilder.emptyState.description') }}
            </p>
            <button
              @click="goBack"
              class="group px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <svg class="w-5 h-5 inline mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ $t('common.back') }}
            </button>
          </div>

          <!-- Form Content -->
          <div v-else class="relative">
            <!-- Progress Indicator -->
            <div class="mb-6">
              <div class="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>{{ $t('formBuilder.formProgress') }}</span>
                <span>{{ formProgress }}%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: formProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Form Content -->
            <div class="form-content">
              <DynamicFormRenderer
                :form-schema="formSchema"
                :form-data="currentFormData"
                @submit="handleFormSubmit"
                @data-change="handleFormChange"
                @error="handleFormError"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Submission Results -->
      <div v-if="submissionData" class="mt-8 relative">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-8 relative overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300/20 to-teal-300/20 rounded-full translate-y-12 -translate-x-12"></div>

          <div class="relative z-10">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-green-800 mb-1">
                  {{ $t('form.success') }}
                </h3>
                <p class="text-green-700 text-lg">
                  {{ $t('formBuilder.messages.submissionSuccess') }}
                </p>
              </div>
            </div>

            <!-- Submission Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div class="text-2xl font-bold text-green-600 mb-1">{{ Object.keys(submissionData.data || {}).length }}</div>
                <div class="text-sm text-slate-600">{{ $t('formBuilder.fieldsSubmitted') }}</div>
              </div>
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div class="text-2xl font-bold text-blue-600 mb-1">{{ submissionTime }}</div>
                <div class="text-sm text-slate-600">{{ $t('formBuilder.submissionTime') }}</div>
              </div>
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div class="text-2xl font-bold text-purple-600 mb-1">100%</div>
                <div class="text-sm text-slate-600">{{ $t('formBuilder.completionRate') }}</div>
              </div>
            </div>

            <!-- Submission Data -->
            <details class="group">
              <summary class="cursor-pointer flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-300">
                <span class="text-green-800 font-semibold flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ $t('formBuilder.viewSubmissionData') }}
                </span>
                <svg class="w-5 h-5 text-green-600 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="mt-4 p-6 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl">
                <pre class="text-sm text-slate-700 overflow-auto max-h-96 leading-relaxed">{{ JSON.stringify(submissionData, null, 2) }}</pre>
              </div>
            </details>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="formError" class="mt-8 relative">
        <div class="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-8 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full -translate-y-16 translate-x-16"></div>

          <div class="relative z-10">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-red-800 mb-1">
                  {{ $t('form.error') }}
                </h3>
                <p class="text-red-700">
                  {{ formError }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DynamicFormRenderer from '../components/DynamicFormRenderer.vue'
import { isRTLSync } from '../i18n'

// Composables
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// Reactive data
const formData = ref<any>(null)
const submissionData = ref<any>(null)
const formError = ref<string | null>(null)
const formProgress = ref<number>(0)
const submissionStartTime = ref<Date | null>(null)
const currentFormData = ref<Record<string, any>>({})

// Computed
const isRTLDirection = computed(() => isRTLSync())

const componentCount = computed(() => {
  return formData.value?.components?.length || 0
})

const requiredFieldsCount = computed(() => {
  if (!formData.value?.components) return 0
  return countRequiredFields(formData.value.components)
})

const estimatedTime = computed(() => {
  const baseTime = componentCount.value * 0.5 // 30 seconds per component
  const complexityMultiplier = getComplexityMultiplier()
  const totalMinutes = Math.ceil(baseTime * complexityMultiplier)
  return `${totalMinutes}m`
})

const formComplexity = computed(() => {
  const score = calculateComplexityScore()
  if (score <= 3) return t('formBuilder.complexity.simple')
  if (score <= 7) return t('formBuilder.complexity.medium')
  return t('formBuilder.complexity.complex')
})

const submissionTime = computed(() => {
  if (!submissionData.value || !submissionStartTime.value) return '0s'
  const endTime = new Date(submissionData.value.created || Date.now())
  const diffMs = endTime.getTime() - submissionStartTime.value.getTime()
  const diffSeconds = Math.round(diffMs / 1000)
  return diffSeconds < 60 ? `${diffSeconds}s` : `${Math.round(diffSeconds / 60)}m`
})

const formSchema = computed(() => {
  if (!formData.value) return { components: [] }

  return {
    title: formData.value.title || t('formBuilder.defaultTitle'),
    name: formData.value.name || 'preview-form',
    path: formData.value.path || 'preview-form',
    type: 'form',
    display: 'form',
    components: formData.value.components || [],
    settings: formData.value.settings || {}
  }
})

// Methods
const goBack = () => {
  router.back()
}

const resetForm = () => {
  submissionData.value = null
  formError.value = null
  currentFormData.value = {}
  formProgress.value = 0
  submissionStartTime.value = null
}

const exportForm = () => {
  if (!formData.value) return

  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData.value, null, 2))
  const exportFileDefaultName = `${formData.value.name || 'form'}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

// Helper functions for statistics
const countRequiredFields = (components: any[]): number => {
  let count = 0

  const countInComponent = (comp: any) => {
    if (comp.validate?.required) {
      count++
    }

    // Check nested components (like in panels, fieldsets, etc.)
    if (comp.components && Array.isArray(comp.components)) {
      comp.components.forEach(countInComponent)
    }

    // Check table cells
    if (comp.type === 'table' && comp.rows) {
      comp.rows.forEach((row: any) => {
        if (row.cells) {
          row.cells.forEach((cell: any) => {
            if (cell.components) {
              cell.components.forEach(countInComponent)
            }
          })
        }
      })
    }

    // Check tabs
    if (comp.type === 'tabs' && comp.components) {
      comp.components.forEach((tab: any) => {
        if (tab.components) {
          tab.components.forEach(countInComponent)
        }
      })
    }
  }

  components.forEach(countInComponent)
  return count
}

const calculateComplexityScore = (): number => {
  if (!formData.value?.components) return 0

  let score = 0
  const complexComponents = ['datagrid', 'editgrid', 'table', 'tabs', 'survey', 'tree']
  const mediumComponents = ['select', 'selectboxes', 'radio', 'checkbox', 'file', 'signature']

  const scoreComponent = (comp: any) => {
    if (complexComponents.includes(comp.type)) {
      score += 3
    } else if (mediumComponents.includes(comp.type)) {
      score += 2
    } else {
      score += 1
    }

    // Add complexity for validation rules
    if (comp.validate) {
      if (comp.validate.required) score += 0.5
      if (comp.validate.pattern) score += 1
      if (comp.validate.custom) score += 2
    }

    // Add complexity for conditional logic
    if (comp.conditional && comp.conditional.when) score += 2

    // Check nested components
    if (comp.components && Array.isArray(comp.components)) {
      comp.components.forEach(scoreComponent)
    }
  }

  formData.value.components.forEach(scoreComponent)
  return score
}

const getComplexityMultiplier = (): number => {
  const score = calculateComplexityScore()
  if (score <= 3) return 1
  if (score <= 7) return 1.5
  return 2
}

const updateFormProgress = (data: Record<string, any>) => {
  const totalFields = componentCount.value
  if (totalFields === 0) {
    formProgress.value = 0
    return
  }

  const filledFields = Object.keys(data).filter(key => {
    const value = data[key]
    return value !== null && value !== undefined && value !== ''
  }).length

  formProgress.value = Math.round((filledFields / totalFields) * 100)
}

const handleFormSubmit = (data: Record<string, any>) => {
  console.log('Form submitted:', data)
  submissionData.value = {
    data,
    created: new Date().toISOString(),
    _id: `preview_${Date.now()}`
  }
  formError.value = null
  formProgress.value = 100
}

const handleFormChange = (data: Record<string, any>) => {
  console.log('Form data changed:', data)
  currentFormData.value = data
  updateFormProgress(data)

  // Start timing if this is the first interaction
  if (!submissionStartTime.value && Object.keys(data).length > 0) {
    submissionStartTime.value = new Date()
  }
}

const handleFormError = (error: string) => {
  console.error('Form error:', error)
  formError.value = error || t('form.error')
}


// Lifecycle
onMounted(() => {
  // Get form data from route params or query
  if (route.params.formData) {
    try {
      formData.value = JSON.parse(decodeURIComponent(route.params.formData as string))
    } catch (error) {
      console.error('Error parsing form data:', error)
    }
  } else if (route.query.formData) {
    try {
      formData.value = JSON.parse(decodeURIComponent(route.query.formData as string))
    } catch (error) {
      console.error('Error parsing form data:', error)
    }
  }

  // If no form data, redirect back
  if (!formData.value) {
    router.push('/builder')
  }
})
</script>

<style scoped>
/* RTL Support */
.rtl {
  direction: rtl;
}

.rtl .space-x-6 > * + * {
  margin-left: 0;
  margin-right: 1.5rem;
}

.rtl .space-x-4 > * + * {
  margin-left: 0;
  margin-right: 1rem;
}

.rtl .space-x-3 > * + * {
  margin-left: 0;
  margin-right: 0.75rem;
}

.rtl .space-x-2 > * + * {
  margin-left: 0;
  margin-right: 0.5rem;
}

.rtl .ml-3 {
  margin-left: 0;
  margin-right: 0.75rem;
}

.rtl .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

.rtl .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}

/* Enhanced Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Component Animations */
.form-preview-page {
  animation: slide-in 0.6s ease-out;
}

.form-content {
  animation: scale-in 0.5s ease-out 0.2s both;
}

/* Glass Morphism Effects */
.backdrop-blur-lg {
  backdrop-filter: blur(20px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Custom Scrollbar */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Enhanced Hover Effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:-translate-x-1 {
  transform: translateX(-0.25rem);
}

.group:hover .group-hover\:translate-y-\[-2px\] {
  transform: translateY(-2px);
}

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

/* Responsive Design Improvements */
@media (max-width: 640px) {
  .max-w-6xl {
    max-width: 100%;
  }

  .px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .lg\:flex-row {
    flex-direction: column;
  }

  .lg\:items-center {
    align-items: flex-start;
  }

  .lg\:justify-between {
    justify-content: flex-start;
  }

  .space-x-6 > * + * {
    margin-left: 0;
    margin-top: 1rem;
  }

  .rtl .space-x-6 > * + * {
    margin-right: 0;
    margin-top: 1rem;
  }
}

/* Progress Bar Animation */
.progress-bar {
  transition: width 0.5s ease-out;
}

/* Form Field Focus Enhancement */
.form-content :deep(.form-control:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: rgb(59, 130, 246);
}

/* Loading States */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Success Animation */
.success-bounce {
  animation: float 2s ease-in-out infinite;
}

/* Error State */
.error-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Enhanced Button Styles */
.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Card Hover Effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Statistics Cards Animation */
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Form Preview Container */
.form-preview-container {
  min-height: calc(100vh - 200px);
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print Styles */
@media print {
  .form-preview-page {
    background: white !important;
  }

  .backdrop-blur-lg,
  .backdrop-blur-sm {
    backdrop-filter: none !important;
  }

  .shadow-xl,
  .shadow-lg {
    box-shadow: none !important;
  }
}
</style>
