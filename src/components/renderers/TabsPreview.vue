<template>
  <div class="form-group">
    <!-- Tabs Container -->
    <div class="border-2 border-green-200 rounded-xl bg-white overflow-hidden shadow-lg">
      <!-- Tabs Header -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ component.label || $t('formBuilder.componentLabels.tabs') || 'تبويبات' }}</h3>
              <p class="text-green-100 text-sm">{{ $t('formBuilder.componentDescriptions.tabs') || 'تنظيم المحتوى في تبويبات' }}</p>
            </div>
          </div>
          <div class="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <span class="text-white text-sm font-medium">
              {{ (component.components || getDefaultTabs()).length }} {{ $t('formBuilder.tabs') || 'تبويب' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs Content -->
      <div class="p-6">
        <div class="border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
          <!-- Tab Headers with Management Buttons -->
          <div class="flex bg-gray-100 border-b border-gray-300">
            <div
              v-for="(tab, tabIndex) in component.components || getDefaultTabs()"
              :key="tabIndex"
              class="relative group flex items-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors border-r border-gray-300"
              :class="{
                'bg-green-500 text-white': activeTab === tabIndex,
                'bg-gray-100 text-gray-700 hover:bg-gray-200': activeTab !== tabIndex
              }"
              @click="activeTab = tabIndex"
            >
              <!-- Tab Label -->
              <span class="flex-1">{{ tab.label || `Tab ${tabIndex + 1}` }}</span>

              <!-- Tab Management Buttons (visible on hover) -->
              <div class="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <!-- Edit Tab Button -->
                <button
                  @click.stop="editTab(tabIndex)"
                  class="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                  :title="$t('formBuilder.editTab')"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>

                <!-- Delete Tab Button (only if more than 1 tab) -->
                <button
                  v-if="(component.components || getDefaultTabs()).length > 1"
                  @click.stop="confirmDeleteTab(tabIndex)"
                  class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  :title="$t('formBuilder.deleteTab')"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Add New Tab Button -->
            <button
              @click="addNewTab"
              class="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 border-r border-gray-300 transition-colors"
              :title="$t('formBuilder.addTab')"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>{{ $t('formBuilder.addTab') }}</span>
            </button>
          </div>

          <!-- Tab Content with Click Zone -->
          <div
            class="tabs-click-zone p-4 bg-white min-h-[100px] relative transition-all duration-200 cursor-pointer hover:bg-green-50"
            @click="openAddComponentToTabModal(activeTab)"
          >
            <!-- Existing Components in Active Tab -->
            <div v-if="(getCurrentTabComponents().length || 0) > 0" class="space-y-2">
              <div
                v-for="(childComponent, childIndex) in getCurrentTabComponents()"
                :key="`tabs-${activeTab}-${childComponent.key || childComponent.type}-${childIndex}-${forceUpdateKey}`"
                class="bg-gray-100 p-2 rounded text-xs border border-gray-200 hover:border-green-200 relative group hover:bg-gray-200 transition-colors"
                @click.stop
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-700">{{ getComponentLabel(childComponent.type) }}</div>
                    <div class="text-gray-700 text-xs truncate" v-if="childComponent.label">{{ childComponent.label }}</div>
                    <div class="text-gray-500 text-[11px] truncate">Key: {{ childComponent.key }}</div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <!-- Edit Button -->
                    <button
                      @click.stop="editTabComponent(activeTab, childIndex, childComponent)"
                      class="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors duration-200"
                      :title="$t('common.edit')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click.stop="deleteTabComponent(activeTab, childIndex, childComponent)"
                      class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                      :title="$t('common.delete')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center text-center py-8">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="text-sm text-gray-600 font-medium mb-1">{{ $t('formBuilder.addComponent') }}</div>
              <div class="text-xs text-gray-500">{{ $t('formBuilder.clickToAddComponentToTab') }}</div>
            </div>
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
import { ref, computed } from 'vue'
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

const activeTab = ref(0)

const emit = defineEmits<{
  'edit-tab-component': [tabIndex: number, componentIndex: number, component: Record<string, any>]
  'delete-tab-component': [tabIndex: number, componentIndex: number, component: Record<string, any>]
  'open-add-component-to-tab-modal': [tabIndex: number]
  'edit-tab': [tabIndex: number]
  'delete-tab': [tabIndex: number]
  'add-new-tab': [newTab: Record<string, any>]
}>()

// Helper functions
const getComponentLabel = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const getDefaultTabs = () => {
  return [
    { label: 'Tab 1', key: 'tab1', components: [] },
    { label: 'Tab 2', key: 'tab2', components: [] }
  ]
}

const getCurrentTabComponents = () => {
  const tabs = props.component.components || getDefaultTabs()
  const currentTab = tabs[activeTab.value]
  return currentTab?.components || []
}

// Event handlers
const editTabComponent = (tabIndex: number, componentIndex: number, component: Record<string, any>) => {
  emit('edit-tab-component', tabIndex, componentIndex, component)
}

const deleteTabComponent = (tabIndex: number, componentIndex: number, component: Record<string, any>) => {
  emit('delete-tab-component', tabIndex, componentIndex, component)
}

const openAddComponentToTabModal = (tabIndex: number) => {
  console.log('🔧 TabsPreview: openAddComponentToTabModal called with:', tabIndex, typeof tabIndex)
  emit('open-add-component-to-tab-modal', tabIndex)
}

const editTab = (tabIndex: number) => {
  emit('edit-tab', tabIndex)
}

const confirmDeleteTab = (tabIndex: number) => {
  if (confirm(t('formBuilder.confirmDeleteTab') || 'Are you sure you want to delete this tab?')) {
    emit('delete-tab', tabIndex)
    
    // Adjust active tab if necessary
    const totalTabs = (props.component.components || getDefaultTabs()).length
    if (activeTab.value >= tabIndex && activeTab.value > 0) {
      activeTab.value = Math.max(0, activeTab.value - 1)
    } else if (activeTab.value >= totalTabs - 1) {
      activeTab.value = Math.max(0, totalTabs - 2)
    }
  }
}

const addNewTab = () => {
  const newTabIndex = (props.component.components || getDefaultTabs()).length
  const newTab = {
    label: `Tab ${newTabIndex + 1}`,
    key: `tab${newTabIndex + 1}_${Date.now()}`,
    components: []
  }
  emit('add-new-tab', newTab)
}
</script>
