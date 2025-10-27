<template>
  <div class="html-element-renderer">
    <component
      :is="component.tag || 'div'"
      v-html="component.content"
      :class="component.className"
      v-bind="getAttributes()"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()

const getAttributes = () => {
  const attrs: Record<string, any> = {}
  
  if (props.component.attrs && Array.isArray(props.component.attrs)) {
    props.component.attrs.forEach((attr: any) => {
      if (attr.attr && attr.value) {
        attrs[attr.attr] = attr.value
      }
    })
  }
  
  return attrs
}
</script>
