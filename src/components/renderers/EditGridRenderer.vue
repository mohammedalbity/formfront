<template>
  <div class="editgrid-renderer">
    <div class="editgrid-container">
      <div v-if="!gridData || gridData.length === 0" class="text-center py-8 text-gray-500">
        <div class="text-sm">{{ t('publicForm.emptyEditGrid') }}</div>
        <button 
          type="button" 
          @click="addRow" 
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ t('publicForm.addRow') }}
        </button>
      </div>
      <div
        v-else
        v-for="(row, rowIndex) in gridData"
        :key="`editgrid-row-${rowIndex}`"
        class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 relative"
      >
        <!-- Row Header with Actions -->
        <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
          <h4 class="text-sm font-medium text-gray-700">
            {{ component.rowLabel ? component.rowLabel.replace('{rowIndex}', (rowIndex + 1).toString()) : t('publicForm.row') + ' ' + (rowIndex + 1) }}
          </h4>
          <div class="flex space-x-2 rtl:space-x-reverse">
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
        </div>
        
        <!-- Row Content -->
        <div class="grid gap-4" :class="getGridClass()">
          <div
            v-for="(col, colIndex) in component.components"
            :key="`editgrid-cell-${rowIndex}-${colIndex}`"
            class="editgrid-cell"
          >
            <component
              :is="getChildComponentRenderer(col.type)"
              :component="{ ...col, key: `${col.key}_${rowIndex}` }"
              :form-data="{ [`${col.key}_${rowIndex}`]: row[col.key] }"
              @update:value="(key: string, value: any) => updateGridValue(rowIndex, col.key, value)"
            />
          </div>
        </div>
      </div>
      
      <!-- Add Row Button -->
      <div v-if="gridData && gridData.length > 0" class="mt-4 flex justify-center">
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
    // Initialize with empty array
    internalGridData.value = []
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

const getGridClass = () => {
  const colCount = props.component.components?.length || 1
  if (colCount === 1) return 'grid-cols-1'
  if (colCount === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (colCount === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
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
  internalGridData.value.splice(rowIndex, 1)
  emit('update:value', props.component.key, [...internalGridData.value])
}
</script>

<style scoped>
.editgrid-renderer {
  margin-bottom: 1.5rem;
}
</style>
