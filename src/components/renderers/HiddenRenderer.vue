<template>
  <input
    type="hidden"
    :name="component.key"
    :value="modelValue"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()

const modelValue = computed(() => props.formData[props.component.key] || props.component.defaultValue || '')

onMounted(() => {
  // Set default value if not already set
  if (!props.formData[props.component.key] && props.component.defaultValue) {
    emit('update:value', props.component.key, props.component.defaultValue)
  }
})
</script>
