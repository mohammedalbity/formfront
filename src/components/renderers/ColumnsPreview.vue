<template>
  <div class="form-group">
    <!-- Component Header -->
    <div class="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-200 rounded-xl shadow-lg">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-white">{{ $t('formBuilder.componentLabels.columns') }}</h3>
          <p class="text-sm text-green-100">{{ component.columns?.length || 2 }} {{ $t('formBuilder.columns') }}</p>
        </div>
      </div>
    </div>

    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
    </label>
    <div>
      <!-- Scrollable container for columns -->
      <div class="overflow-x-auto" :class="{ relative: (component.columns?.length || 2) > 4 }">
        <!-- Scroll indicators for many columns -->
        <div
          v-if="(component.columns?.length || 2) > 4"
          class="absolute top-2 right-2 z-10 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200"
        >
          <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16l4-4m0 0l4-4m-4 4H3m4 0l4 4"
            ></path>
          </svg>
          {{ $t('formBuilder.scrollHorizontally') }}
        </div>
        <div
          class="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg transition-all duration-200"
          :class="getColumnsContainerClass(component.columns?.length || 2)"
          :style="getColumnsContainerStyle(component.columns?.length || 2)"
        >
          <div
            v-for="(column, columnIndex) in component.columns || getDefaultColumns()"
            :key="columnIndex"
            class="column-click-zone bg-gradient-to-br from-green-50 to-green-50 border-2 border-dashed border-green-200 rounded-xl p-4 min-h-[120px] relative transition-all duration-200 cursor-pointer hover:from-green-100 hover:to-green-100 hover:border-green-300 hover:shadow-md"
            :class="getColumnClass(component.columns?.length || 2)"
            @click.stop="openAddComponentModal(columnIndex)"
          >
            <!-- Column Header -->
            <div class="text-xs text-gray-500 mb-2 font-medium">
              {{ $t('formBuilder.column') }} {{ columnIndex + 1 }}
              <span class="text-gray-400"
                >({{ $t('formBuilder.width') }}: {{ column.width || 6 }}/12)</span
              >
            </div>

            <!-- Existing Components in Column -->
            <div v-if="column.components && column.components.length > 0" class="space-y-3">
              <div
                v-for="(childComponent, childIndex) in column.components"
                :key="`${childComponent.key || childComponent.type}-${childIndex}`"
                class="bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:from-green-50 hover:to-green-50 hover:border-green-300 transition-all duration-200 group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-700">
                      {{ getComponentLabel(childComponent.type) }}
                    </div>
                    <div class="text-gray-500 truncate">
                      {{ childComponent.label || childComponent.key }}
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div
                    class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    :class="{ 'flex-row': !isRTLDirection, 'flex-row-reverse': isRTLDirection }"
                  >
                    <!-- Edit Button -->
                    <button
                      @click.stop="editColumnComponent(columnIndex, childIndex, childComponent)"
                      class="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                      :title="$t('common.edit')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click.stop="deleteColumnComponent(columnIndex, childIndex, childComponent)"
                      class="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                      :title="$t('common.delete')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State with Add Button -->
            <div v-else class="flex flex-col items-center justify-center text-center py-8">
              <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg
                  class="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </div>
              <div class="text-sm text-gray-700 font-semibold mb-2">
                {{ $t('formBuilder.addComponent') }}
              </div>
              <div class="text-xs text-gray-500 mb-3">{{ $t('formBuilder.clickToAddComponent') }}</div>
              <div class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-500 text-white text-xs font-medium rounded-lg shadow-sm hover:from-green-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105">
                {{ $t('formBuilder.addComponent') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Column Button -->
      <div class="flex justify-center mt-6">
        <button
          @click="addNewColumn"
          class="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-500 rounded-xl shadow-md hover:from-green-600 hover:to-green-600 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          <span>{{ $t('formBuilder.addColumn') }}</span>
        </button>
      </div>

      <p v-if="component.description" class="text-xs text-gray-500 mt-2">
        {{ component.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'

interface Props {
  component: Record<string, any>
  readonly?: boolean
  forceUpdateKey?: number
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  forceUpdateKey: 0,
})

const { t } = useI18n()

const isRTLDirection = computed(() => isRTLSync())

const emit = defineEmits<{
  'edit-column-component': [
    columnIndex: number,
    componentIndex: number,
    component: Record<string, any>,
  ]
  'delete-column-component': [
    columnIndex: number,
    componentIndex: number,
    component: Record<string, any>,
  ]
  'open-add-component-modal': [columnIndex: number]
  'add-new-column': []
}>()

// Helper functions
const getComponentLabel = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const getDefaultColumns = () => {
  return [
    { width: 6, components: [] },
    { width: 6, components: [] },
  ]
}

const getColumnsGridClass = (columnCount: number) => {
  switch (columnCount) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2'
    case 3:
      return 'grid-cols-3'
    case 4:
      return 'grid-cols-4'
    case 5:
      return 'grid-cols-5'
    case 6:
      return 'grid-cols-6'
    case 7:
      return 'grid-cols-7'
    case 8:
      return 'grid-cols-8'
    case 9:
      return 'grid-cols-9'
    case 10:
      return 'grid-cols-10'
    case 11:
      return 'grid-cols-11'
    case 12:
      return 'grid-cols-12'
    default:
      return `grid-cols-${Math.min(columnCount, 12)}`
  }
}

const getColumnsContainerClass = (columnCount: number) => {
  // For many columns (more than 4), use flex layout to enable horizontal scrolling
  if (columnCount > 4) {
    return 'flex gap-4 min-w-max'
  }
  // For few columns, use responsive grid layout
  return `grid gap-4 ${getColumnsGridClass(columnCount)}`
}

const getColumnsContainerStyle = (columnCount: number) => {
  if (columnCount > 4) {
    return { minWidth: `${columnCount * 250}px` }
  }
  return {}
}

const getColumnClass = (columnCount: number) => {
  if (columnCount > 4) {
    return 'flex-shrink-0 w-60'
  }
  return 'w-full'
}

// Event handlers
const editColumnComponent = (
  columnIndex: number,
  componentIndex: number,
  component: Record<string, any>,
) => {
  console.log('🔧 ColumnsPreview: editColumnComponent called with raw params:', columnIndex, componentIndex, component)
  console.log('🔧 ColumnsPreview: typeof columnIndex:', typeof columnIndex, 'value:', columnIndex)
  console.log('🔧 ColumnsPreview: typeof componentIndex:', typeof componentIndex, 'value:', componentIndex)
  console.log('🔧 ColumnsPreview: typeof component:', typeof component, 'component.type:', component?.type)
  console.log('🔧 ColumnsPreview: props.component:', props.component)
  console.log('🔧 ColumnsPreview: props.component.columns:', props.component.columns)
  
  // Emit with separate parameters to match the expected signature
  console.log('🔧 ColumnsPreview: emitting with separate params:', columnIndex, componentIndex, component?.type)
  emit('edit-column-component', columnIndex, componentIndex, component)
}

const deleteColumnComponent = (
  columnIndex: number,
  componentIndex: number,
  component: Record<string, any>,
) => {
  console.log('🗑️ ColumnsPreview: deleteColumnComponent called with:', columnIndex, componentIndex, component?.type)
  emit('delete-column-component', columnIndex, componentIndex, component)
}

const openAddComponentModal = (columnIndex: number) => {
  emit('open-add-component-modal', columnIndex)
}

const addNewColumn = () => {
  emit('add-new-column')
}
</script>

<style scoped>
.column-click-zone {
  transition: all 0.2s ease;
}

.column-click-zone:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
