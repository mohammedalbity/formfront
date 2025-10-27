// Authentication related TypeScript interfaces and types

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  role: 'admin' | 'user'
  language: 'en' | 'ar'
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  language: 'en' | 'ar'
}

export interface AuthResponse {
  user: User
  token?: string
  message?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  status?: number
}

export interface ValidationErrors {
  [key: string]: string[]
}

export interface AuthResult {
  success: boolean
  error?: string
  errors?: ValidationErrors
  canRetry?: boolean
  isNetworkError?: boolean
}

export interface UpdateProfileData {
  name?: string
  email?: string
  language?: 'en' | 'ar'
}

export interface ChangePasswordData {
  current_password: string
  password: string
  password_confirmation: string
}

// Error types
export interface NetworkError extends Error {
  code?: string
  status?: number
  response?: {
    data?: any
    status: number
    statusText: string
  }
}


export interface AuthError extends Error {
  code: 'AUTH_ERROR'
  status: 401 | 403
}

export interface ValidationError extends Error {
  code: 'VALIDATION_ERROR'
  status: 422
  errors: ValidationErrors
}

// Retry mechanism types
export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

export interface RetryState {
  count: number
  canRetry: boolean
  isRetrying: boolean
  lastError?: Error
}

// Error handler types
export interface ErrorHandlerState {
  hasError: boolean
  errorMessage: string
  errorType: 'network' | 'auth' | 'validation' | 'server' | 'unknown'
  canRetry: boolean
  isNetworkError: boolean
  isAuthError: boolean
  isValidationError: boolean
  retryCount: number
}


// Auth composable return type
export interface UseAuthReturn {
  // State
  user: Ref<User | null>
  isLoading: Ref<boolean>
  isRetrying: Ref<boolean>
  retryCount: Ref<number>
  
  // Computed
  isAuthenticated: ComputedRef<boolean>
  isAdmin: ComputedRef<boolean>
  userLanguage: ComputedRef<'en' | 'ar'>
  
  // Error handling
  hasError: ComputedRef<boolean>
  errorMessage: ComputedRef<string>
  canRetry: ComputedRef<boolean>
  isNetworkError: ComputedRef<boolean>
  isAuthError: ComputedRef<boolean>
  
  // Methods
  login: (credentials: LoginCredentials) => Promise<AuthResult>
  register: (userData: RegisterData) => Promise<AuthResult>
  logout: () => Promise<AuthResult>
  refreshUser: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<AuthResult>
  changePassword: (data: ChangePasswordData) => Promise<AuthResult>
  clearError: () => void
  initialize: () => Promise<void>
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  checkConnectivity: () => Promise<boolean>
  retryLastOperation: (operation: () => Promise<any>) => Promise<AuthResult>
}

// Import Vue types for composable
import type { Ref, ComputedRef } from 'vue'

// API Client types
export interface ApiClientConfig {
  baseURL: string
  timeout: number
  withCredentials: boolean
  headers: Record<string, string>
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

// Route guard types
export interface RouteGuardContext {
  to: any
  from: any
  next: (path?: string | false) => void
}

export interface AuthGuardConfig {
  requireAuth: boolean
  requireGuest: boolean
  requiredRoles?: string[]
  redirectTo?: string
}

// Form validation types
export interface FormField {
  value: any
  error: string | null
  touched: boolean
  dirty: boolean
}

export interface FormState {
  fields: Record<string, FormField>
  isValid: boolean
  isSubmitting: boolean
  hasErrors: boolean
}

// Language and localization types
export interface LocaleConfig {
  code: 'en' | 'ar'
  name: string
  direction: 'ltr' | 'rtl'
  flag: string
}

// Storage types
export interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

// Event types
export interface AuthEvent {
  type: 'login' | 'logout' | 'register' | 'profile_update' | 'password_change'
  user?: User
  timestamp: number
}

export interface ErrorEvent {
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown'
  error: Error
  context?: any
  timestamp: number
}

// Configuration types
export interface AppConfig {
  api: ApiClientConfig
  retry: RetryConfig
}
