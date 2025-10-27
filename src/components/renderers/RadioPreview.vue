<template>
  <div class="form-group">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500">*</span>
    </label>
    <div class="space-y-2 sm:space-y-3">
      <div
        v-for="option in radioOptions"
        :key="option.value"
        class="flex items-center"
      >
        <input
          type="radio"
          :name="component.key"
          :value="option.value"
          :disabled="readonly || component.disabled"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:cursor-not-allowed"
        />
        <label class="ml-2 text-sm sm:text-base text-gray-700" :class="{ 'mr-2 ml-0': isRTLDirection }">
          {{ option.label }}
        </label>
      </div>
    </div>
    <p v-if="component.description" class="text-xs text-gray-500 mt-1">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isRTLSync } from '../../i18n'

interface Props {
  component: Record<string, any>
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

const isRTLDirection = computed(() => isRTLSync())

const radioOptions = computed(() => {
  return props.component.values || [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' }
  ]
})
</script>
