<template>
  <div class="form-group">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500">*</span>
    </label>
    <input
      type="email"
      :placeholder="component.placeholder"
      :disabled="readonly || component.disabled"
      class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      :class="component.customClass"
    />
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
