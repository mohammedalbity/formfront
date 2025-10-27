<template>
  <div class="form-group">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500">*</span>
    </label>
    <CustomSelect
      :disabled="readonly || component.disabled"
      :placeholder="component.placeholder || $t('placeholders.selectAnOption')"
      :options="selectOptions"
      :selectClasses="component.customClass"
      containerClass="w-full"
    />
    <p v-if="component.description" class="text-xs text-gray-500 mt-1">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomSelect from '../CustomSelect.vue'

interface Props {
  component: Record<string, any>
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

const { t } = useI18n()

const selectOptions = computed(() => {
  return props.component.data?.values || [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' }
  ]
})
</script>
