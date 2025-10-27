<template>
  <div class="form-group">
    <!-- File Container -->
    <div class="border-2 border-orange-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- File Header -->
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || 'رفع ملف' }}</h3>
              <p class="text-orange-100 text-sm">حقل رفع الملفات</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              Premium
            </span>
          </div>
        </div>
      </div>

      <!-- File Content -->
      <div class="p-6">
        <!-- File Upload Area Preview -->
        <div class="bg-gradient-to-br from-orange-50 to-orange-50 border-2 border-dashed border-orange-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
          <svg class="w-16 h-16 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p class="text-sm font-medium text-orange-700 mb-2">اسحب وأفلت الملفات هنا</p>
          <p class="text-xs text-orange-600 mb-3">أو انقر للتصفح</p>
          <div class="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            اختيار ملف
          </div>
        </div>

        <!-- File Info -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white border border-orange-200 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">أنواع الملفات</div>
            <div class="text-sm font-medium text-gray-800">
              {{ getFileTypes() }}
            </div>
          </div>
          <div class="bg-white border border-orange-200 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">الحد الأقصى للحجم</div>
            <div class="text-sm font-medium text-gray-800">
              {{ getMaxSize() }}
            </div>
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

        <!-- File Settings -->
        <div v-if="component.multiple" class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center">
          <svg class="w-5 h-5 text-orange-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="text-sm text-gray-700 font-medium">يمكن رفع ملفات متعددة</span>
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
  multiple?: boolean
  filePattern?: string
  fileMaxSize?: string
  validate?: {
    required?: boolean
  }
}

interface Props {
  component: ComponentDefinition
  forceUpdateKey?: number
}

const props = defineProps<Props>()

const getFileTypes = () => {
  if (props.component.filePattern) {
    return props.component.filePattern.replace(/\*/g, '').replace(/\./g, '').toUpperCase()
  }
  return 'جميع الأنواع'
}

const getMaxSize = () => {
  if (props.component.fileMaxSize) {
    return props.component.fileMaxSize
  }
  return '10 MB'
}
</script>
