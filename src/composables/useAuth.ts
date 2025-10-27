// Composable for Laravel Sanctum Authentication
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from './useErrorHandler'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResult, 
  UpdateProfileData, 
  ChangePasswordData,
  UseAuthReturn 
} from '@/types/auth'

export const useAuth = (): UseAuthReturn => {
  const authStore = useAuthStore()
  const router = useRouter()
  const { t } = useI18n()
  const errorHandler = useErrorHandler()

  // Reactive state
  const isLoading = ref(false)
  const isRetrying = ref(false)
  const retryCount = ref(0)
  const maxRetries = 3

  // Computed properties
  const user = computed(() => authStore.user as User | null)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const userLanguage = computed(() => (authStore.userLanguage as 'en' | 'ar') || 'en')

  // Authentication methods with retry mechanism
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    errorHandler.clearError()
    retryCount.value = 0

    try {
      const result = await errorHandler.retryWithBackoff(async () => {
        return await authStore.login(credentials)
      }, maxRetries)
      
      if (result.success) {
        // Redirect to intended page or home
        const redirectPath = router.currentRoute.value.query.redirect as string || '/'
        await router.push(redirectPath)
        return { success: true }
      } else {
        return { success: false, error: result.error, errors: result.errors }
      }
    } catch (err) {
      await errorHandler.handleError(err)
      const friendlyMessage = errorHandler.getUserFriendlyMessage(err)
      return { 
        success: false, 
        error: friendlyMessage,
        canRetry: errorHandler.canRetry.value,
        isNetworkError: errorHandler.isNetworkError.value
      }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    isLoading.value = true
    errorHandler.clearError()
    retryCount.value = 0

    try {
      const result = await errorHandler.retryWithBackoff(async () => {
        return await authStore.register(userData)
      }, maxRetries)
      
      if (result.success) {
        // Redirect to intended page or home
        const redirectPath = router.currentRoute.value.query.redirect as string || '/'
        await router.push(redirectPath)
        return { success: true }
      } else {
        return { success: false, error: result.error, errors: result.errors }
      }
    } catch (err) {
      await errorHandler.handleError(err)
      const friendlyMessage = errorHandler.getUserFriendlyMessage(err)
      return { 
        success: false, 
        error: friendlyMessage,
        canRetry: errorHandler.canRetry.value,
        isNetworkError: errorHandler.isNetworkError.value
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    errorHandler.clearError()

    try {
      await authStore.logout()
      await router.push('/login')
      return { success: true }
    } catch (err) {
      console.error('Logout error:', err)
      // Force logout even if API call fails
      await router.push('/login')
      return { success: false, error: 'Logout failed' }
    } finally {
      isLoading.value = false
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      await authStore.refreshUser()
    } catch (err) {
      console.error('Failed to refresh user:', err)
      throw err
    }
  }

  const updateProfile = async (profileData: any) => {
    isLoading.value = true
    errorHandler.clearError()

    try {
      const result = await authStore.updateProfile(profileData)
      
      if (!result.success) {
        await errorHandler.handleError(new Error(result.error || t('auth.profileUpdateFailed')))
      }
      
      return result
    } catch (err) {
      await errorHandler.handleError(err)
      return { success: false, error: errorHandler.getUserFriendlyMessage(err) }
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (passwordData: {
    current_password: string
    password: string
    password_confirmation: string
  }) => {
    isLoading.value = true
    errorHandler.clearError()

    try {
      const result = await authStore.changePassword(passwordData)
      
      if (!result.success) {
        await errorHandler.handleError(new Error(result.error || t('auth.passwordChangeFailed')))
      }
      
      return result
    } catch (err) {
      await errorHandler.handleError(err)
      return { success: false, error: errorHandler.getUserFriendlyMessage(err) }
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    errorHandler.clearError()
    authStore.clearError()
  }

  // Initialize authentication
  const initialize = async (): Promise<void> => {
    try {
      await authStore.initializeAuth()
    } catch (err) {
      console.error('Failed to initialize auth:', err)
      throw err
    }
  }

  // Check if user has specific role
  const hasRole = (role: string) => {
    return user.value?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]) => {
    return user.value ? roles.includes(user.value.role) : false
  }

  // Network connectivity check
  const checkConnectivity = async () => {
    return await errorHandler.checkConnectivity()
  }

  // Manual retry for failed operations
  const retryLastOperation = async (operation: () => Promise<any>) => {
    if (!errorHandler.canRetry.value) {
      return { success: false, error: 'Operation cannot be retried' }
    }

    isRetrying.value = true
    try {
      const result = await operation()
      errorHandler.clearError()
      return result
    } catch (err) {
      await errorHandler.handleError(err)
      return { 
        success: false, 
        error: errorHandler.getUserFriendlyMessage(err),
        canRetry: errorHandler.canRetry.value
      }
    } finally {
      isRetrying.value = false
    }
  }

  return {
    // State
    user,
    isLoading,
    isRetrying,
    retryCount,
    
    // Computed
    isAuthenticated,
    isAdmin,
    userLanguage,
    
    // Error handling
    hasError: errorHandler.hasError,
    errorMessage: computed(() => errorHandler.errorMessage.value || ''),
    canRetry: errorHandler.canRetry,
    isNetworkError: errorHandler.isNetworkError,
    isAuthError: errorHandler.isAuthError,
    
    // Methods
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    changePassword,
    clearError: errorHandler.clearError,
    initialize,
    hasRole,
    hasAnyRole,
    checkConnectivity,
    retryLastOperation
  }
}
