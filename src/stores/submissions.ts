import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient, type FormSubmission, type PaginatedResponse } from '@/services/apiClient'

export const useSubmissionsStore = defineStore('submissions', () => {
  // State
  const submissions = ref<FormSubmission[]>([])
  const currentSubmission = ref<FormSubmission | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  })

  // Getters
  const submittedSubmissions = computed(() => 
    submissions.value.filter(submission => submission.status === 'submitted')
  )
  
  const reviewedSubmissions = computed(() => 
    submissions.value.filter(submission => submission.status === 'reviewed')
  )
  
  const approvedSubmissions = computed(() => 
    submissions.value.filter(submission => submission.status === 'approved')
  )
  
  const rejectedSubmissions = computed(() => 
    submissions.value.filter(submission => submission.status === 'rejected')
  )

  const totalSubmissions = computed(() => submissions.value.length)

  const submissionsByForm = computed(() => {
    const grouped: Record<number, FormSubmission[]> = {}
    submissions.value.forEach(submission => {
      if (!grouped[submission.form_id]) {
        grouped[submission.form_id] = []
      }
      grouped[submission.form_id].push(submission)
    })
    return grouped
  })

  // Actions
  const fetchSubmissions = async (params?: {
    page?: number
    per_page?: number
    form_id?: number
    status?: string
    from_date?: string
    to_date?: string
    user_search?: string
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getSubmissions(params)
      
      if (response.success && response.data) {
        submissions.value = response.data.data
        pagination.value = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        }
        return { success: true }
      } else {
        error.value = response.error || 'Failed to fetch submissions'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const fetchSubmission = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getSubmission(id)
      
      if (response.success && response.data) {
        currentSubmission.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to fetch submission'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const submitForm = async (formId: number, data: Record<string, any>, metadata?: Record<string, any>) => {
    isSubmitting.value = true
    error.value = null

    try {
      // Debug: Log the data being sent to API
      console.log('SubmissionsStore - Sending to API (Authenticated):', { formId, data, metadata })
      console.log('Data keys:', Object.keys(data || {}))
      console.log('Metadata:', metadata)
      console.log('User ID in metadata:', metadata?.user_id)
      
      const response = await apiClient.submitForm(formId, data, metadata)
      
      if (response.success && response.data) {
        submissions.value.unshift(response.data)
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to submit form'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const submitPublicForm = async (formId: number, data: Record<string, any>, metadata?: Record<string, any>) => {
    isSubmitting.value = true
    error.value = null

    try {
      // Debug: Log the data being sent to API
      console.log('SubmissionsStore - Sending to API (Public/Anonymous):', { formId, data, metadata })
      console.log('Data keys:', Object.keys(data || {}))
      console.log('Metadata:', metadata)
      console.log('User ID in metadata:', metadata?.user_id || 'Anonymous')
      
      const response = await apiClient.submitPublicForm(formId, data, metadata)
      
      if (response.success && response.data) {
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to submit public form'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const updateSubmission = async (id: number, submissionData: Partial<FormSubmission>) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.updateSubmission(id, submissionData)
      
      if (response.success && response.data) {
        const index = submissions.value.findIndex(submission => submission.id === id)
        if (index !== -1) {
          submissions.value[index] = response.data
        }
        if (currentSubmission.value?.id === id) {
          currentSubmission.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to update submission'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteSubmission = async (id: number) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.deleteSubmission(id)
      
      if (response.success) {
        submissions.value = submissions.value.filter(submission => submission.id !== id)
        if (currentSubmission.value?.id === id) {
          currentSubmission.value = null
        }
        return { success: true }
      } else {
        error.value = response.error || 'Failed to delete submission'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const reviewSubmission = async (id: number) => {
    return await updateSubmission(id, { status: 'reviewed' })
  }

  const approveSubmission = async (id: number) => {
    return await updateSubmission(id, { status: 'approved' })
  }

  const rejectSubmission = async (id: number) => {
    return await updateSubmission(id, { status: 'rejected' })
  }

  const getSubmissionsByForm = (formId: number) => {
    return submissions.value.filter(submission => submission.form_id === formId)
  }

  const getSubmissionsByStatus = (status: FormSubmission['status']) => {
    return submissions.value.filter(submission => submission.status === status)
  }

  const getSubmissionById = (id: number) => {
    return submissions.value.find(submission => submission.id === id)
  }

  const searchSubmissions = async (params: {
    form_id?: number
    status?: string
    page?: number
    from_date?: string
    to_date?: string
    user_search?: string
  }) => {
    return await fetchSubmissions(params)
  }

  const clearCurrentSubmission = () => {
    currentSubmission.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    submissions.value = []
    currentSubmission.value = null
    error.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    }
  }

  return {
    // State
    submissions,
    currentSubmission,
    isLoading,
    isSubmitting,
    error,
    pagination,
    
    // Getters
    submittedSubmissions,
    reviewedSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    totalSubmissions,
    submissionsByForm,
    
    // Actions
    fetchSubmissions,
    fetchSubmission,
    submitForm,
    submitPublicForm,
    updateSubmission,
    deleteSubmission,
    reviewSubmission,
    approveSubmission,
    rejectSubmission,
    getSubmissionsByForm,
    getSubmissionsByStatus,
    getSubmissionById,
    searchSubmissions,
    clearCurrentSubmission,
    clearError,
    resetStore
  }
})
