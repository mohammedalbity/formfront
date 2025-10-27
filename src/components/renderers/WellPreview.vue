<template>
  <div class="form-group">
    <!-- Well Container -->
    <div class="border-2 border-green-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- Well Header -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || $t('formBuilder.componentLabels.well') || 'بئر' }}</h3>
              <p class="text-green-100 text-sm">{{ $t('formBuilder.componentDescriptions.well') || 'حاوي مع تأثير بصري مميز' }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ component.components?.length || 0 }} {{ $t('formBuilder.fields') || 'حقل' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Well Content -->
      <div class="p-6">
        <div
          class="well-click-zone bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-5 min-h-[100px] relative transition-all duration-200 cursor-pointer hover:bg-green-50"
          @click.stop="openAddComponentToWellModal"
        >
        <!-- Existing Components in Well -->
        <div v-if="component.components && component.components.length > 0" class="space-y-2">
          <div
            v-for="(wellComponent, index) in component.components"
            :key="`well-${wellComponent.key || wellComponent.type}-${index}-${forceUpdateKey}`"
            class="group relative bg-white border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-all duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">{{ wellComponent.label || wellComponent.type }}</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ wellComponent.type }}</span>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <!-- Edit Button -->
                <button @click.stop="editWellComponent(index, wellComponent)"
                        class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        :title="$t('common.edit')">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <!-- Delete Button -->
                <button @click.stop="deleteWellComponent(index, wellComponent)"
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

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center text-center py-6">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div class="text-sm text-gray-600 font-medium mb-1">{{ $t('formBuilder.addComponent') }}</div>
          <div class="text-xs text-gray-500">{{ $t('formBuilder.clickToAddComponent') }}</div>
          </div>
        </div>
      </div>
      <p v-if="component.description" class="text-xs text-gray-500 mt-1">
        {{ component.description }}
      </p>
    </div>
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
  'edit-well-component': [componentIndex: number, component: Record<string, any>]
  'delete-well-component': [componentIndex: number, component: Record<string, any>]
  'open-add-component-to-well-modal': []
}>()

const editWellComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('edit-well-component', componentIndex, component)
}

const deleteWellComponent = (componentIndex: number, component: Record<string, any>) => {
  emit('delete-well-component', componentIndex, component)
}

const openAddComponentToWellModal = () => {
  emit('open-add-component-to-well-modal')
}
</script>
