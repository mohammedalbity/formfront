<template>
  <div class="columns-renderer">
    
    <!-- Columns Container -->
    <div class="overflow-x-auto" :class="{ 'relative': columnCount > 4 }">
      <!-- Scroll indicator for many columns -->
      <div v-if="columnCount > 4" 
           class="absolute top-2 right-2 z-10 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
        <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l4-4m0 0l4-4m-4 4H3m4 0l4 4"></path>
        </svg>
        {{ t('publicForm.scrollHorizontally') }}
      </div>
      
      <!-- Columns Grid/Flex Container -->
      <div 
        class="transition-all duration-200"
        :class="getColumnsContainerClass(columnCount)"
        :style="getColumnsContainerStyle(columnCount)"
      >
        <div
          v-for="(column, columnIndex) in component.columns"
          :key="`column-${columnIndex}`"
          class="column-container bg-transparent rounded-lg p-4 transition-all duration-200"
          :class="getColumnClass(columnCount)"
        >
          <!-- Column Components -->
          <div v-if="column.components && column.components.length > 0" class="space-y-4">
            <div
              v-for="(childComponent, childIndex) in column.components"
              :key="childComponent.key || `child-${childIndex}`"
              class="column-component"
            >
              <!-- Render child component dynamically -->
              <component
                :is="getChildComponentRenderer(childComponent.type)"
                :component="childComponent"
                :form-data="formData"
                @update:value="(key: string, value: any) => updateValue(key, value)"
              />
            </div>
          </div>
          
          <!-- Empty column state -->
          <div v-else class="text-center py-8 text-gray-500">
            <div class="text-sm">{{ t('publicForm.emptyColumn') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Import child component renderers
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

// Props
interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:value': [key: string, value: any]
}>()

// Composables
const { t } = useI18n()

// Computed
const columnCount = computed(() => props.component.columns?.length || 2)

// Child component renderer mapping
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

// Methods
const getChildComponentRenderer = (type: string) => {
  return (childComponentRenderers as any)[type] || TextFieldRenderer
}

const getColumnsGridClass = (columnCount: number): string => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    7: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7',
    8: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8',
    9: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9',
    10: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-10',
    11: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-11',
    12: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12'
  }
  return (gridClasses as any)[Math.min(columnCount, 12)] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}

const getColumnsContainerClass = (columnCount: number): string => {
  if (columnCount > 4) {
    return 'flex gap-4 min-w-max'
  }
  // For few columns, use responsive grid layout
  return `grid gap-4 ${getColumnsGridClass(columnCount)}`
}

const getColumnsContainerStyle = (columnCount: number): any => {
  if (columnCount > 4) {
    // Calculate minimum width needed for all columns
    const minWidth = columnCount * 280 + (columnCount - 1) * 16 + 32 // 280px per column + gaps + padding
    return { minWidth: `${minWidth}px` }
  }
  return {}
}

const getColumnClass = (columnCount: number): string => {
  if (columnCount > 4) {
    // Fixed width for many columns with horizontal scroll
    return 'flex-shrink-0 w-[280px]'
  }
  // Flexible width for few columns
  return 'flex-1 min-w-0'
}

const updateValue = (key: string, value: any) => {
  emit('update:value', key, value)
}
</script>

<style scoped>
.columns-renderer {
  width: 100%;
}

.column-container {
  min-height: 120px;
}

.column-component {
  width: 100%;
}

/* Custom scrollbar for horizontal scroll */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
