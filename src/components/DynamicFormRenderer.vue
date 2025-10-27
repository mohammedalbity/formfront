<template>
  <div class="dynamic-form-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
      <span class="ml-3 text-gray-600">{{ $t('common.loading') }}</span>
    </div>

    <!-- Form Components -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-for="(component, index) in formSchema.components"
        :key="component.key || `component-${index}`"
        class="form-component"
      >
        <!-- Render component based on type -->
        <component
          :is="getComponentRenderer(component.type)"
          :component="component"
          :form-data="formData"
          @update:value="updateFormData"
          @submit="handleComponentSubmit"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../i18n'

// Import component renderers
import TextFieldRenderer from './renderers/TextFieldRenderer.vue'
import TextAreaRenderer from './renderers/TextAreaRenderer.vue'
import NumberRenderer from './renderers/NumberRenderer.vue'
import EmailRenderer from './renderers/EmailRenderer.vue'
import PasswordRenderer from './renderers/PasswordRenderer.vue'
import SelectRenderer from './renderers/SelectRenderer.vue'
import RadioRenderer from './renderers/RadioRenderer.vue'
import CheckboxRenderer from './renderers/CheckboxRenderer.vue'
import FileRenderer from './renderers/FileRenderer.vue'
import ButtonRenderer from './renderers/ButtonRenderer.vue'
import ColumnsRenderer from './renderers/ColumnsRenderer.vue'
import PanelRenderer from './renderers/PanelRenderer.vue'
import FieldsetRenderer from './renderers/FieldsetRenderer.vue'
import TabsRenderer from './renderers/TabsRenderer.vue'
import TableRenderer from './renderers/TableRenderer.vue'
import WellRenderer from './renderers/WellRenderer.vue'
import ContainerRenderer from './renderers/ContainerRenderer.vue'
import HtmlElementRenderer from './renderers/HtmlElementRenderer.vue'
import ContentRenderer from './renderers/ContentRenderer.vue'
import HiddenRenderer from './renderers/HiddenRenderer.vue'
import DataGridRenderer from './renderers/DataGridRenderer.vue'
import EditGridRenderer from './renderers/EditGridRenderer.vue'
import SurveyRenderer from './renderers/SurveyRenderer.vue'
import TreeRenderer from './renderers/TreeRenderer.vue'
import SignatureRenderer from './renderers/SignatureRenderer.vue'
import TagPadRenderer from './renderers/TagPadRenderer.vue'
import ResourceRenderer from './renderers/ResourceRenderer.vue'

// Props
interface Props {
  formSchema: any
  loading?: boolean
  formData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  formData: () => ({})
})

// Emits
const emit = defineEmits<{
  submit: [data: any, isFormSubmit?: boolean]
  error: [error: string]
  'data-change': [data: any]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const internalFormData = ref<Record<string, any>>({ ...props.formData })

// Computed
const formData = computed({
  get: () => internalFormData.value,
  set: (value) => {
    internalFormData.value = value
    emit('data-change', value)
  }
})

// Component renderer mapping
const componentRenderers = {
  textfield: TextFieldRenderer,
  textarea: TextAreaRenderer,
  number: NumberRenderer,
  email: EmailRenderer,
  password: PasswordRenderer,
  select: SelectRenderer,
  radio: RadioRenderer,
  checkbox: CheckboxRenderer,
  file: FileRenderer,
  button: ButtonRenderer,
  columns: ColumnsRenderer,
  panel: PanelRenderer,
  fieldset: FieldsetRenderer,
  tabs: TabsRenderer,
  table: TableRenderer,
  well: WellRenderer,
  container: ContainerRenderer,
  htmlelement: HtmlElementRenderer,
  content: ContentRenderer,
  hidden: HiddenRenderer,
  datagrid: DataGridRenderer,
  editgrid: EditGridRenderer,
  survey: SurveyRenderer,
  tree: TreeRenderer,
  signature: SignatureRenderer,
  'signature-pad': SignatureRenderer,
  signaturepad: SignatureRenderer,
  توقيع: SignatureRenderer,
  tagpad: TagPadRenderer,
  resource: ResourceRenderer
}

// Methods
const getComponentRenderer = (type: string) => {
  const renderer = (componentRenderers as any)[type]
  
  // Log component type resolution for debugging
  if (!renderer) {
    console.warn('📝 DynamicFormRenderer: Unsupported component type', {
      type,
      availableTypes: Object.keys(componentRenderers),
      fallbackTo: 'TextFieldRenderer'
    })
  } else if (type === 'tabs') {
    console.log('📝 DynamicFormRenderer: Tabs component found', {
      type,
      renderer: renderer.name || 'TabsRenderer'
    })
  }
  
  return renderer || TextFieldRenderer
}

const updateFormData = (key: string, value: any) => {
  // Log signature data specifically
  if (key.includes('signature') || (typeof value === 'string' && value.startsWith('data:image'))) {
    console.log('📝 DynamicFormRenderer: Signature data received', {
      key,
      hasValue: !!value,
      valueType: typeof value,
      isDataURL: typeof value === 'string' && value.startsWith('data:image')
    })
  }
  
  internalFormData.value = {
    ...internalFormData.value,
    [key]: value
  }
  emit('data-change', internalFormData.value)
}

const handleSubmit = () => {
  emit('submit', internalFormData.value, true)
}

const handleComponentSubmit = (buttonInfo?: { action: string, isFormSubmit: boolean }) => {
  // Pass button information to parent component
  if (buttonInfo) {
    emit('submit', internalFormData.value, buttonInfo.isFormSubmit)
  } else {
    // Fallback for components that don't provide button info
    emit('submit', internalFormData.value, false)
  }
}

// Watch for external form data changes
watch(
  () => props.formData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      internalFormData.value = { ...newData }
    }
  },
  { deep: true, immediate: true }
)

// Method to reinitialize signature components when they become visible
const reinitializeSignatureComponents = async () => {
  await nextTick()
  console.log('📝 DynamicFormRenderer: Reinitializing signature components')
  
  // Find all signature components and reinitialize them
  const signatureComponents = document.querySelectorAll('.signature-renderer canvas')
  signatureComponents.forEach((canvas) => {
    const signatureComponent = canvas.closest('.signature-renderer')
    if (signatureComponent && (canvas as any).offsetParent !== null) {
      // Trigger reinitialize if the component has the method exposed
      const componentInstance = (signatureComponent as any).__vueParentComponent?.exposed
      if (componentInstance && componentInstance.reinitialize) {
        componentInstance.reinitialize()
      }
    }
  })
}

// Expose methods for parent component
defineExpose({
  getFormData: () => internalFormData.value,
  setFormData: (data: Record<string, any>) => {
    internalFormData.value = { ...data }
  },
  resetForm: () => {
    internalFormData.value = {}
  },
  reinitializeSignatures: reinitializeSignatureComponents
})
</script>

<style scoped>
.dynamic-form-renderer {
  width: 100%;
}

.form-component {
  margin-bottom: 1.5rem;
}

.rtl {
  direction: rtl;
}
</style>
