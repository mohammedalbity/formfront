<template>
  <div class="form-group">
    <!-- Container -->
    <div class="border-2 border-green-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- Container Header -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || (t('formBuilder.container') || 'Container') }}</h3>
              <p class="text-green-100 text-sm">{{ $t('formBuilder.componentDescriptions.container') || 'حاوي عام للمكونات' }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ (component.components?.length || 0) }} {{ t('formBuilder.components') || 'components' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Container Content -->
      <div class="p-4">
        <!-- Components Display -->
        <div v-if="component.components && component.components.length > 0" class="space-y-3">
          <div class="text-xs font-medium text-gray-600 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            {{ t('formBuilder.containerComponents') || 'Container Components' }}
          </div>

          <!-- Components List -->
          <div class="space-y-2">
            <div
              v-for="(containerComponent, index) in component.components"
              :key="`container-${containerComponent.key || containerComponent.type}-${index}-${forceUpdateKey}`"
              class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 group hover:shadow-sm transition-all"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span class="text-sm font-medium text-gray-800">
                      {{ getComponentLabel(containerComponent.type) }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600 truncate">
                    {{ containerComponent.label || containerComponent.key || t('formBuilder.noLabel') || 'No label' }}
                  </div>
                  <div class="text-xs text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    {{ containerComponent.type }}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Edit Button -->
                  <button @click.stop="editContainerComponent(index, containerComponent)"
                          class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <!-- Delete Button -->
                  <button @click.stop="deleteContainerComponent(index, containerComponent)"
                          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          :title="$t('common.delete')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Container Information -->
          <div class="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
            <div class="flex items-center mb-2">
              <svg class="w-4 h-4 text-cyan-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium text-cyan-800">{{ t('formBuilder.containerUsage') || 'Container Usage' }}</span>
            </div>
            <div class="text-xs text-cyan-700">
              {{ t('formBuilder.containerDescription') || 'This container holds and organizes form components in a flexible layout structure.' }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8" @click.stop="openAddComponentToContainerModal">
          <div class="flex flex-col items-center cursor-pointer hover:bg-cyan-50 rounded-lg p-4 transition-colors">
            <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h4 class="text-sm font-medium text-gray-700 mb-1">{{ t('formBuilder.emptyContainer') || 'Empty Container' }}</h4>
            <p class="text-xs text-gray-500 mb-4">{{ t('formBuilder.clickToAddComponents') || 'Click to add components to this container.' }}</p>
          </div>
        </div>
      </div>

      <!-- Container Actions -->
      <div v-if="component.components && component.components.length > 0" class="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div class="flex items-center justify-between">
          <button @click.stop="openAddComponentToContainerModal"
                  class="inline-flex items-center px-3 py-1.5 bg-cyan-600 text-white text-xs font-medium rounded-md hover:bg-cyan-700 transition-colors">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            {{ $t('formBuilder.addComponent') || 'Add Component' }}
          </button>
          <div class="text-xs text-gray-500">
            {{ t('formBuilder.containerManagement') || 'Organize components in this container' }}
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

const emit = defineEmits<{
  'edit-container-component': [componentIndex: number, component: Record<string, any>]
  'delete-container-component': [componentIndex: number, component: Record<string, any>]
  'open-add-component-to-container-modal': []
}>()

const getComponentLabel = (type: string) => {
  // Helper function to get component label - you may need to implement this
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const editContainerComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('edit-container-component', componentIndex, component)
}

const deleteContainerComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('delete-container-component', componentIndex, component)
}

const openAddComponentToContainerModal = () => {
  emit('open-add-component-to-container-modal')
}
</script>
