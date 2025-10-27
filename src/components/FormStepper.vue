<template>
  <div class="form-stepper" :class="{ rtl: isRTLSync() }">
    <!-- Stepper Header -->
    <div class="stepper-header bg-white/90 border-b p-3">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ $t('formBuilder.stepper.title') }}
        </h3>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>{{ currentStep + 1 }}</span>
          <span>/</span>
          <span>{{ totalSteps }}</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar mb-3">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-slate-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-500">
          <span>{{ $t('formBuilder.stepper.start') }}</span>
          <span>{{ progressPercentage.toFixed(0) }}%</span>
          <span>{{ $t('formBuilder.stepper.complete') }}</span>
        </div>
      </div>

      <!-- Steps Navigation -->
      <div class="steps-navigation">
        <div class="flex items-center justify-between overflow-x-auto pb-2">
          <div
            v-for="(section, index) in sections"
            :key="section.id"
            class="step-item flex-shrink-0 mx-1"
          >
            <!-- Step Circle and Connector -->
            <div class="flex items-center">
              <!-- Step Circle -->
              <button
                type="button"
                @click="goToStep(index)"
                class="step-circle w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs transition-all duration-200 relative"
                :class="getStepClasses(index)"
                :disabled="!canNavigateToStep(index)"
              >
                <!-- Completed Step -->
                <svg
                  v-if="index < currentStep"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!-- Current or Future Step -->
                <span v-else>{{ index + 1 }}</span>
              </button>

              <!-- Connector Line -->
              <div
                v-if="index < sections.length - 1"
                class="step-connector h-0.5 w-8 sm:w-12 mx-2 transition-colors duration-200"
                :class="index < currentStep ? 'bg-slate-600' : 'bg-gray-300'"
              ></div>
            </div>

            <!-- Step Label -->
            <div class="step-label mt-2 text-center max-w-20">
              <div
                class="text-xs font-medium truncate"
                :class="index === currentStep ? 'text-slate-700' : 'text-gray-600'"
                :title="section.title || $t('formBuilder.sections.untitledSection')"
              >
                {{ section.title || $t('formBuilder.stepper.step', { number: index + 1 }) }}
              </div>
              <div class="text-xs text-gray-400 mt-1">
                {{ getComponentsCountText(section.componentIds.length) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Content Form -->
    <div class="step-form p-4 bg-white/80">
      <div class="mb-4 flex items-center justify-between">
        <h4 class="text-sm font-medium text-gray-700">
          {{ $t('formBuilder.stepper.fillStepData') }}
        </h4>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="clearStepData"
            class="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            {{ $t('common.clear') }}
          </button>
        </div>
      </div>

      <!-- Step Content Slot -->
      <slot v-if="hasSlot" />
      <div v-else-if="currentSection && currentSection.componentIds.length > 0" class="space-y-4">
        <div
          v-for="componentId in currentSection.componentIds"
          :key="componentId"
          class="form-field p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <!-- Component Label (Skip for signature components as they render their own labels) -->
          <template v-if="!isSignature(componentId)">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ getComponentDisplayName(componentId) }}
              <span v-if="isComponentRequired(componentId)" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Component Description -->
            <p v-if="getComponentDescription(componentId)" class="text-xs text-gray-500 mb-3">
              {{ getComponentDescription(componentId) }}
            </p>
          </template>

          <!-- Dynamic Input Based on Component Type -->
          <div class="form-input">
            <!-- Text Input -->
            <input
              v-if="isTextInput(componentId)"
              v-model="formData[componentId]"
              :type="getInputType(componentId)"
              :placeholder="getComponentPlaceholder(componentId)"
              :required="isComponentRequired(componentId)"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors"
              :class="
                validationErrors[componentId]
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-slate-500 focus:border-slate-500'
              "
            />

            <!-- Textarea -->
            <textarea
              v-else-if="isTextarea(componentId)"
              v-model="formData[componentId]"
              :placeholder="getComponentPlaceholder(componentId)"
              :required="isComponentRequired(componentId)"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-vertical"
              :class="
                validationErrors[componentId]
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-slate-500 focus:border-slate-500'
              "
            ></textarea>

            <!-- Select Dropdown -->
            <CustomSelect
              v-else-if="isSelect(componentId)"
              v-model="formData[componentId]"
              :required="isComponentRequired(componentId)"
              :placeholder="$t('common.selectOption')"
              :options="getComponentOptions(componentId)"
              containerClass="w-full"
            />

            <!-- Radio Buttons -->
            <div v-else-if="isRadio(componentId)" class="space-y-2">
              <label
                v-for="option in getComponentOptions(componentId)"
                :key="option.value"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  v-model="formData[componentId]"
                  :value="option.value"
                  type="radio"
                  :name="componentId"
                  :required="isComponentRequired(componentId)"
                  class="text-slate-700 focus:ring-slate-500"
                />
                <span class="text-sm text-gray-700">{{ option.label }}</span>
              </label>
            </div>

            <!-- Checkboxes -->
            <div v-else-if="isCheckbox(componentId)" class="space-y-2">
              <label
                v-for="option in getComponentOptions(componentId)"
                :key="option.value"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  v-model="formData[componentId]"
                  :value="option.value"
                  type="checkbox"
                  class="text-slate-700 focus:ring-slate-500 rounded"
                />
                <span class="text-sm text-gray-700">{{ option.label }}</span>
              </label>
            </div>

            <!-- Number Input -->
            <input
              v-else-if="isNumber(componentId)"
              v-model.number="formData[componentId]"
              type="number"
              :placeholder="getComponentPlaceholder(componentId)"
              :required="isComponentRequired(componentId)"
              :min="getComponentMin(componentId)"
              :max="getComponentMax(componentId)"
              :step="getComponentStep(componentId)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
            />

            <!-- Date Input -->
            <input
              v-else-if="isDate(componentId)"
              v-model="formData[componentId]"
              type="date"
              :required="isComponentRequired(componentId)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
            />

            <!-- File Upload -->
            <div v-else-if="isFile(componentId)" class="space-y-2">
              <input
                :ref="`file-${componentId}`"
                type="file"
                :multiple="isMultipleFiles(componentId)"
                :accept="getFileAccept(componentId)"
                @change="handleFileChange(componentId, $event)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
              />
              <div v-if="formData[componentId]" class="text-xs text-gray-600">
                {{
                  Array.isArray(formData[componentId])
                    ? formData[componentId].length + ' ' + $t('common.filesSelected')
                    : formData[componentId].name
                }}
              </div>
            </div>

            <!-- Phone Number Input -->
            <input
              v-else-if="isPhoneNumber(componentId)"
              v-model="formData[componentId]"
              type="tel"
              :placeholder="getComponentPlaceholder(componentId) || '+966 50 123 4567'"
              :required="isComponentRequired(componentId)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />

            <!-- Currency Input -->
            <div v-else-if="isCurrency(componentId)" class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">{{ getCurrencySymbol(componentId) }}</span>
              </div>
              <input
                v-model.number="formData[componentId]"
                type="number"
                :placeholder="getComponentPlaceholder(componentId) || '0.00'"
                :required="isComponentRequired(componentId)"
                :min="getComponentMin(componentId)"
                :max="getComponentMax(componentId)"
                :step="0.01"
                class="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
              />
            </div>

            <!-- Address Input -->
            <div v-else-if="isAddress(componentId)" class="space-y-3">
              <input
                v-model="formData[componentId + '_street']"
                type="text"
                :placeholder="$t('common.street')"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <div class="grid grid-cols-2 gap-3">
                <input
                  v-model="formData[componentId + '_city']"
                  type="text"
                  :placeholder="$t('common.city')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <input
                  v-model="formData[componentId + '_postalCode']"
                  type="text"
                  :placeholder="$t('common.postalCode')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <!-- Hidden Input -->
            <input
              v-else-if="isHidden(componentId)"
              v-model="formData[componentId]"
              type="hidden"
            />

            <!-- Button -->
            <button
              v-else-if="isButton(componentId)"
              type="button"
              @click="handleButtonClick(componentId)"
              class="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {{ getComponentDisplayName(componentId) }}
            </button>

            <!-- Content Display -->
            <div
              v-else-if="isContent(componentId)"
              class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              v-html="getComponentContent(componentId)"
            ></div>

            <!-- HTML Element -->
            <div
              v-else-if="isHtmlElement(componentId)"
              v-html="getComponentHtml(componentId)"
            ></div>

            <!-- Complex Components (Read-only display) -->
            <div
              v-else-if="isComplexComponent(componentId)"
              class="p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span class="text-sm"
                  >{{ $t('formBuilder.stepper.complexComponent') }}:
                  {{ getComponentType(componentId) }}</span
                >
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ $t('formBuilder.stepper.complexComponentHint') }}
              </p>
            </div>

            <!-- Signature Component -->
            <div v-else-if="isSignature(componentId)" class="signature-stepper-container">
              <SignatureRenderer
                :component="getComponentById(componentId)"
                :form-data="formData"
                @update:value="updateFormData"
              />
            </div>

            <!-- Default/Unknown Component Type -->
            <div v-else class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-center gap-2 text-yellow-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
                <span class="text-sm"
                  >{{ $t('formBuilder.stepper.unsupportedComponentType') }}:
                  {{ getComponentType(componentId) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Validation Error -->
          <div
            v-if="validationErrors[componentId]"
            class="mt-2 flex items-center text-sm text-red-600"
          >
            <svg
              class="w-4 h-4 mr-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ validationErrors[componentId] }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"
        >
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M19 11H5m14-7H3m16 14H5"
            ></path>
          </svg>
        </div>
        <p class="text-sm text-gray-500">
          {{ $t('formBuilder.stepper.noComponentsInStep') }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          {{ $t('formBuilder.stepper.addComponentsHint') }}
        </p>
      </div>

      <!-- Navigation Controls (Bottom) -->
      <div class="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <!-- Previous Button -->
        <button
          type="button"
          @click="previousStep"
          :disabled="!canGoPrevious"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          <span>{{ $t('publicForm.previousStep') }}</span>
        </button>

        <!-- Current Step Info -->
        <div class="text-center">
          <div class="text-sm font-medium text-gray-800">
            {{
              currentSection?.title || $t('formBuilder.stepper.step', { number: currentStep + 1 })
            }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ $t('publicForm.stepOf', { current: currentStep + 1, total: totalSteps }) }}
          </div>
        </div>

        <!-- Next/Submit Button -->
        <button
          type="button"
          v-if="!isLastStep"
          @click="nextStep"
          :disabled="!canGoNext"
          class="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>{{ $t('publicForm.nextStep') }}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>

        <!-- Final Submit Button (Last Step) -->
        <div v-else class="flex items-center gap-3">
          <button
            type="button"
            @click="emit('resetForm')"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v7h7M20 20v-7h-7M4 12a8 8 0 0116 0"
              />
            </svg>
            <span>{{ $t('publicForm.reset') }}</span>
          </button>
          <button
            type="submit"
            @click="submitForm"
            :disabled="!canSubmitForm"
            class="px-5 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <span>{{ $t('publicForm.submit') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../i18n'
import CustomSelect from './CustomSelect.vue'
import SignatureRenderer from './renderers/SignatureRenderer.vue'
import { useNotifications } from '../composables/useNotifications'

// Types
interface FormSection {
  id: string
  title: string
  componentIds: string[]
  order: number
}

interface FormComponent {
  key: string
  type: string
  label: string
  [key: string]: any
}

// Props
interface Props {
  sections: FormSection[]
  components: FormComponent[]
  currentStep: number
  allowNavigation?: boolean
  formDataObject?: Record<string, any>
  canGoNext?: boolean
  canGoPrevious?: boolean
  canSubmit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sections: () => [],
  components: () => [],
  currentStep: 0,
  allowNavigation: true,
  formDataObject: undefined,
  canGoNext: true,
  canGoPrevious: true,
  canSubmit: true,
})

// Emits
interface Emits {
  (e: 'update:currentStep', step: number): void
  (e: 'stepChanged', step: number): void
  (e: 'editComponent', componentId: string): void
  (e: 'dataChanged', data: Record<string, any>): void
  (e: 'submitForm', data: Record<string, any>): void
  (e: 'resetForm'): void
  (e: 'buttonClick', componentId: string): void
}

const emit = defineEmits<Emits>()

// Composables
const { t } = useI18n()
const { error: showError } = useNotifications()

// Form Data State
const formData = ref<Record<string, any>>({})
const validationErrors = ref<Record<string, string>>({})

// Computed
const totalSteps = computed(() => props.sections.length)

const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0
  return ((props.currentStep + 1) / totalSteps.value) * 100
})

const currentSection = computed(() => {
  return props.sections[props.currentStep] || null
})

const canGoPrevious = computed(() => {
  // Allow going back on any step after the first, regardless of forward navigation rules
  return props.canGoPrevious && props.currentStep > 0
})

const canGoNext = computed(() => {
  return props.canGoNext && props.currentStep < totalSteps.value - 1 && props.allowNavigation
})

const canSubmitForm = computed(() => {
  return props.canSubmit && isLastStep.value
})

const isLastStep = computed(() => {
  return props.currentStep === totalSteps.value - 1
})

const slots = useSlots()
const hasSlot = computed(() => !!slots.default)

// Methods
const goToStep = (stepIndex: number) => {
  if (!canNavigateToStep(stepIndex)) return

  emit('update:currentStep', stepIndex)
  emit('stepChanged', stepIndex)
}

const previousStep = () => {
  if (canGoPrevious.value) {
    goToStep(props.currentStep - 1)
  }
}

const nextStep = () => {
  // Validate current step before moving to next
  const currentStepValidation = validateCurrentStep()
  if (!currentStepValidation.isValid) {
    console.warn('📝 FormStepper: Validation failed for current step', currentStepValidation.errors)
    // تحديث أخطاء التحقق
    validationErrors.value = { ...validationErrors.value, ...currentStepValidation.errors }

    // إظهار رسالة خطأ للمستخدم
    showError(t('formBuilder.stepper.requiredFieldsError'))
    return
  }

  if (canGoNext.value) {
    goToStep(props.currentStep + 1)
  }
}

// const goToFirstStep = () => {
//   goToStep(0)
// }

// const goToLastStep = () => {
//   goToStep(totalSteps.value - 1)
// }

const submitForm = () => {
  // Check if submit is allowed
  if (!canSubmitForm.value) {
    showError(t('publicForm.errors.cannotSubmitYet'))
    return
  }

  // Validate all required fields before submitting
  const allFieldsValidation = validateAllRequiredFields()
  if (!allFieldsValidation.isValid) {
    console.warn('📝 FormStepper: Cannot submit - validation failed', allFieldsValidation.errors)
    // Show specific error message for missing required fields
    const missingFields = Object.keys(allFieldsValidation.errors)
    showError(
      t('publicForm.validation.requiredFieldsMissing', {
        fields: missingFields.join(', '),
        count: missingFields.length,
      }),
    )
    return
  }

  // Clear any existing validation errors
  validationErrors.value = {}

  // Emit the form data along with the submit event
  emit('submitForm', props.formDataObject ?? formData.value)
}

const canNavigateToStep = (stepIndex: number): boolean => {
  // السماح دائماً بالرجوع للخطوات السابقة حتى لو كان allowNavigation = false
  if (stepIndex < props.currentStep) {
    return true
  }

  // عند محاولة التقدم للأمام، طبق قواعد allowNavigation والتحقق
  if (!props.allowNavigation) return false

  if (stepIndex > props.currentStep) {
    const validation = validateCurrentStep()
    return validation.isValid
  }

  // البقاء في نفس الخطوة ضمن الحدود
  return stepIndex >= 0 && stepIndex < totalSteps.value
}

const getStepClasses = (stepIndex: number): string => {
  const baseClasses = 'border-2 transition-all duration-200'

  if (stepIndex < props.currentStep) {
    // Completed step
    return `${baseClasses} bg-blue-600 border-blue-600 text-white hover:bg-blue-700`
  } else if (stepIndex === props.currentStep) {
    // Current step
    return `${baseClasses} bg-blue-100 border-blue-600 text-blue-600 ring-2 ring-blue-200`
  } else {
    // Future step
    return `${baseClasses} bg-white border-gray-300 text-gray-400 hover:border-gray-400`
  }
}

// const editComponent = (componentId: string) => {
//   emit('editComponent', componentId)
// }

// Helper methods
const getComponentsCountText = (count: number): string => {
  if (count === 0) return t('formBuilder.sections.noComponents')
  if (count === 1) return t('formBuilder.sections.oneComponent')
  return t('formBuilder.sections.componentsCount', { count })
}

const getComponentDisplayName = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.label || component?.type || componentId
}

const getComponentType = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  if (!component) return ''

  const typeKey = `formBuilder.componentTypes.${component.type}`
  const translation = t(typeKey)

  // If translation is the same as key, fallback to component type
  if (translation === typeKey) {
    return component.type.charAt(0).toUpperCase() + component.type.slice(1)
  }

  return translation
}

// Form Data Methods

const clearStepData = () => {
  // Clear form data for current step components
  if (currentSection.value) {
    currentSection.value.componentIds.forEach((componentId) => {
      delete formData.value[componentId]
      delete validationErrors.value[componentId]
    })
  }
}

// Validation methods (simplified)
// const validateStepData = (): boolean => {
//   validationErrors.value = {}
//   let isValid = true

//   if (currentSection.value) {
//     currentSection.value.componentIds.forEach((componentId) => {
//       const component = props.components.find((c) => c.key === componentId)
//       if (component && isComponentRequired(componentId)) {
//         const value = formData.value[componentId]
//         if (
//           !value ||
//           (Array.isArray(value) && value.length === 0) ||
//           value.toString().trim() === ''
//         ) {
//           validationErrors.value[componentId] = t('formBuilder.stepper.fieldRequired')
//           isValid = false
//         }
//       }
//     })
//   }

//   return isValid
// }

// const getCurrentStepData = (): Record<string, any> => {
//   const stepData: Record<string, any> = {}
//   if (currentSection.value) {
//     currentSection.value.componentIds.forEach((componentId) => {
//       if (formData.value[componentId] !== undefined) {
//         stepData[componentId] = formData.value[componentId]
//       }
//     })
//   }
//   return stepData
// }

// Component Type Helpers
const isTextInput = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return (
    component?.type === 'textfield' ||
    component?.type === 'email' ||
    component?.type === 'password' ||
    component?.type === 'url'
  )
}

const isTextarea = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'textarea'
}

const isSelect = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'select'
}

const isRadio = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'radio'
}

const isCheckbox = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'checkbox' || component?.type === 'selectboxes'
}

const isNumber = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'number'
}

const isDate = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'datetime' || component?.type === 'day'
}

const isFile = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'file'
}

const isSignature = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return (
    component?.type === 'signature' ||
    component?.type === 'signaturepad' ||
    component?.type === 'signature-pad' ||
    component?.type === 'توقيع'
  )
}

const isPhoneNumber = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'phoneNumber' || component?.type === 'phonenumber'
}

const isCurrency = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'currency'
}

const isAddress = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'address'
}

const isHidden = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'hidden'
}

const isButton = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'button'
}

const isContent = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'content'
}

const isHtmlElement = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.type === 'htmlelement'
}

const isComplexComponent = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  const complexTypes = [
    'datagrid',
    'editgrid',
    'tree',
    'survey',
    'resource',
    'tabs',
    'table',
    'panel',
    'fieldset',
    'well',
    'container',
    'columns',
  ]
  return complexTypes.includes(component?.type || '')
}

// Helper methods for new components
const getCurrencySymbol = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.currency || 'ر.س'
}

const getComponentContent = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.html || component?.content || ''
}

const getComponentHtml = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.content || ''
}

const handleButtonClick = (componentId: string) => {
  const component = props.components.find((c) => c.key === componentId)
  if (component?.action === 'submit') {
    submitForm()
  } else {
    emit('buttonClick', componentId)
  }
}

const getComponentById = (componentId: string) => {
  return props.components.find((c) => c.key === componentId)
}

// Component Property Helpers
const getInputType = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  if (!component) return 'text'

  switch (component.type) {
    case 'email':
      return 'email'
    case 'password':
      return 'password'
    case 'url':
      return 'url'
    case 'number':
      return 'number'
    default:
      return 'text'
  }
}

const getComponentPlaceholder = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.placeholder || component?.label || ''
}

const getComponentDescription = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.description || component?.tooltip || ''
}

const isComponentRequired = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.validate?.required || false
}

const getComponentOptions = (componentId: string): Array<{ label: string; value: any }> => {
  const component = props.components.find((c) => c.key === componentId)
  if (!component) return []

  // Handle different option formats
  if (component.values) {
    return component.values.map((item: any) => ({
      label: item.label || item.value,
      value: item.value,
    }))
  }

  if (component.data?.values) {
    return component.data.values.map((item: any) => ({
      label: item.label || item.value,
      value: item.value,
    }))
  }

  return []
}

const getComponentMin = (componentId: string): number | undefined => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.validate?.min
}

const getComponentMax = (componentId: string): number | undefined => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.validate?.max
}

const getComponentStep = (componentId: string): number => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.validate?.step || 1
}

const isMultipleFiles = (componentId: string): boolean => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.multiple || false
}

const getFileAccept = (componentId: string): string => {
  const component = props.components.find((c) => c.key === componentId)
  return component?.filePattern || '*'
}

const handleFileChange = (componentId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files) {
    if (isMultipleFiles(componentId)) {
      formData.value[componentId] = Array.from(files)
    } else {
      formData.value[componentId] = files[0] || null
    }
  }
}

// Handle form data updates from components (especially signature)
const updateFormData = (key: string, value: any) => {
  // Log signature data specifically
  if (key.includes('signature') || (typeof value === 'string' && value.startsWith('data:image'))) {
    console.log('📝 FormStepper: Signature data updated', {
      key,
      hasValue: !!value,
      valueType: typeof value,
      isDataURL: typeof value === 'string' && value.startsWith('data:image'),
      dataLength: typeof value === 'string' ? value.length : 0,
    })
  }

  formData.value[key] = value

  // Clear validation error for this field if it now has a value
  if (value && validationErrors.value[key]) {
    delete validationErrors.value[key]
  }
}

// Validation functions
const validateCurrentStep = () => {
  const currentSection = props.sections[props.currentStep]
  if (!currentSection) {
    return { isValid: true, errors: {} }
  }

  const errors: Record<string, string> = {}
  const componentIds = currentSection.componentIds || []

  componentIds.forEach((componentId) => {
    const component = props.components.find((c) => c.key === componentId)
    if (component && isComponentRequired(componentId)) {
      const value =
        props.formDataObject && componentId in (props.formDataObject as Record<string, any>)
          ? (props.formDataObject as Record<string, any>)[componentId]
          : formData.value[componentId]
      let isEmpty = false

      if (value === undefined || value === null || value === '') {
        isEmpty = true
      } else if (Array.isArray(value) && value.length === 0) {
        isEmpty = true
      } else if (typeof value === 'object' && Object.keys(value).length === 0) {
        isEmpty = true
      } else if (component.type === 'signature') {
        // Special handling for signature components
        isEmpty = !(
          typeof value === 'string' &&
          value.startsWith('data:image') &&
          value.length > 50
        )
      }

      if (isEmpty) {
        errors[componentId] = t('formBuilder.stepper.fieldRequired')
        validationErrors.value[componentId] = t('formBuilder.stepper.fieldRequired')
      }
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

const validateAllRequiredFields = () => {
  const errors: Record<string, string> = {}

  props.components.forEach((component) => {
    if (component.validate?.required) {
      const value =
        props.formDataObject && component.key in (props.formDataObject as Record<string, any>)
          ? (props.formDataObject as Record<string, any>)[component.key]
          : formData.value[component.key]
      let isEmpty = false

      if (value === undefined || value === null || value === '') {
        isEmpty = true
      } else if (Array.isArray(value) && value.length === 0) {
        isEmpty = true
      } else if (typeof value === 'object' && Object.keys(value).length === 0) {
        isEmpty = true
      } else if (component.type === 'signature') {
        // Special handling for signature components
        isEmpty = !(
          typeof value === 'string' &&
          value.startsWith('data:image') &&
          value.length > 50
        )
      }

      if (isEmpty) {
        errors[component.key] = t('formBuilder.stepper.fieldRequired')
        validationErrors.value[component.key] = t('formBuilder.stepper.fieldRequired')
      }
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Watchers
watch(
  () => formData.value,
  (newData) => {
    emit('dataChanged', newData)
  },
  { deep: true },
)

// Remove echo loop: do NOT re-emit when external formDataObject changes
// watch(
//   () => props.formDataObject,
//   (newData) => {
//     if (newData) emit('dataChanged', newData as Record<string, any>)
//   },
//   { deep: true }
// )

watch(
  () => props.currentStep,
  () => {
    // Clear validation errors when changing steps
    validationErrors.value = {}
  },
)
</script>

<style scoped>
.form-stepper {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.step-circle {
  position: relative;
  z-index: 1;
}

.step-circle:disabled {
  cursor: not-allowed;
}

.step-connector {
  position: relative;
  z-index: 0;
}

.steps-navigation {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.steps-navigation::-webkit-scrollbar {
  height: 4px;
}

.steps-navigation::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.steps-navigation::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.steps-navigation::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.rtl {
  direction: rtl;
}

.rtl .step-connector {
  transform: scaleX(-1);
}
</style>
