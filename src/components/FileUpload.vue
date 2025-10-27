<template>
  <div class="file-upload-container" :class="{ 'rtl': isRTL }">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Drop Zone -->
    <div
      ref="dropZone"
      class="file-drop-zone"
      :class="{
        'border-blue-400 bg-blue-50': isDragOver,
        'border-red-300 bg-red-50': hasError,
        'border-gray-300': !isDragOver && !hasError,
        'opacity-50 cursor-not-allowed': disabled
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="!disabled && triggerFileInput()"
    >
      <!-- Upload Icon and Text -->
      <div class="text-center py-8">
        <svg v-if="!uploading" class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        
        <!-- Loading Spinner -->
        <div v-if="uploading" class="flex justify-center mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-if="!uploading">
          <p class="text-lg font-medium text-gray-900 mb-2">
            {{ $t('fileUpload.dropFiles') }}
          </p>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('fileUpload.orClickToSelect') }}
          </p>
          
          <!-- File Type Info -->
          <div v-if="acceptedTypes.length > 0" class="text-xs text-gray-400">
            {{ $t('fileUpload.acceptedTypes') }}: {{ acceptedTypesText }}
          </div>
          <div v-if="maxSize" class="text-xs text-gray-400 mt-1">
            {{ $t('fileUpload.maxSize') }}: {{ formatFileSize(maxSize) }}
          </div>
        </div>

        <div v-else class="text-sm text-gray-600">
          {{ $t('fileUpload.uploading') }}...
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      :multiple="multiple"
      :accept="acceptString"
      :disabled="disabled"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Selected Files List -->
    <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
      <h4 class="text-sm font-medium text-gray-700">
        {{ $t('fileUpload.selectedFiles') }} ({{ selectedFiles.length }})
      </h4>
      
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <div
          v-for="(file, index) in selectedFiles"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
        >
          <div class="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0">
            <!-- File Icon -->
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <!-- File Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ file.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }} • {{ getFileType(file.type) }}
              </p>
            </div>
          </div>

          <!-- Remove Button -->
          <button
            type="button"
            @click="removeFile(index)"
            :disabled="disabled"
            class="flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': disabled }"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <!-- Help Text -->
    <p v-if="helpText" class="mt-2 text-sm text-gray-500">
      {{ helpText }}
    </p>

    <!-- Upload Progress -->
    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>{{ $t('fileUpload.uploading') }}</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

// Props
interface Props {
  modelValue?: File[] | File | null
  label?: string
  helpText?: string
  multiple?: boolean
  accept?: string[]
  maxSize?: number // in bytes
  maxFiles?: number
  required?: boolean
  disabled?: boolean
  uploadUrl?: string
  autoUpload?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  multiple: false,
  accept: () => [],
  maxFiles: 10,
  required: false,
  disabled: false,
  autoUpload: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: File[] | File | null]
  'change': [files: File[]]
  'upload-start': [files: File[]]
  'upload-progress': [progress: number]
  'upload-success': [response: any]
  'upload-error': [error: string]
  'file-remove': [file: File, index: number]
}>()

// Composables
const { t, locale } = useI18n()

// Refs
const fileInput = ref<HTMLInputElement>()
const dropZone = ref<HTMLDivElement>()
const selectedFiles = ref<File[]>([])
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')

// Computed
const isRTL = computed(() => locale.value === 'ar')

const acceptedTypes = computed(() => {
  if (props.accept.length === 0) return []
  return props.accept
})

const acceptString = computed(() => {
  if (acceptedTypes.value.length === 0) return '*'
  return acceptedTypes.value.join(',')
})

const acceptedTypesText = computed(() => {
  if (acceptedTypes.value.length === 0) return t('fileUpload.allTypes')
  return acceptedTypes.value.join(', ')
})

const hasError = computed(() => !!errorMessage.value)

// Initialize from modelValue
if (props.modelValue) {
  if (Array.isArray(props.modelValue)) {
    selectedFiles.value = [...props.modelValue]
  } else if (props.modelValue instanceof File) {
    selectedFiles.value = [props.modelValue]
  }
}

// Methods
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled) {
    isDragOver.value = true
  }
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (props.disabled) return
  
  const files = Array.from(event.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
  
  // Reset input value
  if (target) {
    target.value = ''
  }
}

const processFiles = (files: File[]) => {
  errorMessage.value = ''
  
  // Validate files
  const validFiles = files.filter(file => validateFile(file))
  
  if (validFiles.length === 0) return
  
  // Handle multiple files
  if (props.multiple) {
    const totalFiles = selectedFiles.value.length + validFiles.length
    if (totalFiles > props.maxFiles) {
      errorMessage.value = t('fileUpload.errors.tooManyFiles', { max: props.maxFiles })
      return
    }
    selectedFiles.value.push(...validFiles)
  } else {
    selectedFiles.value = [validFiles[0]]
  }
  
  updateModelValue()
  emit('change', selectedFiles.value)
  
  if (props.autoUpload && props.uploadUrl) {
    uploadFiles()
  }
}

const validateFile = (file: File): boolean => {
  // Check file type
  if (acceptedTypes.value.length > 0) {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const mimeType = file.type
    
    const isValidType = acceptedTypes.value.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase()
      }
      return mimeType.match(type.replace('*', '.*'))
    })
    
    if (!isValidType) {
      errorMessage.value = t('fileUpload.errors.invalidType', { 
        fileName: file.name,
        acceptedTypes: acceptedTypesText.value 
      })
      return false
    }
  }
  
  // Check file size
  if (props.maxSize && file.size > props.maxSize) {
    errorMessage.value = t('fileUpload.errors.fileTooLarge', { 
      fileName: file.name,
      maxSize: formatFileSize(props.maxSize)
    })
    return false
  }
  
  return true
}

const removeFile = (index: number) => {
  const removedFile = selectedFiles.value[index]
  selectedFiles.value.splice(index, 1)
  updateModelValue()
  emit('file-remove', removedFile, index)
  emit('change', selectedFiles.value)
}

const updateModelValue = () => {
  if (props.multiple) {
    emit('update:modelValue', selectedFiles.value)
  } else {
    emit('update:modelValue', selectedFiles.value[0] || null)
  }
}

const uploadFiles = async () => {
  if (!props.uploadUrl || selectedFiles.value.length === 0) return
  
  uploading.value = true
  uploadProgress.value = 0
  emit('upload-start', selectedFiles.value)
  
  try {
    const formData = new FormData()
    selectedFiles.value.forEach((file, index) => {
      formData.append(props.multiple ? `files[${index}]` : 'file', file)
    })
    
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100)
        emit('upload-progress', uploadProgress.value)
      }
    })
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        emit('upload-success', response)
        uploadProgress.value = 100
      } else {
        throw new Error(`Upload failed with status ${xhr.status}`)
      }
    })
    
    xhr.addEventListener('error', () => {
      throw new Error('Upload failed')
    })
    
    xhr.open('POST', props.uploadUrl)
    xhr.send(formData)
    
  } catch (error) {
    errorMessage.value = t('fileUpload.errors.uploadFailed')
    emit('upload-error', error instanceof Error ? error.message : 'Upload failed')
  } finally {
    uploading.value = false
    await nextTick()
    if (uploadProgress.value !== 100) {
      uploadProgress.value = 0
    }
  }
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileType = (mimeType: string): string => {
  const types: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'application/pdf': 'PDF',
    'text/plain': 'Text',
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'application/vnd.ms-excel': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel'
  }
  
  return types[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown'
}

// Public methods
defineExpose({
  triggerFileInput,
  uploadFiles,
  clearFiles: () => {
    selectedFiles.value = []
    updateModelValue()
  },
  getFiles: () => selectedFiles.value
})
</script>

<style scoped>
.file-upload-container {
  @apply w-full;
}

.file-drop-zone {
  @apply border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50;
}

.file-drop-zone:hover:not(.opacity-50) {
  @apply border-blue-400 bg-blue-50;
}

.rtl .file-drop-zone {
  direction: rtl;
}
</style>
