<template>
  <div class="form-group">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ component.label }}
    </label>
    <div class="border border-blue-300 rounded-lg overflow-hidden bg-white">
      <!-- Content Header -->
      <div class="bg-blue-50 px-4 py-2 border-b border-blue-200 flex justify-between items-center">
        <div class="flex items-center text-blue-700">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium">{{ $t('formBuilder.staticContent') }}</span>
        </div>
        <div class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {{ (component as any).wysiwyg ? 'WYSIWYG' : 'HTML' }}
        </div>
      </div>

      <!-- Content Body -->
      <div class="p-4 min-h-[80px]">
        <div class="bg-gray-50 border border-gray-200 rounded p-3">
          <div v-if="(component as any).html" class="prose prose-sm max-w-none">
            <div v-html="(component as any).html" class="text-sm text-gray-700"></div>
          </div>
          <div v-else-if="(component as any).content" class="text-sm text-gray-700">
            {{ (component as any).content }}
          </div>
          <div v-else class="text-xs text-gray-500 italic flex items-center justify-center py-4">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            {{ $t('formBuilder.clickToEditContent') }}
          </div>
        </div>

        <!-- Content Info -->
        <div v-if="(component as any).html || (component as any).content" class="mt-3 pt-3 border-t border-gray-200">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>Content Type: {{ (component as any).wysiwyg ? 'Rich Text (WYSIWYG)' : 'HTML/Plain Text' }}</span>
            <span v-if="(component as any).html">{{ (component as any).html.length }} characters</span>
            <span v-else-if="(component as any).content">{{ (component as any).content.length }} characters</span>
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
