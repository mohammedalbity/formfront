<template>
  <div class="form-group">
    <button
      type="button"
      :disabled="readonly || component.disabled"
      class="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
      :class="[
        buttonThemeClasses,
        component.customClass
      ]"
    >
      {{ component.label }}
    </button>
    <p v-if="component.description" class="text-xs text-gray-500 mt-1">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  component: Record<string, any>
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

const buttonThemeClasses = computed(() => {
  const theme = props.component.theme || 'primary'

  const themes = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-yellow-300',
    info: 'bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-cyan-300'
  }

  return themes[theme as keyof typeof themes] || themes.primary
})
</script>
