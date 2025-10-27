<template>
  <div class="signature-pad-container" :class="{ 'rtl': isRTL }">
    <div class="signature-pad-wrapper">
      <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        class="signature-canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing"
      ></canvas>
      
      <!-- Overlay text when empty -->
      <div v-if="isEmpty" class="signature-overlay">
        <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <p class="text-sm text-gray-500">{{ $t('signature.signHere') }}</p>
      </div>
    </div>
    
    <!-- Action buttons -->
    <div class="signature-actions" :class="{ 'rtl:flex-row-reverse': isRTL }">
      <button
        type="button"
        @click="clearSignature"
        :disabled="isEmpty"
        class="signature-btn signature-btn-clear"
        :class="{ 'opacity-50 cursor-not-allowed': isEmpty }"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {{ $t('signature.clear') }}
      </button>
      
      <button
        type="button"
        @click="undoLastStroke"
        :disabled="strokes.length === 0"
        class="signature-btn signature-btn-undo"
        :class="{ 'opacity-50 cursor-not-allowed': strokes.length === 0 }"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        {{ $t('signature.undo') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Props
interface Props {
  modelValue?: string
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  backgroundColor?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  width: 400,
  height: 200,
  strokeColor: '#000000',
  strokeWidth: 2,
  backgroundColor: '#ffffff',
  disabled: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'clear': []
  'start': []
  'end': []
}>()

// Composables
const { t, locale } = useI18n()

// Refs
const canvasRef = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const isEmpty = ref(true)
const strokes = ref<Array<Array<{x: number, y: number}>>>([])
const currentStroke = ref<Array<{x: number, y: number}>>([])

// Computed
const isRTL = computed(() => locale.value === 'ar')
const canvasWidth = computed(() => props.width)
const canvasHeight = computed(() => props.height)

// Canvas context
let ctx: CanvasRenderingContext2D | null = null

// Initialize canvas
onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      setupCanvas()
      if (props.modelValue) {
        loadSignature(props.modelValue)
      }
    }
  }
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && ctx) {
    loadSignature(newValue)
  } else if (!newValue) {
    clearSignature()
  }
})

// Setup canvas properties
const setupCanvas = () => {
  if (!ctx || !canvasRef.value) return
  
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = props.strokeColor
  ctx.lineWidth = props.strokeWidth
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

// Get mouse/touch position relative to canvas
const getEventPos = (event: MouseEvent | TouchEvent): { x: number, y: number } => {
  if (!canvasRef.value) return { x: 0, y: 0 }
  
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  
  let clientX: number, clientY: number
  
  if (event instanceof MouseEvent) {
    clientX = event.clientX
    clientY = event.clientY
  } else {
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  }
  
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  }
}

// Start drawing
const startDrawing = (event: MouseEvent) => {
  if (props.disabled) return
  
  event.preventDefault()
  isDrawing.value = true
  currentStroke.value = []
  
  const pos = getEventPos(event)
  currentStroke.value.push(pos)
  
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }
  
  emit('start')
}

// Draw
const draw = (event: MouseEvent) => {
  if (!isDrawing.value || props.disabled || !ctx) return
  
  event.preventDefault()
  const pos = getEventPos(event)
  currentStroke.value.push(pos)
  
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
  
  isEmpty.value = false
}

// Stop drawing
const stopDrawing = () => {
  if (!isDrawing.value) return
  
  isDrawing.value = false
  
  if (currentStroke.value.length > 0) {
    strokes.value.push([...currentStroke.value])
    currentStroke.value = []
    saveSignature()
  }
  
  emit('end')
}

// Touch event handlers
const handleTouchStart = (event: TouchEvent) => {
  event.preventDefault()
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: event.touches[0].clientX,
    clientY: event.touches[0].clientY
  })
  startDrawing(mouseEvent)
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  if (!isDrawing.value) return
  
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: event.touches[0].clientX,
    clientY: event.touches[0].clientY
  })
  draw(mouseEvent)
}

// Clear signature
const clearSignature = () => {
  if (!ctx || !canvasRef.value) return
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  setupCanvas()
  
  strokes.value = []
  currentStroke.value = []
  isEmpty.value = true
  
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

// Undo last stroke
const undoLastStroke = () => {
  if (strokes.value.length === 0 || !ctx || !canvasRef.value) return
  
  strokes.value.pop()
  redrawCanvas()
  
  if (strokes.value.length === 0) {
    isEmpty.value = true
    emit('update:modelValue', '')
    emit('change', '')
  } else {
    saveSignature()
  }
}

// Redraw canvas from strokes
const redrawCanvas = () => {
  if (!ctx || !canvasRef.value) return
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  setupCanvas()
  
  strokes.value.forEach(stroke => {
    if (stroke.length > 0) {
      ctx!.beginPath()
      ctx!.moveTo(stroke[0].x, stroke[0].y)
      
      stroke.forEach(point => {
        ctx!.lineTo(point.x, point.y)
      })
      
      ctx!.stroke()
    }
  })
}

// Save signature as base64
const saveSignature = () => {
  if (!canvasRef.value) return
  
  const dataURL = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', dataURL)
  emit('change', dataURL)
}

// Load signature from base64
const loadSignature = (dataURL: string) => {
  if (!ctx || !canvasRef.value || !dataURL) return
  
  const img = new Image()
  img.onload = () => {
    ctx!.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
    setupCanvas()
    ctx!.drawImage(img, 0, 0)
    isEmpty.value = false
  }
  img.src = dataURL
}

// Public methods
defineExpose({
  clearSignature,
  undoLastStroke,
  saveSignature,
  loadSignature,
  isEmpty: () => isEmpty.value
})
</script>

<style scoped>
.signature-pad-container {
  @apply w-full;
}

.signature-pad-wrapper {
  @apply relative border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden;
  transition: border-color 0.2s ease;
}

.signature-pad-wrapper:hover {
  @apply border-gray-400;
}

.signature-canvas {
  @apply block cursor-crosshair;
  touch-action: none;
}

.signature-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center pointer-events-none;
  background: rgba(249, 250, 251, 0.8);
}

.signature-actions {
  @apply flex items-center gap-2 mt-3;
}

.signature-btn {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200;
}

.signature-btn-clear {
  @apply text-red-700 bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
}

.signature-btn-undo {
  @apply text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.rtl .signature-btn svg {
  @apply ml-2 mr-0;
}
</style>
