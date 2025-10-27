<template>
  <div class="tree-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Tree Title -->
    <div v-if="component.label" class="tree-title mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0M8 5a2 2 0 012-2h2a2 2 0 012 2v0" />
        </svg>
        {{ component.label }}
        <span v-if="component.validate?.required" class="text-red-500 ml-1">*</span>
      </label>
      <p v-if="component.description" class="text-gray-600 text-sm mb-3">
        {{ component.description }}
      </p>
    </div>

    <!-- Tree Container -->
    <div class="tree-container bg-transparent border border-gray-300 rounded-lg p-4 min-h-[200px]">
      <!-- Tree Nodes -->
      <div v-if="treeData.length > 0" class="tree-nodes">
        <TreeNode
          v-for="(node, index) in treeData"
          :key="node.id || `node-${index}`"
          :node="node"
          :level="0"
          :selected-values="selectedValues"
          :multiple="component.multiple || false"
          @select="handleNodeSelect"
          @toggle="handleNodeToggle"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state text-center py-8">
        <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        </div>
        <p class="text-gray-500 text-sm">{{ $t('tree.noNodes') }}</p>
      </div>
    </div>

    <!-- Selected Values Display -->
    <div v-if="selectedValues.length > 0" class="selected-values mt-3">
      <div class="text-sm text-gray-600 mb-2">{{ $t('tree.selectedItems') }}:</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="value in selectedValues"
          :key="value"
          class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
        >
          {{ getNodeLabel(value) }}
          <button
            v-if="component.multiple"
            @click="removeSelection(value)"
            class="ml-1 text-green-600 hover:text-green-800"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
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

// Tree Node Component
const TreeNode = {
  name: 'TreeNode',
  props: {
    node: Object,
    level: Number,
    selectedValues: Array,
    multiple: Boolean
  },
  emits: ['select', 'toggle'],
  template: `
    <div class="tree-node" :style="{ marginLeft: level * 20 + 'px' }">
      <div class="node-content flex items-center py-1 hover:bg-gray-50 rounded cursor-pointer" @click="handleClick">
        <!-- Expand/Collapse Button -->
        <button
          v-if="node.children && node.children.length > 0"
          @click.stop="$emit('toggle', node)"
          class="w-4 h-4 mr-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <svg v-if="node.expanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div v-else class="w-4 h-4 mr-2"></div>

        <!-- Selection Checkbox/Radio -->
        <input
          v-if="multiple"
          type="checkbox"
          :checked="selectedValues.includes(node.value)"
          @change="$emit('select', node, $event.target.checked)"
          class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mr-2"
        />
        <input
          v-else
          type="radio"
          :checked="selectedValues.includes(node.value)"
          @change="$emit('select', node, true)"
          class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-2 mr-2"
        />

        <!-- Node Icon -->
        <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="node.children && node.children.length > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>

        <!-- Node Label -->
        <span class="text-sm text-gray-700 select-none">{{ node.label }}</span>
      </div>

      <!-- Child Nodes -->
      <div v-if="node.expanded && node.children && node.children.length > 0" class="child-nodes">
        <TreeNode
          v-for="(child, index) in node.children"
          :key="child.id || \`child-\${index}\`"
          :node="child"
          :level="level + 1"
          :selected-values="selectedValues"
          :multiple="multiple"
          @select="$emit('select', $event, $event)"
          @toggle="$emit('toggle', $event)"
        />
      </div>
    </div>
  `,
  setup(props: any, { emit }: any) {
    const handleClick = () => {
      if (!props.multiple) {
        emit('select', props.node, true)
      }
    }
    
    return {
      handleClick
    }
  }
}

// Props
interface TreeNode {
  id?: string
  value: any
  label: string
  children?: TreeNode[]
  expanded?: boolean
}

interface TreeComponent {
  type: 'tree'
  key: string
  label?: string
  description?: string
  multiple?: boolean
  data?: { tree: TreeNode[] }
  validate?: { required?: boolean }
}

interface Props {
  component: TreeComponent
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
const selectedValues = ref<any[]>([])
const validationError = ref<string>('')

// Computed
const treeData = computed(() => {
  return props.component.data?.tree || []
})

const componentKey = computed(() => {
  return props.component.key || 'tree'
})

// Methods
const handleNodeSelect = (node: TreeNode, selected: boolean) => {
  const value = node.value || node.id

  if (props.component.multiple) {
    if (selected) {
      if (!selectedValues.value.includes(value)) {
        selectedValues.value.push(value)
      }
    } else {
      const index = selectedValues.value.indexOf(value)
      if (index > -1) {
        selectedValues.value.splice(index, 1)
      }
    }
  } else {
    selectedValues.value = selected ? [value] : []
  }

  updateFormData()
  clearValidationError()
}

const handleNodeToggle = (node: TreeNode) => {
  node.expanded = !node.expanded
}

const removeSelection = (value: any) => {
  const index = selectedValues.value.indexOf(value)
  if (index > -1) {
    selectedValues.value.splice(index, 1)
    updateFormData()
  }
}

const getNodeLabel = (value: any): string => {
  const findNodeByValue = (nodes: TreeNode[], targetValue: any): TreeNode | null => {
    for (const node of nodes) {
      if (node.value === targetValue || node.id === targetValue) {
        return node
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeByValue(node.children, targetValue)
        if (found) return found
      }
    }
    return null
  }

  const node = findNodeByValue(treeData.value, value)
  return node ? node.label : value
}

const updateFormData = () => {
  const value = props.component.multiple ? selectedValues.value : selectedValues.value[0] || null
  emit('update:value', componentKey.value, value)
}

const validate = (): boolean => {
  if (props.component.validate?.required) {
    if (selectedValues.value.length === 0) {
      validationError.value = t('validation.required')
      return false
    }
  }
  return true
}

const clearValidationError = () => {
  validationError.value = ''
}

// Initialize selected values from form data
const initializeSelectedValues = () => {
  const formValue = props.formData?.[componentKey.value]
  if (formValue !== undefined && formValue !== null) {
    if (props.component.multiple) {
      selectedValues.value = Array.isArray(formValue) ? [...formValue] : [formValue]
    } else {
      selectedValues.value = formValue ? [formValue] : []
    }
  }
}

// Watch for external form data changes
watch(
  () => props.formData?.[componentKey.value],
  (newValue) => {
    if (newValue !== undefined) {
      if (props.component.multiple) {
        selectedValues.value = Array.isArray(newValue) ? [...newValue] : [newValue]
      } else {
        selectedValues.value = newValue ? [newValue] : []
      }
    }
  },
  { immediate: true }
)

// Lifecycle
onMounted(() => {
  initializeSelectedValues()
})

// Expose methods for parent component
defineExpose({
  validate,
  getFormData: () => ({
    [componentKey.value]: props.component.multiple ? selectedValues.value : selectedValues.value[0] || null
  })
})
</script>

<style scoped>
.tree-renderer {
  width: 100%;
}

.tree-container {
  max-height: 400px;
  overflow-y: auto;
}

.tree-node {
  user-select: none;
}

.node-content {
  transition: background-color 0.2s ease;
}

.node-content:hover {
  background-color: #f9fafb;
}

.child-nodes {
  border-left: 1px dashed #d1d5db;
  margin-left: 10px;
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

.rtl .child-nodes {
  border-left: none;
  border-right: 1px dashed #d1d5db;
  margin-left: 0;
  margin-right: 10px;
}

/* Custom scrollbar */
.tree-container::-webkit-scrollbar {
  width: 6px;
}

.tree-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tree-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tree-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Focus styles */
input[type="checkbox"]:focus,
input[type="radio"]:focus {
  outline: none;
  border-color: #22c55e;
}
</style>
