<template>
  <div class="file-renderer">
    <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ component.label }}
      <span v-if="component.validate?.required" class="text-red-500">*</span>
    </label>
    
    <!-- File Input -->
    <input
      ref="fileInput"
      type="file"
      @change="handleFileChange"
      :required="component.validate?.required"
      :disabled="component.disabled || uploading"
      :multiple="component.multiple"
      :accept="getAcceptTypes()"
      class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      :class="[component.customClass, { 'border-red-300 focus:ring-red-500': hasError }]"
    />
    
    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-2">
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
        <span class="text-sm text-blue-600">جارٍ رفع الملف...</span>
      </div>
    </div>
    
    <!-- File Preview -->
    <div v-if="fileData && fileData.length > 0" class="mt-3 space-y-2">
      <div v-for="(file, index) in fileData" :key="index" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- File Icon -->
            <div class="p-2 rounded-lg" :class="getFileIconClass(file.type)">
              <svg class="w-5 h-5" :class="getFileIconColor(file.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isImageFile(file.type)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <!-- File Info -->
            <div>
              <div class="text-sm font-medium text-gray-900">{{ file.name }}</div>
              <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }} • {{ getFileTypeLabel(file.type) }}</div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <!-- Preview Button for Images -->
            <button
              type="button"
              v-if="isImageFile(file.type)"
              @click="previewFile(file)"
              class="p-1 text-blue-600 hover:text-blue-700 transition-colors"
              title="معاينة الصورة"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <!-- Download Button -->
            <button
              type="button"
              @click="downloadFile(file)"
              class="p-1 text-green-600 hover:text-green-700 transition-colors"
              title="تحميل الملف"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            <!-- Remove Button -->
            <button
              type="button"
              @click="removeFile(index)"
              class="p-1 text-red-600 hover:text-red-700 transition-colors"
              title="حذف الملف"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Image Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closePreview">
      <div class="relative max-w-4xl max-h-full p-4">
        <img :src="previewImage" :alt="previewFileName" class="max-w-full max-h-full object-contain rounded-lg" />
        <button
          type="button"
          @click="closePreview"
          class="absolute top-2 right-2 bg-transparent rounded-full p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="component.description" class="text-xs text-gray-500 mt-1">
      {{ component.description }}
    </p>
    <p v-if="errorMessage" class="text-xs text-red-600 mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  component: any
  formData: Record<string, any>
}

interface FileData {
  name: string
  type: string
  size: number
  data: string // base64 data
  originalFile?: File
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [key: string, value: any] }>()

const errorMessage = ref('')
const uploading = ref(false)
const fileData = ref<FileData[]>([])
const showPreview = ref(false)
const previewImage = ref('')
const previewFileName = ref('')
const fileInput = ref<HTMLInputElement>()

const hasError = computed(() => !!errorMessage.value)

const getAcceptTypes = () => {
  if (props.component.fileTypes && props.component.fileTypes.length > 0) {
    return props.component.fileTypes.map((type: any) => type.value).join(',')
  }
  return '*'
}

const isImageFile = (type: string): boolean => {
  return type.startsWith('image/')
}

const getFileIconClass = (type: string): string => {
  if (isImageFile(type)) return 'bg-green-100'
  if (type.includes('pdf')) return 'bg-red-100'
  if (type.includes('word') || type.includes('document')) return 'bg-blue-100'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'bg-green-100'
  return 'bg-gray-100'
}

const getFileIconColor = (type: string): string => {
  if (isImageFile(type)) return 'text-green-600'
  if (type.includes('pdf')) return 'text-red-600'
  if (type.includes('word') || type.includes('document')) return 'text-blue-600'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'text-green-600'
  return 'text-gray-600'
}

const getFileTypeLabel = (type: string): string => {
  if (isImageFile(type)) return 'صورة'
  if (type.includes('pdf')) return 'PDF'
  if (type.includes('word') || type.includes('document')) return 'مستند'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'جدول بيانات'
  if (type.includes('text')) return 'ملف نصي'
  return 'ملف'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت'
  const k = 1024
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  errorMessage.value = ''
  
  if (!files || files.length === 0) return

  uploading.value = true
  
  try {
    const newFileData: FileData[] = []
    
    for (const file of Array.from(files)) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errorMessage.value = `الملف "${file.name}" كبير جداً. الحد الأقصى 10 ميجابايت.`
        continue
      }
      
      // Convert to base64
      const base64Data = await convertFileToBase64(file)
      
      const fileInfo: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data,
        originalFile: file
      }
      
      newFileData.push(fileInfo)
    }
    
    if (props.component.multiple) {
      fileData.value = [...fileData.value, ...newFileData]
    } else {
      fileData.value = newFileData
    }
    
    // Emit the file data
    const valueToEmit = props.component.multiple ? fileData.value : fileData.value[0]
    emit('update:value', props.component.key, valueToEmit)
    
  } catch (error) {
    console.error('Error processing files:', error)
    errorMessage.value = 'حدث خطأ أثناء معالجة الملفات'
  } finally {
    uploading.value = false
    // Clear the input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const removeFile = (index: number) => {
  fileData.value.splice(index, 1)
  const valueToEmit = props.component.multiple ? fileData.value : (fileData.value[0] || null)
  emit('update:value', props.component.key, valueToEmit)
}

const previewFile = (file: FileData) => {
  if (isImageFile(file.type)) {
    previewImage.value = file.data
    previewFileName.value = file.name
    showPreview.value = true
  }
}

const closePreview = () => {
  showPreview.value = false
  previewImage.value = ''
  previewFileName.value = ''
}

const downloadFile = (file: FileData) => {
  try {
    const link = document.createElement('a')
    link.href = file.data
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading file:', error)
    errorMessage.value = 'حدث خطأ أثناء تحميل الملف'
  }
}
</script>

<style scoped>
.file-upload-area {
  transition: all 0.3s ease;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.file-upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.file-item {
  transition: all 0.2s ease;
}

.file-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-progress {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.preview-modal {
  backdrop-filter: blur(8px);
}

.preview-image {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
}

.btn-hover {
  transition: all 0.2s ease;
}

.btn-hover:hover {
  transform: translateY(-1px);
}

.file-icon {
  transition: all 0.2s ease;
}

.file-item:hover .file-icon {
  transform: scale(1.1);
}
</style>
