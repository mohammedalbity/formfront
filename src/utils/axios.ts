// Axios-like implementation using fetch API
// This is a fallback when axios is not available

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: AxiosRequestConfig
}

export class AxiosError<T = any> extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse<T>
  isAxiosError: boolean = true

  constructor(message: string, config: AxiosRequestConfig, code?: string, request?: any, response?: AxiosResponse<T>) {
    super(message)
    this.name = 'AxiosError'
    this.config = config
    this.code = code
    this.request = request
    this.response = response
  }
}

export interface AxiosRequestConfig {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  baseURL?: string
  headers?: Record<string, string>
  data?: any
  params?: Record<string, any>
  timeout?: number
  withCredentials?: boolean
}

export interface AxiosInstance {
  defaults: AxiosRequestConfig
  interceptors: {
    request: {
      use: (onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>) => void
    }
    response: {
      use: (
        onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
        onRejected?: (error: AxiosError) => any
      ) => void
    }
  }
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>
}

class AxiosImplementation implements AxiosInstance {
  defaults: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  }

  private requestInterceptors: Array<(config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>> = []
  private responseInterceptors: Array<{
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
    onRejected?: (error: AxiosError) => any
  }> = []

  interceptors = {
    request: {
      use: (onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>) => {
        if (onFulfilled) {
          this.requestInterceptors.push(onFulfilled)
        }
      }
    },
    response: {
      use: (
        onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
        onRejected?: (error: AxiosError) => any
      ) => {
        this.responseInterceptors.push({ onFulfilled, onRejected })
      }
    }
  }

  private async processRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    let processedConfig = { ...this.defaults, ...config }
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig)
    }
    
    return processedConfig
  }

  private async processResponse(response: AxiosResponse): Promise<AxiosResponse> {
    let processedResponse = response
    
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        processedResponse = await interceptor.onFulfilled(processedResponse)
      }
    }
    
    return processedResponse
  }

  private async processError(error: AxiosError): Promise<any> {
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onRejected) {
        return await interceptor.onRejected(error)
      }
    }
    throw error
  }

  private createAxiosError(message: string, config: AxiosRequestConfig, response?: Response): AxiosError {
    const axiosResponse = response ? {
      data: null,
      status: response.status,
      statusText: response.statusText,
      headers: {},
      config
    } : undefined
    
    return new AxiosError(message, config, undefined, undefined, axiosResponse)
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const processedConfig = await this.processRequest(config)
      
      const url = processedConfig.baseURL 
        ? `${processedConfig.baseURL}${processedConfig.url || ''}`
        : processedConfig.url || ''

      // Add query parameters
      const finalUrl = new URL(url)
      if (processedConfig.params) {
        Object.entries(processedConfig.params).forEach(([key, value]) => {
          finalUrl.searchParams.append(key, String(value))
        })
      }

      const fetchOptions: RequestInit = {
        method: processedConfig.method || 'GET',
        headers: processedConfig.headers,
        credentials: 'same-origin',
      }

      if (processedConfig.data && processedConfig.method !== 'GET') {
        fetchOptions.body = typeof processedConfig.data === 'string' 
          ? processedConfig.data 
          : JSON.stringify(processedConfig.data)
      }

      const controller = new AbortController()
      if (processedConfig.timeout) {
        setTimeout(() => controller.abort(), processedConfig.timeout)
      }
      fetchOptions.signal = controller.signal

      const response = await fetch(finalUrl.toString(), fetchOptions)
      
      let data: T
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text() as any
      }

      if (!response.ok) {
        const error = this.createAxiosError(
          `Request failed with status ${response.status}`,
          processedConfig,
          response
        )
        error.response!.data = data
        return await this.processError(error)
      }

      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })

      const axiosResponse: AxiosResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
        config: processedConfig
      }

      return await this.processResponse(axiosResponse)
    } catch (error) {
      if (error instanceof Error && 'isAxiosError' in error) {
        return await this.processError(error as AxiosError)
      }
      
      const axiosError = this.createAxiosError(
        error instanceof Error ? error.message : 'Network Error',
        config
      )
      return await this.processError(axiosError)
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }
}

// Create default instance
const axios = new AxiosImplementation()

// Add isAxiosError utility function
const isAxiosError = (error: any): error is AxiosError => {
  return error && typeof error === 'object' && error.isAxiosError === true
}

// Attach isAxiosError to axios instance
;(axios as any).isAxiosError = isAxiosError

// Create function to create new instances
const create = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = new AxiosImplementation()
  if (config) {
    instance.defaults = { ...instance.defaults, ...config }
  }
  // Attach isAxiosError to new instances too
  ;(instance as any).isAxiosError = isAxiosError
  return instance
}

export default axios
export { create, isAxiosError }
