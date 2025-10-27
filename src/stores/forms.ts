import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient, type Form, type PaginatedResponse } from '@/services/apiClient'

export const useFormsStore = defineStore('forms', () => {
  // State
  const forms = ref<Form[]>([])
  const publicForms = ref<Form[]>([])
  const currentForm = ref<Form | null>(null)
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
  const publishedForms = computed(() =>
    forms.value.filter(form => form.status === 'published')
  )

  const draftForms = computed(() =>
    forms.value.filter(form => form.status === 'draft')
  )

  const archivedForms = computed(() =>
    forms.value.filter(form => form.status === 'archived')
  )

  const totalForms = computed(() => forms.value.length)

  // Actions
  const fetchForms = async (params?: {
    page?: number
    per_page?: number
    status?: string
    language?: string
    search?: string
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getForms(params)

      if (response.success && response.data) {
        forms.value = response.data.data
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
        error.value = response.error || 'Failed to fetch forms'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const fetchPublicForms = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getPublicForms()

      if (response.success && response.data) {
        publicForms.value = response.data
        return { success: true }
      } else {
        error.value = response.error || 'Failed to fetch public forms'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const fetchForm = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getForm(id)

      if (response.success && response.data) {
        currentForm.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to fetch form'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const fetchPublicForm = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getPublicForm(id)

      if (response.success && response.data) {
        currentForm.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to fetch public form'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const submitPublicForm = async (formId: number, data: any) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.submitPublicForm(formId, data)

      if (response.success) {
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

  const createForm = async (formData: Partial<Form>) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.createForm(formData)

      if (response.success && response.data) {
        forms.value.unshift(response.data)
        currentForm.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to create form'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const updateForm = async (id: number, formData: Partial<Form>) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.updateForm(id, formData)

      if (response.success && response.data) {
        const index = forms.value.findIndex(form => form.id === id)
        if (index !== -1) {
          forms.value[index] = response.data
        }
        if (currentForm.value?.id === id) {
          currentForm.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to update form'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteForm = async (id: number) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.deleteForm(id)

      if (response.success) {
        forms.value = forms.value.filter(form => form.id !== id)
        if (currentForm.value?.id === id) {
          currentForm.value = null
        }
        return { success: true }
      } else {
        error.value = response.error || 'Failed to delete form'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const duplicateForm = async (id: number, newTitle?: string) => {
    const form = forms.value.find(f => f.id === id)
    if (!form) {
      return { success: false, error: 'Form not found' }
    }

    const duplicatedFormData = {
      title: newTitle || `${form.title} (Copy)`,
      title_ar: form.title_ar ? `${form.title_ar} (نسخة)` : undefined,
      description: form.description,
      description_ar: form.description_ar,
      schema: form.schema,
      display: form.display,
      status: 'draft' as const,
      language: form.language,
      is_public: false,
      allow_anonymous: form.allow_anonymous
    }

    return await createForm(duplicatedFormData)
  }

  const publishForm = async (id: number) => {
    return await updateForm(id, { status: 'published' })
  }

  const archiveForm = async (id: number) => {
    return await updateForm(id, { status: 'archived' })
  }

  const restoreForm = async (id: number) => {
    return await updateForm(id, { status: 'draft' })
  }

  const searchForms = async (query: string, filters?: {
    status?: string
    language?: string
  }) => {
    return await fetchForms({
      search: query,
      ...filters
    })
  }

  const getFormByTitle = (title: string) => {
    return forms.value.find(form =>
      form.title.toLowerCase().includes(title.toLowerCase()) ||
      (form.title_ar && form.title_ar.includes(title))
    )
  }

  const clearCurrentForm = () => {
    currentForm.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    forms.value = []
    publicForms.value = []
    currentForm.value = null
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
    forms,
    publicForms,
    currentForm,
    isLoading,
    isSubmitting,
    error,
    pagination,

    // Getters
    publishedForms,
    draftForms,
    archivedForms,
    totalForms,

    // Actions
    fetchForms,
    fetchPublicForms,
    fetchForm,
    fetchPublicForm,
    submitPublicForm,
    createForm,
    updateForm,
    deleteForm,
    duplicateForm,
    publishForm,
    archiveForm,
    restoreForm,
    searchForms,
    getFormByTitle,
    clearCurrentForm,
    clearError,
    resetStore
  }
})
