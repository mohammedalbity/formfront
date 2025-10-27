<template>
  <div class="form-section-manager" :class="{ rtl: isRTLSync() }">
    <!-- Section Management Header -->
    <div class="section-header bg-white border-b p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ $t('formBuilder.sections.title') }}
        </h3>
        <button
          @click="addSection"
          class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {{ $t('formBuilder.sections.addSection') }}
        </button>
      </div>

      <!-- Sections List -->
      <div class="sections-list space-y-2">
        <div
          v-for="(section, index) in sections"
          :key="section.id"
          class="section-item p-3 border rounded-lg transition-colors"
          :class="{
            'border-blue-500 bg-blue-50': currentSectionIndex === index,
            'border-gray-200 bg-white hover:border-gray-300': currentSectionIndex !== index,
            'border-green-400 bg-green-50': dragOverSectionId === section.id
          }"
          @dragover="onDragOver"
          @drop="onDrop($event, section.id)"
          @dragenter="dragOverSectionId = section.id"
          @dragleave="dragOverSectionId = null"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
              <!-- Section Icon -->
              <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H3m16 14H5"></path>
                </svg>
              </div>

              <!-- Section Info -->
              <div class="flex-1 min-w-0">
                <input
                  v-if="editingSectionId === section.id"
                  v-model="editingSectionTitle"
                  @blur="saveSection(section)"
                  @keyup.enter="saveSection(section)"
                  @keyup.escape="cancelEdit"
                  class="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="$t('formBuilder.sections.titlePlaceholder')"
                  ref="editInput"
                />
                <div v-else class="cursor-pointer" @click="editSection(section)">
                  <h4 class="font-medium text-gray-900 truncate">
                    {{ section.title || $t('formBuilder.sections.untitledSection') }}
                  </h4>
                  <p class="text-xs text-gray-500">
                    {{ getComponentsCountText(section.componentIds.length) }}
                  </p>
                </div>
              </div>

              <!-- Section Badge -->
              <div class="flex items-center gap-2">
                <span
                  v-if="currentSectionIndex === index"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {{ $t('formBuilder.sections.current') }}
                </span>
                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {{ index + 1 }}
                </span>
              </div>
            </div>

            <!-- Section Actions -->
            <div class="flex items-center gap-1 ml-3">
              <button
                @click="selectSection(index)"
                class="w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center justify-center"
                :title="$t('formBuilder.sections.selectSection')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
              
              <button
                v-if="sections.length > 1"
                @click="deleteSection(index)"
                class="w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
                :title="$t('formBuilder.sections.deleteSection')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Assignment Area -->
    <div class="section-assignment p-4 bg-gray-50">
      <div class="mb-3">
        <h4 class="text-sm font-medium text-gray-700 mb-2">
          {{ $t('formBuilder.sections.assignComponents') }}
        </h4>
        <p class="text-xs text-gray-500">
          {{ $t('formBuilder.sections.assignComponentsDesc') }}
        </p>
      </div>

      <!-- Current Section Components -->
      <div v-if="currentSection" class="current-section-components">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ currentSection.title || $t('formBuilder.sections.untitledSection') }}
          </span>
          <span class="text-xs text-gray-500">
            {{ getComponentsCountText(currentSection.componentIds.length) }}
          </span>
        </div>

        <!-- Components in Current Section -->
        <div class="space-y-1 max-h-32 overflow-y-auto">
          <div
            v-for="componentId in currentSection.componentIds"
            :key="componentId"
            class="flex items-center justify-between p-2 bg-white border border-gray-200 rounded text-sm cursor-move"
            draggable="true"
            @dragstart="onDragStart($event, componentId)"
          >
            <span class="text-gray-700">
              {{ getComponentDisplayName(componentId) }}
            </span>
            <button
              @click="removeComponentFromSection(componentId)"
              class="text-red-500 hover:text-red-700 transition-colors"
              :title="$t('formBuilder.sections.removeComponent')"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Unassigned Components -->
      <div v-if="unassignedComponents.length > 0" class="unassigned-components mt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ $t('formBuilder.sections.unassignedComponents') }}
          </span>
          <button
            @click="assignAllUnassignedToCurrentSection"
            class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
            :title="$t('formBuilder.sections.assignAllToCurrentSection')"
          >
            {{ $t('formBuilder.sections.assignAllToCurrentSection') }}
          </button>
        </div>

        <!-- Unassigned Components List -->
        <div class="space-y-1 max-h-32 overflow-y-auto">
          <div
            v-for="component in unassignedComponents"
            :key="component.key"
            class="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
            draggable="true"
            @dragstart="onDragStart($event, component.key)"
          >
            <span class="text-gray-700">
              {{ component.label || component.key }}
            </span>
            <button
              @click="assignComponentToCurrentSection(component.key)"
              class="text-blue-500 hover:text-blue-700 transition-colors"
              :title="$t('formBuilder.sections.assignToCurrentSection')"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../i18n'

// Types
interface FormSection {
  id: string
  title: string
  componentIds: string[]
  order: number
}

interface FormComponent {
  key: string
  type: string
  label: string
  [key: string]: any
}

// Props
interface Props {
  sections: FormSection[]
  components: FormComponent[]
  currentSectionIndex: number
}

const props = withDefaults(defineProps<Props>(), {
  sections: () => [],
  components: () => [],
  currentSectionIndex: 0
})

// Emits
interface Emits {
  (e: 'update:sections', sections: FormSection[]): void
  (e: 'update:currentSectionIndex', index: number): void
  (e: 'sectionChanged', sectionIndex: number): void
  (e: 'componentAssigned', componentId: string, sectionId: string): void
  (e: 'componentRemoved', componentId: string, sectionId: string): void
}

const emit = defineEmits<Emits>()

// Composables
const { t } = useI18n()

// Reactive state
const editingSectionId = ref<string | null>(null)
const editingSectionTitle = ref('')
const editInput = ref<HTMLInputElement>()
const dragOverSectionId = ref<string | null>(null)

// Computed
const currentSection = computed(() => {
  return props.sections[props.currentSectionIndex] || null
})

// Get unassigned components
const unassignedComponents = computed(() => {
  const assignedComponentIds = new Set()
  props.sections.forEach(section => {
    section.componentIds.forEach(id => assignedComponentIds.add(id))
  })
  
  return props.components.filter(component => !assignedComponentIds.has(component.key))
})

// Methods
const generateSectionId = (): string => {
  return 'section_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const addSection = () => {
  const newSection: FormSection = {
    id: generateSectionId(),
    title: '',
    componentIds: [],
    order: props.sections.length
  }
  
  const updatedSections = [...props.sections, newSection]
  emit('update:sections', updatedSections)
  
  // Auto-edit the new section
  nextTick(() => {
    editSection(newSection)
  })
}

const editSection = (section: FormSection) => {
  editingSectionId.value = section.id
  editingSectionTitle.value = section.title
  
  nextTick(() => {
    if (editInput.value && typeof editInput.value.focus === 'function') {
      editInput.value.focus()
    }
  })
}

const saveSection = (section: FormSection) => {
  const updatedSections = props.sections.map(s => 
    s.id === section.id 
      ? { ...s, title: editingSectionTitle.value.trim() }
      : s
  )
  
  emit('update:sections', updatedSections)
  cancelEdit()
}

const cancelEdit = () => {
  editingSectionId.value = null
  editingSectionTitle.value = ''
}

const selectSection = (index: number) => {
  emit('update:currentSectionIndex', index)
  emit('sectionChanged', index)
}

const deleteSection = (index: number) => {
  if (props.sections.length <= 1) return
  
  const sectionToDelete = props.sections[index]
  
  // Move components from deleted section to first section
  if (sectionToDelete.componentIds.length > 0 && props.sections.length > 1) {
    const firstSection = props.sections[0]
    if (firstSection.id !== sectionToDelete.id) {
      const updatedSections = props.sections.map(s => 
        s.id === firstSection.id 
          ? { ...s, componentIds: [...s.componentIds, ...sectionToDelete.componentIds] }
          : s
      )
      emit('update:sections', updatedSections.filter(s => s.id !== sectionToDelete.id))
    } else {
      // If deleting first section, move to second section
      const secondSection = props.sections[1]
      const updatedSections = props.sections.map(s => 
        s.id === secondSection.id 
          ? { ...s, componentIds: [...s.componentIds, ...sectionToDelete.componentIds] }
          : s
      )
      emit('update:sections', updatedSections.filter(s => s.id !== sectionToDelete.id))
    }
  } else {
    const updatedSections = props.sections.filter(s => s.id !== sectionToDelete.id)
    emit('update:sections', updatedSections)
  }
  
  // Adjust current section index if needed
  if (props.currentSectionIndex >= index && props.currentSectionIndex > 0) {
    emit('update:currentSectionIndex', props.currentSectionIndex - 1)
  }
}

const removeComponentFromSection = (componentId: string) => {
  if (!currentSection.value) return
  
  const updatedSections = props.sections.map(s => 
    s.id === currentSection.value!.id 
      ? { ...s, componentIds: s.componentIds.filter(id => id !== componentId) }
      : s
  )
  
  emit('update:sections', updatedSections)
  emit('componentRemoved', componentId, currentSection.value.id)
}

const assignComponentToCurrentSection = (componentId: string) => {
  if (!currentSection.value) return
  
  // Remove from other sections first
  const updatedSections = props.sections.map(s => ({
    ...s,
    componentIds: s.componentIds.filter(id => id !== componentId)
  }))
  
  // Add to current section
  const finalSections = updatedSections.map(s => 
    s.id === currentSection.value!.id 
      ? { ...s, componentIds: [...s.componentIds, componentId] }
      : s
  )
  
  emit('update:sections', finalSections)
  emit('componentAssigned', componentId, currentSection.value.id)
}

// Helper methods
const getComponentsCountText = (count: number): string => {
  if (count === 0) return t('formBuilder.sections.noComponents')
  if (count === 1) return t('formBuilder.sections.oneComponent')
  return t('formBuilder.sections.componentsCount', { count })
}

const getComponentDisplayName = (componentId: string): string => {
  const component = props.components.find(c => c.key === componentId)
  return component?.label || component?.type || componentId
}

// Assign all unassigned components to current section
const assignAllUnassignedToCurrentSection = () => {
  if (!currentSection.value || unassignedComponents.value.length === 0) return
  
  const updatedSections = props.sections.map(s => 
    s.id === currentSection.value!.id 
      ? { ...s, componentIds: [...s.componentIds, ...unassignedComponents.value.map(c => c.key)] }
      : s
  )
  
  emit('update:sections', updatedSections)
}

// Drag and drop functionality
const onDragStart = (event: DragEvent, componentId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', componentId)
    event.dataTransfer.effectAllowed = 'move'
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent, targetSectionId: string) => {
  event.preventDefault()
  dragOverSectionId.value = null // Clear drag over state
  
  const componentId = event.dataTransfer?.getData('text/plain')
  if (!componentId) return
  
  // Find target section and assign component
  const targetSection = props.sections.find(s => s.id === targetSectionId)
  if (!targetSection) return
  
  // Don't do anything if component is already in target section
  if (targetSection.componentIds.includes(componentId)) return
  
  const updatedSections = props.sections.map(section => {
    if (section.id === targetSectionId) {
      // Add to target section
      return {
        ...section,
        componentIds: [...section.componentIds, componentId]
      }
    } else {
      // Remove from other sections
      return {
        ...section,
        componentIds: section.componentIds.filter(id => id !== componentId)
      }
    }
  })
  
  emit('update:sections', updatedSections)
  emit('componentAssigned', componentId, targetSectionId)
}

// Expose methods for parent component
defineExpose({
  assignComponentToCurrentSection,
  getCurrentSectionId: () => currentSection.value?.id || null
})
</script>

<style scoped>
.form-section-manager {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.section-item {
  transition: all 0.2s ease;
}

.section-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.rtl {
  direction: rtl;
}

.rtl .section-item {
  text-align: right;
}
</style>
