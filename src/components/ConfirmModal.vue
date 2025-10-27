<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ title || $t('common.confirm') }}
        </h3>
        <button
          @click="handleCancel"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="flex items-start space-x-4" :class="{ 'space-x-4': !isRTL, 'space-x-reverse': isRTL }">
          <!-- Warning Icon -->
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          <!-- Message -->
          <div class="flex-1">
            <p class="text-gray-700 leading-relaxed">
              {{ message }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 p-6 border-t bg-gray-50" :class="{ 'space-x-3': !isRTL, 'space-x-reverse': isRTL }">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {{ cancelText || $t('common.cancel') }}
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 transition-colors"
        >
          {{ confirmText || $t('common.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '@/i18n'

interface Props {
  isVisible: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const isRTL = computed(() => isRTLSync())

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>
