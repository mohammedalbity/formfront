<template>
  <div class="datagrid-renderer">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="(col, colIndex) in component.components"
              :key="col.key || `col-${colIndex}`"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
              :class="{ 'rtl:text-right': $i18n.locale === 'ar' }"
            >
              {{ col.label || col.key }}
              <span v-if="col.validate?.required" class="text-red-500 mr-1 rtl:ml-1">*</span>
            </th>
            <th v-if="!component.disableActions" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              {{ t('publicForm.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-transparent divide-y divide-gray-200">
          <tr v-if="!gridData || gridData.length === 0">
            <td :colspan="component.components?.length + (!component.disableActions ? 1 : 0)" class="px-4 py-8 text-center text-gray-500">
              {{ t('publicForm.emptyDataGrid') }}
            </td>
          </tr>
          <tr v-else v-for="(row, rowIndex) in gridData" :key="`row-${rowIndex}`" class="hover:bg-gray-50">
            <td
              v-for="(col, colIndex) in component.components"
              :key="`cell-${rowIndex}-${colIndex}`"
              class="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0"
            >
              <component
                :is="getChildComponentRenderer(col.type)"
                :component="{ ...col, key: `${col.key}_${rowIndex}` }"
                :form-data="{ [`${col.key}_${rowIndex}`]: row[col.key] }"
                @update:value="(key: string, value: any) => updateGridValue(rowIndex, col.key, value)"
              />
            </td>
            <td v-if="!component.disableActions" class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
              <div class="flex justify-end gap-2">
                <button 
                  type="button" 
                  @click="removeRow(rowIndex)" 
                  class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  :title="t('publicForm.removeRow')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="mt-4 flex justify-end">
      <button 
        type="button" 
        @click="addRow" 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ t('publicForm.addRow') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import TextFieldRenderer from './TextFieldRenderer.vue'
import TextAreaRenderer from './TextAreaRenderer.vue'
import NumberRenderer from './NumberRenderer.vue'
import EmailRenderer from './EmailRenderer.vue'
import PasswordRenderer from './PasswordRenderer.vue'
import SelectRenderer from './SelectRenderer.vue'
import RadioRenderer from './RadioRenderer.vue'
import CheckboxRenderer from './CheckboxRenderer.vue'
import FileRenderer from './FileRenderer.vue'
import ButtonRenderer from './ButtonRenderer.vue'
import HiddenRenderer from './HiddenRenderer.vue'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()
const { t } = useI18n()

// Use ref instead of computed to allow mutations
const internalGridData = ref<any[]>([])

// Initialize grid data from props
watch(() => props.component.defaultValue, (newValue) => {
  if (newValue && Array.isArray(newValue) && newValue.length > 0) {
    internalGridData.value = [...newValue]
  } else {
    // Initialize with one empty row if no data
    internalGridData.value = [{}]
  }
}, { immediate: true })

// Expose gridData as computed for template
const gridData = computed(() => internalGridData.value)

const childComponentRenderers = {
  textfield: TextFieldRenderer,
  textarea: TextAreaRenderer,
  number: NumberRenderer,
  email: EmailRenderer,
  password: PasswordRenderer,
  select: SelectRenderer,
  radio: RadioRenderer,
  checkbox: CheckboxRenderer,
  file: FileRenderer,
  button: ButtonRenderer,
  hidden: HiddenRenderer
}

const getChildComponentRenderer = (type: string) => {
  return (childComponentRenderers as any)[type] || TextFieldRenderer
}

const updateGridValue = (rowIndex: number, colKey: string, value: any) => {
  if (!internalGridData.value[rowIndex]) {
    internalGridData.value[rowIndex] = {}
  }
  internalGridData.value[rowIndex][colKey] = value
  emit('update:value', props.component.key, [...internalGridData.value])
}

const addRow = () => {
  internalGridData.value.push({})
  emit('update:value', props.component.key, [...internalGridData.value])
}

const removeRow = (rowIndex: number) => {
  if (internalGridData.value.length > 1) {
    internalGridData.value.splice(rowIndex, 1)
    emit('update:value', props.component.key, [...internalGridData.value])
  } else {
    // If it's the last row, clear it instead of removing
    internalGridData.value = [{}]
    emit('update:value', props.component.key, [...internalGridData.value])
  }
}
</script>

<style scoped>
.datagrid-renderer table {
  table-layout: fixed;
}
</style>
