<template>
  <div class="signature-renderer" :class="{ 'rtl': isRTLSync() }">
    <!-- Signature Title -->
    <div v-if="component.label" class="signature-title mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        {{ component.label }}
        <span v-if="component.validate?.required" class="text-red-500 ml-1">*</span>
      </label>
      <p v-if="component.description" class="text-gray-600 text-sm mb-3">
        {{ component.description }}
      </p>
    </div>

    <!-- Signature Pad Container -->
    <div class="signature-container bg-transparent border-2 border-gray-300 rounded-lg overflow-hidden">
      <!-- Signature Canvas -->
      <div class="signature-canvas-container relative" :style="canvasContainerStyle">
        <canvas
          ref="signatureCanvas"
          :width="canvasWidth"
          :height="canvasHeight"
          class="signature-canvas cursor-crosshair"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="stopDrawing"
        ></canvas>

        <!-- Empty State Overlay -->
        <div
          v-if="!hasSignature && !isDrawing"
          class="signature-placeholder absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div class="text-center text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <p class="text-sm">{{ $t('signature.signHere') }}</p>
          </div>
        </div>
      </div>

      <!-- Signature Controls -->
      <div class="signature-controls bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <!-- Clear Button -->
          <button
            type="button"
            @click="clearSignature"
            :disabled="!hasSignature"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('signature.clear') }}
          </button>

          <!-- Undo Button -->
          <button
            type="button"
            @click="undoLastStroke"
            :disabled="strokes.length === 0"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            {{ $t('signature.undo') }}
          </button>
        </div>

        <!-- Signature Status -->
        <div class="flex items-center text-sm">
          <div v-if="hasSignature" class="flex items-center text-green-600">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ $t('signature.signed') }}
          </div>
          <div v-else class="text-gray-500">
            {{ $t('signature.empty') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Error -->
    <div v-if="validationError" class="mt-2 text-red-600 text-sm">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../../i18n'

// Props
interface Props {
  component: any
  formData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:value': [key: string, value: any]
}>()

// Composables
const { t } = useI18n()

// Reactive state
const signatureCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const hasSignature = ref(false)
const strokes = ref<Array<Array<{x: number, y: number}>>>([])
const currentStroke = ref<Array<{x: number, y: number}>>([])
const validationError = ref<string>('')

// Computed
const componentKey = computed(() => {
  return props.component.key || 'signature'
})

const canvasWidth = computed(() => {
  return props.component.width || 400
})

const canvasHeight = computed(() => {
  return props.component.height || 200
})

const canvasContainerStyle = computed(() => {
  return {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`,
    maxWidth: '100%'
  }
})

const strokeColor = computed(() => {
  return props.component.strokeColor || '#000000'
})

const strokeWidth = computed(() => {
  return props.component.strokeWidth || 2
})

const backgroundColor = computed(() => {
  return props.component.backgroundColor || '#ffffff'
})

// Methods
const getCanvasContext = (): CanvasRenderingContext2D | null => {
  if (!signatureCanvas.value) return null
  return signatureCanvas.value.getContext('2d')
}

const setupCanvas = () => {
  const canvas = signatureCanvas.value
  const ctx = getCanvasContext()
  if (!canvas || !ctx) return

  // Set canvas background
  ctx.fillStyle = backgroundColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Set drawing properties
  ctx.strokeStyle = strokeColor.value
  ctx.lineWidth = strokeWidth.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const getEventPos = (event: MouseEvent | Touch): {x: number, y: number} => {
  const canvas = signatureCanvas.value
  if (!canvas) return {x: 0, y: 0}

  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  }
}

const startDrawing = (event: MouseEvent) => {
  event.preventDefault()
  
  // Ensure canvas is properly initialized before drawing
  if (!signatureCanvas.value || signatureCanvas.value.offsetParent === null) {
    console.log('🖋️ SignatureRenderer: Canvas not visible, reinitializing...')
    reinitializeCanvas()
    return
  }
  
  isDrawing.value = true
  currentStroke.value = []
  
  const pos = getEventPos(event)
  currentStroke.value.push(pos)
  
  const ctx = getCanvasContext()
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }
}

const draw = (event: MouseEvent) => {
  if (!isDrawing.value) return
  event.preventDefault()

  const pos = getEventPos(event)
  currentStroke.value.push(pos)
  
  const ctx = getCanvasContext()
  if (ctx) {
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }
}

const stopDrawing = () => {
  if (!isDrawing.value) return
  
  isDrawing.value = false
  
  if (currentStroke.value.length > 0) {
    strokes.value.push([...currentStroke.value])
    hasSignature.value = true
    updateFormData()
    clearValidationError()
  }
  
  currentStroke.value = []
}

const handleTouchStart = (event: TouchEvent) => {
  event.preventDefault()
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    startDrawing(touch as any)
  }
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    draw(touch as any)
  }
}

const clearSignature = () => {
  const ctx = getCanvasContext()
  if (!ctx || !signatureCanvas.value) return

  // Clear canvas
  ctx.fillStyle = backgroundColor.value
  ctx.fillRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
  
  // Reset state
  strokes.value = []
  currentStroke.value = []
  hasSignature.value = false
  
  updateFormData()
}

const undoLastStroke = () => {
  if (strokes.value.length === 0) return
  
  strokes.value.pop()
  redrawCanvas()
  
  hasSignature.value = strokes.value.length > 0
  updateFormData()
}

const redrawCanvas = () => {
  const ctx = getCanvasContext()
  if (!ctx || !signatureCanvas.value) return

  // Clear and setup canvas
  setupCanvas()
  
  // Redraw all strokes
  ctx.strokeStyle = strokeColor.value
  ctx.lineWidth = strokeWidth.value
  
  strokes.value.forEach(stroke => {
    if (stroke.length > 0) {
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y)
      }
      
      ctx.stroke()
    }
  })
}

const getSignatureDataURL = (): string => {
  if (!signatureCanvas.value || !hasSignature.value) return ''
  return signatureCanvas.value.toDataURL('image/png')
}

const updateFormData = () => {
  const dataURL = getSignatureDataURL()
  console.log('🖋️ SignatureRenderer: Updating form data', {
    componentKey: componentKey.value,
    hasSignature: hasSignature.value,
    dataURL: dataURL ? dataURL.substring(0, 50) + '...' : 'empty'
  })
  emit('update:value', componentKey.value, dataURL)
}

const loadSignatureFromDataURL = (dataURL: string) => {
  if (!dataURL || !signatureCanvas.value) return
  
  const img = new Image()
  img.onload = () => {
    const ctx = getCanvasContext()
    if (ctx) {
      setupCanvas()
      ctx.drawImage(img, 0, 0)
      hasSignature.value = true
    }
  }
  img.src = dataURL
}

const validate = (): boolean => {
  if (props.component.validate?.required && !hasSignature.value) {
    validationError.value = t('validation.required')
    return false
  }
  return true
}

const clearValidationError = () => {
  validationError.value = ''
}

// Watch for external form data changes
watch(
  () => props.formData?.[componentKey.value],
  (newValue) => {
    if (newValue && typeof newValue === 'string' && newValue.startsWith('data:image/')) {
      loadSignatureFromDataURL(newValue)
    } else if (!newValue) {
      clearSignature()
    }
  },
  { immediate: true }
)

// Re-initialize canvas when it becomes visible
const reinitializeCanvas = async () => {
  await nextTick()
  if (signatureCanvas.value && signatureCanvas.value.offsetParent !== null) {
    console.log('🖋️ SignatureRenderer: Reinitializing canvas', {
      componentKey: componentKey.value,
      canvasVisible: signatureCanvas.value.offsetParent !== null,
      canvasWidth: signatureCanvas.value.width,
      canvasHeight: signatureCanvas.value.height
    })
    setupCanvas()
    
    // Load existing signature if any
    const existingSignature = props.formData?.[componentKey.value]
    if (existingSignature) {
      loadSignatureFromDataURL(existingSignature)
    }
  }
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  setupCanvas()
  
  // Load existing signature if any
  const existingSignature = props.formData?.[componentKey.value]
  if (existingSignature) {
    loadSignatureFromDataURL(existingSignature)
  }
  
  // Set up observer to reinitialize when canvas becomes visible
  if (signatureCanvas.value) {
    const observer = new MutationObserver(() => {
      if (signatureCanvas.value && signatureCanvas.value.offsetParent !== null) {
        reinitializeCanvas()
      }
    })
    
    // Observe changes in the parent elements
    let parent = signatureCanvas.value.parentElement
    while (parent) {
      observer.observe(parent, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        subtree: true
      })
      parent = parent.parentElement
    }
  }
})

// Expose methods for parent component
defineExpose({
  validate,
  clear: clearSignature,
  getSignatureData: getSignatureDataURL,
  getFormData: () => ({
    [componentKey.value]: getSignatureDataURL()
  }),
  reinitialize: reinitializeCanvas
})
</script>

<style scoped>
.signature-renderer {
  width: 100%;
}

.signature-container {
  display: inline-block;
  max-width: 100%;
}

.signature-canvas-container {
  position: relative;
  background-color: #ffffff;
}

.signature-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.signature-placeholder {
  background-color: rgba(249, 250, 251, 0.8);
}

.signature-controls {
  min-height: 50px;
}

.rtl {
  direction: rtl;
}

.rtl .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

.rtl .mr-1 {
  margin-right: 0;
  margin-left: 0.25rem;
}

.rtl .mr-1\.5 {
  margin-right: 0;
  margin-left: 0.375rem;
}

.rtl .ml-1 {
  margin-left: 0;
  margin-right: 0.25rem;
}

.rtl .space-x-3 > * + * {
  margin-left: 0;
  margin-right: 0.75rem;
}

/* Responsive design */
@media (max-width: 640px) {
  .signature-controls {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .signature-controls > div {
    justify-content: center;
  }
}

/* Focus styles */
button:focus {
  outline: none;
}

/* Canvas border when focused */
.signature-canvas:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions */
.signature-container {
  transition: border-color 0.2s ease;
}

.signature-container:hover {
  border-color: #9ca3af;
}

.signature-container:focus-within {
  border-color: #3b82f6;
}
</style>
