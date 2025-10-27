<template>
  <div class="form-group">
    <div class="flex items-center">
      <input
        type="checkbox"
        :disabled="readonly || component.disabled"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
      />
      <label class="ml-2 text-sm sm:text-base text-gray-700" :class="{ 'mr-2 ml-0': isRTLDirection }">
        {{ component.label }}
        <span v-if="component.validate?.required" class="text-red-500">*</span>
      </label>
    </div>
    <p v-if="component.description" class="text-xs text-gray-500 mt-1 ml-6" :class="{ 'mr-6 ml-0': isRTLDirection }">
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

withDefaults(defineProps<Props>(), {
  readonly: false
})

const isRTLDirection = computed(() => isRTLSync())
</script>
