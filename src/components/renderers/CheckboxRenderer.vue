<template>
  <div class="checkbox-renderer">
    <div class="flex items-center">
      <input
        :id="component.key"
        type="checkbox"
        :checked="modelValue"
        @change="handleChange"
        :required="component.validate?.required"
        :disabled="component.disabled"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label
        v-if="component.label"
        :for="component.key"
        class="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
      >
        {{ component.label }}
        <span v-if="component.validate?.required" class="text-red-500">*</span>
      </label>
    </div>
    <p v-if="component.description" class="text-xs text-gray-500 mt-2 ml-6">
      {{ component.description }}
    </p>
    <p v-if="errorMessage" class="text-xs text-red-600 mt-2 ml-6">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()

const errorMessage = ref('')
const modelValue = computed(() => !!props.formData[props.component.key])
const hasError = computed(() => !!errorMessage.value)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.checked
  errorMessage.value = ''
  emit('update:value', props.component.key, value)
}
</script>
