<template>
  <div class="form-group">
    <!-- Signature Container -->
    <div class="border-2 border-orange-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- Signature Header -->
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || 'توقيع' }}</h3>
              <p class="text-orange-100 text-sm">حقل التوقيع الإلكتروني</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              Premium
            </span>
          </div>
        </div>
      </div>

      <!-- Signature Content -->
      <div class="p-6">
        <!-- Signature Canvas Preview -->
        <div class="bg-gradient-to-br from-orange-50 to-orange-50 border-2 border-dashed border-orange-300 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 text-orange-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            <p class="text-sm font-medium text-orange-700 mb-1">منطقة التوقيع</p>
            <p class="text-xs text-orange-600">سيتم عرض لوحة التوقيع عند ملء النموذج</p>
          </div>
        </div>

        <!-- Signature Info -->
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="bg-white border border-orange-200 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">النوع</div>
            <div class="text-sm font-medium text-gray-800">التوقيع الإلكتروني</div>
          </div>
          <div class="bg-white border border-orange-200 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">الحالة</div>
            <div class="flex items-center">
              <span v-if="component.validate?.required" class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                إلزامي
              </span>
              <span v-else class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                اختياري
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="component.description" class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p class="text-sm text-gray-700">{{ component.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ComponentDefinition {
  type: string
  key: string
  label?: string
  description?: string
  validate?: {
    required?: boolean
  }
}

interface Props {
  component: ComponentDefinition
  forceUpdateKey?: number
}

const props = defineProps<Props>()
</script>
