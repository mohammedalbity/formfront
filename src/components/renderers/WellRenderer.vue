<template>
  <div class="well-renderer">
    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
      
      <div class="space-y-4">
        <div v-if="!component.components || component.components.length === 0" class="text-center py-8 text-gray-500">
          <div class="text-sm">{{ t('publicForm.emptyWell') }}</div>
        </div>
        <div
          v-else
          v-for="(childComponent, index) in component.components"
          :key="childComponent.key || `well-child-${index}`"
          class="well-component"
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
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
  return (childComponentRenderers as any)[type] || TextFieldRenderer
}

const updateValue = (key: string, value: any) => {
  emit('update:value', key, value)
}
</script>
