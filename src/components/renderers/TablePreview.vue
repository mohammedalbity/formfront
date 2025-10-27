<template>
  <div class="form-group" :key="`table-${component.key || component.type}-${forceUpdateKey}`">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
    </label>

    <!-- Table Container -->
    <div class="border-2 border-blue-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- Table Header -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8h9m-9 4h9"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ $t('formBuilder.componentLabels.table') || 'جدول' }}</h3>
              <p class="text-blue-100 text-sm">{{ $t('formBuilder.componentDescriptions.table') || 'جدول لتنظيم البيانات في صفوف وأعمدة' }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ getTableHeaders(component).length }} × {{ getTableRows(component).length }}
            </span>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="p-4">
        <!-- Table Structure Display -->
        <div v-if="getTableHeaders(component).length > 0" class="space-y-4">
          <!-- Headers Preview -->
          <div class="text-xs font-medium text-gray-600 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            {{ $t('formBuilder.tableHeaders') || 'Table Headers' }}
          </div>

          <!-- Headers Display with Edit/Delete Actions -->
          <div class="flex flex-wrap gap-2 mb-4">
            <div v-for="(header, headerIndex) in getTableHeaders(component)"
                 :key="`header-preview-${headerIndex}-${forceUpdateKey}`"
                 class="group bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-sm hover:border-purple-300 hover:shadow-sm transition-all duration-200">
              <div class="flex items-center justify-between space-x-2">
                <span class="font-medium text-purple-800">{{ header || `${$t('formBuilder.column')} ${headerIndex + 1}` }}</span>
                <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="editTableHeader(headerIndex)"
                          class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          :title="$t('formBuilder.editHeader')">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click.stop="deleteTableColumn(headerIndex)"
                          class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          :title="$t('formBuilder.deleteColumn')"
                          :disabled="getTableHeaders(component).length <= 1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Add Column Button -->
            <button @click="addTableColumn"
                    class="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>{{ $t('formBuilder.addColumn') }}</span>
            </button>
          </div>

          <!-- Actual Table with Interactive Cells -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th v-for="(header, headerIndex) in getTableHeaders(component)"
                      :key="`header-${headerIndex}-${forceUpdateKey}`"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                    {{ header || `${$t('formBuilder.column')} ${headerIndex + 1}` }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <!-- Actual Table Rows with Interactive Cells -->
                <tr v-for="(row, rowIndex) in getTableRows(component)"
                    :key="`table-row-${rowIndex}-${forceUpdateKey}`"
                    class="hover:bg-gray-50">
                  <td v-for="(cell, cellIndex) in getTableCells(row, component)"
                      :key="`table-cell-${rowIndex}-${cellIndex}-${forceUpdateKey}`"
                      class="px-3 py-2 border-r border-gray-200 last:border-r-0 min-h-[60px] align-top">

                    <!-- Cell Content: Components or Empty State -->
                    <div v-if="cell.components && cell.components.length > 0" class="space-y-1">
                      <div v-for="(cellComponent, componentIndex) in cell.components"
                           :key="`cell-component-${rowIndex}-${cellIndex}-${componentIndex}-${forceUpdateKey}`"
                           class="bg-gray-100 p-2 rounded text-xs border border-gray-200 group hover:bg-gray-200 transition-colors">
                        <div class="flex items-center justify-between">
                          <div class="flex-1 min-w-0">
                            <div class="font-medium text-gray-700">{{ getComponentLabel(cellComponent.type) }}</div>
                            <div class="text-gray-500 truncate">{{ cellComponent.label || cellComponent.key }}</div>
                          </div>

                          <!-- Component Actions (show on hover) -->
                          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                            <button @click.stop="editTableCellComponent(rowIndex, cellIndex, componentIndex, cellComponent)"
                                    class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    :title="$t('formBuilder.editComponent')">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button @click.stop="deleteTableCellComponent(rowIndex, cellIndex, componentIndex, cellComponent)"
                                    class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    :title="$t('formBuilder.deleteComponent')">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Empty Cell - Click to Add Component -->
                    <div v-else
                         @click="openAddComponentToTableCellModal(rowIndex, cellIndex)"
                         class="min-h-[50px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                      <div class="text-center">
                        <div class="w-6 h-6 mx-auto mb-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </div>
                        <div class="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                          {{ $t('formBuilder.addComponent') }}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Add Row Button -->
          <div class="flex justify-center mt-4">
            <button @click="addTableRow"
                    class="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>{{ $t('formBuilder.addRow') }}</span>
            </button>
          </div>
        </div>

        <!-- Empty Table State -->
        <div v-else class="text-center py-8">
          <div class="flex flex-col items-center">
            <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8h9m-9 4h9"></path>
            </svg>
            <h4 class="text-sm font-medium text-gray-700 mb-1">{{ $t('formBuilder.emptyTable') || 'Empty Table' }}</h4>
            <p class="text-xs text-gray-500 mb-4">{{ $t('formBuilder.clickToSetupTable') || 'Click to setup table structure.' }}</p>
            <button @click="setupTable"
                    class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t('formBuilder.setupTable') || 'Setup Table' }}
            </button>
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
import { computed } from 'vue'
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

const emit = defineEmits<{
  'edit-table-cell-component': [rowIndex: number, cellIndex: number, componentIndex: number, component: Record<string, any>]
  'delete-table-cell-component': [rowIndex: number, cellIndex: number, componentIndex: number, component: Record<string, any>]
  'open-add-component-to-table-cell-modal': [rowIndex: number, cellIndex: number]
  'edit-table-header': [headerIndex: number]
  'delete-table-column': [columnIndex: number]
  'add-table-column': []
  'add-table-row': []
  'setup-table': []
}>()

// Helper functions
const getComponentLabel = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const getTableHeaders = (tableComponent: any): string[] => {
  // New structure: headers array
  if (tableComponent.headers && Array.isArray(tableComponent.headers) && tableComponent.headers.length > 0) {
    return tableComponent.headers
  }
  
  // Old structure: header1, header2, etc. properties
  const oldHeaders = []
  let headerIndex = 1
  while (tableComponent[`header${headerIndex}`]) {
    oldHeaders.push(tableComponent[`header${headerIndex}`])
    headerIndex++
  }
  
  if (oldHeaders.length > 0) {
    return oldHeaders
  }
  
  // Fallback: determine from existing rows structure
  if (tableComponent.rows && Array.isArray(tableComponent.rows) && tableComponent.rows.length > 0) {
    const firstRow = tableComponent.rows[0]
    
    // New structure: row.cells array
    if (firstRow.cells && Array.isArray(firstRow.cells)) {
      const columnCount = firstRow.cells.length
      return Array(columnCount).fill(null).map((_, index) => `عمود ${index + 1}`)
    }
    
    // Old structure: row is array of cells
    if (Array.isArray(firstRow)) {
      const columnCount = firstRow.length
      return Array(columnCount).fill(null).map((_, index) => `عمود ${index + 1}`)
    }
  }
  
  // Default fallback
  return ['عمود 1', 'عمود 2']
}

const getTableRows = (tableComponent: any): any[] => {
  if (!tableComponent.rows || !Array.isArray(tableComponent.rows)) {
    return [createDefaultTableRow(getTableHeaders(tableComponent).length, 0)]
  }

  const headers = getTableHeaders(tableComponent)
  
  return tableComponent.rows.map((row: any, rowIndex: number) => {
    // New structure: row has cells array
    if (row.cells && Array.isArray(row.cells)) {
      return row
    }
    
    // Old structure: row is array of cells directly
    if (Array.isArray(row)) {
      const newRow: { cells: Array<{ components: any[] }> } = { cells: [] }
      
      // Convert old structure to new structure
      for (let i = 0; i < headers.length; i++) {
        if (i < row.length && row[i]) {
          if (row[i].components && Array.isArray(row[i].components)) {
            newRow.cells.push({
              components: row[i].components
            })
          } else {
            newRow.cells.push(createEmptyTableCell())
          }
        } else {
          newRow.cells.push(createEmptyTableCell())
        }
      }
      
      return newRow
    }
    
    // Fallback: create default row
    return createDefaultTableRow(headers.length, rowIndex)
  })
}

const getTableCells = (row: any, tableComponent: any): any[] => {
  const headers = getTableHeaders(tableComponent)
  
  if (row.cells && Array.isArray(row.cells)) {
    // Ensure we have the right number of cells
    const cells = [...row.cells]
    while (cells.length < headers.length) {
      cells.push(createEmptyTableCell())
    }
    return cells.slice(0, headers.length)
  }
  
  // Fallback: create empty cells
  return Array(headers.length).fill(null).map(() => createEmptyTableCell())
}

const createEmptyTableCell = () => {
  return { components: [] }
}

const createDefaultTableRow = (columnCount: number, rowIndex: number) => {
  return {
    cells: Array(columnCount).fill(null).map(() => createEmptyTableCell())
  }
}

// Event handlers
const editTableCellComponent = (rowIndex: number, cellIndex: number, componentIndex: number, component: Record<string, any>) => {
  emit('edit-table-cell-component', rowIndex, cellIndex, componentIndex, component)
}

const deleteTableCellComponent = (rowIndex: number, cellIndex: number, componentIndex: number, component: Record<string, any>) => {
  emit('delete-table-cell-component', rowIndex, cellIndex, componentIndex, component)
}

const openAddComponentToTableCellModal = (rowIndex: number, cellIndex: number) => {
  emit('open-add-component-to-table-cell-modal', rowIndex, cellIndex)
}

const editTableHeader = (headerIndex: number) => {
  emit('edit-table-header', headerIndex)
}

const deleteTableColumn = (columnIndex: number) => {
  emit('delete-table-column', columnIndex)
}

const addTableColumn = () => {
  emit('add-table-column')
}

const addTableRow = () => {
  emit('add-table-row')
}

const setupTable = () => {
  emit('setup-table')
}
</script>
