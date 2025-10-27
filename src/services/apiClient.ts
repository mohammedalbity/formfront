// API Client for Token-based Authentication
import axios, { AxiosError, create, isAxiosError } from '../utils/axios'
import type { AxiosInstance, AxiosResponse } from '../utils/axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://formend.fikra-ye.app'
const API_TIMEOUT = 10000

// Response interfaces
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Authentication interfaces
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  language?: string
  // NOTE: role is NOT allowed here - all new registrations are 'user' by default
  // Only admins can change roles through admin endpoints
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  language: string
  timezone?: string
  preferences?: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token?: string
  expires_at?: string
  two_factor?: boolean
}

// Form interfaces
export interface Form {
  id: number
  title: string
  title_ar?: string
  description?: string
  description_ar?: string
  schema: Record<string, any>
  display?: Record<string, any>
  status: 'draft' | 'published' | 'archived'
  language: string
  is_public: boolean
  allow_anonymous: boolean
  user_id: number
  created_at: string
  updated_at: string
  user?: User
  submissions_count?: number
}

export interface FormComponent {
  id: number
  type: string
  label: string
  label_ar?: string
  key: string
  properties: Record<string, any>
  validation?: Record<string, any>
  conditional?: Record<string, any>
  category: 'basic' | 'advanced' | 'layout'
  is_active: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface FormSubmission {
  id: number
  form_id: number
  data: Record<string, any>
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected'
  metadata?: Record<string, any>
  user_id?: number
  reviewer_id?: number
  reviewed_at?: string
  submitted_at: string
  created_at: string
  updated_at: string
  form?: Form
  user?: User
  reviewer?: User
}

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null
  private isInitialized: boolean = false

  constructor() {
    this.client = create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // Load stored token on initialization
    this.loadStoredToken()

    // Request interceptor to add Authorization header
    this.client.interceptors.request.use((config) => {
      // Add Authorization token to headers
      if (this.token && config.headers) {
        config.headers['Authorization'] = `Bearer ${this.token}`
      }

      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearAuthData()
          // Redirect to login if needed
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      },
    )
  }

  // Token management
  private loadStoredToken(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedToken = localStorage.getItem('api_token')
        if (storedToken) {
          this.token = storedToken
          this.isInitialized = true
        }
      }
    } catch (error) {
      console.warn('Failed to load stored token:', error)
    }
  }

  public setAuthToken(token: string): void {
    this.token = token
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('api_token', token)
      }
    } catch (error) {
      console.warn('Failed to save token to localStorage:', error)
    }
    this.isInitialized = true
  }

  public getAuthToken(): string | null {
    return this.token
  }

  public clearAuthData(): void {
    this.token = null
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('api_token')
        localStorage.removeItem('user_data')
      }
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
    this.isInitialized = false
  }

  // Initialize API client
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.loadStoredToken()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize API client:', error)
      throw error
    }
  }

  // Get current user data from storage
  public getCurrentUser(): User | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const userData = localStorage.getItem('user_data')
        return userData ? JSON.parse(userData) : null
      }
      return null
    } catch (error) {
      console.warn('Failed to get current user:', error)
      return null
    }
  }

  // Generic API methods
  private async handleRequest<T>(request: Promise<AxiosResponse>): Promise<ApiResponse<T>> {
    try {
      const response = await request
      return response.data
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      }
    }
  }

  // Authentication methods for Laravel Sanctum
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.handleRequest<AuthResponse>(this.client.post('/login', credentials))

    if (response.success && response.data) {
      // Store user data safely
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }
      } catch (error) {
        console.warn('Failed to save user data to localStorage:', error)
      }

      // Store API token for authentication
      if (response.data.token) {
        this.setAuthToken(response.data.token)
      }
    }

    return response
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.handleRequest<AuthResponse>(this.client.post('/register', userData))

    if (response.success && response.data) {
      // Store user data safely
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }
      } catch (error) {
        console.warn('Failed to save user data to localStorage:', error)
      }

      // Store API token for authentication
      if (response.data.token) {
        this.setAuthToken(response.data.token)
      }
    }

    return response
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.handleRequest<void>(this.client.post('/logout'))

      // Clear all auth data regardless of response
      this.clearAuthData()

      return response
    } catch (error) {
      // Clear auth data even if logout request fails
      this.clearAuthData()
      throw error
    }
  }

  async getUser(): Promise<ApiResponse<User>> {
    return this.handleRequest<User>(this.client.get('/user'))
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.handleRequest<User>(this.client.put('/profile', userData))
  }

  async changePassword(data: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(this.client.put('/change-password', data))
  }

  // Form methods
  async getForms(params?: {
    page?: number
    per_page?: number
    status?: string
    language?: string
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<Form>>> {
    // Clean undefined parameters to avoid sending them in URL
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    )
    return this.handleRequest<PaginatedResponse<Form>>(this.client.get('/forms', { params: cleanParams }))
  }

  async getPublicForms(): Promise<ApiResponse<Form[]>> {
    return this.handleRequest<Form[]>(this.client.get('/forms/public'))
  }

  async getForm(id: number): Promise<ApiResponse<Form>> {
    return this.handleRequest<Form>(this.client.get(`/forms/${id}`))
  }

  async getPublicForm(id: number): Promise<ApiResponse<Form>> {
    return this.handleRequest<Form>(this.client.get(`/forms/${id}/public`))
  }

  async createForm(formData: Partial<Form>): Promise<ApiResponse<Form>> {
    return this.handleRequest<Form>(this.client.post('/forms', formData))
  }

  async updateForm(id: number, formData: Partial<Form>): Promise<ApiResponse<Form>> {
    return this.handleRequest<Form>(this.client.put(`/forms/${id}`, formData))
  }

  async deleteForm(id: number): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(this.client.delete(`/forms/${id}`))
  }

  // Form Components methods
  async getComponents(params?: {
    category?: string
    language?: string
    active?: boolean
  }): Promise<ApiResponse<FormComponent[]>> {
    return this.handleRequest<FormComponent[]>(this.client.get('/components', { params }))
  }

  async getComponent(id: number): Promise<ApiResponse<FormComponent>> {
    return this.handleRequest<FormComponent>(this.client.get(`/components/${id}`))
  }

  async createComponent(
    componentData: Partial<FormComponent>,
  ): Promise<ApiResponse<FormComponent>> {
    return this.handleRequest<FormComponent>(this.client.post('/components', componentData))
  }

  async updateComponent(
    id: number,
    componentData: Partial<FormComponent>,
  ): Promise<ApiResponse<FormComponent>> {
    return this.handleRequest<FormComponent>(this.client.put(`/components/${id}`, componentData))
  }

  async deleteComponent(id: number): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(this.client.delete(`/components/${id}`))
  }

  // Form Submissions methods
  async getSubmissions(params?: {
    page?: number
    per_page?: number
    form_id?: number
    status?: string
    from_date?: string
    to_date?: string
    user_search?: string
  }): Promise<ApiResponse<PaginatedResponse<FormSubmission>>> {
    return this.handleRequest<PaginatedResponse<FormSubmission>>(
      this.client.get('/submissions', { params }),
    )
  }

  async getSubmission(id: number): Promise<ApiResponse<FormSubmission>> {
    return this.handleRequest<FormSubmission>(this.client.get(`/submissions/${id}`))
  }

  async submitForm(
    formId: number,
    data: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<ApiResponse<FormSubmission>> {
    return this.handleRequest<FormSubmission>(
      this.client.post(`/forms/${formId}/submit`, { data, metadata }),
    )
  }

  async submitPublicForm(
    formId: number,
    data: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<ApiResponse<FormSubmission>> {
    return this.handleRequest<FormSubmission>(
      this.client.post(`/forms/${formId}/submit/public`, { data, metadata }),
    )
  }

  async getUserSubmissions(params?: {
    page?: number
    per_page?: number
    status?: string
  }): Promise<ApiResponse<PaginatedResponse<FormSubmission>>> {
    return this.handleRequest<PaginatedResponse<FormSubmission>>(
      this.client.get('/my-submissions', { params }),
    )
  }

  async updateSubmission(
    id: number,
    submissionData: Partial<FormSubmission>,
  ): Promise<ApiResponse<FormSubmission>> {
    return this.handleRequest<FormSubmission>(this.client.put(`/submissions/${id}`, submissionData))
  }

  async deleteSubmission(id: number): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(this.client.delete(`/submissions/${id}`))
  }

  // Utility methods
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.handleRequest<{ status: string; timestamp: string }>(this.client.get('/health'))
  }

  // Generic HTTP methods for direct API calls
  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(this.client.get(url, config))
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(this.client.post(url, data, config))
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(this.client.put(url, data, config))
  }

  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(this.client.delete(url, config))
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(this.client.patch(url, data, config))
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const userData = localStorage.getItem('user_data')
    return !!userData
  }

  // Get API token (if available)
  getApiToken(): string | null {
    return localStorage.getItem('api_token')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
