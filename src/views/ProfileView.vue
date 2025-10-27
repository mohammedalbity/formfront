<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('profile.title') || 'الملف الشخصي' }}</h1>
            <p class="text-gray-600 mt-1">{{ $t('profile.subtitle') || 'إدارة معلومات حسابك' }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'profile'"
              :class="[activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors']"
            >
              {{ $t('profile.personalInfo') || 'المعلومات الشخصية' }}
            </button>
            <button
              @click="activeTab = 'password'"
              :class="[activeTab === 'password' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors']"
            >
              {{ $t('profile.security') || 'الأمان' }}
            </button>
          </nav>
        </div>

        <!-- Profile Information Tab -->
        <div v-show="activeTab === 'profile'" class="p-8">
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <!-- Name -->
            <div class="space-y-2">
              <label for="name" class="block text-sm font-medium text-gray-700">{{ $t('auth.name') || 'الاسم' }}</label>
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p v-if="profileErrors.name" class="text-sm text-red-600">{{ profileErrors.name[0] }}</p>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-gray-700">{{ $t('auth.email') || 'البريد الإلكتروني' }}</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p v-if="profileErrors.email" class="text-sm text-red-600">{{ profileErrors.email[0] }}</p>
            </div>

            <!-- Language -->
            <div class="space-y-2">
              <label for="language" class="block text-sm font-medium text-gray-700">{{ $t('profile.language') || 'اللغة' }}</label>
              <select
                id="language"
                v-model="profileForm.language"
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                :disabled="isUpdatingProfile"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!isUpdatingProfile">{{ $t('profile.saveChanges') || 'حفظ التغييرات' }}</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ $t('common.saving') || 'جاري الحفظ...' }}
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Tab -->
        <div v-show="activeTab === 'password'" class="p-8">
          <form @submit.prevent="handleChangePassword" class="space-y-6">
            <!-- Current Password -->
            <div class="space-y-2">
              <label for="current_password" class="block text-sm font-medium text-gray-700">{{ $t('profile.currentPassword') || 'كلمة المرور الحالية' }}</label>
              <input
                id="current_password"
                v-model="passwordForm.current_password"
                type="password"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p v-if="passwordErrors.current_password" class="text-sm text-red-600">{{ passwordErrors.current_password[0] }}</p>
            </div>

            <!-- New Password -->
            <div class="space-y-2">
              <label for="new_password" class="block text-sm font-medium text-gray-700">{{ $t('profile.newPassword') || 'كلمة المرور الجديدة' }}</label>
              <input
                id="new_password"
                v-model="passwordForm.password"
                type="password"
                required
                minlength="8"
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p v-if="passwordErrors.password" class="text-sm text-red-600">{{ passwordErrors.password[0] }}</p>
            </div>

            <!-- Confirm New Password -->
            <div class="space-y-2">
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700">{{ $t('auth.confirmPassword') || 'تأكيد كلمة المرور' }}</label>
              <input
                id="password_confirmation"
                v-model="passwordForm.password_confirmation"
                type="password"
                required
                minlength="8"
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                :disabled="isChangingPassword"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!isChangingPassword">{{ $t('profile.changePassword') || 'تغيير كلمة المرور' }}</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ $t('common.saving') || 'جاري التغيير...' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '@/composables/useNotifications'

const { t } = useI18n()
const { user, updateProfile, changePassword } = useAuth()
const { success, error: showError } = useNotifications()

const activeTab = ref('profile')
const isUpdatingProfile = ref(false)
const isChangingPassword = ref(false)

const profileForm = ref<{
  name: string
  email: string
  language: 'en' | 'ar'
}>({
  name: '',
  email: '',
  language: 'ar'
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const profileErrors = ref<Record<string, string[]>>({})
const passwordErrors = ref<Record<string, string[]>>({})

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      language: user.value.language || 'ar'
    }
  }
})

const handleUpdateProfile = async () => {
  isUpdatingProfile.value = true
  profileErrors.value = {}

  try {
    const result = await updateProfile(profileForm.value)
    
    if (result.success) {
      success(
        t('profile.updateSuccess') || 'نجاح',
        t('profile.updateSuccess') || 'تم تحديث الملف الشخصي بنجاح'
      )
    } else {
      if (result.errors) {
        profileErrors.value = result.errors
      }
      showError(
        t('common.error') || 'خطأ',
        result.error || t('profile.updateFailed') || 'فشل تحديث الملف الشخصي'
      )
    }
  } catch (err) {
    console.error('Profile update error:', err)
    showError(
      t('common.error') || 'خطأ',
      t('common.errorOccurred') || 'حدث خطأ'
    )
  } finally {
    isUpdatingProfile.value = false
  }
}

const handleChangePassword = async () => {
  isChangingPassword.value = true
  passwordErrors.value = {}

  try {
    const result = await changePassword(passwordForm.value)
    
    if (result.success) {
      success(
        t('profile.passwordChangeSuccess') || 'نجاح',
        t('profile.passwordChangeSuccess') || 'تم تغيير كلمة المرور بنجاح'
      )
      // Reset form
      passwordForm.value = {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
    } else {
      if (result.errors) {
        passwordErrors.value = result.errors
      }
      showError(
        t('common.error') || 'خطأ',
        result.error || t('profile.passwordChangeFailed') || 'فشل تغيير كلمة المرور'
      )
    }
  } catch (err) {
    console.error('Password change error:', err)
    showError(
      t('common.error') || 'خطأ',
      t('common.errorOccurred') || 'حدث خطأ'
    )
  } finally {
    isChangingPassword.value = false
  }
}
</script>
