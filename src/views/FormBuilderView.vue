<template>
  <div class="form-builder-view">
    <!-- Fullscreen Loading while view initializes -->
    <LoadingSpinner
      v-if="loading"
      fullscreen
      overlay
      :showPulse="true"
      text="Loading"
      subtext="Preparing the builder..."
    />

    <FormBuilder />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import FormBuilder from '../components/FormBuilder.vue'

const loading = ref(true)

onMounted(() => {
  // Small delay to show the loader on refresh; replace with real data-loading signal if available
  setTimeout(() => {
    loading.value = false
  }, 300)
})
</script>

<style scoped>
.form-builder-view {
  height: 100vh;
  overflow: hidden;
}
</style>
