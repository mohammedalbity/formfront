import { createI18n } from 'vue-i18n'

// Import locale messages synchronously to avoid initialization issues
import arMessages from '../locales/ar.json'
import enMessages from '../locales/en.json'

// Default language constant
const DEFAULT_LANGUAGE = 'ar'

// Safe function to get saved language
const getSavedLanguage = (): 'ar' | 'en' => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return (localStorage.getItem('language') as 'ar' | 'en') || DEFAULT_LANGUAGE
    }
  } catch (error) {
    console.warn('localStorage not available:', error)
  }
  return DEFAULT_LANGUAGE
}

// Set document direction based on language
const setDocumentDirection = (locale: string) => {
  try {
    if (typeof document !== 'undefined') {
      const direction = locale === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.setAttribute('dir', direction)
      document.documentElement.setAttribute('lang', locale)
    }
  } catch (error) {
    console.warn('Document not available:', error)
  }
}

// Create i18n instance with Composition API mode (Vue i18n v11 compatible)
const createI18nInstance = () => {
  const initialLanguage = getSavedLanguage()

  // Set initial direction safely
  if (typeof window !== 'undefined') {
    setDocumentDirection(initialLanguage)
  }

  const i18nInstance = createI18n({
    legacy: false, // Use Composition API mode (Vue i18n v11 recommended)
    locale: initialLanguage,
    fallbackLocale: 'ar',
    globalInjection: true,
    messages: {
      ar: arMessages,
      en: enMessages
    },
    // Enhanced configuration for message compiler compatibility
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    warnHtmlMessage: false,
    missingWarn: false,
    fallbackWarn: false,
    // Composition API mode is now enabled by default with legacy: false
    // Add datetime and number formats for proper localization
    datetimeFormats: {
      ar: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      en: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }
      }
    },
    numberFormats: {
      ar: {
        currency: {
          style: 'currency',
          currency: 'SAR',
          notation: 'standard'
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      },
      en: {
        currency: {
          style: 'currency',
          currency: 'USD',
          notation: 'standard'
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      }
    }
  })

  return i18nInstance
}

// Global i18n instance - initialize immediately
const i18nInstance = createI18nInstance()

// Export function to change language
export const changeLanguage = (locale: 'ar' | 'en') => {
  i18nInstance.global.locale.value = locale // Composition API mode - .value needed
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', locale)
    }
  } catch (error) {
    console.warn('Could not save language to localStorage:', error)
  }
  setDocumentDirection(locale)
}

// Export function to get current language - now synchronous
export const getCurrentLanguage = (): string => {
  return i18nInstance.global.locale.value // Composition API mode - .value needed
}

// Export function to check if current language is RTL - now synchronous
export const isRTL = (): boolean => {
  return getCurrentLanguage() === 'ar'
}

// Synchronous RTL check for immediate use (alias for isRTL)
export const isRTLSync = (): boolean => {
  return isRTL()
}

// Export the i18n instance directly
export default i18nInstance
