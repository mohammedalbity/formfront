// API related TypeScript interfaces and types

export interface ApiError {
  message: string
  code?: string | number
  status?: number
  errors?: Record<string, string[]>
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  meta?: any
}

export interface ApiErrorResponse {
  success: false
  error: string
  message?: string
  errors?: Record<string, string[]>
  status?: number
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// HTTP Client types
export interface HttpClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
}

export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
  signal?: AbortSignal
}

export interface HttpResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

// Interceptor types
export interface RequestInterceptor {
  onFulfilled?: (config: any) => any | Promise<any>
  onRejected?: (error: any) => any | Promise<any>
}

export interface ResponseInterceptor {
  onFulfilled?: (response: any) => any | Promise<any>
  onRejected?: (error: any) => any | Promise<any>
}

// Form.io related API types
export interface FormSchema {
  components: FormComponent[]
  display?: string
  type?: string
  title?: string
  name?: string
  path?: string
}

export interface FormComponent {
  type: string
  key: string
  label?: string
  input?: boolean
  placeholder?: string
  description?: string
  validate?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: string
  }
  conditional?: {
    show?: boolean
    when?: string
    eq?: any
  }
  properties?: Record<string, any>
}

export interface FormSubmission {
  id?: string
  data: Record<string, any>
  form?: string
  created?: string
  modified?: string
  state?: 'submitted' | 'draft'
}

// File upload types
export interface UploadResponse {
  success: boolean
  file?: {
    id: string
    name: string
    size: number
    type: string
    url: string
  }
  error?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// WebSocket types (for real-time features)
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

export interface WebSocketConfig {
  url: string
  protocols?: string[]
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

// Cache types
export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
}

export interface CacheConfig {
  defaultTTL: number
  maxSize: number
  strategy: 'lru' | 'fifo' | 'ttl'
}

// Rate limiting types
export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  skipSuccessfulRequests?: boolean
}

export interface RateLimitState {
  requests: number
  resetTime: number
  remaining: number
}
