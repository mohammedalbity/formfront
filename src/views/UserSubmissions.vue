<template>
  <div class="user-submissions-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Enhanced Header -->
    <div class="relative overflow-hidden bg-white shadow-sm border-b">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5"></div>
      <div class="relative px-6 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="space-y-2">
              <div class="flex items-center space-x-3" :class="{ 'space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }">
                <div class="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {{ t('userSubmissions.title') }}
                  </h1>
                  <p class="text-lg text-gray-600">
                    {{ t('userSubmissions.subtitle') }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4 text-sm text-gray-500" :class="{ 'space-x-4': !isRTLSync(), 'space-x-reverse': isRTLSync() }">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" :class="{ 'mr-1': !isRTLSync(), 'ml-1': isRTLSync() }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {{ submissions.length }} {{ t('userSubmissions.totalSubmissions') }}
                </span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="refreshSubmissions"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" :class="{ 'mr-2': !isRTLSync(), 'ml-2': isRTLSync() }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ t('userSubmissions.refresh') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col items-center justify-center py-16">
          <div class="relative">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p class="mt-4 text-lg text-gray-600 font-medium">{{ t('userSubmissions.loading') }}</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-6">
      <div class="max-w-7xl mx-auto">
        <div class="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
          <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-red-800 mb-2">{{ t('userSubmissions.errorTitle') }}</h3>
          <p class="text-red-600 mb-6">{{ error }}</p>
          <button
            @click="() => loadSubmissions()"
            class="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {{ t('userSubmissions.retry') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Submissions Grid -->
    <div v-else-if="submissions.length > 0" class="px-6 py-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="submission in submissions"
            :key="submission.id"
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div class="p-6 relative">
              <button
                @click="openDeleteModal(submission)"
                :title="t('common.delete')"
                class="absolute top-3 left-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-red-600 hover:bg-red-50 border border-red-200 shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                </svg>
              </button>
              <div class="flex items-start justify-between mb-4 pl-12">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ submission.form?.title || t('userSubmissions.unknownForm') }}
                  </h3>
                  <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0" :class="{ 'sm:space-x-4': !isRTLSync(), 'sm:space-x-reverse': isRTLSync() }">
                    <p class="text-sm text-gray-500">
                      {{ t('userSubmissions.submissionId') }}: #{{ submission.id }}
                    </p>
                    <div v-if="submission.user" class="flex items-center space-x-2 text-sm text-gray-600" :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }">
                      <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {{ submission.user.name.charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-medium">{{ submission.user.name }}</span>
                      <span class="text-xs text-gray-400">ID: {{ submission.user.id }}</span>
                    </div>
                  </div>
                </div>
                <span :class="getStatusBadgeClass(submission.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getStatusText(submission.status) }}
                </span>
              </div>

              <div class="space-y-3 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" :class="{ 'mr-2': !isRTLSync(), 'ml-2': isRTLSync() }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(submission.submitted_at || submission.created_at) }}
                </div>
                
                <div class="text-sm text-gray-600">
                  <div class="bg-gray-50 rounded-lg p-3">
                    {{ getSubmissionPreview(submission.data) }}
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center">
                <button
                  @click="viewSubmission(submission)"
                  class="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-1" :class="{ 'mr-1': !isRTLSync(), 'ml-1': isRTLSync() }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span class="hidden sm:inline">{{ t('userSubmissions.view') }}</span>
                  <span class="sm:hidden">{{ t('userSubmissions.viewDetails') || t('userSubmissions.view') }}</span>
                </button>
                
                <router-link
                  :to="`/forms/${submission.form_id}/fill`"
                  class="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-1" :class="{ 'mr-1': !isRTLSync(), 'ml-1': isRTLSync() }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="hidden sm:inline">{{ t('userSubmissions.submitAgain') }}</span>
                  <span class="sm:hidden">{{ t('userSubmissions.resubmit') || t('userSubmissions.submitAgain') }}</span>
                </router-link>

              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="mt-8 flex items-center justify-center">
          <div class="flex space-x-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page <= 1"
              class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('userSubmissions.pagination.previous') }}
            </button>
            <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
              {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.last_page"
              class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('userSubmissions.pagination.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center py-16">
          <div class="mx-auto w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-8">
            <svg class="h-16 w-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            {{ t('userSubmissions.noSubmissions') }}
          </h3>
          <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {{ t('userSubmissions.noSubmissionsDesc') }}
          </p>
          <router-link
            to="/"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
          >
            {{ t('userSubmissions.exploreforms') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-gray-900/50"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3" :class="{ 'mr-3': !isRTLSync(), 'ml-3': isRTLSync() }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.2L13.4 4.8a2 2 0 00-3.4 0L3 17.2A2 2 0 005.07 19z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ t('common.confirm') }}</h3>
              <p class="text-gray-600">{{ t('common.delete') }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3" :class="{ 'space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }">
            <button @click="closeDeleteModal" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">{{ t('common.cancel') }}</button>
            <button @click="confirmDelete" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">{{ t('common.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSubmissionsStore } from '../stores/submissions'
import { useNotifications } from '../composables/useNotifications'
import { isRTLSync } from '../i18n'

// Types
interface Submission {
  id: number
  form_id: number
  form?: {
    id: number
    title: string
  }
  data: any
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected'
  submitted_at: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email?: string
  }
}

// Composables
const { t } = useI18n()
const router = useRouter()
const submissionsStore = useSubmissionsStore()
const { success, error: showError } = useNotifications()

// Reactive state
const submissions = ref<Submission[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// Modal state
const showDeleteModal = ref(false)
const submissionToDelete = ref<Submission | null>(null)

// Computed
const isRTLDirection = computed(() => isRTLSync())

// Methods
const loadSubmissions = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    // Load user's own submissions
    const result = await submissionsStore.fetchSubmissions({ page, per_page: 15 })
    if (result.success) {
      submissions.value = submissionsStore.submissions
      pagination.value = submissionsStore.pagination
    } else {
      error.value = result.error || t('userSubmissions.errors.loadFailed')
    }
  } catch (err) {
    console.error('Error loading submissions:', err)
    error.value = t('userSubmissions.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

const refreshSubmissions = () => {
  loadSubmissions(pagination.value.current_page)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadSubmissions(page)
  }
}

const viewSubmission = (submission: Submission) => {
  router.push(`/submissions/${submission.id}`)
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    submitted: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Helper function to get status text (fixes Vue i18n message compiler syntax error)
const getStatusText = (status: string): string => {
  return t('submissions.status.' + status)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(isRTLSync() ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSubmissionPreview = (data: any) => {
  if (!data || typeof data !== 'object') return t('userSubmissions.noData')

  const keys = Object.keys(data)
  if (keys.length === 0) return t('userSubmissions.emptySubmission')

  const firstKey = keys[0]
  const firstValue = data[firstKey]

  if (typeof firstValue === 'string') {
    return `${firstKey}: ${firstValue.substring(0, 50)}${firstValue.length > 50 ? '...' : ''}`
  }

  return t('userSubmissions.fieldsSubmitted', { count: keys.length })
}

// Helper functions for datagrid data display
const isDatagridData = (value: any[]): boolean => {
  if (!Array.isArray(value) || value.length === 0) return false
  
  // Check if all items are objects with similar structure
  const firstItem = value[0]
  if (typeof firstItem !== 'object' || firstItem === null) return false
  
  const firstKeys = Object.keys(firstItem)
  if (firstKeys.length === 0) return false
  
  // Check if at least 80% of items have similar keys (to handle slight variations)
  const similarItems = value.filter(item => {
    if (typeof item !== 'object' || item === null) return false
    const itemKeys = Object.keys(item)
    const commonKeys = firstKeys.filter(key => itemKeys.includes(key))
    return commonKeys.length >= Math.ceil(firstKeys.length * 0.8)
  })
  
  return similarItems.length >= Math.ceil(value.length * 0.8)
}

const getDatagridColumns = (value: any[]): string[] => {
  if (!Array.isArray(value) || value.length === 0) return []
  
  // Collect all unique keys from all objects
  const allKeys = new Set<string>()
  value.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => allKeys.add(key))
    }
  })
  
  return Array.from(allKeys).sort()
}

const formatObjectValue = (value: any): string => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? '✓' : '✗'
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

// Helper function to check if data is components array (technical component definitions)
const isComponentsData = (key: string, value: any): boolean => {
  return key.toLowerCase() === 'components' && Array.isArray(value) && value.length > 0 && 
         value.every(item => typeof item === 'object' && item !== null && 'type' in item)
}

// Helper function to detect EditGrid data
const isEditGridData = (value: any[]): boolean => {
  if (!Array.isArray(value) || value.length === 0) return false
  
  // EditGrid data is similar to datagrid but may have different structure
  return value.every(item => typeof item === 'object' && item !== null)
}

// Helper function to detect Panel/Fieldset data (nested object with form data)
const isPanelData = (value: any): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  
  // Panel data usually contains form field values
  const keys = Object.keys(value)
  return keys.length > 0 && keys.some(key => 
    typeof value[key] === 'string' || 
    typeof value[key] === 'number' || 
    typeof value[key] === 'boolean' ||
    Array.isArray(value[key])
  )
}

// Helper function to detect Table data (structured table with rows/columns)
const isTableData = (value: any): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  
  // Table data may have rows property or be structured data
  return 'rows' in value || Object.keys(value).length > 2
}

// Helper function to detect Tree data
const isTreeData = (value: any): boolean => {
  if (typeof value !== 'object' || value === null) return false
  
  // Tree data usually has tree structure with nodes
  return 'tree' in value || ('nodes' in value) || ('children' in value)
}

// Helper function to format component display
const formatComponentInfo = (component: any): string => {
  const type = component.type || 'unknown'
  const label = component.label || component.key || type
  const key = component.key || ''
  
  return `${label} (${type}${key ? ` - ${key}` : ''})`
}

// Lifecycle
onMounted(() => {
  loadSubmissions()
})

const openDeleteModal = (submission: Submission) => {
  submissionToDelete.value = submission
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  submissionToDelete.value = null
}

const confirmDelete = async () => {
  if (!submissionToDelete.value) return
  try {
    const id = submissionToDelete.value.id
    const result = await submissionsStore.deleteSubmission(id)
    if (result.success) {
      submissions.value = submissions.value.filter((s) => s.id !== id)
      success(t('common.success'))
      if (submissions.value.length === 0 && pagination.value.current_page > 1) {
        loadSubmissions(pagination.value.current_page - 1)
      }
    } else {
      showError(result.error || t('common.error'))
    }
  } catch (e) {
    showError(t('common.error'))
  } finally {
    closeDeleteModal()
  }
}
</script>

<style scoped>
.user-submissions-container {
  min-height: 100vh;
}

/* Enhanced animations and transitions */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom backdrop blur for better browser support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Enhanced focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(147 51 234 / 0.5);
}

/* Enhanced button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Loading spinner enhancement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Mobile responsiveness improvements */
@media (max-width: 640px) {
  .backdrop-blur-sm {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: rgba(255, 255, 255, 0.95);
  }
}

/* Print styles */
@media print {
  .user-submissions-container {
    background: white !important;
  }

  .backdrop-blur-sm {
    background: white !important;
    backdrop-filter: none !important;
  }
}
</style>
