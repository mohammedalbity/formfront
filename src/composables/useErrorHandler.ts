// Composable for Error Handling and Network Failures
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ErrorState {
  hasError: boolean
  errorMessage: string | null
  errorCode: string | null
  isNetworkError: boolean
  isAuthError: boolean
  canRetry: boolean
}

export const useErrorHandler = () => {
  const { t } = useI18n()
  
  // Error state
  const errorState = ref<ErrorState>({
    hasError: false,
    errorMessage: null,
    errorCode: null,
    isNetworkError: false,
    isAuthError: false,
    canRetry: false
  })

  // Computed properties
  const hasError = computed(() => errorState.value.hasError)
  const errorMessage = computed(() => errorState.value.errorMessage)
  const canRetry = computed(() => errorState.value.canRetry)
  const isNetworkError = computed(() => errorState.value.isNetworkError)
  const isAuthError = computed(() => errorState.value.isAuthError)

  // Clear error state
  const clearError = () => {
    errorState.value = {
      hasError: false,
      errorMessage: null,
      errorCode: null,
      isNetworkError: false,
      isAuthError: false,
      canRetry: false
    }
  }

  // Handle different types of errors
  const handleError = async (error: any): Promise<ErrorState> => {
    clearError()

    // Network/Connection errors
    if (!navigator.onLine) {
      errorState.value = {
        hasError: true,
        errorMessage: t('errors.offline'),
        errorCode: 'OFFLINE',
        isNetworkError: true,
        isAuthError: false,
        canRetry: true
      }
      return errorState.value
    }

    // Axios/HTTP errors
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 401:
          errorState.value = {
            hasError: true,
            errorMessage: data.message || t('errors.unauthorized'),
            errorCode: 'UNAUTHORIZED',
            isNetworkError: false,
            isAuthError: true,
                canRetry: false
          }
          break

        case 403:
          errorState.value = {
            hasError: true,
            errorMessage: data.message || t('errors.forbidden'),
            errorCode: 'FORBIDDEN',
            isNetworkError: false,
            isAuthError: true,
                canRetry: false
          }
          break

        case 419:
          // Token expired/invalid - treat as auth error
          errorState.value = {
            hasError: true,
            errorMessage: t('errors.tokenExpired'),
            errorCode: 'TOKEN_EXPIRED',
            isNetworkError: false,
            isAuthError: true,
            canRetry: false
          }
          break

        case 422:
          // Validation errors
          const validationErrors = data.errors || {}
          const firstError = Object.values(validationErrors)[0] as string[]
          errorState.value = {
            hasError: true,
            errorMessage: firstError?.[0] || data.message || t('errors.validation'),
            errorCode: 'VALIDATION_ERROR',
            isNetworkError: false,
            isAuthError: false,
                canRetry: false
          }
          break

        case 429:
          errorState.value = {
            hasError: true,
            errorMessage: t('errors.tooManyRequests'),
            errorCode: 'RATE_LIMITED',
            isNetworkError: false,
            isAuthError: false,
                canRetry: true
          }
          break

        case 500:
          errorState.value = {
            hasError: true,
            errorMessage: t('errors.serverError'),
            errorCode: 'SERVER_ERROR',
            isNetworkError: false,
            isAuthError: false,
                canRetry: true
          }
          break

        case 503:
          errorState.value = {
            hasError: true,
            errorMessage: t('errors.serviceUnavailable'),
            errorCode: 'SERVICE_UNAVAILABLE',
            isNetworkError: true,
            isAuthError: false,
                canRetry: true
          }
          break

        default:
          errorState.value = {
            hasError: true,
            errorMessage: data.message || t('errors.unknown'),
            errorCode: `HTTP_${status}`,
            isNetworkError: false,
            isAuthError: false,
                canRetry: status >= 500
          }
      }
    } else if (error.request) {
      // Network error - no response received
      errorState.value = {
        hasError: true,
        errorMessage: t('errors.networkError'),
        errorCode: 'NETWORK_ERROR',
        isNetworkError: true,
        isAuthError: false,
        canRetry: true
      }
    } else {
      // Other errors
      errorState.value = {
        hasError: true,
        errorMessage: error.message || t('errors.unknown'),
        errorCode: 'UNKNOWN_ERROR',
        isNetworkError: false,
        isAuthError: false,
        canRetry: false
      }
    }

    return errorState.value
  }

  // Retry mechanism with exponential backoff
  const retryWithBackoff = async (
    operation: () => Promise<any>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<any> => {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          throw error
        }

        // Check if error is retryable
        const errorInfo = await handleError(error)
        if (!errorInfo.canRetry) {
          throw error
        }

        // Wait with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        // Clear error before retry
        clearError()
      }
    }

    throw lastError
  }

  // Check network connectivity
  const checkConnectivity = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      return false
    }

    try {
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Get user-friendly error message
  const getUserFriendlyMessage = (error: any): string => {
    if (!navigator.onLine) {
      return t('errors.offline')
    }

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 401:
          return t('errors.sessionExpired')
        case 403:
          return t('errors.accessDenied')
        case 404:
          return t('errors.notFound')
        case 419:
          return t('errors.sessionExpired')
        case 422:
          return t('errors.invalidData')
        case 429:
          return t('errors.tooManyRequests')
        case 500:
          return t('errors.serverError')
        case 503:
          return t('errors.serviceUnavailable')
        default:
          return data.message || t('errors.unknown')
      }
    }

    if (error.request) {
      return t('errors.connectionFailed')
    }

    return error.message || t('errors.unknown')
  }

  return {
    // State
    errorState,
    hasError,
    errorMessage,
    canRetry,
    isNetworkError,
    isAuthError,

    // Methods
    handleError,
    clearError,
    retryWithBackoff,
    checkConnectivity,
    getUserFriendlyMessage
  }
}
