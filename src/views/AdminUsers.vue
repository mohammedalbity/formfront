<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ $t('admin.users.title') || 'إدارة المستخدمين' }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ $t('admin.users.subtitle') || 'إدارة حسابات المستخدمين وصلاحياتهم' }}
            </p>
          </div>
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm text-gray-600"
              >{{ $t('admin.users.totalUsers') || 'إجمالي المستخدمين' }}:</span
            >
            <span class="text-2xl font-bold text-blue-600">{{ pagination.total || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.search') || 'البحث'
            }}</label>
            <input
              v-model="filters.search"
              type="text"
              :placeholder="$t('admin.users.searchPlaceholder') || 'البحث بالاسم أو البريد...'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="debouncedSearch"
            />
          </div>

          <!-- Role Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('admin.users.role') || 'الدور'
            }}</label>
            <select
              v-model="filters.role"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="() => fetchUsers()"
            >
              <option value="">{{ $t('admin.users.allRoles') || 'جميع الأدوار' }}</option>
              <option value="admin">{{ $t('admin.users.admin') || 'مدير' }}</option>
              <option value="user">{{ $t('admin.users.user') || 'مستخدم' }}</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('admin.users.status') || 'الحالة'
            }}</label>
            <select
              v-model="filters.is_active"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="() => fetchUsers()"
            >
              <option value="">{{ $t('admin.users.allStatuses') || 'جميع الحالات' }}</option>
              <option value="1">{{ $t('admin.users.active') || 'نشط' }}</option>
              <option value="0">{{ $t('admin.users.inactive') || 'معطل' }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
      >
        <!-- Loading State -->
        <div v-if="isLoading" class="p-12 text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-600">{{ $t('common.loading') || 'جاري التحميل...' }}</p>
        </div>

        <!-- Users List -->
        <div v-else-if="users.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('admin.users.name') || 'الاسم' }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('admin.users.email') || 'البريد الإلكتروني' }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('admin.users.role') || 'الدور' }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('admin.users.status') || 'الحالة' }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('admin.users.stats') || 'الإحصائيات' }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('admin.users.actions') || 'الإجراءات' }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
                    >
                      <span class="text-white font-semibold">{{
                        user.name.charAt(0).toUpperCase()
                      }}</span>
                    </div>
                    <div class="mr-4 rtl:mr-0 rtl:ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-xs text-gray-500">
                        {{ $t('admin.users.id') || 'ID' }}: {{ user.id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800',
                    ]"
                  >
                    {{
                      user.role === 'admin'
                        ? $t('admin.users.admin') || 'مدير'
                        : $t('admin.users.user') || 'مستخدم'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{
                      user.is_active
                        ? $t('admin.users.active') || 'نشط'
                        : $t('admin.users.inactive') || 'معطل'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-4 rtl:space-x-reverse">
                    <div>
                      <span class="font-medium">{{ user.forms_count || 0 }}</span>
                      <span class="text-xs">{{ $t('admin.users.forms') || 'نماذج' }}</span>
                    </div>
                    <div>
                      <span class="font-medium">{{ user.submissions_count || 0 }}</span>
                      <span class="text-xs">{{ $t('admin.users.submissions') || 'إرسالات' }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2 rtl:space-x-reverse">
                    <!-- Toggle Status -->
                    <button
                      @click="toggleUserStatus(user)"
                      :class="[
                        'p-2 rounded-lg transition-colors',
                        user.is_active
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50',
                      ]"
                      :title="
                        user.is_active
                          ? $t('admin.users.deactivate') || 'تعطيل'
                          : $t('admin.users.activate') || 'تفعيل'
                      "
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          v-if="user.is_active"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                        <path
                          v-else
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>

                    <!-- Toggle Role -->
                    <button
                      @click="toggleUserRole(user)"
                      :disabled="user.id === currentUserId"
                      :class="[
                        'p-2 rounded-lg transition-colors',
                        user.id === currentUserId
                          ? 'text-gray-400 cursor-not-allowed opacity-50'
                          : 'text-purple-600 hover:bg-purple-50',
                      ]"
                      :title="
                        user.role === 'admin'
                          ? $t('admin.users.makeUser') || 'جعله مستخدم'
                          : $t('admin.users.makeAdmin') || 'جعله مدير'
                      "
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </button>

                    <!-- Reset Password -->
                    <button
                      @click="openResetPasswordModal(user)"
                      :disabled="user.id === currentUserId"
                      :class="[
                        'p-2 rounded-lg transition-colors',
                        user.id === currentUserId
                          ? 'text-gray-400 cursor-not-allowed opacity-50'
                          : 'text-orange-600 hover:bg-orange-50',
                      ]"
                      :title="$t('admin.users.resetPassword') || 'إعادة تعيين كلمة المرور'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            {{ $t('admin.users.noUsers') || 'لا يوجد مستخدمين' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ $t('admin.users.noUsersDesc') || 'لم يتم العثور على أي مستخدمين' }}
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="users.length > 0" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              {{ $t('admin.users.showing') || 'عرض' }}
              <span class="font-medium">{{ pagination.from }}</span>
              {{ $t('admin.users.to') || 'إلى' }}
              <span class="font-medium">{{ pagination.to }}</span>
              {{ $t('admin.users.of') || 'من' }}
              <span class="font-medium">{{ pagination.total }}</span>
            </div>
            <div class="flex space-x-2 rtl:space-x-reverse">
              <button
                @click="changePage(pagination.current_page - 1)"
                :disabled="pagination.current_page === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('common.previous') || 'السابق' }}
              </button>
              <button
                @click="changePage(pagination.current_page + 1)"
                :disabled="pagination.current_page === pagination.last_page"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('common.next') || 'التالي' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeConfirmModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        <!-- Header -->
        <div
          :class="[
            'px-6 py-4 border-b flex items-center space-x-3 rtl:space-x-reverse',
            confirmModalData.type === 'danger'
              ? 'bg-red-50 border-red-200'
              : confirmModalData.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200'
                : confirmModalData.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200',
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              confirmModalData.type === 'danger'
                ? 'bg-red-100'
                : confirmModalData.type === 'warning'
                  ? 'bg-yellow-100'
                  : confirmModalData.type === 'success'
                    ? 'bg-green-100'
                    : 'bg-blue-100',
            ]"
          >
            <svg
              v-if="confirmModalData.type === 'danger'"
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else-if="confirmModalData.type === 'warning'"
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else-if="confirmModalData.type === 'success'"
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3
            :class="[
              'text-lg font-semibold',
              confirmModalData.type === 'danger'
                ? 'text-red-900'
                : confirmModalData.type === 'warning'
                  ? 'text-yellow-900'
                  : confirmModalData.type === 'success'
                    ? 'text-green-900'
                    : 'text-blue-900',
            ]"
          >
            {{ confirmModalData.title }}
          </h3>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <p class="text-gray-700 text-base leading-relaxed">
            {{ confirmModalData.message }}
          </p>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rtl:space-x-reverse rounded-b-2xl"
        >
          <button
            @click="closeConfirmModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {{ confirmModalData.cancelText }}
          </button>
          <button
            @click="confirmModalData.onConfirm(); closeConfirmModal()"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors',
              confirmModalData.type === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : confirmModalData.type === 'warning'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : confirmModalData.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700',
            ]"
          >
            {{ confirmModalData.confirmText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div
      v-if="showResetPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeResetPasswordModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">
          {{ $t('admin.users.resetPasswordTitle') || 'إعادة تعيين كلمة المرور' }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ $t('admin.users.resetPasswordDesc') || 'إعادة تعيين كلمة المرور للمستخدم' }}:
          <strong>{{ selectedUser?.name }}</strong>
        </p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('admin.users.newPassword') || 'كلمة المرور الجديدة'
            }}</label>
            <input
              v-model="newPassword"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="$t('admin.users.enterNewPassword') || 'أدخل كلمة المرور الجديدة'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('admin.users.confirmPassword') || 'تأكيد كلمة المرور'
            }}</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="$t('admin.users.confirmNewPassword') || 'أكد كلمة المرور الجديدة'"
            />
          </div>
        </div>
        <div class="flex space-x-3 rtl:space-x-reverse mt-6">
          <button
            @click="resetPassword"
            :disabled="isResetting || !newPassword || newPassword !== confirmPassword"
            class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{
              isResetting
                ? $t('common.saving') || 'جاري الحفظ...'
                : $t('admin.users.resetPassword') || 'إعادة التعيين'
            }}
          </button>
          <button
            @click="closeResetPasswordModal"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            {{ $t('common.cancel') || 'إلغاء' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiClient } from '@/services/apiClient'
import { useNotifications } from '@/composables/useNotifications'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const { success, error: showError } = useNotifications()
const authStore = useAuthStore()

interface User {
  id: number
  name: string
  email: string
  role: string
  is_active: boolean
  forms_count?: number
  submissions_count?: number
}

const users = ref<User[]>([])
const isLoading = ref(false)
const filters = ref({
  search: '',
  role: '',
  is_active: '',
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  from: 0,
  to: 0,
})

const showResetPasswordModal = ref(false)
const selectedUser = ref<User | null>(null)
const newPassword = ref('')
const confirmPassword = ref('')
const isResetting = ref(false)

// Confirmation Modal State
const showConfirmModal = ref(false)
const confirmModalData = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  type: 'warning' as 'warning' | 'danger' | 'success' | 'info',
  onConfirm: () => {},
})

const currentUserId = computed(() => {
  const userId = authStore.user?.id
  console.log('Current User ID:', userId)
  console.log('Auth Store User:', authStore.user)
  return userId
})

let searchTimeout: number | undefined

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchUsers()
  }, 500)
}

const fetchUsers = async (page = 1) => {
  isLoading.value = true
  try {
    const params: Record<string, unknown> = { page }

    if (filters.value.search) params.search = filters.value.search
    if (filters.value.role) params.role = filters.value.role
    if (filters.value.is_active) params.is_active = filters.value.is_active

    const response = await apiClient.get('/admin/users', { params })

    if (response.success && response.data) {
      users.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      }
    }
  } catch (err) {
    console.error('Error fetching users:', err)
    showError(t('common.error') || 'خطأ', t('admin.users.fetchError') || 'فشل تحميل المستخدمين')
  } finally {
    isLoading.value = false
  }
}

const toggleUserStatus = async (user: User) => {
  const confirmMsg = user.is_active
    ? `${t('admin.users.confirmDeactivate') || 'هل تريد تعطيل حساب'} ${user.name}؟`
    : `${t('admin.users.confirmActivate') || 'هل تريد تفعيل حساب'} ${user.name}؟`

  // Show confirmation modal
  confirmModalData.value = {
    title: user.is_active
      ? t('admin.users.deactivate') || 'تعطيل الحساب'
      : t('admin.users.activate') || 'تفعيل الحساب',
    message: confirmMsg,
    confirmText: t('common.confirm') || 'تأكيد',
    cancelText: t('common.cancel') || 'إلغاء',
    type: user.is_active ? 'danger' : 'success',
    onConfirm: async () => {
      await performToggleStatus(user)
    },
  }
  showConfirmModal.value = true
}

const performToggleStatus = async (user: User) => {
  try {
    const response = await apiClient.put(`/admin/users/${user.id}`, {
      is_active: !user.is_active,
    })

    if (response.success) {
      user.is_active = !user.is_active
      success(
        t('common.success') || 'نجاح',
        user.is_active
          ? t('admin.users.activatedSuccess') || 'تم تفعيل الحساب بنجاح'
          : t('admin.users.deactivatedSuccess') || 'تم تعطيل الحساب بنجاح',
      )
    }
  } catch (err) {
    console.error('Error toggling user status:', err)
    showError(t('common.error') || 'خطأ', t('admin.users.statusError') || 'فشل تغيير حالة المستخدم')
  }
}

const toggleUserRole = async (user: User) => {
  // Prevent admin from changing their own role
  if (user.id === currentUserId.value) {
    showError(t('common.error') || 'خطأ', 'لا يمكنك تغيير دورك الخاص')
    return
  }

  const newRole = user.role === 'admin' ? 'user' : 'admin'
  const confirmMsg =
    newRole === 'admin'
      ? `${t('admin.users.confirmMakeAdmin') || 'هل تريد جعل'} ${user.name} ${t('admin.users.admin') || 'مدير'}؟`
      : `${t('admin.users.confirmMakeUser') || 'هل تريد جعل'} ${user.name} ${t('admin.users.user') || 'مستخدم عادي'}؟`

  // Show confirmation modal
  confirmModalData.value = {
    title: t('admin.users.role') || 'تغيير الدور',
    message: confirmMsg,
    confirmText: t('common.confirm') || 'تأكيد',
    cancelText: t('common.cancel') || 'إلغاء',
    type: 'warning',
    onConfirm: async () => {
      await performToggleRole(user, newRole)
    },
  }
  showConfirmModal.value = true
}

const performToggleRole = async (user: User, newRole: string) => {
  try {
    const response = await apiClient.put(`/admin/users/${user.id}`, {
      role: newRole,
    })

    if (response.success) {
      user.role = newRole
      success(t('common.success') || 'نجاح', t('admin.users.roleUpdated') || 'تم تحديث الدور بنجاح')
    }
  } catch (err) {
    console.error('Error toggling user role:', err)
    showError(t('common.error') || 'خطأ', t('admin.users.roleError') || 'فشل تغيير دور المستخدم')
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
}

const openResetPasswordModal = (user: User) => {
  selectedUser.value = user
  newPassword.value = ''
  confirmPassword.value = ''
  showResetPasswordModal.value = true
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  selectedUser.value = null
  newPassword.value = ''
  confirmPassword.value = ''
}

const resetPassword = async () => {
  if (!selectedUser.value || !newPassword.value || newPassword.value !== confirmPassword.value)
    return

  isResetting.value = true
  try {
    const response = await apiClient.put(`/admin/users/${selectedUser.value.id}/reset-password`, {
      password: newPassword.value,
    })

    if (response.success) {
      success(
        t('common.success') || 'نجاح',
        t('admin.users.passwordReset') || 'تم إعادة تعيين كلمة المرور بنجاح',
      )
      closeResetPasswordModal()
    }
  } catch (err) {
    console.error('Error resetting password:', err)
    showError(
      t('common.error') || 'خطأ',
      t('admin.users.passwordError') || 'فشل إعادة تعيين كلمة المرور',
    )
  } finally {
    isResetting.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchUsers(page)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
