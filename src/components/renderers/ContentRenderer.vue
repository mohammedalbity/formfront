<template>
  <div class="content-renderer">
    <div v-html="component.html || component.content" class="prose prose-sm max-w-none"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  component: any
  formData: Record<string, any>
}

const props = defineProps<Props>()
</script>
