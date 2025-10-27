import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient, type User, type LoginCredentials, type RegisterData } from '@/services/apiClient'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && apiClient.isAuthenticated())
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userLanguage = computed(() => user.value?.language || 'en')

  // Actions
  const initializeAuth = async () => {
    if (isInitialized.value) return
    
    try {
      // Initialize API client with stored token
      await apiClient.initialize()
      
      // Load user data from localStorage
      const userData = apiClient.getCurrentUser()
      const token = apiClient.getAuthToken()
      
      if (userData && token) {
        user.value = userData
        // Verify token is still valid by fetching user data
        await refreshUser()
      }
      
      isInitialized.value = true
    } catch (err) {
      console.warn('Failed to initialize auth:', err)
      // Clear potentially stale data
      user.value = null
      apiClient.clearAuthData()
      isInitialized.value = true
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.login(credentials)
      
      if (response.success && response.data) {
        user.value = response.data.user
        error.value = null
        return { success: true }
      } else {
        error.value = response.error || 'Login failed'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.register(userData)
      
      if (response.success && response.data) {
        user.value = response.data.user
        error.value = null
        return { success: true }
      } else {
        error.value = response.error || 'Registration failed'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      await apiClient.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local state regardless of API response
      user.value = null
      error.value = null
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.updateProfile(profileData)
      
      if (response.success && response.data) {
        user.value = response.data
        // Update localStorage safely
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('user_data', JSON.stringify(response.data))
          }
        } catch (storageError) {
          console.warn('Could not save user data to localStorage:', storageError)
        }
        return { success: true }
      } else {
        error.value = response.error || 'Profile update failed'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
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
    error.value = null

    try {
      const response = await apiClient.changePassword(passwordData)
      
      if (response.success) {
        return { success: true }
      } else {
        error.value = response.error || 'Password change failed'
        return { success: false, error: error.value, errors: response.errors }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getUser()
      
      if (response.success && response.data) {
        user.value = response.data
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('user_data', JSON.stringify(response.data))
          }
        } catch (storageError) {
          console.warn('Could not save user data to localStorage:', storageError)
        }
        return { success: true }
      } else {
        // Session might be invalid
        user.value = null
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('user_data')
            localStorage.removeItem('api_token')
          }
        } catch (storageError) {
          console.warn('Could not clear localStorage:', storageError)
        }
        return { success: false, error: response.error }
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err)
      // Clear potentially stale data on network errors
      user.value = null
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('user_data')
          localStorage.removeItem('api_token')
        }
      } catch (storageError) {
        console.warn('Could not clear localStorage:', storageError)
      }
      return { success: false, error: 'Network error' }
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    isInitialized,
    
    // Getters
    isAuthenticated,
    isAdmin,
    userLanguage,
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    clearError
  }
})
