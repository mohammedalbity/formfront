<template>
  <div class="form-group">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
    </label>
    <div class="border border-yellow-300 rounded-lg overflow-hidden bg-white">
      <!-- HTML Element Header -->
      <div class="bg-yellow-50 px-4 py-2 border-b border-yellow-200 flex justify-between items-center">
        <div class="flex items-center text-yellow-700">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium">HTML Element</span>
        </div>
        <div class="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
          {{ (component as any).tag || 'div' }}
        </div>
      </div>

      <!-- HTML Element Content -->
      <div class="p-4 min-h-[80px]">
        <!-- Live Preview -->
        <div v-if="(component as any).content" class="mb-4 p-3 border border-gray-200 rounded bg-white">
          <div class="text-xs text-gray-500 mb-2 font-medium">Live Preview:</div>
          <div
            v-html="(component as any).content"
            :class="(component as any).className"
            class="html-preview"
          ></div>
        </div>

        <!-- Properties Summary -->
        <div class="bg-gray-50 border border-gray-200 rounded p-3">
          <div class="text-sm text-gray-700 mb-2">
            <strong>Tag:</strong>
            <code class="bg-gray-200 px-1 py-0.5 rounded text-xs">&lt;{{ (component as any).tag || 'div' }}&gt;</code>
          </div>

          <div v-if="(component as any).content" class="text-sm text-gray-600 mb-2">
            <strong>Content:</strong>
            <code class="bg-gray-200 px-1 py-0.5 rounded text-xs break-all">{{
              (component as any).content && (component as any).content.length > 50 ? (component as any).content.substring(0, 50) + '...' : (component as any).content
            }}</code>
          </div>

          <div v-if="(component as any).className" class="text-sm text-gray-600 mb-2">
            <strong>CSS Classes:</strong>
            <code class="bg-blue-100 px-1 py-0.5 rounded text-xs">{{ (component as any).className }}</code>
          </div>

          <div v-if="(component as any).attrs && (component as any).attrs.length > 0" class="text-sm text-gray-600">
            <strong>Attributes:</strong>
            <div class="mt-1 flex flex-wrap gap-1">
              <code
                v-for="attr in (component as any).attrs"
                :key="attr.name"
                class="text-xs bg-green-100 px-2 py-1 rounded"
              >
                {{ attr.name }}="{{ attr.value }}"
              </code>
            </div>
          </div>

          <div v-if="!(component as any).content && !(component as any).className && (!(component as any).attrs || (component as any).attrs.length === 0)"
               class="text-xs text-gray-500 italic flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ $t('formBuilder.configureHtmlElementProperties') }}
          </div>
        </div>
      </div>
    </div>
    <p v-if="component.description" class="text-xs text-gray-500 mt-1">
      {{ component.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  component: Record<string, any>
  readonly?: boolean
}

withDefaults(defineProps<Props>(), {
  readonly: false
})

const { t } = useI18n()
</script>
