<template>
  <div class="tabs-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Tab Headers -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex" :class="isRTLSync() ? 'space-x-reverse space-x-8' : 'space-x-8'" aria-label="Tabs">
        <button
          v-for="(tab, index) in component.components"
          :key="tab.key || `tab-${index}`"
          type="button"
          @click="switchToTab(index)"
          :class="[
            activeTab === index
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50',
            'whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg'
          ]"
        >
          {{ tab.label || getTabLabel(index) }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <div
        v-for="(tab, index) in component.components"
        :key="tab.key || `tab-content-${index}`"
        v-show="activeTab === index"
        class="tab-content"
      >
        <div class="space-y-4">
          <div v-if="!tab.components || tab.components.length === 0" class="text-center py-8 text-gray-500">
            <div class="text-sm">{{ t('publicForm.emptyTab') }}</div>
          </div>
          <div
            v-else
            v-for="(childComponent, childIndex) in tab.components"
            :key="childComponent.key || `tab-child-${childIndex}`"
            class="tab-component"
          >
            <component
              :is="getChildComponentRenderer(childComponent.type)"
              :component="childComponent"
              :form-data="formData"
              @update:value="(key: string, value: any) => updateValue(key, value)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'
import TextFieldRenderer from './TextFieldRenderer.vue'
import TextAreaRenderer from './TextAreaRenderer.vue'
import NumberRenderer from './NumberRenderer.vue'
import EmailRenderer from './EmailRenderer.vue'
import PasswordRenderer from './PasswordRenderer.vue'
import SelectRenderer from './SelectRenderer.vue'
import RadioRenderer from './RadioRenderer.vue'
import CheckboxRenderer from './CheckboxRenderer.vue'
import FileRenderer from './FileRenderer.vue'
import ButtonRenderer from './ButtonRenderer.vue'
import HiddenRenderer from './HiddenRenderer.vue'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()
const { t } = useI18n()

const activeTab = ref(0)

// Debug logging for tabs component
console.log('📝 TabsRenderer: Component received:', props.component)
console.log('📝 TabsRenderer: Tabs components:', props.component?.components)

const childComponentRenderers = {
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
  hidden: HiddenRenderer
}

const getChildComponentRenderer = (type: string) => {
  const renderer = (childComponentRenderers as any)[type]
  if (!renderer) {
    console.warn('📝 TabsRenderer: Unsupported child component type:', type)
  }
  return renderer || TextFieldRenderer
}

const getTabLabel = (index: number) => {
  try {
    return t('renderers.tabs.tab', { number: index + 1 })
  } catch (error) {
    return `Tab ${index + 1}`
  }
}

const switchToTab = async (index: number) => {
  console.log('📝 TabsRenderer: Switching to tab', index)
  activeTab.value = index
  
  // Wait for DOM update and trigger any necessary re-renders
  await nextTick()
  
  // Dispatch custom event for any components that need to know about tab changes
  const event = new CustomEvent('tab-changed', {
    detail: { 
      tabIndex: index,
      tabComponent: props.component?.components?.[index]
    }
  })
  window.dispatchEvent(event)
}

const updateValue = (key: string, value: any) => {
  console.log('📝 TabsRenderer: Updating value', { key, value })
  emit('update:value', key, value)
}

// Watch for component changes to reset active tab if needed
watch(
  () => props.component?.components?.length,
  (newLength, oldLength) => {
    if (newLength !== oldLength && activeTab.value >= (newLength || 0)) {
      activeTab.value = 0
    }
  }
)
</script>

<style scoped>
.tabs-renderer {
  width: 100%;
}

.tabs-renderer.rtl {
  direction: rtl;
}

.tab-content {
  min-height: 200px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RTL Support for tabs */
.rtl nav {
  direction: rtl;
}

.rtl .space-x-reverse > * + * {
  margin-right: 2rem;
  margin-left: 0;
}

/* Enhanced tab button styles */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
