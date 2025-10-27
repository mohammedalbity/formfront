import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient, type FormComponent } from '@/services/apiClient'

export const useComponentsStore = defineStore('components', () => {
  // State
  const components = ref<FormComponent[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const basicComponents = computed(() => 
    components.value.filter(component => component.category === 'basic' && component.is_active)
  )
  
  const advancedComponents = computed(() => 
    components.value.filter(component => component.category === 'advanced' && component.is_active)
  )
  
  const layoutComponents = computed(() => 
    components.value.filter(component => component.category === 'layout' && component.is_active)
  )

  const activeComponents = computed(() => 
    components.value.filter(component => component.is_active)
  )

  const systemComponents = computed(() => 
    components.value.filter(component => component.is_system)
  )

  const customComponents = computed(() => 
    components.value.filter(component => !component.is_system)
  )

  const componentsByCategory = computed(() => ({
    basic: basicComponents.value,
    advanced: advancedComponents.value,
    layout: layoutComponents.value
  }))

  // Actions
  const fetchComponents = async (params?: {
    category?: string
    language?: string
    active?: boolean
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getComponents(params)
      
      if (response.success && response.data) {
        components.value = response.data
        return { success: true }
      } else {
        error.value = response.error || 'Failed to fetch components'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const fetchComponent = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getComponent(id)
      
      if (response.success && response.data) {
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to fetch component'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const createComponent = async (componentData: Partial<FormComponent>) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.createComponent(componentData)
      
      if (response.success && response.data) {
        components.value.push(response.data)
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to create component'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const updateComponent = async (id: number, componentData: Partial<FormComponent>) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.updateComponent(id, componentData)
      
      if (response.success && response.data) {
        const index = components.value.findIndex(component => component.id === id)
        if (index !== -1) {
          components.value[index] = response.data
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.error || 'Failed to update component'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteComponent = async (id: number) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await apiClient.deleteComponent(id)
      
      if (response.success) {
        components.value = components.value.filter(component => component.id !== id)
        return { success: true }
      } else {
        error.value = response.error || 'Failed to delete component'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  const getComponentsByCategory = (category: 'basic' | 'advanced' | 'layout') => {
    return components.value.filter(component => 
      component.category === category && component.is_active
    )
  }

  const getComponentByType = (type: string) => {
    return components.value.find(component => component.type === type)
  }

  const getLocalizedComponents = (language: string = 'en') => {
    return components.value.map(component => ({
      ...component,
      label: language === 'ar' && component.label_ar ? component.label_ar : component.label
    }))
  }

  const searchComponents = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return components.value.filter(component =>
      component.label.toLowerCase().includes(lowercaseQuery) ||
      (component.label_ar && component.label_ar.includes(query)) ||
      component.type.toLowerCase().includes(lowercaseQuery) ||
      component.key.toLowerCase().includes(lowercaseQuery)
    )
  }

  const toggleComponentStatus = async (id: number) => {
    const component = components.value.find(c => c.id === id)
    if (!component) {
      return { success: false, error: 'Component not found' }
    }

    return await updateComponent(id, { is_active: !component.is_active })
  }

  const duplicateComponent = async (id: number, newKey?: string) => {
    const component = components.value.find(c => c.id === id)
    if (!component) {
      return { success: false, error: 'Component not found' }
    }

    const duplicatedComponentData = {
      type: component.type,
      label: `${component.label} (Copy)`,
      label_ar: component.label_ar ? `${component.label_ar} (نسخة)` : undefined,
      key: newKey || `${component.key}_copy`,
      properties: { ...component.properties },
      validation: component.validation ? { ...component.validation } : undefined,
      conditional: component.conditional ? { ...component.conditional } : undefined,
      category: component.category,
      is_active: true,
      is_system: false
    }

    return await createComponent(duplicatedComponentData)
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    components.value = []
    error.value = null
  }

  return {
    // State
    components,
    isLoading,
    isSubmitting,
    error,
    
    // Getters
    basicComponents,
    advancedComponents,
    layoutComponents,
    activeComponents,
    systemComponents,
    customComponents,
    componentsByCategory,
    
    // Actions
    fetchComponents,
    fetchComponent,
    createComponent,
    updateComponent,
    deleteComponent,
    getComponentsByCategory,
    getComponentByType,
    getLocalizedComponents,
    searchComponents,
    toggleComponentStatus,
    duplicateComponent,
    clearError,
    resetStore
  }
})
