<template>
  <div class="form-group">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500">*</span>
    </label>
    <textarea
      :placeholder="component.placeholder"
      :rows="typeof component.rows === 'number' ? component.rows : 3"
      :disabled="readonly || component.disabled"
      class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
      :class="component.customClass"
    ></textarea>
    <p v-if="component.description" class="text-xs text-gray-500 mt-1">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  component: Record<string, any>
  readonly?: boolean
}

withDefaults(defineProps<Props>(), {
  readonly: false
})
</script>
