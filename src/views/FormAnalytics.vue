<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="$router.back()"
          class="mb-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <svg class="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ $t('common.back') || 'رجوع' }}
        </button>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('analytics.title') || 'تحليلات النموذج' }}</h1>
        <p v-if="formData" class="text-gray-600 mt-2">{{ formData.title || formData.title_ar }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Analytics Content -->
      <div v-else-if="analytics" class="space-y-6">
        <!-- Basic Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Total Submissions -->
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('analytics.totalSubmissions') || 'إجمالي الإرسالات' }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ analytics.basic_stats.total_submissions }}</p>
              </div>
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Status Breakdown -->
          <div
            v-for="status in analytics.basic_stats.status_breakdown"
            :key="status.status"
            class="bg-white rounded-xl shadow-lg p-6 border-l-4"
            :class="{
              'border-yellow-500': status.status === 'submitted',
              'border-blue-500': status.status === 'reviewed',
              'border-green-500': status.status === 'approved',
              'border-red-500': status.status === 'rejected'
            }"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ getStatusLabel(status.status) }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ status.count }}</p>
              </div>
              <div
                class="rounded-full p-3"
                :class="{
                  'bg-yellow-100': status.status === 'submitted',
                  'bg-blue-100': status.status === 'reviewed',
                  'bg-green-100': status.status === 'approved',
                  'bg-red-100': status.status === 'rejected'
                }"
              >
                <svg class="w-8 h-8" :class="{
                  'text-yellow-600': status.status === 'submitted',
                  'text-blue-600': status.status === 'reviewed',
                  'text-green-600': status.status === 'approved',
                  'text-red-600': status.status === 'rejected'
                }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Submissions Timeline Chart -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('analytics.submissionsTimeline') || 'الإرسالات حسب التاريخ' }}</h3>
          <div class="space-y-2">
            <div
              v-for="item in analytics.basic_stats.submissions_by_date.slice(0, 10)"
              :key="item.date"
              class="flex items-center"
            >
              <span class="text-sm text-gray-600 w-32">{{ formatDate(item.date) }}</span>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full flex items-center justify-end px-2"
                    :style="{ width: `${(item.count / maxSubmissionsPerDay) * 100}%` }"
                  >
                    <span class="text-xs text-white font-semibold">{{ item.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Field Analysis -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">{{ $t('analytics.fieldAnalysis') || 'تحليل الحقول' }}</h3>
          <div class="space-y-6">
            <div
              v-for="field in analytics.field_analysis"
              :key="field.field_key"
              class="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors"
            >
              <!-- Field Header -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="text-lg font-semibold text-gray-800">{{ field.field_label }}</h4>
                  <p class="text-sm text-gray-500">{{ field.field_type }} • {{ field.field_key }}</p>
                </div>
                <span class="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {{ field.total_responses }} {{ $t('analytics.responses') || 'إجابة' }}
                </span>
              </div>

              <!-- Checkbox Analysis (Yes/No) -->
              <div v-if="field.field_type === 'checkbox'" class="grid grid-cols-2 gap-4">
                <div class="bg-green-50 rounded-lg p-4 text-center">
                  <p class="text-sm text-gray-600">{{ $t('analytics.yes') || 'نعم' }}</p>
                  <p class="text-2xl font-bold text-green-600">{{ field.yes_count }}</p>
                  <p class="text-xs text-gray-500">{{ getPercentage(field.yes_count, field.total_responses) }}%</p>
                </div>
                <div class="bg-red-50 rounded-lg p-4 text-center">
                  <p class="text-sm text-gray-600">{{ $t('analytics.no') || 'لا' }}</p>
                  <p class="text-2xl font-bold text-red-600">{{ field.no_count }}</p>
                  <p class="text-xs text-gray-500">{{ getPercentage(field.no_count, field.total_responses) }}%</p>
                </div>
              </div>

              <!-- Choice Field Analysis (Radio, Select) -->
              <div v-else-if="field.value_distribution" class="space-y-2">
                <div
                  v-for="(count, value) in field.value_distribution"
                  :key="value"
                  class="flex items-center"
                >
                  <span class="text-sm text-gray-700 w-40 truncate">{{ value }}</span>
                  <div class="flex-1 mx-3">
                    <div class="bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div
                        class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full flex items-center justify-end px-2"
                        :style="{ width: `${(count / field.total_responses) * 100}%` }"
                      >
                        <span class="text-xs text-white font-semibold">{{ count }}</span>
                      </div>
                    </div>
                  </div>
                  <span class="text-sm text-gray-600 w-16 text-right">{{ getPercentage(count, field.total_responses) }}%</span>
                </div>
              </div>

              <!-- Number Field Analysis -->
              <div v-else-if="field.field_type === 'number' && field.min !== undefined" class="grid grid-cols-4 gap-4">
                <div class="bg-blue-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-600">{{ $t('analytics.min') || 'الأدنى' }}</p>
                  <p class="text-xl font-bold text-blue-600">{{ field.min }}</p>
                </div>
                <div class="bg-green-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-600">{{ $t('analytics.max') || 'الأعلى' }}</p>
                  <p class="text-xl font-bold text-green-600">{{ field.max }}</p>
                </div>
                <div class="bg-purple-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-600">{{ $t('analytics.average') || 'المتوسط' }}</p>
                  <p class="text-xl font-bold text-purple-600">{{ field.average.toFixed(2) }}</p>
                </div>
                <div class="bg-indigo-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-600">{{ $t('analytics.median') || 'الوسيط' }}</p>
                  <p class="text-xl font-bold text-indigo-600">{{ field.median }}</p>
                </div>
              </div>

              <!-- Text Field Analysis -->
              <div v-else-if="field.filled_count !== undefined" class="grid grid-cols-2 gap-4">
                <div class="bg-indigo-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-600">{{ $t('analytics.filledResponses') || 'إجابات مكتملة' }}</p>
                  <p class="text-xl font-bold text-indigo-600">{{ field.filled_count }}</p>
                </div>
                <div class="bg-purple-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-600">{{ $t('analytics.avgLength') || 'متوسط الطول' }}</p>
                  <p class="text-xl font-bold text-purple-600">{{ field.average_length }}</p>
                </div>
              </div>

              <!-- Empty Responses -->
              <div v-if="field.empty_responses > 0" class="mt-3 text-sm text-gray-500">
                <span class="inline-flex items-center">
                  <svg class="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {{ field.empty_responses }} {{ $t('analytics.emptyResponses') || 'إجابة فارغة' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Submissions -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('analytics.recentSubmissions') || 'أحدث الإرسالات' }}</h3>
          <div class="space-y-3">
            <div
              v-for="submission in analytics.recent_submissions"
              :key="submission.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3 rtl:space-x-reverse">
                <div class="bg-indigo-100 rounded-full p-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ getUserName(submission) }}</p>
                  <p class="text-sm text-gray-500">{{ formatDateTime(submission.submitted_at) }}</p>
                </div>
              </div>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': submission.status === 'submitted',
                  'bg-blue-100 text-blue-800': submission.status === 'reviewed',
                  'bg-green-100 text-green-800': submission.status === 'approved',
                  'bg-red-100 text-red-800': submission.status === 'rejected'
                }"
              >
                {{ getStatusLabel(submission.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800 font-medium">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { apiClient } from '@/services/apiClient'

const route = useRoute()
const { t } = useI18n()

const isLoading = ref(true)
const error = ref('')
const analytics = ref<any>(null)
const formData = ref<any>(null)

const maxSubmissionsPerDay = computed(() => {
  if (!analytics.value?.basic_stats?.submissions_by_date) return 1
  return Math.max(...analytics.value.basic_stats.submissions_by_date.map((item: any) => item.count))
})

// Helper function to extract user information (same as FormSubmissions)
const getUserName = (submission: any): string => {
  // Check metadata first (new structure)
  if (submission.metadata?.user_name) {
    return submission.metadata.user_name
  }
  // Fallback to user object (old structure)
  if (submission.user?.name) {
    return submission.user.name
  }
  // Return anonymous text
  return t('analytics.anonymous') || 'مجهول'
}

const fetchAnalytics = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const formId = route.params.id
    const response = await apiClient.get(`/forms/${formId}/analytics`)

    if (response.success) {
      analytics.value = response.data
      formData.value = response.data.form
    }
  } catch (err: any) {
    console.error('Error fetching analytics:', err)
    error.value = err.response?.data?.message || t('common.error')
  } finally {
    isLoading.value = false
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    submitted: t('analytics.submitted') || 'مُرسل',
    reviewed: t('analytics.reviewed') || 'تم المراجعة',
    approved: t('analytics.approved') || 'موافق عليه',
    rejected: t('analytics.rejected') || 'مرفوض'
  }
  return labels[status] || status
}

const getPercentage = (value: number, total: number) => {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(1)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchAnalytics()
})
</script>
