<template>
  <div class="form-group">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
    </label>

    <!-- EditGrid Container -->
    <div class="border-2 border-purple-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- EditGrid Header -->
      <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || tr('formBuilder.componentLabels.editgrid', 'شبكة التحرير') }}</h3>
              <p class="text-purple-100 text-sm">{{ tr('formBuilder.componentDescriptions.editgrid', 'شبكة قابلة للتحرير لإدارة البيانات') }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ (component.components || []).length }} {{ tr('formBuilder.fields', 'حقل') }}
            </span>
          </div>
        </div>
      </div>

      <!-- EditGrid Content -->
      <div class="p-6">
        <!-- Fields Display -->
        <div v-if="component.components && component.components.length > 0" class="space-y-4">
          <div class="text-xs font-medium text-gray-600 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            {{ tr('formBuilder.editGridFields', 'حقول شبكة التحرير') }}
          </div>

          <!-- Fields Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div v-for="(field, fieldIndex) in component.components"
                 :key="`editgrid-field-${fieldIndex}-${forceUpdateKey}`"
                 class="bg-gradient-to-br from-purple-50 to-purple-50 border-2 border-purple-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
              
              <!-- Field Header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h4 class="text-sm font-semibold text-purple-800">
                    {{ field.label || field.key || `${tr('formBuilder.field', 'حقل')} ${fieldIndex + 1}` }}
                  </h4>
                </div>
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  {{ field.type }}
                </span>
              </div>

              <!-- Field Preview -->
              <div class="bg-white border border-purple-200 rounded-lg p-3 mb-3">
                <div class="text-xs text-gray-600 mb-1">{{ tr('formBuilder.preview', 'معاينة') }}</div>
                <div class="text-sm text-gray-800">
                  {{ getFieldPreview(field) }}
                </div>
                <div v-if="field.validate?.required" class="text-xs text-red-500 mt-1">
                  * {{ tr('formBuilder.required', 'إلزامي') }}
                </div>
              </div>

              <!-- Field Actions -->
              <div class="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex space-x-1">
                  <button @click.stop="editEditGridComponent(fieldIndex, field)"
                          class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click.stop="deleteEditGridComponent(fieldIndex, field)"
                          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          :title="$t('common.delete')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                <div class="text-xs text-purple-600">
                  {{ fieldIndex + 1 }}/{{ component.components.length }}
                </div>
              </div>
            </div>

            <!-- Add Field Card -->
            <div @click="openAddComponentToEditGridModal"
                 class="border-2 border-dashed border-purple-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group min-h-[140px]">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="text-sm text-purple-700 font-medium mb-1">{{ tr('formBuilder.addField', 'إضافة حقل') }}</div>
              <div class="text-xs text-purple-600">{{ tr('formBuilder.clickToAddField', 'انقر لإضافة حقل') }}</div>
            </div>
          </div>

          <!-- Sample Row Preview -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h5 class="text-sm font-medium text-gray-700">{{ tr('formBuilder.sampleRowPreview', 'معاينة صف تجريبي') }}</h5>
                <span class="text-xs text-gray-500">{{ tr('formBuilder.editGridPreview', 'معاينة شبكة التحرير') }}</span>
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div v-for="(field, index) in component.components"
                   :key="`preview-${index}`"
                   class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-700">
                    {{ field.label || field.key }}
                    <span v-if="field.validate?.required" class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="text-xs text-gray-500 mt-1">{{ field.type }}</div>
                </div>
                <div class="flex-1 ml-4">
                  <div class="bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-600">
                    {{ getFieldPreview(field) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- EditGrid Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-gray-200">
            <button @click="openAddComponentToEditGridModal"
                    class="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-all duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>{{ tr('formBuilder.addField', 'إضافة حقل') }}</span>
            </button>
            <div class="text-xs text-gray-500">
              {{ tr('formBuilder.editGridManagement', 'إدارة حقول شبكة التحرير') }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8" @click.stop="openAddComponentToEditGridModal">
          <div class="flex flex-col items-center cursor-pointer hover:bg-purple-50 rounded-lg p-4 transition-colors">
            <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <h4 class="text-sm font-medium text-gray-700 mb-1">{{ tr('formBuilder.emptyEditGrid', 'شبكة تحرير فارغة') }}</h4>
            <p class="text-xs text-gray-500 mb-4">{{ tr('formBuilder.clickToAddFields', 'انقر لإضافة حقول إلى شبكة التحرير') }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="component.description" class="text-xs text-gray-500 mt-2">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  component: Record<string, any>
  readonly?: boolean
  forceUpdateKey?: number
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  forceUpdateKey: 0
})

const { t } = useI18n()

// i18n helper with safe fallback
const tr = (key: string, fallback: string) => {
  const translated = t(key) as string
  return translated !== key ? translated : fallback
}

const emit = defineEmits<{
  'edit-editgrid-component': [data: { componentIndex: number; component: Record<string, any> }]
  'delete-editgrid-component': [data: { componentIndex: number; component: Record<string, any> }]
  'open-add-component-to-editgrid-modal': []
}>()

// Helper functions
const getFieldPreview = (field: Record<string, any>) => {
  switch (field.type) {
    case 'textfield':
      return field.placeholder || 'Enter text...'
    case 'textarea':
      return field.placeholder || 'Enter description...'
    case 'number':
      return field.placeholder || '0'
    case 'email':
      return field.placeholder || 'user@example.com'
    case 'select':
      return field.data?.values?.[0]?.label || 'Select option...'
    case 'radio':
      return field.values?.[0]?.label || 'Option 1'
    case 'checkbox':
      return field.label || 'Check this'
    case 'datetime':
      return 'Select date...'
    case 'button':
      return field.label || 'Click me'
    default:
      return field.placeholder || field.label || 'Sample data'
  }
}

// Event handlers
const editEditGridComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('edit-editgrid-component', { componentIndex, component })
}

const deleteEditGridComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('delete-editgrid-component', { componentIndex, component })
}

const openAddComponentToEditGridModal = () => {
  emit('open-add-component-to-editgrid-modal')
}
</script>
