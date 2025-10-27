<template>
  <div
    class="public-form-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30">
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-400/20 to-cyan-500/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"
      ></div>
    </div>

    <!-- Enhanced Professional Header with Better UX -->
    <div class="relative bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
      <div class="px-4 py-6">
        <div class="max-w-6xl mx-auto">
          <div
            v-if="form"
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <!-- Form Info Section -->
            <div class="flex items-center gap-4">
              <!-- Enhanced Icon with Animation -->
              <div
                class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <!-- Title and Description with Better Typography -->
              <div class="min-w-0 flex-1">
                <h1
                  class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 truncate"
                  :title="form.title"
                >
                  {{ form.title }}
                </h1>
                <p
                  v-if="form.description"
                  class="text-sm text-gray-600 line-clamp-2"
                  :title="form.description"
                >
                  {{ form.description }}
                </p>
                <!-- Estimated Time Indicator -->
                <div
                  v-if="formSections.length > 1"
                  class="flex items-center mt-2 text-xs text-gray-500"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{
                    $t('publicForm.estimatedTime', { minutes: Math.ceil(formSections.length * 2) })
                  }}
                </div>
              </div>
            </div>

            <!-- Enhanced Status and Progress Section -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <!-- Form Status Badge with Better States -->
              <span
                class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200"
                :class="formStatusClasses"
              >
                <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ formStatusText }}
              </span>

              <!-- Enhanced Progress for Multi-Step Forms -->
              <div v-if="formSections.length > 1" class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 font-medium">
                    {{ currentStep + 1 }}/{{ formSections.length }}
                  </span>
                  <div class="w-24 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                    <div
                      class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out relative"
                      :style="{ width: progressPercentage + '%' }"
                    >
                      <!-- Progress Shimmer Effect -->
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                      ></div>
                    </div>
                  </div>
                </div>
                <!-- Step Completion Indicator -->
                <div class="flex items-center gap-1">
                  <div
                    v-for="(section, index) in formSections"
                    :key="section.id"
                    class="w-2 h-2 rounded-full transition-all duration-300"
                    :class="getStepIndicatorClass(index)"
                    :title="`${$t('publicForm.step')} ${index + 1}: ${section.title}`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Loading State -->
    <div v-if="loading" class="relative px-6 py-20">
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-col items-center justify-center">
          <!-- Advanced Loading Animation -->
          <div class="relative mb-8">
            <div class="w-20 h-20 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            <div
              class="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
            ></div>
            <div
              class="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin absolute top-2 left-2"
              style="animation-direction: reverse; animation-duration: 1.5s"
            ></div>
          </div>

          <!-- Loading Text with Animation -->
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('publicForm.loading') }}</h3>
            <p class="text-gray-600 animate-pulse">{{ $t('publicForm.loadingDescription') }}</p>
          </div>

          <!-- Loading Progress Dots -->
          <div class="flex space-x-2 mt-6">
            <div
              class="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"
              style="animation-delay: 0s"
            ></div>
            <div
              class="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style="animation-delay: 0.4s"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Error State with Better UX -->
    <div v-else-if="error" class="relative px-6 py-20">
      <div class="max-w-4xl mx-auto">
        <div
          class="bg-gradient-to-br from-red-50 via-red-50/80 to-orange-50/60 border-2 border-red-200/60 rounded-3xl p-10 text-center backdrop-blur-sm"
        >
          <!-- Error Icon with Animation -->
          <div
            class="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 animate-pulse"
          >
            <svg
              class="h-10 w-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <!-- Enhanced Error Content -->
          <h3 class="text-3xl font-bold text-red-800 mb-4">{{ $t('publicForm.errorTitle') }}</h3>
          <p class="text-red-700 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">{{ error }}</p>

          <!-- Error Type and Suggestions -->
          <div class="bg-red-100/50 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <h4 class="font-semibold text-red-800 mb-2">
              {{ $t('publicForm.errorSuggestions.title') }}
            </h4>
            <ul class="text-sm text-red-700 text-left space-y-1">
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ $t('publicForm.errorSuggestions.checkConnection') }}
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ $t('publicForm.errorSuggestions.refreshPage') }}
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ $t('publicForm.errorSuggestions.contactSupport') }}
              </li>
            </ul>
          </div>

          <!-- Enhanced Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              @click="loadForm"
              class="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <svg
                class="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ $t('publicForm.retry') }}
            </button>

            <router-link
              to="/"
              class="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <svg
                class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {{ $t('publicForm.backToHome') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Success State -->
    <div v-else-if="submitted" class="relative px-6 py-20">
      <div class="max-w-4xl mx-auto">
        <!-- Success Animation Container -->
        <div
          class="bg-gradient-to-br from-green-50 via-emerald-50/90 to-teal-50/70 border-2 border-green-200/60 rounded-3xl p-12 text-center backdrop-blur-sm relative overflow-hidden"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-4 right-4 w-32 h-32 bg-green-400 rounded-full blur-2xl"></div>
            <div
              class="absolute bottom-4 left-4 w-24 h-24 bg-emerald-400 rounded-full blur-xl"
            ></div>
          </div>

          <!-- Success Icon with Celebration Animation -->
          <div
            class="relative mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mb-8 animate-bounce"
          >
            <svg
              class="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>

            <!-- Celebration Particles -->
            <div
              class="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"
            ></div>
            <div
              class="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping"
              style="animation-delay: 0.5s"
            ></div>
            <div
              class="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"
              style="animation-delay: 1s"
            ></div>
          </div>

          <!-- Success Content -->
          <h3 class="text-4xl font-black text-green-800 mb-4">
            {{ $t('publicForm.successTitle') }}
          </h3>
          <p class="text-green-700 mb-10 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            {{ $t('publicForm.successMessage') }}
          </p>

          <!-- Action Buttons with Enhanced Design -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              @click="resetForm"
              class="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <svg
                class="w-6 h-6 mr-3 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span class="relative z-10">{{ $t('publicForm.submitAnother') }}</span>
            </button>

            <router-link
              to="/"
              class="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 hover:from-slate-700 hover:via-gray-700 hover:to-slate-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <svg
                class="w-6 h-6 mr-3 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span class="relative z-10">{{ $t('publicForm.backToHome') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Form Content with Better UX -->
    <div v-else-if="form" class="relative px-4 py-6">
      <div class="max-w-4xl mx-auto">
        <!-- Form Container with Enhanced Design -->
        <div class="rounded-2xl border border-gray-200 overflow-hidden">
          <!-- Multi-Step Form Stepper (if form has sections) -->
          <div v-if="formSections.length > 1" class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <!-- Multi-Step Form Header (instructions) -->
            <div v-if="formSections.length > 1" class="px-6 py-3 text-gray-700">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ $t('publicForm.fillForm') }}
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                {{ $t('publicForm.multiStepInstructions') }}
              </p>
            </div>

            <!-- Unified Stepper: always render stepper and slot form inside -->
            <div class="px-6 py-4">
              <FormStepper
                :sections="formSections"
                :components="formComponents"
                :current-step="currentStep"
                :allow-navigation="allowStepNavigation"
                :can-go-next="canGoNext"
                :can-go-previous="canGoPrevious"
                :can-submit="canSubmit"
                :form-data-object="formData"
                @update:current-step="(s) => (currentStep = s)"
                @step-changed="handleStepChanged"
                @data-changed="handleFormDataChange"
                @submit-form="submitForm"
                @reset-form="resetForm"
                @next-step="nextStep"
                @previous-step="previousStep"
              >
                <!-- Render dynamic form inside the stepper -->
                <DynamicFormRenderer
                  v-if="form && formComponents && formComponents.length"
                  ref="dynamicFormRendererRef"
                  :form-schema="currentStepSchema"
                  :form-data="formData"
                  @data-change="handleFormDataChange"
                  @submit="handleStepSubmit"
                />
              </FormStepper>
            </div>

            <!-- Moved single-section renderer to sibling v-else block for proper rendering -->

            <!-- Debug Info -->
            <div v-if="false" class="mt-4 p-4 bg-gray-100 rounded text-xs">
              <h4 class="font-bold">{{ $t('publicForm.debugInfo.title') }}</h4>
              <p>
                <strong>{{ $t('publicForm.debugInfo.currentStep') }}:</strong> {{ currentStep }}
              </p>
              <p>
                <strong>{{ $t('publicForm.debugInfo.formSections') }}:</strong>
                {{ formSections.length }}
              </p>
              <p>
                <strong>{{ $t('publicForm.debugInfo.currentStepComponents') }}:</strong>
                {{ currentStepSchema.components?.length || 0 }}
              </p>
              <div v-if="currentStepSchema.components?.length > 0">
                <p>
                  <strong>{{ $t('publicForm.debugInfo.componentTypes') }}:</strong>
                </p>
                <ul>
                  <li v-for="comp in currentStepSchema.components" :key="comp?.key || 'unknown'">
                    {{ comp?.type }} - {{ comp?.key }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Fallback to original FormRenderer if needed -->
            <!-- <FormRenderer
              ref="formRendererRef"
              :form-schema="currentStepSchema"
              :loading="submitting"
              :form-data="formData"
              @submit="handleStepSubmit"
              @error="handleFormError"
              @data-change="handleFormDataChange"
              class="form-renderer-enhanced w-full"
            /> -->

            <!-- Loading Overlay for Form Submission -->
            <div
              v-if="submitting"
              class="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50"
            >
              <div class="text-center">
                <div class="relative mb-4">
                  <div
                    class="w-12 h-12 border-4 border-indigo-200 rounded-full animate-pulse"
                  ></div>
                  <div
                    class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
                  ></div>
                </div>
                <h4 class="text-lg font-semibold text-gray-800 mb-1">
                  {{ $t('publicForm.submitting') }}
                </h4>
                <p class="text-sm text-gray-600">{{ $t('publicForm.submittingDescription') }}</p>
              </div>
            </div>
          </div>
          <div v-else class="px-6 py-4">
            <DynamicFormRenderer
              v-if="form && formComponents && formComponents.length"
              ref="dynamicFormRendererRef"
              :form-schema="currentStepSchema"
              :form-data="formData"
              @data-change="handleFormDataChange"
              @submit="handleStepSubmit"
            />
            <div class="px-6 py-4 flex items-center gap-3">
              <button class="px-6 py-3 bg-gray-600 text-white rounded-xl" @click="resetForm">
                {{ $t('publicForm.reset') }}
              </button>
              <button class="px-6 py-3 bg-green-600 text-white rounded-xl" @click="handleSingleFormSubmit">
                {{ $t('publicForm.submit') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced Security Footer with Better UX -->
        <div class="mt-6 text-center">
          <div
            class="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 transition-all duration-300"
          >
            <svg
              class="w-5 h-5 text-green-500 mr-3 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-left">
              <span class="text-sm text-gray-700 font-semibold block">{{
                $t('publicForm.secureForm')
              }}</span>
              <span class="text-xs text-gray-500">{{
                $t('publicForm.encryptedTransmission')
              }}</span>
            </div>
          </div>

          <!-- Additional Security Indicators -->
          <div class="mt-4 flex justify-center items-center space-x-6 text-xs text-gray-500">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ $t('publicForm.sslEncrypted') }}
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ $t('publicForm.privacyProtected') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useFormsStore } from '../stores/forms'
import { useSubmissionsStore } from '../stores/submissions'
import { useNotifications } from '../composables/useNotifications'
import { useAuth } from '../composables/useAuth'
import { isRTLSync } from '../i18n'
import FormRenderer from '../components/FormRenderer.vue'
import DynamicFormRenderer from '../components/DynamicFormRenderer.vue'
import FormStepper from '../components/FormStepper.vue'

// Types
interface FormComponent {
  key: string
  id?: string
  label: string
  type: string
  validate?: { required?: boolean }
  components?: FormComponent[]
}

interface FormSection {
  id: string
  title: string
  componentIds: string[]
  order: number
  components?: FormComponent[]
}

interface FormSchema {
  sections?: FormSection[]
  components?: FormComponent[]
}

interface Form {
  id: number
  title: string
  description?: string
  schema: FormSchema
  status: string
  is_public: boolean
  allow_anonymous: boolean
}

// Composables
const { t } = useI18n()
const route = useRoute()
const formsStore = useFormsStore()
const submissionsStore = useSubmissionsStore()
const { success, error: showError } = useNotifications()
const { user, isAuthenticated } = useAuth()

// Reactive state
const form = ref<Form | null>(null)
const loading = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const submitted = ref(false)
const dynamicFormRendererRef = ref<any>(null)

// Multi-step form state
const currentStep = ref(0)
const formData = ref<Record<string, any>>({})
const stepValidation = ref<Record<number, boolean>>({})

// Computed
const isRTLDirection = computed(() => isRTLSync())
const formId = computed(() => route.params.id as string)

// Form sections and components
const formSections = computed(() => {
  if (!form.value?.schema) return []

  // Parse schema if it's a string
  let schema = form.value.schema
  if (typeof schema === 'string') {
    try {
      schema = JSON.parse(schema)
    } catch (e) {
      console.error('Error parsing form schema:', e)
      return []
    }
  }

  if (!schema.sections || !Array.isArray(schema.sections) || schema.sections.length === 0) {
    // If no sections, treat entire form as single section
    const components = schema.components || []
    return components.length > 0
      ? [
          {
            id: 'default',
            title: form.value.title || t('publicForm.defaultSectionTitle'),
            componentIds: components.map(
              (comp: FormComponent) => comp.key || comp.id || `component_${Math.random()}`,
            ),
            order: 0,
          },
        ]
      : []
  }

  // Convert sections to expected format for FormStepper
  const convertedSections = schema.sections.map((section: FormSection, index: number) => {
    // Extract component IDs from section
    let componentIds = []

    if (section.componentIds && Array.isArray(section.componentIds)) {
      // Use existing componentIds if available
      componentIds = section.componentIds
    } else if (section.components && Array.isArray(section.components)) {
      // Extract keys from components array
      componentIds = section.components.map(
        (comp: FormComponent) => comp.key || comp.id || `component_${Math.random()}`,
      )
    } else {
      // If section has a key, use it directly (for single component sections)
      componentIds = [(section as any).key || (section as any).id || `section_${index}`]
    }

    console.log(`📝 PublicForm: Section ${index} componentIds:`, componentIds)

    return {
      id: section.id || `section_${index}`,
      title: section.title || t('publicForm.step', { number: index + 1 }),
      componentIds: componentIds,
      order: section.order || index,
    }
  })

  return convertedSections
})

const formComponents = computed(() => {
  if (!form.value?.schema) return []

  // Parse schema if it's a string
  let schema = form.value.schema
  if (typeof schema === 'string') {
    try {
      schema = JSON.parse(schema)
    } catch (e) {
      console.error('Error parsing form schema:', e)
      return []
    }
  }

  // Collect all components from all sections and root level
  const allComponents: FormComponent[] = []

  // Add components from sections
  if (schema.sections && Array.isArray(schema.sections)) {
    schema.sections.forEach((section: FormSection) => {
      if (section.components && Array.isArray(section.components)) {
        allComponents.push(...section.components)
      }
    })
  }

  // Add root level components (this is where tabs component should be)
  if (schema.components && Array.isArray(schema.components)) {
    allComponents.push(...schema.components)
  }

  // Ensure each component has a key
  return allComponents.map((comp: FormComponent, index: number) => ({
    ...comp,
    key: comp.key || comp.id || `component_${index}`,
  }))
})

const currentStepSchema = computed(() => {
  const currentSection = formSections.value[currentStep.value]
  if (!currentSection) {
    console.log('📝 PublicForm: No current section found')
    return { components: [] }
  }

  console.log('📝 PublicForm: Current section:', currentSection)
  console.log('📝 PublicForm: Form components:', formComponents.value)

  // Get components for current section using componentIds
  const sectionComponentIds = currentSection.componentIds || []
  let sectionComponents = sectionComponentIds
    .map((componentId) => {
      const comp = formComponents.value.find((comp) => comp.key === componentId)
      console.log(`📝 PublicForm: Looking for component ${componentId}, found:`, comp)
      return comp
    })
    .filter(Boolean) // Remove undefined components

  console.log('📝 PublicForm: Section components:', sectionComponents)

  // If no components found, try alternative matching strategies
  if (sectionComponents.length === 0 && sectionComponentIds.length > 0) {
    console.log('📝 PublicForm: No direct matches found, trying alternative strategies...')

    // Strategy 1: Try to match by section ID or partial key matching
    sectionComponents = formComponents.value.filter((comp) => {
      return sectionComponentIds.some((sectionId) => {
        // Check if component key contains section ID or vice versa
        return (
          comp.key?.includes(sectionId) ||
          sectionId.includes(comp.key) ||
          comp.id?.includes(sectionId) ||
          sectionId.includes(comp.id)
        )
      })
    })

    console.log('📝 PublicForm: Alternative matching found:', sectionComponents)
  }

  // If still no components found, use all components as fallback
  // This ensures tabs component is always displayed
  if (sectionComponents.length === 0 && formComponents.value.length > 0) {
    console.log('📝 PublicForm: Using all components as fallback')
    return {
      components: formComponents.value,
      display: 'form',
      type: 'form',
    }
  }

  const result = {
    components: sectionComponents,
    display: 'form',
    type: 'form',
  }

  console.log('📝 PublicForm: Final currentStepSchema:', result)
  return result
})

const progressPercentage = computed(() => {
  if (formSections.value.length <= 1) return 100
  return Math.round(((currentStep.value + 1) / formSections.value.length) * 100)
})

const isLastStep = computed(() => {
  return currentStep.value === formSections.value.length - 1
})

const isCurrentStepValid = computed(() => {
  // Basic validation - check if current step has any data
  const currentStepData = getCurrentStepData()
  return Object.keys(currentStepData).length > 0 || stepValidation.value[currentStep.value] === true
})

// Strict validation for required fields in the current step
const isStepValidByRequired = computed(() => {
  const { isValid } = validateCurrentStepRequiredFields(getCurrentStepData())
  return isValid
})

const allowStepNavigation = computed(() => {
  // Only allow navigation when current step passes required-field validation
  return isStepValidByRequired.value
})

// Button states for stepper navigation
const canGoNext = computed(() => {
  // Can go next if current step is valid and not on last step
  return isStepValidByRequired.value && !isLastStep.value
})

const canGoPrevious = computed(() => {
  // Can always go back if not on first step
  return currentStep.value > 0
})

const canSubmit = computed(() => {
  // Can submit if on last step and current step is valid
  return isLastStep.value && isStepValidByRequired.value
})

// Enhanced UX computed properties
const formStatusClasses = computed(() => {
  if (submitted.value) {
    return 'bg-green-50 text-green-700 border-green-200'
  } else if (submitting.value) {
    return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  } else if (error.value) {
    return 'bg-red-50 text-red-700 border-red-200'
  } else {
    return 'bg-green-50 text-green-700 border-green-200'
  }
})

const formStatusText = computed(() => {
  if (submitted.value) {
    return t('publicForm.status.completed')
  } else if (submitting.value) {
    return t('publicForm.status.submitting')
  } else if (error.value) {
    return t('publicForm.status.error')
  } else {
    return t('publicForm.status.active')
  }
})

const getStepIndicatorClass = (index: number) => {
  if (index < currentStep.value) {
    return 'bg-green-500' // Completed steps
  } else if (index === currentStep.value) {
    return 'bg-indigo-500 animate-pulse' // Current step
  } else {
    return 'bg-gray-300' // Future steps
  }
}

// Methods
const getFieldLabels = () => {
  const labels: Record<string, string> = {}

  // Recursive function to collect labels from nested components
  const collectLabels = (components: FormComponent[], parentKey: string = '') => {
    components.forEach((component: FormComponent) => {
      // Add label if component has key and label
      if (component.key && component.label) {
        // Store the direct component key-label mapping
        labels[component.key] = component.label
        console.log('🏷️ PublicForm: Collected label', {
          key: component.key,
          label: component.label,
        })
        
        // For nested components in grids, also store with parent prefix for nested access
        if (parentKey) {
          const nestedKey = `${parentKey}.${component.key}`;
          labels[nestedKey] = component.label;
          console.log('🏷️ PublicForm: Collected nested label', {
            key: nestedKey,
            label: component.label,
            parent: parentKey
          });
        }
      }

      // Handle nested components in different container types
      if (component.components && Array.isArray(component.components)) {
        // Pass the current component key as parent for nested components
        const newParentKey = component.key || parentKey;
        collectLabels(component.components, newParentKey)
      }

      // Handle columns
      if ((component as any).columns && Array.isArray((component as any).columns)) {
        (component as any).columns.forEach((column: any, index: number) => {
          if (column.components && Array.isArray(column.components)) {
            // Create a parent key for column components
            const columnParentKey = component.key ? `${component.key}.column${index}` : `column${index}`;
            collectLabels(column.components, columnParentKey)
          }
        })
      }

      // Handle tabs
      if (component.type === 'tabs' && component.components) {
        component.components.forEach((tab: any, index: number) => {
          if (tab.components && Array.isArray(tab.components)) {
            // Create a parent key for tab components
            const tabParentKey = component.key ? `${component.key}.tab${index}` : `tab${index}`;
            collectLabels(tab.components, tabParentKey)
          }
        })
      }

      // Handle table rows and cells
      if (component.type === 'table' && (component as any).rows) {
        (component as any).rows.forEach((row: any, rowIndex: number) => {
          if (row.cells && Array.isArray(row.cells)) {
            row.cells.forEach((cell: any, colIndex: number) => {
              if (cell.components && Array.isArray(cell.components)) {
                // Create a parent key for cell components
                const cellParentKey = component.key ? `${component.key}.row${rowIndex}.col${colIndex}` : `row${rowIndex}.col${colIndex}`;
                collectLabels(cell.components, cellParentKey)
              }
            })
          }
        })
      }

      // Handle EditGrid - collect labels from nested components
      if (component.type === 'editgrid' && component.components) {
        console.log('🏷️ PublicForm: Processing EditGrid component', {
          key: component.key,
          label: component.label,
          nestedComponents: component.components.length,
        })
        
        // Store the grid component itself
        if (component.key && component.label) {
          labels[component.key] = component.label;
        }
        
        // For each component in the editgrid, we need to store both the direct key and the nested key
        collectLabels(component.components, component.key || 'editgrid')
      }

      // Handle DataGrid - collect labels from nested components
      if (component.type === 'datagrid' && component.components) {
        console.log('🏷️ PublicForm: Processing DataGrid component', {
          key: component.key,
          label: component.label,
          nestedComponents: component.components.length,
        })
        
        // Store the grid component itself
        if (component.key && component.label) {
          labels[component.key] = component.label;
        }
        
        // For each component in the datagrid, we need to store both the direct key and the nested key
        collectLabels(component.components, component.key || 'datagrid')
      }

      // Handle Panel - collect labels from nested components
      if (component.type === 'panel' && component.components) {
        console.log('🏷️ PublicForm: Processing Panel component', {
          key: component.key,
          label: component.label,
        })
        collectLabels(component.components, component.key || 'panel')
      }

      // Handle Fieldset - collect labels from nested components
      if (component.type === 'fieldset' && component.components) {
        console.log('🏷️ PublicForm: Processing Fieldset component', {
          key: component.key,
          label: component.label,
        })
        collectLabels(component.components, component.key || 'fieldset')
      }

      // Handle Well - collect labels from nested components
      if (component.type === 'well' && component.components) {
        console.log('🏷️ PublicForm: Processing Well component', {
          key: component.key,
          label: component.label,
        })
        collectLabels(component.components, component.key || 'well')
      }

      // Handle Container - collect labels from nested components
      if (component.type === 'container' && component.components) {
        console.log('🏷️ PublicForm: Processing Container component', {
          key: component.key,
          label: component.label,
        })
        collectLabels(component.components, component.key || 'container')
      }
    })
  }

  // Start collecting from top-level components
  collectLabels(formComponents.value)

  // Enhance labels for complex components
  enhanceLabelsForComplexComponents(labels)

  // Create additional mappings for common field patterns
  createCommonFieldMappings(labels)

  console.log('🏷️ PublicForm: Final collected labels:', labels)
  return labels
}

// Helper function to enhance labels for complex components
const enhanceLabelsForComplexComponents = (labels: Record<string, string>) => {
  // Find all EditGrid and DataGrid components and enhance their nested field labels
  const collectAndEnhanceNestedLabels = (components: FormComponent[]) => {
    components.forEach((component: FormComponent) => {
      if (
        (component.type === 'editgrid' || component.type === 'datagrid') &&
        component.components
      ) {
        console.log('🔧 PublicForm: Enhancing labels for', component.type, component.key)

        component.components.forEach((nestedComponent: FormComponent) => {
          if (nestedComponent.key && nestedComponent.label) {
            // Store the label with the nested component key
            labels[nestedComponent.key] = nestedComponent.label

            // Also store with the parent component key prefix for better matching
            const prefixedKey = `${component.key}_${nestedComponent.key}`
            labels[prefixedKey] = nestedComponent.label

            console.log('🔧 PublicForm: Enhanced nested label', {
              key: nestedComponent.key,
              prefixedKey: prefixedKey,
              label: nestedComponent.label,
              parent: component.key,
              parentType: component.type,
            })
          }
        })
      }

      // Recursively process nested components
      if (component.components) {
        collectAndEnhanceNestedLabels(component.components)
      }
      if ((component as any).columns) {
        (component as any).columns.forEach((column: any) => {
          if (column.components) {
            collectAndEnhanceNestedLabels(column.components)
          }
        })
      }
    })
  }

  collectAndEnhanceNestedLabels(formComponents.value)

  // Also create a mapping for Form.io generated keys to their actual labels
  createFormIoKeyMapping(labels)
}

// Helper function to create mapping for Form.io generated keys
const createFormIoKeyMapping = (labels: Record<string, string>) => {
  const formIoKeyMapping: Record<string, string> = {}

  // Extract all component keys and their labels
  const extractKeysAndLabels = (components: FormComponent[]) => {
    components.forEach((component: FormComponent) => {
      if (component.key && component.label) {
        // Store the original mapping
        formIoKeyMapping[component.key] = component.label

        // Create alternative mappings for Form.io generated keys
        // Extract meaningful parts from the key
        const keyParts = component.key.split('_')
        if (keyParts.length >= 3) {
          const lastPart = keyParts[keyParts.length - 1]
          if (lastPart && lastPart.length > 3) {
            formIoKeyMapping[lastPart] = component.label
          }
        }

        // Also create mapping for the full Form.io generated key pattern
        // This handles cases where the component key itself is a Form.io generated key
        if (component.key.match(/^[a-z]{3}_\d+_[a-z0-9]+$/)) {
          formIoKeyMapping[component.key] = component.label
        }
      }

      // Recursively process nested components
      if (component.components) {
        extractKeysAndLabels(component.components)
      }
      if ((component as any).columns) {
        (component as any).columns.forEach((column: any) => {
          if (column.components) {
            extractKeysAndLabels(column.components)
          }
        })
      }
    })
  }

  extractKeysAndLabels(formComponents.value)

  // Merge the Form.io key mapping into the main labels
  Object.assign(labels, formIoKeyMapping)

  console.log('🔧 PublicForm: Created Form.io key mapping:', formIoKeyMapping)
}

// Helper function to create mappings for common field patterns
const createCommonFieldMappings = (labels: Record<string, string>) => {
  const commonMappings: Record<string, string> = {}

  // Create mappings for common field types
  const fieldTypeMappings = {
    textfield: 'حقل نص',
    textarea: 'منطقة نص',
    number: 'حقل رقم',
    email: 'البريد الإلكتروني',
    select: 'قائمة اختيار',
    checkbox: 'مربع اختيار',
    radio: 'اختيار واحد',
    signature: 'التوقيع الرقمي',
    date: 'تاريخ',
    time: 'وقت',
    datetime: 'تاريخ ووقت',
    file: 'ملف',
    url: 'رابط',
    phoneNumber: 'رقم الهاتف',
    password: 'كلمة المرور',
  }

  // Add mappings for field types with numbers (like textfield-1, textfield_1)
  Object.entries(fieldTypeMappings).forEach(([type, label]) => {
    for (let i = 1; i <= 10; i++) {
      commonMappings[`${type}-${i}`] = label
      commonMappings[`${type}_${i}`] = label
    }
  })

  // Merge the common mappings into the main labels
  Object.assign(labels, commonMappings)

  console.log('🔧 PublicForm: Created common field mappings:', commonMappings)
}

const loadForm = async () => {
  loading.value = true
  error.value = null

  try {
    const result = await formsStore.fetchPublicForm(Number(formId.value))
    if (result.success && result.data) {
      form.value = result.data

      // Check if form is available for public access
      if (form.value.status !== 'published') {
        error.value = t('publicForm.errors.formNotPublished')
        return
      }

      if (!form.value.is_public) {
        error.value = t('publicForm.errors.formNotPublic')
        return
      }

      // Reset multi-step state
      currentStep.value = 0
      formData.value = {}
      stepValidation.value = {}
    } else {
      error.value = result.error || t('publicForm.errors.formNotFound')
    }
  } catch (err) {
    console.error('Error loading form:', err)
    error.value = t('publicForm.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

// Multi-step form methods
const getCurrentStepData = () => {
  const currentSection = formSections.value[currentStep.value]
  if (!currentSection) return {}

  const stepData: Record<string, any> = {}
  const sectionComponentIds = currentSection.componentIds || []

  sectionComponentIds.forEach((componentId: string) => {
    if (formData.value[componentId] !== undefined) {
      stepData[componentId] = formData.value[componentId]

      // Log EditGrid/DataGrid data for debugging
      if (Array.isArray(formData.value[componentId]) && formData.value[componentId].length > 0) {
        console.log('📊 PublicForm: Current step contains array data', {
          componentId,
          arrayLength: formData.value[componentId].length,
          isEditGrid: componentId.includes('editgrid'),
          isDataGrid: componentId.includes('datagrid'),
          currentStep: currentStep.value,
        })
      }
    }
  })

  console.log('📝 PublicForm: Current step data', {
    step: currentStep.value,
    sectionTitle: currentSection.title,
    componentIds: sectionComponentIds,
    stepDataKeys: Object.keys(stepData),
    stepData: stepData,
  })

  return stepData
}

const getCurrentStepTitle = () => {
  const currentSection = formSections.value[currentStep.value]
  return currentSection?.title || t('publicForm.step', { number: currentStep.value + 1 })
}

const handleStepChange = (stepIndex: number) => {
  // Prevent jumping forward if current step has missing required fields
  if (stepIndex > currentStep.value && !isStepValidByRequired.value) {
    const { errorMessage } = validateCurrentStepRequiredFields(getCurrentStepData())
    showError(errorMessage || t('publicForm.errors.validation'))
    return
  }
  if (stepIndex >= 0 && stepIndex < formSections.value.length) {
    currentStep.value = stepIndex
  }
}

const handleStepChanged = (stepIndex: number) => {
  // Prevent jumping forward if current step has missing required fields
  if (stepIndex > currentStep.value && !isStepValidByRequired.value) {
    const { errorMessage } = validateCurrentStepRequiredFields(getCurrentStepData())
    showError(errorMessage || t('publicForm.errors.validation'))
    return
  }
  currentStep.value = stepIndex
}

const handleEditComponent = (componentId: string) => {
  // In public form, we don't allow editing components
  // This method is kept for interface compatibility
}

const handleFormDataChange = (data: Record<string, any>) => {
  // Log signature data specifically
  Object.keys(data).forEach((key) => {
    if (
      key.includes('signature') ||
      (typeof data[key] === 'string' && data[key].startsWith('data:image'))
    ) {
      console.log('🎯 PublicForm: Signature data received', {
        key,
        hasValue: !!data[key],
        valueType: typeof data[key],
        isDataURL: typeof data[key] === 'string' && data[key].startsWith('data:image'),
        currentStep: currentStep.value,
        dataLength: typeof data[key] === 'string' ? data[key].length : 0,
      })
    }

    // Log EditGrid/DataGrid data specifically
    if (Array.isArray(data[key]) && data[key].length > 0) {
      console.log('📊 PublicForm: Array data received (EditGrid/DataGrid)', {
        key,
        arrayLength: data[key].length,
        firstItem: data[key][0],
        isEditGrid: key.includes('editgrid') || key.includes('datagrid'),
        currentStep: currentStep.value,
      })
    }
  })

  // Update form data with new values
  formData.value = { ...formData.value, ...data }

  // Log total form data for debugging
  console.log('📝 PublicForm: Form data updated', {
    totalKeys: Object.keys(formData.value).length,
    currentStep: currentStep.value,
    newDataKeys: Object.keys(data),
    formDataKeys: Object.keys(formData.value),
  })

  // Mark current step as having data
  stepValidation.value[currentStep.value] = Object.keys(getCurrentStepData()).length > 0
}

const previousStep = async () => {
  if (canGoPrevious.value) {
    currentStep.value--

    // Reinitialize signature components after step change
    await nextTick()
    if (dynamicFormRendererRef.value && dynamicFormRendererRef.value.reinitializeSignatures) {
      console.log('🎯 PublicForm: Reinitializing signatures after previous step')
      dynamicFormRendererRef.value.reinitializeSignatures()
    }
  }
}

const nextStep = async () => {
  // Block progressing if current step has missing required fields
  if (!canGoNext.value && !canSubmit.value) {
    const { errorMessage } = validateCurrentStepRequiredFields(getCurrentStepData())
    showError(errorMessage || t('publicForm.errors.validation'))
    return
  }

  if (isLastStep.value) {
    // Submit the form
    submitForm()
  } else if (currentStep.value < formSections.value.length - 1) {
    // Save current step data before moving to next
    const currentStepData = getCurrentStepData()
    handleFormDataChange(currentStepData)

    // Move to next step
    currentStep.value++

    // Reinitialize signature components after step change
    await nextTick()
    if (dynamicFormRendererRef.value && dynamicFormRendererRef.value.reinitializeSignatures) {
      console.log('🎯 PublicForm: Reinitializing signatures after step change')
      dynamicFormRendererRef.value.reinitializeSignatures()
    }
  }
}

const handleStepSubmit = (submissionData: Record<string, any>, isFormSubmit: boolean = false) => {
  // Handle form submission from FormRenderer
  if (formSections.value.length <= 1) {
    // Single step form - only submit if it's a form submit button
    if (isFormSubmit) {
      handleSubmit(submissionData)
    } else {
      // Just update form data for regular buttons
      handleFormDataChange(submissionData)
    }
  } else {
    // Multi-step form - only submit if it's the final submit and from form submit button
    if (isFormSubmit && isLastStep.value) {
      handleFormDataChange(submissionData)
      submitForm()
    } else {
      // Just update data for regular buttons
      handleFormDataChange(submissionData)
    }
  }
}

// Validation function for required fields in current step only
const validateCurrentStepRequiredFields = (stepData: Record<string, any>) => {
  const missingFields: string[] = []
  const fieldLabels = getFieldLabels()

  // Get components for current step only
  const currentSection = formSections.value[currentStep.value]
  if (!currentSection) return { isValid: true, errorMessage: '', missingFields: [] }

  const currentStepComponentIds = currentSection.componentIds || []

  // Get actual components for current step
  const componentsToCheck = currentStepComponentIds
    .map((componentId) => {
      return formComponents.value.find((comp) => comp.key === componentId)
    })
    .filter(Boolean)

  // If no components found but single step form, use all components
  if (componentsToCheck.length === 0 && formSections.value.length === 1) {
    componentsToCheck.push(...formComponents.value)
  }

  // Check each component in current step for required validation
  componentsToCheck
    .filter((component): component is FormComponent => component !== undefined)
    .forEach((component: FormComponent) => {
      if (component.validate?.required && component.key) {
        const value = stepData[component.key] || formData.value[component.key]

        // Check if field is empty based on component type
        let isEmpty = false

        if (value === undefined || value === null || value === '') {
          isEmpty = true
        } else if (Array.isArray(value) && value.length === 0) {
          isEmpty = true
        } else if (typeof value === 'object' && Object.keys(value).length === 0) {
          isEmpty = true
        } else if (component.type === 'signature') {
          // Special handling for signature components
          // Signature is empty if it's not a valid data URL
          isEmpty = !(
            typeof value === 'string' &&
            value.startsWith('data:image') &&
            value.length > 50
          )
        }

        if (isEmpty) {
          const fieldLabel = fieldLabels[component.key] || component.label || component.key
          missingFields.push(fieldLabel)
        }
      }
    })

  if (missingFields.length > 0) {
    const errorMessage = t('publicForm.validation.requiredFieldsMissing', {
      fields: missingFields.join(', '),
      count: missingFields.length,
    })

    return {
      isValid: false,
      errorMessage,
      missingFields,
    }
  }

  return {
    isValid: true,
    errorMessage: '',
    missingFields: [],
  }
}

// Validation function for required fields (all steps)
const validateRequiredFields = (submissionData: Record<string, any>) => {
  const missingFields: string[] = []
  const fieldLabels = getFieldLabels()

  // Use all form components for validation
  const allComponents = formComponents.value

  // Check each component for required validation
  allComponents.forEach((component: FormComponent) => {
    if (component.validate?.required && component.key) {
      const value = submissionData[component.key]

      // Check if field is empty based on component type
      let isEmpty = false

      if (value === undefined || value === null || value === '') {
        isEmpty = true
      } else if (Array.isArray(value) && value.length === 0) {
        isEmpty = true
      } else if (typeof value === 'object' && Object.keys(value).length === 0) {
        isEmpty = true
      } else if (component.type === 'signature') {
        // Special handling for signature components
        // Signature is empty if it's not a valid data URL
        isEmpty = !(
          typeof value === 'string' &&
          value.startsWith('data:image') &&
          value.length > 50
        )
      }

      if (isEmpty) {
        const fieldLabel = fieldLabels[component.key] || component.label || component.key
        missingFields.push(fieldLabel)
      }
    }
  })

  if (missingFields.length > 0) {
    const errorMessage = t('publicForm.validation.requiredFieldsMissing', {
      fields: missingFields.join(', '),
      count: missingFields.length,
    })

    return {
      isValid: false,
      errorMessage,
      missingFields,
    }
  }

  return {
    isValid: true,
    errorMessage: '',
    missingFields: [],
  }
}

const submitForm = async (stepperData?: Record<string, any>) => {
  try {
    submitting.value = true

    // Combine all form data from all steps
    let finalSubmissionData = { ...formData.value }

    // If data is passed from FormStepper, use it
    if (stepperData && Object.keys(stepperData).length > 0) {
      finalSubmissionData = { ...finalSubmissionData, ...stepperData }
    }

    // Log signature data in final submission
    const signatureKeys = Object.keys(finalSubmissionData).filter(
      (key) =>
        key.includes('signature') ||
        (typeof finalSubmissionData[key] === 'string' &&
          finalSubmissionData[key].startsWith('data:image')),
    )
    if (signatureKeys.length > 0) {
      console.log('🚀 PublicForm: Final submission with signature data', {
        signatureKeys,
        signatureCount: signatureKeys.length,
        totalDataKeys: Object.keys(finalSubmissionData).length,
        signatureDetails: signatureKeys.map((key) => ({
          key,
          hasValue: !!finalSubmissionData[key],
          isDataURL:
            typeof finalSubmissionData[key] === 'string' &&
            finalSubmissionData[key].startsWith('data:image'),
          dataLength:
            typeof finalSubmissionData[key] === 'string' ? finalSubmissionData[key].length : 0,
        })),
      })
    }

    // Log EditGrid/DataGrid data in final submission
    const arrayKeys = Object.keys(finalSubmissionData).filter(
      (key) => Array.isArray(finalSubmissionData[key]) && finalSubmissionData[key].length > 0,
    )
    if (arrayKeys.length > 0) {
      console.log('📊 PublicForm: Final submission with array data (EditGrid/DataGrid)', {
        arrayKeys,
        arrayCount: arrayKeys.length,
        arrayDetails: arrayKeys.map((key) => ({
          key,
          arrayLength: finalSubmissionData[key].length,
          firstItem: finalSubmissionData[key][0],
          isEditGrid: key.includes('editgrid'),
          isDataGrid: key.includes('datagrid'),
        })),
      })
    }

    // If formData is empty, try to get data directly from DynamicFormRenderer
    if (Object.keys(finalSubmissionData).length === 0) {
      if (dynamicFormRendererRef.value && dynamicFormRendererRef.value.getFormData) {
        const rendererData = dynamicFormRendererRef.value.getFormData()
        if (rendererData && Object.keys(rendererData).length > 0) {
          Object.assign(finalSubmissionData, rendererData)
        }
      }
    }

    // Check if data is still empty after trying to get from FormRenderer
    if (Object.keys(finalSubmissionData).length === 0) {
      showError(t('publicForm.errors.noDataToSubmit') || 'No data to submit')
      submitting.value = false
      return
    }

    // Validate required fields before submission
    const validationResult = validateRequiredFields(finalSubmissionData)
    if (!validationResult.isValid) {
      showError(validationResult.errorMessage)
      submitting.value = false
      return
    }

    // Get field labels with enhanced mapping
    const fieldLabels = getFieldLabels()

    // Log field labels for debugging
    console.log('🏷️ PublicForm: Sending field labels with submission:', {
      totalLabels: Object.keys(fieldLabels).length,
      labels: fieldLabels,
    })

    // Prepare metadata with user information if authenticated
    const metadata: Record<string, any> = {
      submitted_at: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ip_address: null, // Will be set by backend
      field_labels: fieldLabels, // Add enhanced field labels to metadata
      form_schema: form.value?.schema, // Add form schema for reference
    }

    // Add user information if authenticated
    if (isAuthenticated.value && user.value) {
      metadata.user_id = user.value.id
      metadata.user_name = user.value.name
      metadata.user_email = user.value.email
    }

    // Submit form with user information and field labels
    const result =
      isAuthenticated.value && user.value
        ? await submissionsStore.submitForm(form.value!.id, finalSubmissionData, metadata)
        : await submissionsStore.submitPublicForm(form.value!.id, finalSubmissionData, metadata)

    if (result.success) {
      submitted.value = true
      success(t('publicForm.submitSuccess'))
    } else {
      showError(result.error || t('publicForm.errors.submitFailed'))
    }
  } catch (err) {
    console.error('Error submitting form:', err)
    showError(t('publicForm.errors.submitFailed'))
  } finally {
    submitting.value = false
  }
}

const handleSingleFormSubmit = () => {
  const rendererData =
    dynamicFormRendererRef.value && dynamicFormRendererRef.value.getFormData
      ? dynamicFormRendererRef.value.getFormData()
      : formData.value
  submitForm(rendererData)
}

const handleSubmit = async (formData: Record<string, any>) => {
  if (!form.value) return

  submitting.value = true

  try {
    // Validate required fields before submission
    const validationResult = validateRequiredFields(formData)
    if (!validationResult.isValid) {
      showError(validationResult.errorMessage)
      submitting.value = false
      return
    }

    // Get field labels
    const fieldLabels = getFieldLabels()

    // Prepare metadata with user information if authenticated
    const metadata: Record<string, any> = {
      submitted_at: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ip_address: null, // Will be set by backend
      field_labels: fieldLabels, // Add field labels to metadata
    }

    // Add user information if authenticated
    if (isAuthenticated.value && user.value) {
      metadata.user_id = user.value.id
      metadata.user_name = user.value.name
      metadata.user_email = user.value.email
    }

    // Submit form with user information and field labels
    const result =
      isAuthenticated.value && user.value
        ? await submissionsStore.submitForm(form.value.id, formData, metadata)
        : await submissionsStore.submitPublicForm(form.value.id, formData, metadata)

    if (result.success) {
      submitted.value = true
      success(t('publicForm.submitSuccess'))
    } else {
      showError(result.error || t('publicForm.errors.submitFailed'))
    }
  } catch (err) {
    console.error('Error submitting form:', err)
    showError(t('publicForm.errors.submitFailed'))
  } finally {
    submitting.value = false
  }
}

const handleFormError = (errorMessage: string) => {
  showError(errorMessage)
}

const resetForm = () => {
  submitted.value = false
  currentStep.value = 0
  formData.value = {}
  stepValidation.value = {}
  loadForm()
}

// Lifecycle
onMounted(() => {
  if (formId.value) {
    loadForm()
  } else {
    error.value = t('publicForm.errors.invalidFormId')
  }
})
</script>

<style scoped>
.public-form-container {
  min-height: 100vh;
  position: relative;
}

/* Enhanced animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Backdrop blur effects */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Form renderer enhancement */
.form-renderer-enhanced {
  animation: fadeInUp 0.6s ease-out;
  min-height: 400px;
  width: 100%;
}

/* Full width form styling */
.form-renderer-enhanced :deep(.formio-form) {
  width: 100% !important;
  max-width: none !important;
}

.form-renderer-enhanced :deep(.form-group) {
  margin-bottom: 1.5rem;
}

.form-renderer-enhanced :deep(.form-control) {
  width: 100% !important;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.form-renderer-enhanced :deep(.form-control:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  outline: none;
}

.form-renderer-enhanced :deep(label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

.form-renderer-enhanced :deep(.btn-primary) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
}

.form-renderer-enhanced :deep(.btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

/* Enhanced button effects */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

button:active {
  transform: translateY(-1px);
}

/* Enhanced Loading animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* New UX animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes wiggle {
  0%,
  7% {
    transform: rotateZ(0);
  }
  15% {
    transform: rotateZ(-15deg);
  }
  20% {
    transform: rotateZ(10deg);
  }
  25% {
    transform: rotateZ(-10deg);
  }
  30% {
    transform: rotateZ(6deg);
  }
  35% {
    transform: rotateZ(-4deg);
  }
  40%,
  100% {
    transform: rotateZ(0);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-bounce {
  animation: bounce 1s infinite;
}
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
.animate-scale-in {
  animation: scaleIn 0.5s ease-out;
}
.animate-slide-in-right {
  animation: slideInRight 0.5s ease-out;
}
.animate-wiggle {
  animation: wiggle 1s ease-in-out;
}

/* Enhanced focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .backdrop-blur-sm,
  .backdrop-blur-xl {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: rgba(255, 255, 255, 0.95);
  }
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Print styles */
@media print {
  .public-form-container {
    background: white !important;
  }
  .backdrop-blur-sm,
  .backdrop-blur-xl {
    background: white !important;
    backdrop-filter: none !important;
  }
}
</style>
