<template>
  <div class="form-group">
    <!-- Panel Container -->
    <div class="border-2 border-green-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- Panel Header -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || (t('formBuilder.panel') || 'Panel') }}</h3>
              <p class="text-green-100 text-sm">{{ $t('formBuilder.componentDescriptions.panel') || 'حاوي لتجميع المكونات' }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ (component.components?.length || 0) }} {{ t('formBuilder.components') || 'components' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Panel Content -->
      <div class="p-6">
        <!-- Components Display -->
        <div v-if="component.components && component.components.length > 0" class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h4 class="text-sm font-semibold text-gray-800">{{ $t('formBuilder.editableFields') || 'الحقول القابلة للتحرير' }}</h4>
            </div>
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {{ component.components.length }} {{ component.components.length === 1 ? $t('common.field') || 'حقل' : $t('common.fields') || 'حقول' }}
            </span>
          </div>

          <!-- Form Preview -->
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-5">
            <div class="space-y-4">
              <div v-for="(childComponent, childIndex) in component.components"
                   :key="`panel-field-${childIndex}-${forceUpdateKey}`"
                   class="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-green-300 transition-all duration-300 group">

                <!-- Field Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <label class="text-sm font-semibold text-gray-800">
                      {{ childComponent.label || childComponent.key || $t('formBuilder.properties.label') }}
                      <span v-if="(childComponent as any).required" class="text-red-500 mr-1">*</span>
                    </label>
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      {{ childComponent.type }}
                    </span>
                  </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Edit Button -->
                  <button @click.stop="editPanelComponent(childIndex, childComponent)"
                          class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <!-- Delete Button -->
                  <button @click.stop="deletePanelComponent(childIndex, childComponent)"
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
        </div>

          <!-- Panel Information -->
          <div class="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div class="flex items-center mb-2">
              <svg class="w-4 h-4 text-emerald-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium text-emerald-800">{{ t('formBuilder.panelUsage') }}</span>
            </div>
            <div class="text-xs text-emerald-700">
              {{ t('formBuilder.panelDescription') }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8" @click.stop="openAddComponentToPanelModal">
          <div class="flex flex-col items-center cursor-pointer hover:bg-emerald-50 rounded-lg p-4 transition-colors">
            <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h4 class="text-sm font-medium text-gray-700 mb-1">{{ t('formBuilder.emptyPanel') || 'Empty Panel' }}</h4>
            <p class="text-xs text-gray-500 mb-4">{{ t('formBuilder.clickToAddComponents') || 'Click to add components to this panel.' }}</p>
          </div>
        </div>
      </div>

      <!-- Panel Actions -->
      <div v-if="component.components && component.components.length > 0" class="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div class="flex items-center justify-between">
          <button @click.stop="openAddComponentToPanelModal"
                  class="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 transition-colors">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            {{ t('formBuilder.addComponent') || 'Add Component' }}
          </button>
          <div class="text-xs text-gray-500">
            {{ t('formBuilder.panelManagement') || 'Organize components in this panel' }}
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
  'edit-panel-component': [componentIndex: number, component: Record<string, any>]
  'delete-panel-component': [componentIndex: number, component: Record<string, any>]
  'open-add-component-to-panel-modal': []
}>()

const editPanelComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('edit-panel-component', componentIndex, component)
}

const deletePanelComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('delete-panel-component', componentIndex, component)
}

const openAddComponentToPanelModal = () => {
  emit('open-add-component-to-panel-modal')
}
</script>
