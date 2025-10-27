<template>
  <div class="select-renderer">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500">*</span>
    </label>
    <CustomSelect
      :modelValue="modelValue"
      @update:modelValue="handleValueUpdate"
      :required="component.validate?.required"
      :disabled="component.disabled"
      :placeholder="component.placeholder || 'اختر خياراً'"
      :options="options"
      :selectClasses="component.customClass || ''"
      :error="errorMessage"
      containerClass="w-full"
    />
    <p v-if="component.description" class="text-xs text-gray-500 mt-1">
      {{ component.description }}
    </p>
    <p v-if="errorMessage" class="text-xs text-red-600 mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CustomSelect from '../CustomSelect.vue'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()

const errorMessage = ref('')
const modelValue = computed(() => props.formData[props.component.key] || '')
const hasError = computed(() => !!errorMessage.value)

const options = computed(() => {
  return props.component.data?.values || props.component.values || []
})

const handleValueUpdate = (value: string | number) => {
  errorMessage.value = ''
  emit('update:value', props.component.key, value)
}
</script>
