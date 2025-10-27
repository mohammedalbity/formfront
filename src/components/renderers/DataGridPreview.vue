<template>
  <div class="form-group">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
    </label>

    <!-- DataGrid Container -->
    <div class="border-2 border-purple-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- DataGrid Header -->
      <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || tr('formBuilder.componentLabels.datagrid', 'شبكة البيانات') }}</h3>
              <p class="text-purple-100 text-sm">{{ tr('formBuilder.componentDescriptions.datagrid', 'شبكة لإدارة البيانات المتعددة') }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ (component.components || []).length }} {{ tr('formBuilder.columns', 'عمود') }}
            </span>
          </div>
        </div>
      </div>

      <!-- DataGrid Content -->
      <div class="p-6 max-h-80 overflow-y-auto overflow-x-hidden">
        <!-- Column Headers -->
        <div v-if="component.components && component.components.length > 0" class="space-y-4">
          <div class="text-xs font-medium text-gray-600 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9z"></path>
            </svg>
            {{ tr('formBuilder.dataGridColumns', 'أعمدة شبكة البيانات') }}
          </div>

          <!-- Columns Display -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div v-for="(column, columnIndex) in component.components"
                 :key="`datagrid-column-${columnIndex}-${forceUpdateKey}`"
                 class="bg-gradient-to-br from-purple-50 to-purple-50 border-2 border-purple-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
              
              <!-- Column Header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h4 class="text-sm font-semibold text-purple-800">
                    {{ column.label || column.key || `${tr('formBuilder.column', 'عمود')} ${columnIndex + 1}` }}
                  </h4>
                </div>
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  {{ column.type }}
                </span>
              </div>

              <!-- Column Preview -->
              <div class="bg-white border border-purple-200 rounded-lg p-3 mb-3">
                <div class="text-xs text-gray-600 mb-1">{{ tr('formBuilder.preview', 'معاينة') }}</div>
                <div class="text-sm text-gray-800">
                  {{ column.placeholder || column.label || tr('formBuilder.sampleData', 'بيانات نموذجية') }}
                </div>
              </div>

              <!-- Column Actions -->
              <div class="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex space-x-1">
                  <button @click.stop="editDataGridColumn(columnIndex, column)"
                          class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click.stop="deleteDataGridColumn(columnIndex, column)"
                          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          :title="$t('common.delete')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                <div class="text-xs text-green-600">
                  {{ columnIndex + 1 }}/{{ component.components.length }}
                </div>
              </div>
            </div>

            <!-- Add Column Card -->
            <div @click="openAddComponentToDataGridModal"
                 class="border-2 border-dashed border-green-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200 group min-h-[140px]">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="text-sm text-green-700 font-medium mb-1">{{ tr('formBuilder.addColumn', 'إضافة عمود') }}</div>
              <div class="text-xs text-green-600">{{ tr('formBuilder.clickToAddColumn', 'انقر لإضافة عمود') }}</div>
            </div>
          </div>

          <!-- Sample Data Preview -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h5 class="text-sm font-medium text-gray-700">{{ tr('formBuilder.sampleDataPreview', 'معاينة بيانات نموذجية') }}</h5>
                <span class="text-xs text-gray-500">{{ tr('formBuilder.dataGridPreview', 'معاينة شبكة البيانات') }}</span>
              </div>
            </div>
            <div class="p-4">
              <table class="min-w-full text-sm table-fixed">
                <colgroup v-if="component.components && component.components.length">
                  <col v-for="(c, i) in component.components" :key="`colw-${i}`" :style="{ width: (100 / (component.components.length || 1)) + '%' }" />
                </colgroup>
                <thead>
                  <tr class="border-b border-gray-200">
                    <th v-for="(column, index) in component.components"
                        :key="`header-${index}`"
                        class="py-2 px-3 text-xs font-medium text-gray-600 ltr:text-left rtl:text-right whitespace-nowrap">
                      {{ column.label || column.key }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-100">
                    <td v-for="(column, index) in component.components"
                        :key="`sample-${index}`"
                        class="py-2 px-3 text-xs text-gray-600 ltr:text-left rtl:text-right align-middle truncate">
                      {{ getSampleData(column) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8" @click.stop="openAddComponentToDataGridModal">
          <div class="flex flex-col items-center cursor-pointer hover:bg-green-50 rounded-lg p-4 transition-colors">
            <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9z"></path>
            </svg>
            <h4 class="text-sm font-medium text-gray-700 mb-1">{{ tr('formBuilder.emptyDataGrid', 'شبكة بيانات فارغة') }}</h4>
            <p class="text-xs text-gray-500 mb-4">{{ tr('formBuilder.clickToAddColumns', 'انقر لإضافة أعمدة إلى هذه الشبكة') }}</p>
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

// i18n helper with safe fallback when the key is missing
const tr = (key: string, fallback: string) => {
  const translated = t(key) as string
  return translated !== key ? translated : fallback
}

const emit = defineEmits<{
  'edit-datagrid-column': [columnIndex: number, component: Record<string, any>]
  'delete-datagrid-column': [columnIndex: number, component: Record<string, any>]
  'open-add-component-to-datagrid-modal': []
}>()

// Helper functions
const getSampleData = (column: Record<string, any>) => {
  switch (column.type) {
    case 'textfield':
      return tr('formBuilder.samples.text', 'نص تجريبي')
    case 'number':
      return tr('formBuilder.samples.number', '١٢٣')
    case 'email':
      return tr('formBuilder.samples.email', 'user@example.com')
    case 'select':
      return tr('formBuilder.samples.option', 'خيار ١')
    case 'checkbox':
      return tr('formBuilder.samples.yes', 'نعم')
    case 'datetime':
      return tr('formBuilder.samples.date', '2024-01-01')
    default:
      return tr('formBuilder.samples.value', 'قيمة')
  }
}

// Event handlers
const editDataGridColumn = (columnIndex: number, component: Record<string, any>) => {
  emit('edit-datagrid-column', columnIndex, component)
}

const deleteDataGridColumn = (columnIndex: number, component: Record<string, any>) => {
  emit('delete-datagrid-column', columnIndex, component)
}

const openAddComponentToDataGridModal = () => {
  emit('open-add-component-to-datagrid-modal')
}
</script>
