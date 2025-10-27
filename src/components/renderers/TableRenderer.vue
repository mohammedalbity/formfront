<template>
  <div class="table-renderer">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
        <thead v-if="component.headers && component.headers.length > 0" class="bg-gray-50">
          <tr>
            <th
              v-for="(header, headerIndex) in component.headers"
              :key="`header-${headerIndex}`"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-transparent divide-y divide-gray-200">
          <tr v-if="!component.rows || component.rows.length === 0">
            <td :colspan="component.headers?.length || 1" class="px-4 py-8 text-center text-gray-500">
              {{ t('publicForm.emptyTable') }}
            </td>
          </tr>
          <tr v-else v-for="(row, rowIndex) in component.rows" :key="`row-${rowIndex}`">
            <td
              v-for="(cell, cellIndex) in row.cells"
              :key="`cell-${rowIndex}-${cellIndex}`"
              class="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0"
            >
              <!-- Render nested components if present; fallback to cell content -->
              <template v-if="cell.components && Array.isArray(cell.components) && cell.components.length">
                <div class="space-y-4">
                  <component
                    v-for="(childComponent, componentIndex) in cell.components"
                    :key="childComponent.key || `table-cell-${rowIndex}-${cellIndex}-comp-${componentIndex}`"
                    :is="getChildComponentRenderer(childComponent.type)"
                    :component="childComponent"
                    :form-data="formData"
                    @update:value="(key: string, value: any) => updateValue(key, value)"
                  />
                </div>
              </template>
              <template v-else>
                <div v-html="cell.content || ''"></div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
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

// Map child component types
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
  hidden: HiddenRenderer,
}

const getChildComponentRenderer = (type: string) => {
  return (childComponentRenderers as any)[type] || TextFieldRenderer
}

const updateValue = (key: string, value: any) => {
  emit('update:value', key, value)
}
</script>
