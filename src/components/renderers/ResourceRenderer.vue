<template>
  <div class="resource-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Resource Title -->
    <div v-if="component.label" class="resource-title mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
        {{ component.label }}
        <span v-if="component.validate?.required" class="text-red-500 ml-1">*</span>
      </label>
      <p v-if="component.description" class="text-gray-600 text-sm mb-3">
        {{ component.description }}
      </p>
    </div>

    <!-- Resource Select Container -->
    <div class="resource-container">
      <!-- Search Input -->
      <div v-if="component.searchEnabled !== false" class="search-container mb-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('resource.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            @input="handleSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-orange-200 border-t-orange-600"></div>
          </div>
        </div>
      </div>

      <!-- Resource Selection -->
      <div class="resource-selection">
        <!-- Single Select -->
        <div v-if="!component.multiple" class="single-select">
          <select
            v-model="selectedValue"
            @change="handleSelectionChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-transparent"
            :disabled="loading"
          >
            <option value="">{{ $t('resource.selectOption') }}</option>
            <option
              v-for="item in filteredItems"
              :key="item[valueProperty]"
              :value="item[valueProperty]"
            >
              {{ getDisplayText(item) }}
            </option>
          </select>
        </div>

        <!-- Multiple Select -->
        <div v-else class="multiple-select">
          <div class="selected-items mb-3" v-if="selectedItems.length > 0">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in selectedItems"
                :key="item[valueProperty]"
                class="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
              >
                {{ getDisplayText(item) }}
                <button
                  @click="removeSelectedItem(item)"
                  class="ml-2 text-orange-600 hover:text-orange-800 focus:outline-none"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <div class="available-items border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
            <div v-if="filteredItems.length === 0" class="p-4 text-center text-gray-500">
              <div v-if="loading">{{ $t('resource.loading') }}</div>
              <div v-else-if="searchQuery">{{ $t('resource.noResults') }}</div>
              <div v-else>{{ $t('resource.noItems') }}</div>
            </div>
            <button
              v-for="item in filteredItems"
              :key="item[valueProperty]"
              @click="addSelectedItem(item)"
              :disabled="isItemSelected(item)"
              class="w-full text-left px-4 py-2 hover:bg-orange-50 focus:outline-none focus:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100 last:border-b-0"
            >
              <div class="flex items-center justify-between">
                <span>{{ getDisplayText(item) }}</span>
                <svg v-if="isItemSelected(item)" class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Resource Info -->
      <div v-if="selectedResourceInfo" class="resource-info mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 class="text-sm font-medium text-gray-800 mb-2">{{ $t('resource.selectedInfo') }}</h4>
        <div class="text-sm text-gray-600">
          <div v-for="(value, key) in selectedResourceInfo" :key="key" class="mb-1">
            <span class="font-medium">{{ key }}:</span> {{ value }}
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.limit" class="pagination mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          {{ $t('resource.showing', { 
            start: (pagination.page - 1) * pagination.limit + 1,
            end: Math.min(pagination.page * pagination.limit, pagination.total),
            total: pagination.total
          }) }}
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('common.previous') }}
          </button>
          <span class="text-sm text-gray-600">
            {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.limit) }}
          </span>
          <button
            @click="goToPage(pagination.page + 1)"
            :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('common.next') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Validation Error -->
    <div v-if="validationError" class="mt-2 text-red-600 text-sm">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'

// Props
interface Props {
  component: any
  formData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:value': [key: string, value: any]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const items = ref<any[]>([])
const selectedValue = ref<any>(null)
const selectedItems = ref<any[]>([])
const searchQuery = ref<string>('')
const loading = ref<boolean>(false)
const validationError = ref<string>('')
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// Computed
const componentKey = computed(() => {
  return props.component.key || 'resource'
})

const valueProperty = computed(() => {
  return props.component.valueProperty || 'id'
})

const labelProperty = computed(() => {
  return props.component.labelProperty || 'name'
})

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return items.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return items.value.filter(item => {
    const label = getDisplayText(item).toLowerCase()
    return label.includes(query)
  })
})

const selectedResourceInfo = computed(() => {
  if (!props.component.showSelectedInfo) return null
  
  if (props.component.multiple) {
    return selectedItems.value.length > 0 ? selectedItems.value[0] : null
  } else {
    return items.value.find(item => item[valueProperty.value] === selectedValue.value) || null
  }
})

// Methods
const getDisplayText = (item: any): string => {
  if (props.component.template) {
    // Simple template replacement
    return props.component.template.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => {
      return item[key] || match
    })
  }
  return item[labelProperty.value] || item[valueProperty.value] || 'Unknown'
}

const loadItems = async () => {
  loading.value = true
  
  try {
    // Simulate API call - in real implementation, this would call the actual resource API
    const mockData = props.component.data?.values || [
      { id: 1, name: 'Item 1', description: 'First item' },
      { id: 2, name: 'Item 2', description: 'Second item' },
      { id: 3, name: 'Item 3', description: 'Third item' }
    ]
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    items.value = mockData
    pagination.value.total = mockData.length
  } catch (error) {
    console.error('Error loading resource items:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  // In real implementation, this would trigger API search
  // For now, filtering is done in computed property
}

const handleSelectionChange = () => {
  updateFormData()
  clearValidationError()
}

const addSelectedItem = (item: any) => {
  if (!isItemSelected(item)) {
    selectedItems.value.push(item)
    updateFormData()
    clearValidationError()
  }
}

const removeSelectedItem = (item: any) => {
  const index = selectedItems.value.findIndex(selected => 
    selected[valueProperty.value] === item[valueProperty.value]
  )
  if (index > -1) {
    selectedItems.value.splice(index, 1)
    updateFormData()
  }
}

const isItemSelected = (item: any): boolean => {
  return selectedItems.value.some(selected => 
    selected[valueProperty.value] === item[valueProperty.value]
  )
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= Math.ceil(pagination.value.total / pagination.value.limit)) {
    pagination.value.page = page
    loadItems()
  }
}

const updateFormData = () => {
  let value
  if (props.component.multiple) {
    value = selectedItems.value.map(item => item[valueProperty.value])
  } else {
    value = selectedValue.value
  }
  
  emit('update:value', componentKey.value, value)
}

const validate = (): boolean => {
  if (props.component.validate?.required) {
    if (props.component.multiple) {
      if (selectedItems.value.length === 0) {
        validationError.value = t('validation.required')
        return false
      }
    } else {
      if (!selectedValue.value) {
        validationError.value = t('validation.required')
        return false
      }
    }
  }
  return true
}

const clearValidationError = () => {
  validationError.value = ''
}

// Initialize from form data
const initializeFromFormData = () => {
  const formValue = props.formData?.[componentKey.value]
  
  if (props.component.multiple) {
    if (Array.isArray(formValue)) {
      // Find items that match the form values
      selectedItems.value = items.value.filter(item => 
        formValue.includes(item[valueProperty.value])
      )
    }
  } else {
    selectedValue.value = formValue || null
  }
}

// Watch for external form data changes
watch(
  () => props.formData?.[componentKey.value],
  () => {
    initializeFromFormData()
  },
  { deep: true }
)

// Watch for items changes to update selections
watch(items, () => {
  initializeFromFormData()
})

// Lifecycle
onMounted(async () => {
  await loadItems()
  initializeFromFormData()
})

// Expose methods for parent component
defineExpose({
  validate,
  refresh: loadItems,
  getFormData: () => ({
    [componentKey.value]: props.component.multiple 
      ? selectedItems.value.map(item => item[valueProperty.value])
      : selectedValue.value
  })
})
</script>

<style scoped>
.resource-renderer {
  width: 100%;
}

.resource-container {
  position: relative;
}

.available-items {
  background-color: #ffffff;
}

.available-items button {
  transition: background-color 0.2s ease;
}

.selected-items span {
  transition: all 0.2s ease;
}

.rtl {
  direction: rtl;
}

.rtl .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

.rtl .ml-1 {
  margin-left: 0;
  margin-right: 0.25rem;
}

.rtl .ml-2 {
  margin-left: 0;
  margin-right: 0.5rem;
}

.rtl .pl-10 {
  padding-left: 1rem;
  padding-right: 2.5rem;
}

.rtl .pr-4 {
  padding-right: 1rem;
  padding-left: 1rem;
}

.rtl .space-x-2 > * + * {
  margin-left: 0;
  margin-right: 0.5rem;
}

/* Custom scrollbar */
.available-items::-webkit-scrollbar {
  width: 6px;
}

.available-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.available-items::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.available-items::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Focus styles */
input:focus,
select:focus {
  outline: none;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive design */
@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .selected-items .flex {
    gap: 0.5rem;
  }
}
</style>
