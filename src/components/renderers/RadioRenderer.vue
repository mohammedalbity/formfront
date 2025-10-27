<template>
  <div class="radio-renderer">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500">*</span>
    </label>
    <div class="space-y-2">
      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center"
      >
        <input
          :id="`${component.key}-${option.value}`"
          type="radio"
          :name="component.key"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="handleChange"
          :required="component.validate?.required"
          :disabled="component.disabled"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
        />
        <label
          :for="`${component.key}-${option.value}`"
          class="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
        >
          {{ option.label }}
        </label>
      </div>
    </div>
    <p v-if="component.description" class="text-xs text-gray-500 mt-2">
      {{ component.description }}
    </p>
    <p v-if="errorMessage" class="text-xs text-red-600 mt-2">
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
const modelValue = computed(() => props.formData[props.component.key] || '')
const hasError = computed(() => !!errorMessage.value)

const options = computed(() => {
  return props.component.values || []
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  errorMessage.value = ''
  emit('update:value', props.component.key, value)
}
</script>
