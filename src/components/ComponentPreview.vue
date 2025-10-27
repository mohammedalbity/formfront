<template>
  <div class="component-preview" :class="{ rtl: isRTLSync() }">
    <!-- Dynamic Component Renderer -->
    <component
      :is="getComponentRenderer(component.type)"
      :component="component"
      :readonly="readonly"
      :force-update-key="forceUpdateKey"
      v-bind="getComponentProps(component.type)"
      @edit-panel-component="handleEditPanelComponent"
      @delete-panel-component="handleDeletePanelComponent"
      @open-add-component-to-panel-modal="handleOpenAddComponentToPanelModal"
      @edit-well-component="handleEditWellComponent"
      @delete-well-component="handleDeleteWellComponent"
      @open-add-component-to-well-modal="handleOpenAddComponentToWellModal"
      @edit-container-component="handleEditContainerComponent"
      @delete-container-component="handleDeleteContainerComponent"
      @open-add-component-to-container-modal="handleOpenAddComponentToContainerModal"
      @edit-fieldset-component="handleEditFieldsetComponent"
      @delete-fieldset-component="handleDeleteFieldsetComponent"
      @open-add-component-to-fieldset-modal="handleOpenAddComponentToFieldsetModal"
      @edit-column-component="handleEditColumnComponent"
      @delete-column-component="handleDeleteColumnComponent"
      @open-add-component-modal="handleOpenAddComponentModal"
      @add-new-column="handleAddNewColumn"
      @edit-tab-component="handleEditTabComponent"
      @delete-tab-component="handleDeleteTabComponent"
      @open-add-component-to-tab-modal="handleOpenAddComponentToTabModal"
      @edit-tab="handleEditTab"
      @delete-tab="handleDeleteTab"
      @add-new-tab="handleAddNewTab"
      @edit-table-cell-component="handleEditTableCellComponent"
      @delete-table-cell-component="handleDeleteTableCellComponent"
      @open-add-component-to-table-cell-modal="handleOpenAddComponentToTableCellModal"
      @edit-table-header="handleEditTableHeader"
      @delete-table-column="handleDeleteTableColumn"
      @add-table-column="handleAddTableColumn"
      @add-table-row="handleAddTableRow"
      @setup-table="handleSetupTable"
      @edit-datagrid-column="handleEditDataGridColumn"
      @delete-datagrid-column="handleDeleteDataGridColumn"
      @open-add-component-to-datagrid-modal="handleOpenAddComponentToDataGridModal"
      @edit-editgrid-component="handleEditEditGridComponent"
      @delete-editgrid-component="handleDeleteEditGridComponent"
      @open-add-component-to-editgrid-modal="handleOpenAddComponentToEditGridModal"
      @edit-survey-question="handleEditSurveyQuestion"
      @delete-survey-question="handleDeleteSurveyQuestion"
      @open-add-survey-question-modal="handleOpenAddSurveyQuestionModal"
    />

    <!-- Fallback for unsupported component types -->
    <div v-if="!getComponentRenderer(component.type)" class="form-group">
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center text-yellow-700">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm font-medium">
            {{ $t('formBuilder.unsupportedComponentType') || 'Unsupported Component Type' }}:
            {{ component.type }}
          </span>
        </div>
        <p class="text-xs text-yellow-600 mt-1">
          {{
            $t('formBuilder.componentNotImplemented') ||
            'This component type is not yet implemented in the preview system.'
          }}
        </p>
      </div>
    </div>

    <!-- Add Component Modal - Modern Design -->
    <div
      v-if="showAddComponentModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="closeAddComponentModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden transform transition-all duration-300 scale-100"
        @click.stop
      >
        <!-- Modal Header -->
        <div
          class="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white px-8 py-6"
        >
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative flex items-center justify-between">
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <div
                class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-1">{{ getModalTitle() }}</h3>
                <p class="text-indigo-100 text-sm opacity-90">{{ getModalSubtitle() }}</p>
              </div>
            </div>
            <button
              @click="closeAddComponentModal"
              class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-8 overflow-y-auto max-h-[calc(85vh-140px)]">
          <!-- Search Bar -->
          <div class="mb-6">
            <div class="relative">
              <svg
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('formBuilder.searchComponents') || 'البحث في المكونات...'"
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <!-- Component Categories Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              v-for="componentType in filteredComponents"
              :key="componentType.type"
              class="group relative cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-indigo-50 hover:to-purple-50 border border-gray-200 hover:border-indigo-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              @click="selectComponentType(componentType.type)"
            >
              <!-- Hover Glow Effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-300"
              ></div>

              <div class="relative flex flex-col items-center text-center">
                <!-- Icon Container -->
                <div
                  class="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300 shadow-sm group-hover:shadow-md"
                >
                  <div
                    v-html="componentType.icon"
                    class="w-7 h-7 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300"
                  ></div>
                </div>

                <!-- Component Name -->
                <h4
                  class="font-bold text-gray-800 group-hover:text-indigo-800 mb-2 text-sm leading-tight"
                >
                  {{ getComponentLabel(componentType.type) }}
                </h4>

                <!-- Component Description -->
                <p
                  class="text-xs text-gray-500 group-hover:text-indigo-600 leading-relaxed opacity-80 group-hover:opacity-100 transition-all duration-300"
                >
                  {{ getComponentDescription(componentType.type) }}
                </p>

                <!-- Selection Indicator -->
                <div
                  class="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredComponents.length === 0" class="text-center py-12">
            <div
              class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-600 mb-2">
              {{ $t('formBuilder.noComponentsFound') || 'لا توجد مكونات' }}
            </h3>
            <p class="text-gray-500">
              {{ $t('formBuilder.tryDifferentSearch') || 'جرب البحث بكلمات مختلفة' }}
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 flex justify-between items-center border-t border-gray-200"
        >
          <div class="text-sm text-gray-500">
            {{ filteredComponents.length }}
            {{ $t('formBuilder.componentsAvailable') || 'مكون متاح' }}
          </div>
          <div class="flex space-x-3 rtl:space-x-reverse">
            <button
              @click="closeAddComponentModal"
              class="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 rounded-xl hover:bg-white/50"
            >
              {{ $t('common.cancel') || 'إلغاء' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../i18n'

// Import component renderers
import TextFieldPreview from './renderers/TextFieldPreview.vue'
import TextAreaPreview from './renderers/TextAreaPreview.vue'
import NumberPreview from './renderers/NumberPreview.vue'
import EmailPreview from './renderers/EmailPreview.vue'
import PasswordPreview from './renderers/PasswordPreview.vue'
import SelectPreview from './renderers/SelectPreview.vue'
import RadioPreview from './renderers/RadioPreview.vue'
import CheckboxPreview from './renderers/CheckboxPreview.vue'
import ButtonPreview from './renderers/ButtonPreview.vue'
import HiddenPreview from './renderers/HiddenPreview.vue'
import ContentPreview from './renderers/ContentPreview.vue'
import HtmlElementPreview from './renderers/HtmlElementPreview.vue'
import PanelPreview from './renderers/PanelPreview.vue'
import WellPreview from './renderers/WellPreview.vue'
import ContainerPreview from './renderers/ContainerPreview.vue'
import FieldsetPreview from './renderers/FieldsetPreview.vue'
import ColumnsPreview from './renderers/ColumnsPreview.vue'
import TabsPreview from './renderers/TabsPreview.vue'
import TablePreview from './renderers/TablePreview.vue'
import DataGridPreview from './renderers/DataGridPreview.vue'
import EditGridPreview from './renderers/EditGridPreview.vue'
import SignaturePreview from './renderers/SignaturePreview.vue'
import FilePreview from './renderers/FilePreview.vue'
import SurveyPreview from './renderers/SurveyPreview.vue'

// Component type definitions
interface ComponentDefinition {
  type: string
  key?: string
  label?: string
  placeholder?: string
  description?: string
  disabled?: boolean
  customClass?: string
  validate?: {
    required?: boolean
    min?: number
    max?: number
  }
  rows?: number
  components?: ComponentDefinition[]
  data?: {
    values?: Array<{ label: string; value: string }>
  }
  values?: Array<{ label: string; value: string }>
  theme?: string
  tag?: string
  content?: string
  className?: string
  attrs?: Array<{ name: string; value: string }>
  html?: string
  wysiwyg?: boolean
}

interface Props {
  component: ComponentDefinition
  readonly?: boolean
  componentIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

const { t } = useI18n()

// Force update key for complex components
const forceUpdateKey = ref(0)

// Modal state
const showAddComponentModal = ref(false)
const selectedContainerType = ref<string>('')
const selectedContainerIndex = ref<number>(-1)
const selectedTableRowIndex = ref<number>(-1)
const selectedTableCellIndex = ref<number>(-1)
const searchQuery = ref('')

// Available components for modal
const availableComponents = [
  {
    type: 'textfield',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6z"/></svg>',
  },
  {
    type: 'textarea',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6z"/></svg>',
  },
  {
    type: 'number',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M8 5a1 1 0 100 2v3a1 1 0 001 1h3a1 1 0 100-2V6a1 1 0 00-1-1H8z"/></svg>',
  },
  {
    type: 'file',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h8l4-4V5a2 2 0 00-2-2H4zm8 12V9h4l-4 6z"/></svg>',
  },
  {
    type: 'email',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>',
  },
  {
    type: 'password',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>',
  },
  {
    type: 'select',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>',
  },
  {
    type: 'radio',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
  },
  {
    type: 'checkbox',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clip-rule="evenodd"/></svg>',
  },
  {
    type: 'button',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clip-rule="evenodd"/></svg>',
  },
  {
    type: 'signature',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 13c1.5-1.5 3-3 5-3s3.5 1.5 5 1.5c1 0 2-.5 3-1v2c-1 .5-2 1-3 1-1.5 0-3-1.5-5-1.5s-3.5 1.5-5 3H2v-2h2z"/></svg>',
  },
]

// Component renderer mapping
const componentRenderers = {
  textfield: TextFieldPreview,
  textarea: TextAreaPreview,
  number: NumberPreview,
  email: EmailPreview,
  password: PasswordPreview,
  select: SelectPreview,
  radio: RadioPreview,
  checkbox: CheckboxPreview,
  button: ButtonPreview,
  hidden: HiddenPreview,
  content: ContentPreview,
  htmlelement: HtmlElementPreview,
  panel: PanelPreview,
  well: WellPreview,
  container: ContainerPreview,
  fieldset: FieldsetPreview,
  columns: ColumnsPreview,
  tabs: TabsPreview,
  table: TablePreview,
  datagrid: DataGridPreview,
  editgrid: EditGridPreview,
  signature: SignaturePreview,
  file: FilePreview,
  survey: SurveyPreview,
}

// Get component renderer
const getComponentRenderer = (type: string) => {
  return componentRenderers[type as keyof typeof componentRenderers] || null
}

// Get additional props for specific component types
const getComponentProps = (type: string) => {
  const baseProps = {}

  // Add specific props for complex components that need them
  if (['panel', 'well', 'container', 'fieldset'].includes(type)) {
    return {
      ...baseProps,
      forceUpdateKey: forceUpdateKey.value,
    }
  }

  return baseProps
}

// Filtered components based on search
const filteredComponents = computed(() => {
  if (!searchQuery.value.trim()) {
    return availableComponents
  }

  const query = searchQuery.value.toLowerCase().trim()
  return availableComponents.filter((component) => {
    const label = getComponentLabel(component.type).toLowerCase()
    const description = getComponentDescription(component.type).toLowerCase()
    return (
      label.includes(query) ||
      description.includes(query) ||
      component.type.toLowerCase().includes(query)
    )
  })
})

// Modal functions
const getModalTitle = () => {
  switch (selectedContainerType.value) {
    case 'panel':
      return t('formBuilder.addComponentToPanel') || 'إضافة مكون إلى اللوحة'
    case 'well':
      return t('formBuilder.addComponentToWell') || 'إضافة مكون إلى البئر'
    case 'container':
      return t('formBuilder.addComponentToContainer') || 'إضافة مكون إلى الحاوية'
    case 'fieldset':
      return t('formBuilder.addComponentToFieldset') || 'إضافة مكون إلى مجموعة الحقول'
    case 'column':
      return t('formBuilder.addComponentToColumn') || 'إضافة مكون إلى العمود'
    case 'datagrid':
      return t('formBuilder.addComponentToDataGrid') || 'إضافة مكون إلى شبكة البيانات'
    default:
      return t('formBuilder.addComponent') || 'إضافة مكون'
  }
}

const getModalSubtitle = () => {
  switch (selectedContainerType.value) {
    case 'panel':
      return t('formBuilder.selectComponentTypeForPanel') || 'اختر نوع المكون لإضافته إلى اللوحة'
    case 'well':
      return t('formBuilder.selectComponentTypeForWell') || 'اختر نوع المكون لإضافته إلى البئر'
    case 'container':
      return (
        t('formBuilder.selectComponentTypeForContainer') || 'اختر نوع المكون لإضافته إلى الحاوية'
      )
    case 'fieldset':
      return (
        t('formBuilder.selectComponentTypeForFieldset') ||
        'اختر نوع المكون لإضافته إلى مجموعة الحقول'
      )
    case 'column':
      return t('formBuilder.selectComponentTypeForColumn') || 'اختر نوع المكون لإضافته إلى العمود'
    case 'table-cell':
      return (
        t('formBuilder.selectComponentTypeForTableCell') ||
        'اختر نوع المكون لإضافته إلى خلية الجدول'
      )
    case 'datagrid':
      return (
        t('formBuilder.selectComponentForDataGrid') || 'اختر نوع المكون لإضافته إلى شبكة البيانات'
      )
    default:
      return t('formBuilder.selectComponentType') || 'اختر نوع المكون'
  }
}

const getComponentLabel = (componentType: string) => {
  const translationKey = `formBuilder.componentLabels.${componentType}`
  const translatedLabel = t(translationKey)
  return translatedLabel !== translationKey ? translatedLabel : componentType
}

const getComponentDescription = (componentType: string) => {
  const translationKey = `formBuilder.componentDescriptions.${componentType}`
  const translatedDescription = t(translationKey)
  return translatedDescription !== translationKey ? translatedDescription : componentType
}

const openAddComponentModal = (containerType: string, containerIndex: number = -1) => {
  selectedContainerType.value = containerType
  selectedContainerIndex.value = containerIndex
  showAddComponentModal.value = true
}

const closeAddComponentModal = () => {
  showAddComponentModal.value = false
  selectedContainerType.value = ''
  selectedContainerIndex.value = -1
  selectedTableRowIndex.value = -1
  selectedTableCellIndex.value = -1
  searchQuery.value = ''
}

const selectComponentType = (componentType: string) => {
  // Emit the appropriate event based on container type
  switch (selectedContainerType.value) {
    case 'panel':
      emit('add-component-to-panel', componentType)
      break
    case 'well':
      emit('add-component-to-well', componentType)
      break
    case 'container':
      emit('add-component-to-container', componentType)
      break
    case 'fieldset':
      emit('add-component-to-fieldset', componentType)
      break
    case 'column':
      emit('add-component-to-column', selectedContainerIndex.value, componentType)
      break
    case 'table-cell':
      emit('add-component-to-table-cell', {
        rowIndex: selectedTableRowIndex.value,
        cellIndex: selectedTableCellIndex.value,
        componentType: componentType,
      })
      break
    case 'tab':
      emit('add-component-to-tab', {
        tabIndex: selectedContainerIndex.value,
        component: { type: componentType },
      })
      break
    case 'datagrid':
      // For DataGrid, we emit only the component type. FormBuilder resolves the index itself.
      emit('add-component-to-datagrid', componentType)
      break
    case 'editgrid':
      // For EditGrid, FormBuilder expects an object with a component definition
      emit('add-component-to-editgrid', { component: { type: componentType } })
      break
    default:
      console.warn('Unknown container type:', selectedContainerType.value)
  }

  closeAddComponentModal()
}

// Emit definitions
const emit = defineEmits<{
  'edit-panel-component': [componentIndex: number, component: ComponentDefinition]
  'delete-panel-component': [componentIndex: number, component: ComponentDefinition]
  'add-component-to-panel': [componentType: string]
  'edit-well-component': [componentIndex: number, component: ComponentDefinition]
  'delete-well-component': [componentIndex: number, component: ComponentDefinition]
  'add-component-to-well': [componentType: string]
  'edit-container-component': [componentIndex: number, component: ComponentDefinition]
  'delete-container-component': [componentIndex: number, component: ComponentDefinition]
  'add-component-to-container': [componentType: string]
  'edit-fieldset-component': [componentIndex: number, component: ComponentDefinition]
  'delete-fieldset-component': [componentIndex: number, component: ComponentDefinition]
  'add-component-to-fieldset': [componentType: string]
  'edit-column-component': [
    columnIndex: number,
    componentIndex: number,
    component: ComponentDefinition,
  ]
  'delete-column-component': [
    columnIndex: number,
    componentIndex: number,
    component: ComponentDefinition,
  ]
  'add-component-to-column': [columnIndex: number, componentType: string]
  'open-add-component-modal': [columnIndex: number]
  'add-new-column': []
  'edit-tab-component': [tabIndex: number, componentIndex: number, component: ComponentDefinition]
  'delete-tab-component': [tabIndex: number, componentIndex: number, component: ComponentDefinition]
  'open-add-component-to-tab-modal': [tabIndex: number]
  'add-component-to-tab': [data: { tabIndex: number; component: { type: string } }]
  'edit-tab': [tabIndex: number]
  'delete-tab': [tabIndex: number]
  'add-new-tab': [newTab: Record<string, any>]
  'edit-table-cell-component': [
    data: { rowIndex: number; cellIndex: number; componentIndex: number; component: ComponentDefinition },
  ]
  'delete-table-cell-component': [
    data: { rowIndex: number; cellIndex: number; componentIndex: number; component: ComponentDefinition },
  ]
  'open-add-component-to-table-cell-modal': [rowIndex: number, cellIndex: number]
  'add-component-to-table-cell': [
    data: { rowIndex: number; cellIndex: number; componentType: string },
  ]
  'edit-table-header': [headerIndex: number]
  'delete-table-column': [columnIndex: number]
  'add-table-column': []
  'add-table-row': []
  'setup-table': []
  'edit-datagrid-column': [columnIndex: number, component: ComponentDefinition]
  'delete-datagrid-column': [columnIndex: number, component: ComponentDefinition]
  'edit-datagrid-component': [columnIndex: number, component: ComponentDefinition]
  'delete-datagrid-component': [columnIndex: number, component: ComponentDefinition]
  'open-add-component-to-datagrid-modal': []
  'add-component-to-datagrid': [componentType: string]
  'add-component-to-editgrid': [data: { component: ComponentDefinition }]
  'edit-editgrid-component': [data: { componentIndex: number; component: ComponentDefinition }]
  'delete-editgrid-component': [data: { componentIndex: number; component: ComponentDefinition }]
  'open-add-component-to-editgrid-modal': []
  'edit-survey-question': [data: { questionIndex: number; question: Record<string, any> }]
  'delete-survey-question': [data: { questionIndex: number; question: Record<string, any> }]
  'open-add-survey-question-modal': []
}>()

// Event handlers for panel components
const handleEditPanelComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('edit-panel-component', componentIndex, component)
}

const handleDeletePanelComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('delete-panel-component', componentIndex, component)
}

const handleOpenAddComponentToPanelModal = () => {
  openAddComponentModal('panel')
}

// Event handlers for well components
const handleEditWellComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('edit-well-component', componentIndex, component)
}

const handleDeleteWellComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('delete-well-component', componentIndex, component)
}

const handleOpenAddComponentToWellModal = () => {
  openAddComponentModal('well')
}

// Event handlers for container components
const handleEditContainerComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('edit-container-component', componentIndex, component)
}

const handleDeleteContainerComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('delete-container-component', componentIndex, component)
}

const handleOpenAddComponentToContainerModal = () => {
  openAddComponentModal('container')
}

// Event handlers for fieldset components
const handleEditFieldsetComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('edit-fieldset-component', componentIndex, component)
}

const handleDeleteFieldsetComponent = (componentIndex: number, component: ComponentDefinition) => {
  emit('delete-fieldset-component', componentIndex, component)
}

const handleOpenAddComponentToFieldsetModal = () => {
  openAddComponentModal('fieldset')
}

// Event handlers for columns components
const handleEditColumnComponent = (
  columnIndex: number,
  componentIndex: number,
  component: ComponentDefinition,
) => {
  console.log(
    '🔧 ComponentPreview: handleEditColumnComponent called with raw params:',
    columnIndex,
    componentIndex,
    component,
  )
  console.log('🔧 ComponentPreview: typeof columnIndex:', typeof columnIndex, 'value:', columnIndex)
  console.log(
    '🔧 ComponentPreview: typeof componentIndex:',
    typeof componentIndex,
    'value:',
    componentIndex,
  )
  console.log(
    '🔧 ComponentPreview: typeof component:',
    typeof component,
    'component.type:',
    component?.type,
  )

  // Emit with separate parameters to match the expected signature
  console.log(
    '🔧 ComponentPreview: emitting with separate params:',
    columnIndex,
    componentIndex,
    component?.type,
  )
  emit('edit-column-component', columnIndex, componentIndex, component)
}

const handleDeleteColumnComponent = (
  columnIndex: number,
  componentIndex: number,
  component: ComponentDefinition,
) => {
  console.log(
    '🗑️ ComponentPreview: handleDeleteColumnComponent called with:',
    columnIndex,
    componentIndex,
    component?.type,
  )
  emit('delete-column-component', columnIndex, componentIndex, component)
}

const handleOpenAddComponentModal = (columnIndex: number) => {
  openAddComponentModal('column', columnIndex)
}

const handleAddNewColumn = () => {
  emit('add-new-column')
}

// Event handlers for tabs components
const handleEditTabComponent = (
  tabIndex: number,
  componentIndex: number,
  component: ComponentDefinition,
) => {
  emit('edit-tab-component', tabIndex, componentIndex, component)
}

const handleDeleteTabComponent = (
  tabIndex: number,
  componentIndex: number,
  component: ComponentDefinition,
) => {
  emit('delete-tab-component', tabIndex, componentIndex, component)
}

const handleOpenAddComponentToTabModal = (tabIndex: number) => {
  console.log(
    '🔧 ComponentPreview: handleOpenAddComponentToTabModal called with:',
    tabIndex,
    typeof tabIndex,
  )
  // Use the same global modern modal as other containers for unified UX
  openAddComponentModal('tab', tabIndex)
}

const handleEditTab = (tabIndex: number) => {
  emit('edit-tab', tabIndex)
}

const handleDeleteTab = (tabIndex: number) => {
  emit('delete-tab', tabIndex)
}

const handleAddNewTab = (newTab: Record<string, any>) => {
  emit('add-new-tab', newTab)
}

// Event handlers for table components
const handleEditTableCellComponent = (
  rowIndex: number,
  cellIndex: number,
  componentIndex: number,
  component: ComponentDefinition,
) => {
  emit('edit-table-cell-component', { rowIndex, cellIndex, componentIndex, component })
}

const handleDeleteTableCellComponent = (
  rowIndex: number,
  cellIndex: number,
  componentIndex: number,
  component: ComponentDefinition,
) => {
  emit('delete-table-cell-component', { rowIndex, cellIndex, componentIndex, component })
}

const handleOpenAddComponentToTableCellModal = (rowIndex: number, cellIndex: number) => {
  console.log('🔧 Opening add component modal for table cell:', { rowIndex, cellIndex })
  selectedContainerType.value = 'table-cell'
  selectedTableRowIndex.value = rowIndex
  selectedTableCellIndex.value = cellIndex
  showAddComponentModal.value = true
}

const handleEditTableHeader = (headerIndex: number) => {
  emit('edit-table-header', headerIndex)
}

const handleDeleteTableColumn = (columnIndex: number) => {
  emit('delete-table-column', columnIndex)
}

const handleAddTableColumn = () => {
  emit('add-table-column')
}

const handleAddTableRow = () => {
  emit('add-table-row')
}

const handleSetupTable = () => {
  emit('setup-table')
}

// Event handlers for datagrid components
// Route to direct DataGrid component handlers expected by FormBuilder
const handleEditDataGridColumn = (columnIndex: number, component: ComponentDefinition) => {
  emit('edit-datagrid-component', columnIndex, component)
}

const handleDeleteDataGridColumn = (columnIndex: number, component: ComponentDefinition) => {
  emit('delete-datagrid-component', columnIndex, component)
}

const handleOpenAddComponentToDataGridModal = () => {
  // Open the same modern modal used for other containers for consistency
  openAddComponentModal('datagrid')
}

// Event handlers for editgrid components
const handleEditEditGridComponent = (data: { componentIndex: number; component: ComponentDefinition }) => {
  emit('edit-editgrid-component', data)
}

const handleDeleteEditGridComponent = (data: { componentIndex: number; component: ComponentDefinition }) => {
  emit('delete-editgrid-component', data)
}

const handleOpenAddComponentToEditGridModal = () => {
  // Open the add component modal targeting the editgrid container
  openAddComponentModal('editgrid')
}

// Event handlers for survey questions
const handleEditSurveyQuestion = (data: { questionIndex: number; question: Record<string, any> }) => {
  emit('edit-survey-question', data)
}

const handleDeleteSurveyQuestion = (data: { questionIndex: number; question: Record<string, any> }) => {
  emit('delete-survey-question', data)
}

const handleOpenAddSurveyQuestionModal = () => {
  emit('open-add-survey-question-modal')
}
</script>

<style scoped>
.component-preview {
  @apply w-full;
}

.component-preview.rtl {
  direction: rtl;
}
</style>
