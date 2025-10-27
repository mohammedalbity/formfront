// Form API Service for managing form schemas
export interface FormSchema {
  id?: string
  title: string
  name: string
  path: string
  components: FormComponent[]
  settings?: any
  createdAt?: string
  updatedAt?: string
}

export interface FormComponent {
  type: string
  key: string
  label: string
  input?: boolean
  placeholder?: string
  required?: boolean
  validate?: any
  conditional?: any
  disabled?: boolean
  hidden?: boolean
  customClass?: string
  description?: string
  rows?: number
  data?: any
  values?: any[]
  action?: string
  theme?: string
  [key: string]: any
}

export interface FormSubmission {
  id?: string
  formId: string
  data: Record<string, any>
  submittedAt: string
  userAgent?: string
  ipAddress?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class FormApiService {
  private baseUrl = '/api/forms'
  private storageKey = 'formio_forms'
  private submissionsKey = 'formio_submissions'

  // Initialize localStorage if not exists
  private initStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (!localStorage.getItem(this.storageKey)) {
          localStorage.setItem(this.storageKey, JSON.stringify([]))
        }
        if (!localStorage.getItem(this.submissionsKey)) {
          localStorage.setItem(this.submissionsKey, JSON.stringify([]))
        }
      }
    } catch (error) {
      console.warn('localStorage not available:', error)
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Get all forms from localStorage
  private getFormsFromStorage(): FormSchema[] {
    this.initStorage()
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      }
      return []
    } catch (error) {
      console.error('Error parsing forms from localStorage:', error)
      return []
    }
  }

  // Save forms to localStorage
  private saveFormsToStorage(forms: FormSchema[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(forms))
      }
    } catch (error) {
      console.error('Error saving forms to localStorage:', error)
      throw new Error('Failed to save forms to local storage')
    }
  }

  // Get all submissions from localStorage
  private getSubmissions(): FormSubmission[] {
    this.initStorage()
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(localStorage.getItem(this.submissionsKey) || '[]')
      }
      return []
    } catch (error) {
      console.error('Error parsing submissions from localStorage:', error)
      return []
    }
  }

  // Save submissions to localStorage
  private saveSubmissions(submissions: FormSubmission[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.submissionsKey, JSON.stringify(submissions))
      }
    } catch (error) {
      console.error('Error saving submissions to localStorage:', error)
      throw new Error('Failed to save submissions to local storage')
    }
  }

  // Simulate API delay
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Create a new form
  async createForm(formData: Omit<FormSchema, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FormSchema>> {
    try {
      await this.delay()
      
      const forms = this.getFormsFromStorage()
      
      // Check if form name already exists
      if (forms.some(form => form.name === formData.name)) {
        return {
          success: false,
          error: 'Form with this name already exists'
        }
      }

      const newForm: FormSchema = {
        ...formData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      forms.push(newForm)
      this.saveFormsToStorage(forms)

      return {
        success: true,
        data: newForm,
        message: 'Form created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create form'
      }
    }
  }

  // Get all forms
  async getForms(): Promise<ApiResponse<FormSchema[]>> {
    try {
      await this.delay(200)
      
      const forms = this.getFormsFromStorage()
      
      return {
        success: true,
        data: forms
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch forms'
      }
    }
  }

  // Get form by ID
  async getFormById(id: string): Promise<ApiResponse<FormSchema>> {
    try {
      await this.delay(200)
      
      const forms = this.getFormsFromStorage()
      const form = forms.find(f => f.id === id)
      
      if (!form) {
        return {
          success: false,
          error: 'Form not found'
        }
      }

      return {
        success: true,
        data: form
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch form'
      }
    }
  }

  // Get form by name
  async getFormByName(name: string): Promise<ApiResponse<FormSchema>> {
    try {
      await this.delay(200)
      
      const forms = this.getFormsFromStorage()
      const form = forms.find(f => f.name === name)
      
      if (!form) {
        return {
          success: false,
          error: 'Form not found'
        }
      }

      return {
        success: true,
        data: form
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch form'
      }
    }
  }

  // Update form
  async updateForm(id: string, formData: Partial<FormSchema>): Promise<ApiResponse<FormSchema>> {
    try {
      await this.delay()
      
      const forms = this.getFormsFromStorage()
      const formIndex = forms.findIndex(f => f.id === id)
      
      if (formIndex === -1) {
        return {
          success: false,
          error: 'Form not found'
        }
      }

      // Check if name is being changed and already exists
      if (formData.name && formData.name !== forms[formIndex].name) {
        if (forms.some(form => form.name === formData.name && form.id !== id)) {
          return {
            success: false,
            error: 'Form with this name already exists'
          }
        }
      }

      const updatedForm: FormSchema = {
        ...forms[formIndex],
        ...formData,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      }

      forms[formIndex] = updatedForm
      this.saveFormsToStorage(forms)

      return {
        success: true,
        data: updatedForm,
        message: 'Form updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update form'
      }
    }
  }

  // Delete form
  async deleteForm(id: string): Promise<ApiResponse<void>> {
    try {
      await this.delay()
      
      const forms = this.getFormsFromStorage()
      const formIndex = forms.findIndex(f => f.id === id)
      
      if (formIndex === -1) {
        return {
          success: false,
          error: 'Form not found'
        }
      }

      forms.splice(formIndex, 1)
      this.saveFormsToStorage(forms)

      // Also delete related submissions
      const submissions = this.getSubmissions()
      const filteredSubmissions = submissions.filter(s => s.formId !== id)
      this.saveSubmissions(filteredSubmissions)

      return {
        success: true,
        message: 'Form deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete form'
      }
    }
  }

  // Duplicate form
  async duplicateForm(id: string, newName?: string): Promise<ApiResponse<FormSchema>> {
    try {
      const formResponse = await this.getFormById(id)
      
      if (!formResponse.success || !formResponse.data) {
        return {
          success: false,
          error: 'Original form not found'
        }
      }

      const originalForm = formResponse.data
      const duplicatedForm = {
        ...originalForm,
        name: newName || `${originalForm.name}_copy`,
        title: `${originalForm.title} (Copy)`,
        path: newName || `${originalForm.path}_copy`
      }

      // Remove ID fields to create new form
      delete duplicatedForm.id
      delete duplicatedForm.createdAt
      delete duplicatedForm.updatedAt

      return await this.createForm(duplicatedForm)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to duplicate form'
      }
    }
  }

  // Submit form data
  async submitForm(formId: string, data: Record<string, any>): Promise<ApiResponse<FormSubmission>> {
    try {
      await this.delay()
      
      // Verify form exists
      const formResponse = await this.getFormById(formId)
      if (!formResponse.success) {
        return {
          success: false,
          error: 'Form not found'
        }
      }

      const submissions = this.getSubmissions()
      
      const newSubmission: FormSubmission = {
        id: this.generateId(),
        formId,
        data,
        submittedAt: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      }

      submissions.push(newSubmission)
      this.saveSubmissions(submissions)

      return {
        success: true,
        data: newSubmission,
        message: 'Form submitted successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit form'
      }
    }
  }

  // Get form submissions
  async getFormSubmissions(formId: string): Promise<ApiResponse<FormSubmission[]>> {
    try {
      await this.delay(200)
      
      const submissions = this.getSubmissions()
      const formSubmissions = submissions.filter(s => s.formId === formId)
      
      return {
        success: true,
        data: formSubmissions
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch submissions'
      }
    }
  }

  // Export form as JSON
  async exportForm(id: string): Promise<ApiResponse<string>> {
    try {
      const formResponse = await this.getFormById(id)
      
      if (!formResponse.success || !formResponse.data) {
        return {
          success: false,
          error: 'Form not found'
        }
      }

      const exportData = {
        form: formResponse.data,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }

      return {
        success: true,
        data: JSON.stringify(exportData, null, 2),
        message: 'Form exported successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export form'
      }
    }
  }

  // Import form from JSON
  async importForm(jsonData: string): Promise<ApiResponse<FormSchema>> {
    try {
      const importData = JSON.parse(jsonData)
      
      if (!importData.form || !importData.form.components) {
        return {
          success: false,
          error: 'Invalid form data format'
        }
      }

      const formData = importData.form
      
      // Remove ID fields to create new form
      delete formData.id
      delete formData.createdAt
      delete formData.updatedAt
      
      // Ensure unique name
      const forms = this.getFormsFromStorage()
      let baseName = formData.name || 'imported-form'
      let counter = 1
      let uniqueName = baseName
      
      while (forms.some(form => form.name === uniqueName)) {
        uniqueName = `${baseName}-${counter}`
        counter++
      }
      
      formData.name = uniqueName
      formData.path = uniqueName

      return await this.createForm(formData)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import form'
      }
    }
  }

  // Clear all data (for development/testing)
  async clearAllData(): Promise<ApiResponse<void>> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.storageKey)
        localStorage.removeItem(this.submissionsKey)
      }
      
      return {
        success: true,
        message: 'All data cleared successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear data'
      }
    }
  }

  // Get statistics
  async getStatistics(): Promise<ApiResponse<{
    totalForms: number
    totalSubmissions: number
    formsWithSubmissions: number
    averageSubmissionsPerForm: number
  }>> {
    try {
      const forms = this.getFormsFromStorage()
      const submissions = this.getSubmissions()
      
      const formsWithSubmissions = forms.filter(form => 
        submissions.some(sub => sub.formId === form.id)
      ).length
      
      const stats = {
        totalForms: forms.length,
        totalSubmissions: submissions.length,
        formsWithSubmissions,
        averageSubmissionsPerForm: forms.length > 0 ? submissions.length / forms.length : 0
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get statistics'
      }
    }
  }
}

// Export singleton instance
export const formApi = new FormApiService()
export default formApi
