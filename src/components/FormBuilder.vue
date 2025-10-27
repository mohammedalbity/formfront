<template>
  <div class="form-builder-container mt-5" :class="{ rtl: isRTLSync() }">
    <!-- Header -->
    <div class="builder-header bg-white   shadow-sm border-b p-3 sm:p-4">
      <div
        class="flex flex-col sm:flex-row mt-2 justify-between items-start sm:items-center gap-3 sm:gap-0"
      >
        <div
          class="flex items-center space-x-2 sm:space-x-3"
          :class="{ 'space-x-2 sm:space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
        >
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">
            {{ isEditMode ? $t('formBuilder.editTitle') : $t('formBuilder.title') }}
          </h2>
          <span
            v-if="isEditMode"
            class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
          >
            {{ $t('formBuilder.editMode') }}
          </span>
          <div
            v-if="loading"
            class="flex items-center space-x-2"
            :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
          >
            <div
              class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"
            ></div>
            <span class="text-sm text-gray-600 hidden sm:inline">{{
              $t('formBuilder.loading')
            }}</span>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <!-- Public Form Toggle -->
          <div
            class="flex items-center space-x-2"
            :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
          >
            <label class="flex items-center cursor-pointer">
              <input v-model="isPublicForm"  type="checkbox" class="sr-only" />
              <div class="relative">
                <div
                  class="w-8 sm:w-10 h-5 sm:h-6 bg-gray-200 rounded-full shadow-inner transition-colors duration-200"
                  :class="{ 'bg-green-400': isPublicForm }"
                ></div>
                <div
                  class="absolute w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full shadow top-1 transition-transform duration-200"
                  :class="{
                    'transform translate-x-3 sm:translate-x-4': isPublicForm && !isRTLSync(),
                    'transform -translate-x-3 sm:-translate-x-4': isPublicForm && isRTLSync(),
                    'left-1': !isPublicForm && !isRTLSync(),
                    'right-1': !isPublicForm && isRTLSync(),
                  }"
                ></div>
              </div>
            </label>
            <span class="text-xs sm:text-sm font-medium text-gray-700">
              {{ $t('formBuilder.publicForm') }}
            </span>
            <div class="group relative hidden sm:block">
              <svg
                class="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div
                class="absolute bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10"
                :class="{
                  'left-[52px]': isRTLSync(),
                  'left-1/2': !isRTLSync()
                }"
              >
                {{ $t('formBuilder.publicFormTooltip') }}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <!-- Section Management Button -->
            <div class="group relative">
              <button
                @click="toggleSectionManager"
                :class="{
                  'bg-orange-600 hover:bg-orange-700': showSectionManager,
                  'bg-gray-600 hover:bg-gray-700': !showSectionManager
                }"
                class="w-10 h-10 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H3m16 14H5"></path>
                </svg>
              </button>
              <div class="absolute bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none"
                :class="{
                  'left-[52px]': isRTLSync(),
                  'left-1/2': !isRTLSync()
                }">
                {{ $t('formBuilder.sections.title') }}
              </div>
            </div>

            <!-- Stepper Button -->
            <div class="group relative">
              <button
                @click="toggleStepper"
                :class="{
                  'bg-indigo-600 hover:bg-indigo-700': showStepper,
                  'bg-gray-600 hover:bg-gray-700': !showStepper
                }"
                class="w-10 h-10 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <div class="absolute bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none"
                :class="{
                  'left-[52px]': isRTLSync(),
                  'left-1/2': !isRTLSync()
                }">
                {{ $t('formBuilder.stepper.title') }}
              </div>
            </div>

            <!-- Separator -->
            <div class="w-px bg-gray-300 mx-1"></div>

            <!-- Save Button -->
            <div class="group relative">
              <button
                @click="saveForm"
                :disabled="saving"
                class="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <svg v-if="saving" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
              </button>
              <div class="absolute bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none"
                :class="{
                  'left-[52px]': isRTLSync(),
                  'left-1/2': !isRTLSync()
                }">
                <span v-if="saving">{{ $t('formBuilder.saving') }}...</span>
                <span v-else>{{ $t('formBuilder.save') }}</span>
              </div>
            </div>


            <!-- Export Button -->
            <div class="group relative">
              <button
                @click="exportForm"
                class="w-10 h-10 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              <div class="absolute bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none"
                :class="{
                  'left-[52px]': isRTLSync(),
                  'left-1/2': !isRTLSync()
                }">
                {{ $t('formBuilder.export') }}
              </div>
            </div>

            <!-- Import Button -->
            <div class="group relative">
              <button
                @click="triggerImport"
                class="w-10 h-10 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
              </button>
              <div class="absolute bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none"
                :class="{
                  'left-[52px]': isRTLSync(),
                  'left-1/2': !isRTLSync()
                }">
                {{ $t('formBuilder.import') }}
              </div>
            </div>

            <!-- Load Demo Button -->
            <div class="group relative">
              <button
                @click="loadDemoSchema"
                class="w-10 h-10 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </button>
              <div class="absolute bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none"
                :class="{
                  'left-[52px]': isRTLSync(),
                  'left-1/2': !isRTLSync()
                }">
                {{ $t('formBuilder.loadDemo') }}
              </div>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              accept=".json"
              @change="handleFileImport"
              class="hidden"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Section Manager Panel -->
    <div
      v-if="showSectionManager"
      class="section-manager-panel bg-white border-b transition-all duration-300"
    >
      <FormSectionManager
        ref="sectionManagerRef"
        :sections="formSchema.sections || []"
        :components="formSchema.components"
        :current-section-index="currentSectionIndex"
        @update:sections="formSchema.sections = $event"
        @update:currentSectionIndex="currentSectionIndex = $event"
        @sectionChanged="onSectionChanged"
        @componentAssigned="onComponentAssigned"
        @componentRemoved="onComponentRemoved"
      />
    </div>

    <!-- Stepper Panel -->
    <div
      v-if="showStepper"
      class="stepper-panel bg-white border-b transition-all duration-300"
    >
      <FormStepper
        :sections="formSchema.sections || []"
        :components="formSchema.components"
        :current-step="currentSectionIndex"
        @update:currentStep="currentSectionIndex = $event"
        @stepChanged="onStepChanged"
        @editComponent="onEditComponentFromStepper"
      />
    </div>

    <div class="builder-content flex flex-col lg:flex-row h-full relative overflow-hidden">
      <!-- Components Palette -->
      <div
        class="components-palette w-full lg:w-72 bg-gradient-to-b from-gray-50 to-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto transition-all duration-300 absolute lg:static bottom-16 left-0 right-0 lg:top-auto lg:left-auto lg:right-auto lg:bottom-auto shadow-lg lg:shadow-none"
        style="z-index: 50"
        :class="[
          'lg:block lg:max-h-none lg:opacity-100',
          shouldShowComponents
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden lg:max-h-none lg:opacity-100 lg:overflow-visible'
        ]"
      >
        <div class="p-4 sm:p-6">
          <div class="mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {{ $t('formBuilder.components') }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600">
              {{ $t('formBuilder.componentsSubtitle') }}
            </p>
          </div>

          <!-- Search Components -->
          <div class="mb-4 sm:mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="w-4 sm:w-5 h-4 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                v-model="searchTerm"
                type="text"
                :placeholder="$t('formBuilder.searchComponents')"
                class="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-sm sm:text-base"
              />
            </div>
          </div>

          <!-- Component Categories -->
          <div v-for="category in filteredComponents" :key="category.name" class="mb-6 lg:mb-8">
            <div class="flex items-center mb-3 lg:mb-4">
              <div
                :class="getCategoryIconClass(category.name)"
                class="w-7 lg:w-8 h-7 lg:h-8 rounded-lg flex items-center justify-center mr-2 lg:mr-3"
              >
                <!-- Basic Category Icon -->
                <svg v-if="category.name === 'Basic'" class="w-3.5 lg:w-4 h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <!-- Layout Category Icon -->
                <svg v-else-if="category.name === 'Layout'" class="w-3.5 lg:w-4 h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H3m16 14H5"></path>
                </svg>
                <!-- Data Category Icon -->
                <svg v-else-if="category.name === 'Data'" class="w-3.5 lg:w-4 h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                </svg>
                <!-- Premium Category Icon -->
                <svg v-else-if="category.name === 'Premium'" class="w-3.5 lg:w-4 h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
                <!-- Default Icon -->
                <svg v-else class="w-3.5 lg:w-4 h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="text-xs lg:text-sm font-bold text-gray-800 uppercase tracking-wide">
                  {{ getCategoryText(category.name) }}
                </h4>
                <p class="text-xs text-gray-500">
                  {{ category.components.length }} {{ $t('formBuilder.componentsCount') }}
                </p>
              </div>
            </div>

            <!-- Mobile Grid Layout for Small Screens -->
            <div class="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                v-for="component in category.components"
                :key="component.type"
                @click="addComponentMobile(component)"
                class="component-item-mobile group p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
              >
                <div class="flex items-start space-x-3 rtl:space-x-reverse">
                  <div
                    :class="getComponentIconClass(category.name)"
                    class="component-icon w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0"
                  >
                    <div v-html="component.icon" class="text-white"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div
                      class="font-medium text-gray-900 text-sm group-hover:text-blue-900 transition-colors"
                    >
                      {{ getComponentLabel(component.type) }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {{ getComponentDescription(component.type) }}
                    </div>
                    <div class="flex items-center mt-2">
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span class="text-xs text-gray-400 ml-2 rtl:mr-2 rtl:ml-0">{{ $t('formBuilder.available') }}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <!-- Desktop Drag & Drop Layout -->
            <div class="hidden lg:block space-y-3">
              <div
                v-for="component in category.components"
                :key="component.type"
                :draggable="true"
                @dragstart="handleDragStart($event, component)"
                class="component-item group p-4 bg-white border-2 border-gray-200 rounded-xl cursor-move hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div class="flex items-start space-x-3 rtl:space-x-reverse">
                  <div
                    :class="getComponentIconClass(category.name)"
                    class="component-icon w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0"
                  >
                    <div v-html="component.icon" class="text-white"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div
                      class="font-semibold text-gray-900 text-base group-hover:text-blue-900 transition-colors"
                    >
                      {{ getComponentLabel(component.type) }}
                    </div>
                    <div class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">
                      {{ getComponentDescription(component.type) }}
                    </div>
                    <div class="flex items-center mt-3">
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span class="text-xs text-gray-400 ml-2 rtl:mr-2 rtl:ml-0">{{ $t('formBuilder.available') }}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="text-xs text-gray-400">
                    {{ $t('formBuilder.dragToAdd') }}
                  </div>
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Builder Area -->
      <div class="form-builder-area flex-1 flex flex-col h-full lg:h-auto">
        <!-- Form Properties Panel -->
        <div class="form-properties bg-white border-b p-4">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('formBuilder.formTitle') }}
              </label>
              <input
                v-model="formSchema.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="$t('formBuilder.formTitlePlaceholder')"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('formBuilder.formName') }}
              </label>
              <input
                v-model="formSchema.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="$t('formBuilder.formNamePlaceholder')"
              />
            </div>
          </div>
        </div>

        <!-- Drop Zone -->
        <div
          ref="dropZone"
          class="drop-zone flex-1 p-6 bg-gray-50 min-h-96 relative overflow-y-auto h-full"
          @dragover="handleDragOver"
          @drop="handleDrop"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          :class="{ 'opacity-50 pointer-events-none': loading }"
        >
          <!-- Mobile Components Toggle Button - Floating inside Drop Zone -->
          <div class="lg:hidden absolute bottom-4 right-4 z-20">
            <button
              @click="toggleMobileComponents"
              class="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14-7H3m16 14H5"
                ></path>
              </svg>
            </button>
          </div>
          <!-- Loading Overlay -->
          <div
            v-if="loading"
            class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
          >
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"
              ></div>
              <p class="text-gray-600 font-medium">{{ $t('formBuilder.loadingForm') }}</p>
            </div>
          </div>
          <div v-if="formSchema.components.length === 0" class="empty-state text-center py-20">
            <div class="text-6xl text-gray-300 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-600 mb-2">
              {{ $t('formBuilder.emptyState.title') }}
            </h3>
            <p class="text-gray-500">
              {{ $t('formBuilder.emptyState.description') }}
            </p>
          </div>

          <!-- Form Components -->
          <div
            v-else
            class="form-components space-y-6 lg:space-y-4 pb-24 lg:pb-4 scroll-smooth min-h-0"
          >
            <!-- Section Filter Info -->
            <div v-if="showSectionManager || showStepper" class="section-filter-info bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div class="flex items-center gap-2 text-blue-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm font-medium">
                  {{ getCurrentSectionTitle() }}
                </span>
              </div>
              <p class="text-xs text-blue-600 mt-1">
                {{ $t('formBuilder.sections.assignComponentsDesc') }}
              </p>
            </div>

            <!-- Empty State Message -->
            <div v-if="filteredFormComponents.length === 0" class="empty-state text-center py-12">
              <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  {{ (showSectionManager || showStepper) ? $t('formBuilder.sections.noComponentsInSection') : $t('formBuilder.noComponents') }}
                </h3>
                <p class="text-gray-500 mb-4">
                  {{ (showSectionManager || showStepper) ? $t('formBuilder.sections.addComponentsToSection') : $t('formBuilder.addComponentsDesc') }}
                </p>
                <button
                  v-if="!showMobileComponents && !isDesktop"
                  @click="toggleMobileComponents"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  {{ $t('formBuilder.addComponent') }}
                </button>
              </div>
            </div>

            <transition-group name="component-list" tag="div" class="space-y-4">
              <div
                v-for="(component, index) in filteredFormComponents"
                :key="component.key || index"
                class="form-component-wrapper relative group mb-4 transition-all duration-300 ease-in-out cursor-move"
                @click="selectComponent(component, getOriginalComponentIndex(component))"
                :class="{
                  selected: selectedComponentIndex === getOriginalComponentIndex(component),
                  'opacity-50 scale-95': draggedComponentIndex === getOriginalComponentIndex(component),
                  'border-2 border-dashed border-purple-400 bg-purple-50': dropTargetIndex === getOriginalComponentIndex(component) && draggedComponentIndex !== getOriginalComponentIndex(component)
                }"
                :draggable="true"
                @dragstart="handleComponentDragStart($event, component, getOriginalComponentIndex(component))"
                @dragover="handleComponentDragOver($event, getOriginalComponentIndex(component))"
                @dragenter="handleComponentDragEnter($event, getOriginalComponentIndex(component))"
                @dragleave="handleComponentDragLeave($event, getOriginalComponentIndex(component))"
                @drop="handleComponentDrop($event, getOriginalComponentIndex(component))"
              >
              <!-- Component Preview -->
              <div
                class="component-preview bg-white border-2 rounded-lg p-4 transition-colors"
                :class="
                  selectedComponentIndex === getOriginalComponentIndex(component)
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                "
              >
                <ComponentPreview
                  :component="component"
                  :readonly="false"
                  @drop-component="(componentData: any, containerPath: string) => {
                    console.log('🔥 DROP-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Component data:', componentData);
                    console.log('🔥 Container path:', containerPath);
                    console.log('🔥 Target component:', component);
                    console.log('🔥 Original index:', getOriginalComponentIndex(component));
                    handleNestedComponentDrop(componentData, component, getOriginalComponentIndex(component), containerPath);
                  }"
                  @add-column="(newColumn: any) => {
                    console.log('🔥 ADD-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 New column data:', newColumn);
                    console.log('🔥 Target component:', component);
                    handleAddColumn(component, getOriginalComponentIndex(component), newColumn);
                  }"
                  @edit-column-component="(columnIndex: number, componentIndex: number, editComponent: any) => {
                    console.log('🔧 EDIT-COLUMN-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Received params:', { columnIndex, componentIndex, editComponent });
                    console.log('🔧 Types:', { 
                      columnIndexType: typeof columnIndex, 
                      componentIndexType: typeof componentIndex, 
                      componentType: typeof editComponent 
                    });
                    console.log('🔧 Component:', component);
                    const columnsIndex = getOriginalComponentIndex(component);
                    console.log('🔧 Original component index:', columnsIndex);
                    
                    // Create data object for the handler
                    const data = { columnIndex, componentIndex, component: editComponent };
                    console.log('🔧 Created data object:', data);
                    
                    handleEditColumnComponent(component, columnsIndex, data);
                  }"
                  @delete-column-component="(columnIndex: number, componentIndex: number, deleteComponent: any) => {
                    console.log('🗑️ DELETE-COLUMN-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Received params:', { columnIndex, componentIndex, deleteComponent });
                    console.log('🗑️ Types:', { 
                      columnIndexType: typeof columnIndex, 
                      componentIndexType: typeof componentIndex, 
                      componentType: typeof deleteComponent 
                    });
                    
                    // Create data object for the handler
                    const data = { columnIndex, componentIndex, component: deleteComponent };
                    console.log('🗑️ Created data object:', data);
                    
                    handleDeleteColumnComponent(component, getOriginalComponentIndex(component), data);
                  }"
                  @add-component-to-column="(columnIndex: number, componentType: string) => {
                    console.log('🔥 ADD-COMPONENT-TO-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Column index:', columnIndex);
                    console.log('🔥 Component type:', componentType);
                    console.log('🔥 Target component:', component);
                    handleAddComponentToColumn(component, getOriginalComponentIndex(component), columnIndex, componentType);
                  }"
                  @add-new-column="() => {
                    console.log('🔥 ADD-NEW-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Target component:', component);
                    const newColumn = { width: 6, components: [] };
                    handleAddColumn(component, getOriginalComponentIndex(component), newColumn);
                  }"
                  @add-component-to-table-cell="(data: { rowIndex: number, cellIndex: number, componentType: string }) => {
                    console.log('🔥 ADD-COMPONENT-TO-TABLE-CELL EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Table component:', component);
                    console.log('🔥 Data:', data);
                    handleAddComponentToTableCell(component, getOriginalComponentIndex(component), data);
                  }"
                  @edit-table-cell-component="(data: any) => {
                    console.log('🔧 EDIT-TABLE-CELL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Edit data:', data);
                    handleEditTableCellComponent(component, getOriginalComponentIndex(component), data);
                  }"
                  @delete-table-cell-component="(data: any) => {
                    console.log('🗑️ DELETE-TABLE-CELL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Delete data:', data);
                    handleDeleteTableCellComponent(component, getOriginalComponentIndex(component), data);
                  }"
                  @edit-panel-component="(componentIndex: number, panelComponent: any) => {
                    console.log('🔧 EDIT-PANEL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Component index:', componentIndex);
                    console.log('🔧 Panel component:', panelComponent);
                    handleEditPanelComponent(component, getOriginalComponentIndex(component), componentIndex, panelComponent);
                  }"
                  @delete-panel-component="(componentIndex: number, panelComponent: any) => {
                    console.log('🗑️ DELETE-PANEL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Component index:', componentIndex);
                    console.log('🗑️ Panel component:', panelComponent);
                    handleDeletePanelComponent(component, getOriginalComponentIndex(component), componentIndex, panelComponent);
                  }"
                  @add-component-to-panel="(componentType: string) => {
                    console.log('🔥 ADD-COMPONENT-TO-PANEL EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Component type:', componentType);
                    console.log('🔥 Target component:', component);
                    handleAddComponentToPanel(component, getOriginalComponentIndex(component), componentType);
                  }"
                  @add-component-to-datagrid-column="(data: any) => {
                    console.log('🔵 ADD-COMPONENT-TO-DATAGRID-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔵 Data:', data);
                    handleAddComponentToDataGridColumn(component, getOriginalComponentIndex(component), data);
                  }"
                  @edit-datagrid-column-component="(data: any) => {
                    console.log('🔧 EDIT-DATAGRID-COLUMN-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Data:', data);
                    handleEditDataGridColumnComponent(component, getOriginalComponentIndex(component), data);
                  }"
                  @delete-datagrid-column-component="(data: any) => {
                    console.log('🗑️ DELETE-DATAGRID-COLUMN-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Data:', data);
                    handleDeleteDataGridColumnComponent(component, getOriginalComponentIndex(component), data);
                  }"
                  @edit-fieldset-component="(componentIndex: number, fieldsetComponent: any) => {
                    console.log('🔧 EDIT-FIELDSET-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Component index:', componentIndex);
                    console.log('🔧 Fieldset component:', fieldsetComponent);
                    handleEditFieldsetComponent(component, getOriginalComponentIndex(component), componentIndex, fieldsetComponent);
                  }"
                  @delete-fieldset-component="(componentIndex: number, fieldsetComponent: any) => {
                    console.log('🗑️ DELETE-FIELDSET-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Component index:', componentIndex);
                    console.log('🗑️ Fieldset component:', fieldsetComponent);
                    handleDeleteFieldsetComponent(component, getOriginalComponentIndex(component), componentIndex, fieldsetComponent);
                  }"
                  @add-component-to-fieldset="(componentType: string) => {
                    console.log('🔥 ADD-COMPONENT-TO-FIELDSET EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Component type:', componentType);
                    console.log('🔥 Target component:', component);
                    handleAddComponentToFieldset(component, getOriginalComponentIndex(component), componentType);
                  }"
                  @edit-well-component="(componentIndex: number, wellComponent: any) => {
                    console.log('🔧 EDIT-WELL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Component index:', componentIndex);
                    console.log('🔧 Well component:', wellComponent);
                    handleEditWellComponent(component, getOriginalComponentIndex(component), componentIndex, wellComponent);
                  }"
                  @delete-well-component="(componentIndex: number, wellComponent: any) => {
                    console.log('🗑️ DELETE-WELL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Component index:', componentIndex);
                    console.log('🗑️ Well component:', wellComponent);
                    handleDeleteWellComponent(component, getOriginalComponentIndex(component), componentIndex, wellComponent);
                  }"
                  @add-component-to-well="(componentType: string) => {
                    console.log('🔥 ADD-COMPONENT-TO-WELL EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Component type:', componentType);
                    console.log('🔥 Target component:', component);
                    handleAddComponentToWell(component, getOriginalComponentIndex(component), componentType);
                  }"
                  @edit-container-component="(componentIndex: number, containerComponent: any) => {
                    console.log('🔧 EDIT-CONTAINER-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Component index:', componentIndex);
                    console.log('🔧 Container component:', containerComponent);
                    handleEditContainerComponent(component, getOriginalComponentIndex(component), componentIndex, containerComponent);
                  }"
                  @delete-container-component="(componentIndex: number, containerComponent: any) => {
                    console.log('🗑️ DELETE-CONTAINER-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Component index:', componentIndex);
                    console.log('🗑️ Container component:', containerComponent);
                    handleDeleteContainerComponent(component, getOriginalComponentIndex(component), componentIndex, containerComponent);
                  }"
                  @add-component-to-container="(componentType: string) => {
                    console.log('🔥 ADD-COMPONENT-TO-CONTAINER EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔥 Component type:', componentType);
                    console.log('🔥 Target component:', component);
                    handleAddComponentToContainer(component, getOriginalComponentIndex(component), componentType);
                  }"
                  @add-table-column="() => {
                    console.log('➕ ADD-TABLE-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    handleAddTableColumn(component, getOriginalComponentIndex(component));
                  }"
                  @delete-table-column="(columnIndex: number) => {
                    console.log('🗑️ DELETE-TABLE-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Column index:', columnIndex);
                    handleDeleteTableColumn(component, getOriginalComponentIndex(component), columnIndex);
                  }"
                  @add-table-row="() => {
                    console.log('➕ ADD-TABLE-ROW EVENT RECEIVED IN FORMBUILDER!');
                    handleAddTableRow(component, getOriginalComponentIndex(component));
                  }"
                  @delete-table-row="(rowIndex: number) => {
                    console.log('🗑️ DELETE-TABLE-ROW EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Row index:', rowIndex);
                    handleDeleteTableRow(component, getOriginalComponentIndex(component), rowIndex);
                  }"
                  @add-datagrid-row="() => {
                    console.log('➕ ADD-DATAGRID-ROW EVENT RECEIVED IN FORMBUILDER!');
                    handleAddDataGridRow(component, getOriginalComponentIndex(component));
                  }"
                  @delete-datagrid-row="(rowIndex: number) => {
                    console.log('🗑️ DELETE-DATAGRID-ROW EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Row index:', rowIndex);
                    handleDeleteDataGridRow(component, getOriginalComponentIndex(component), rowIndex);
                  }"
                  @update-datagrid-cell-value="(data: any) => {
                    console.log('📝 UPDATE-DATAGRID-CELL-VALUE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('📝 Data:', data);
                    handleUpdateDataGridCellValue(component, getOriginalComponentIndex(component), data);
                  }"
                  @update-datagrid-cell="(rowIndex: number, fieldKey: string, newValue: any) => {
                    console.log('📝 UPDATE-DATAGRID-CELL EVENT RECEIVED IN FORMBUILDER!');
                    console.log('📝 Row index:', rowIndex, 'Field:', fieldKey, 'Value:', newValue);
                    handleUpdateDataGridCell(component, getOriginalComponentIndex(component), rowIndex, fieldKey, newValue);
                  }"
                  @signature-change="(data: { componentIndex: number, signature: string }) => {
                    console.log('✍️ SIGNATURE-CHANGE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('✍️ Data:', data);
                    handleSignatureChange(data.componentIndex.toString(), data.signature);
                  }"
                  @signature-clear="(data: { componentIndex: number }) => {
                    console.log('🗑️ SIGNATURE-CLEAR EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Data:', data);
                    handleSignatureClear(data.componentIndex.toString());
                  }"
                  @update-table-header="(headerIndex: number, newHeaderName: string) => {
                    console.log('✏️ UPDATE-TABLE-HEADER EVENT RECEIVED IN FORMBUILDER!');
                    console.log('✏️ Header index:', headerIndex, 'New name:', newHeaderName);
                    console.log('✏️ Component:', component);
                    const originalIndex = getOriginalComponentIndex(component);
                    console.log('✏️ Original component index:', originalIndex);
                    handleUpdateTableHeader(component, originalIndex, headerIndex, newHeaderName);
                  }"
                  @edit-datagrid-component="(componentIndex: number, gridComponent: any) => {
                    console.log('🔧 EDIT-DATAGRID-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Component index:', componentIndex);
                    console.log('🔧 DataGrid component:', gridComponent);
                    handleEditDataGridComponent(component, getOriginalComponentIndex(component), componentIndex, gridComponent);
                  }"
                  @delete-datagrid-component="(componentIndex: number, gridComponent: any) => {
                    console.log('🗑️ DELETE-DATAGRID-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Component index:', componentIndex);
                    console.log('🗑️ DataGrid component:', gridComponent);
                    handleDeleteDataGridComponent(component, getOriginalComponentIndex(component), componentIndex, gridComponent);
                  }"
                  @add-datagrid-column="(dataGridIndex: number) => {
                    console.log('➕ ADD-DATAGRID-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    console.log('➕ DataGrid index:', dataGridIndex);
                    handleAddDataGridColumn(component, getOriginalComponentIndex(component));
                  }"
                  @delete-datagrid-column="(columnIndex: number, gridComponent: any) => {
                    console.log('🗑️ DELETE-DATAGRID-COLUMN EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Column index:', columnIndex, 'Component:', gridComponent);
                    handleDeleteDataGridColumn(component, getOriginalComponentIndex(component), columnIndex);
                  }"
                  @update-datagrid-header="(dataGridIndex: number, columnIndex: number, newHeaderName: string) => {
                    console.log('✏️ UPDATE-DATAGRID-HEADER EVENT RECEIVED IN FORMBUILDER!');
                    console.log('✏️ DataGrid index:', dataGridIndex, 'Column index:', columnIndex, 'New name:', newHeaderName);
                    handleUpdateDataGridHeader(component, getOriginalComponentIndex(component), columnIndex, newHeaderName);
                  }"
                  @add-component-to-datagrid="(newComponent: any) => {
                    console.log('➕ ADD-COMPONENT-TO-DATAGRID EVENT RECEIVED IN FORMBUILDER!');
                    console.log('➕ New component:', newComponent);
                    handleAddComponentToDataGrid(component, getOriginalComponentIndex(component), newComponent);
                  }"
                  @add-component-to-datagrid-row="(rowIndex: number, newComponent: any) => {
                    console.log('➕ ADD-COMPONENT-TO-DATAGRID-ROW EVENT RECEIVED IN FORMBUILDER!');
                    console.log('➕ Row index:', rowIndex, 'New component:', newComponent);
                    handleAddComponentToDataGrid(component, getOriginalComponentIndex(component), newComponent);
                  }"
                  @delete-component-from-datagrid-cell="(data: any) => {
                    console.log('🗑️ DELETE-COMPONENT-FROM-DATAGRID-CELL EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Delete data:', data);
                    handleDeleteComponentFromDataGridCell(component, getOriginalComponentIndex(component), data);
                  }"
                  @add-component-to-datagrid-cell="(data: any) => {
                    console.log('➕ ADD-COMPONENT-TO-DATAGRID-CELL EVENT RECEIVED IN FORMBUILDER!');
                    console.log('➕ Add data:', data);
                    handleAddComponentToDataGridCell(component, getOriginalComponentIndex(component), data);
                  }"
                  @edit-datagrid-cell-component="(data: { rowIndex: number, columnIndex: number, componentIndex: number, component: ComponentDefinition }) => {
                    console.log('🔧 EDIT-DATAGRID-CELL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Data:', data);
                    const formComponent: FormComponent = { ...data.component, key: data.component.key || data.component.type };
                    handleEditDataGridCellComponent(component, getOriginalComponentIndex(component), data.rowIndex, data.componentIndex, formComponent);
                  }"
                  @delete-datagrid-cell-component="(data: { rowIndex: number, columnIndex: number, componentIndex: number, component: ComponentDefinition }) => {
                    console.log('🗑️ DELETE-DATAGRID-CELL-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Data:', data);
                    const formComponent: FormComponent = { ...data.component, key: data.component.key || data.component.type };
                    handleDeleteDataGridCellComponent(component, getOriginalComponentIndex(component), data.rowIndex, data.componentIndex, formComponent);
                  }"
                  @edit-editgrid-component="(data: { componentIndex: number, component: any }) => {
                    console.log('🔧 EDIT-EDITGRID-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Data:', data);
                    const formComponent: FormComponent = { ...data.component, key: data.component.key || data.component.type };
                    handleEditEditGridComponent(component, getOriginalComponentIndex(component), data.componentIndex, formComponent);
                  }"
                  @delete-editgrid-component="(data: { componentIndex: number, component: any }) => {
                    console.log('🗑️ DELETE-EDITGRID-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Data:', data);
                    const formComponent: FormComponent = { ...data.component, key: data.component.key || data.component.type };
                    handleDeleteEditGridComponent(component, getOriginalComponentIndex(component), data.componentIndex, formComponent);
                  }"
                  @add-component-to-editgrid="(data: { component: any }) => {
                    console.log('➕ ADD-COMPONENT-TO-EDITGRID EVENT RECEIVED IN FORMBUILDER!');
                    console.log('➕ Data:', data);
                    if (!data || !data.component) {
                      console.error('❌ Invalid data received for add-component-to-editgrid:', data);
                      showError(t('formBuilder.errorAddingComponent'));
                      return;
                    }
                    const formComponent: FormComponent = { ...data.component, key: data.component.key || data.component.type };
                    handleAddComponentToEditGrid(component, getOriginalComponentIndex(component), formComponent);
                  }"
                  @edit-tab-component="(tabIndex: number, componentIndex: number, emittedComponent: any) => {
                    console.log('🔧 EDIT-TAB-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Args:', { tabIndex, componentIndex, emittedComponent });
                    const formComponent: FormComponent = { ...emittedComponent, key: (emittedComponent as any).key || (emittedComponent as any).type };
                    handleEditTabComponent(component, getOriginalComponentIndex(component), tabIndex, componentIndex, formComponent);
                  }"
                  @delete-tab-component="(tabIndex: number, componentIndex: number, emittedComponent: any) => {
                    console.log('🗑️ DELETE-TAB-COMPONENT EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Args:', { tabIndex, componentIndex, emittedComponent });
                    const formComponent: FormComponent = { ...emittedComponent, key: (emittedComponent as any).key || (emittedComponent as any).type };
                    handleDeleteTabComponent(component, getOriginalComponentIndex(component), tabIndex, componentIndex, formComponent);
                  }"
                  @add-component-to-tab="(data: { tabIndex: number, component: any }) => {
                    console.log('➕ ADD-COMPONENT-TO-TAB EVENT RECEIVED IN FORMBUILDER!');
                    console.log('➕ Data:', data);
                    const formComponent: FormComponent = { ...data.component, key: data.component.key || data.component.type };
                    handleAddComponentToTab(component, getOriginalComponentIndex(component), data.tabIndex, formComponent);
                  }"
                  @add-new-tab="(newTab: any) => handleAddNewTab(component, getOriginalComponentIndex(component), newTab)"
                  @open-add-component-to-tab-modal="(tabIndex: number) => openAddToTabModalHandler(component, tabIndex)"
                  @edit-tab="(tabIndex: number) => {
                    console.log('🔧 EDIT-TAB EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔧 Tab Index:', tabIndex, 'Component:', component);
                    handleEditTab(component, getOriginalComponentIndex(component), tabIndex);
                  }"
                  @update-tab-name="(data: { tabIndex: number, name: string }) => handleUpdateTabName(component, getOriginalComponentIndex(component), data.tabIndex, data.name)"
                  @delete-tab="(tabIndex: number) => {
                    console.log('🗑️ DELETE-TAB EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🗑️ Tab Index:', tabIndex, 'Component:', component);
                    handleDeleteTab(component, getOriginalComponentIndex(component), tabIndex);
                  }"
                  @add-tree-node="(data: { node: any }) => {
                    console.log('🌳 ADD-TREE-NODE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🌳 Data:', data);
                    handleAddTreeNode(component, getOriginalComponentIndex(component), data.node);
                  }"
                  @edit-tree-node="(data: { node: any, component: any }) => {
                    console.log('🌳 EDIT-TREE-NODE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🌳 Node:', data.node, 'Tree component:', data.component);
                    handleEditTreeNode(component, getOriginalComponentIndex(component), data.node, data.component);
                  }"
                  @delete-tree-node="(node: any, treeComponent: any) => {
                    console.log('🌳 DELETE-TREE-NODE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🌳 Node:', node, 'Tree component:', treeComponent);
                    handleDeleteTreeNode(component, getOriginalComponentIndex(component), node, treeComponent);
                  }"
                  @add-tree-child-node="(parentNode: any, treeComponent: any) => {
                    console.log('🌳 ADD-TREE-CHILD-NODE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🌳 Parent node:', parentNode, 'Tree component:', treeComponent);
                    handleAddTreeChildNode(component, getOriginalComponentIndex(component), parentNode, treeComponent);
                  }"
                  @add-survey-question="(question: any, surveyComponent: any) => {
                    console.log('📋 ADD-SURVEY-QUESTION EVENT RECEIVED IN FORMBUILDER!');
                    console.log('📋 Question:', question, 'Survey component:', surveyComponent);
                    handleAddSurveyQuestion(question, surveyComponent);
                  }"
                  @edit-survey-question="(data: { questionIndex: number, question: any }) => {
                    console.log('📋 EDIT-SURVEY-QUESTION EVENT RECEIVED IN FORMBUILDER (NEW)!');
                    console.log('📋 Data:', data);
                    handleEditSurveyQuestionNew(component, getOriginalComponentIndex(component), data.questionIndex, data.question);
                  }"
                  @delete-survey-question="(data: { questionIndex: number, question: any }) => {
                    console.log('📋 DELETE-SURVEY-QUESTION EVENT RECEIVED IN FORMBUILDER!');
                    console.log('📋 Data:', data);
                    handleDeleteSurveyQuestionNew(component, getOriginalComponentIndex(component), data.questionIndex, data.question);
                  }"
                  @open-add-survey-question-modal="() => {
                    console.log('📋 OPEN-ADD-SURVEY-QUESTION-MODAL EVENT RECEIVED IN FORMBUILDER!');
                    openSurveyQuestionModalForComponent(component, getOriginalComponentIndex(component));
                  }"
                  @update-survey-question="(question: any, index: number, surveyComponent: any) => {
                    console.log('📋 UPDATE-SURVEY-QUESTION EVENT RECEIVED IN FORMBUILDER!');
                    console.log('📋 Question:', question, 'Index:', index, 'Survey component:', surveyComponent);
                    handleUpdateSurveyQuestion(question, index, surveyComponent);
                  }"
                  @preview-survey="(surveyComponent: any) => {
                    console.log('📋 PREVIEW-SURVEY EVENT RECEIVED IN FORMBUILDER!');
                    console.log('📋 Survey component:', surveyComponent);
                    handlePreviewSurvey(component, getOriginalComponentIndex(component), surveyComponent);
                  }"
                  @configure-resource="(resourceComponent: any) => {
                    console.log('🔗 CONFIGURE-RESOURCE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔗 Resource component:', resourceComponent);
                    handleConfigureResource(component, getOriginalComponentIndex(component), resourceComponent);
                  }"
                  @refresh-resource="(resourceComponent: any) => {
                    console.log('🔗 REFRESH-RESOURCE EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔗 Resource component:', resourceComponent);
                    handleRefreshResource(component, getOriginalComponentIndex(component), resourceComponent);
                  }"
                  @view-resource-item="(item: any, index: number, resourceComponent: any) => {
                    console.log('🔗 VIEW-RESOURCE-ITEM EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔗 Item:', item, 'Index:', index, 'Resource component:', resourceComponent);
                    handleViewResourceItem(component, getOriginalComponentIndex(component), item, index, resourceComponent);
                  }"
                  @edit-resource-item="(item: any, index: number, resourceComponent: any) => {
                    console.log('🔗 EDIT-RESOURCE-ITEM EVENT RECEIVED IN FORMBUILDER!');
                    console.log('🔗 Item:', item, 'Index:', index, 'Resource component:', resourceComponent);
                    handleEditResourceItem(component, getOriginalComponentIndex(component), item, index, resourceComponent);
                  }"
                />

                <!-- Selected Component Indicator -->
                <div
                  v-if="selectedComponentIndex === getOriginalComponentIndex(component)"
                  class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-5 lg:bottom-2 lg:top-auto"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ $t('formBuilder.selected') }}
                </div>
              </div>

              <!-- Component Controls - Mobile and Desktop -->
              <!-- Mobile Controls - Bottom Bar -->
              <div
                class="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 rounded-b-lg z-30"
              >
                <div class="flex justify-center gap-2">
                  <!-- Move Up Button -->
                  <button
                    @click.stop="moveComponentUp(getOriginalComponentIndex(component))"
                    :disabled="getOriginalComponentIndex(component) === 0"
                    class="flex-1 max-w-14 h-14 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                    :title="$t('formBuilder.moveUp')"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <!-- Move Down Button -->
                  <button
                    @click.stop="moveComponentDown(getOriginalComponentIndex(component))"
                    :disabled="getOriginalComponentIndex(component) === formSchema.components.length - 1"
                    class="flex-1 max-w-14 h-14 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                    :title="$t('formBuilder.moveDown')"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button
                    @click.stop="editComponent(component, getOriginalComponentIndex(component))"
                    class="flex-1 max-w-14 h-14 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                    :title="$t('edit')"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click.stop="duplicateComponent(component, getOriginalComponentIndex(component))"
                    class="flex-1 max-w-16 h-16 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                    :title="$t('duplicate')"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    @click.stop="deleteComponent(getOriginalComponentIndex(component))"
                    class="flex-1 max-w-16 h-16 bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                    :title="$t('delete')"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Desktop Controls - Top Right -->
              <div
                class="hidden lg:block component-controls absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div class="flex gap-1">
                  <!-- Move Up Button -->
                  <button
                    @click.stop="moveComponentUp(getOriginalComponentIndex(component))"
                    :disabled="getOriginalComponentIndex(component) === 0"
                    class="w-8 h-8 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                    :title="$t('formBuilder.moveUp')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <!-- Move Down Button -->
                  <button
                    @click.stop="moveComponentDown(getOriginalComponentIndex(component))"
                    :disabled="getOriginalComponentIndex(component) === formSchema.components.length - 1"
                    class="w-8 h-8 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                    :title="$t('formBuilder.moveDown')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button
                    @click.stop="editComponent(component, getOriginalComponentIndex(component))"
                    class="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                    :title="$t('edit')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click.stop="deleteComponent(getOriginalComponentIndex(component))"
                    class="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                    :title="$t('delete')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Drag Handle -->
              <div
                class="drag-handle absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
              >
                <div
                  class="w-6 h-6 bg-gray-400 rounded flex items-center justify-center text-white"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            </transition-group>
          </div>

          <!-- Drop Indicator -->
          <div
            v-if="isDragOver"
            class="drop-indicator absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center"
          >
            <div class="text-blue-600 font-medium">
              {{ $t('formBuilder.dropHere') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Properties Panel -->
      <div class="properties-panel w-full lg:w-80 bg-white border-l overflow-y-auto h-full">
        <div class="p-4">
          <div class="flex items-center gap-2 mb-4">
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-700">
              {{ $t('formBuilder.propertiesLabel') }}
            </h3>
          </div>

          <!-- Component Properties Editor -->
          <div v-if="selectedComponent && (selectedComponentIndex >= 0 || selectedComponentPath)">
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center gap-2 text-blue-700">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">{{
                  selectedComponent.label || $t(`formBuilder.componentLabels.${selectedComponent.type}`) || selectedComponent.type
                }}</span>
              </div>
              <p class="text-xs text-blue-600 mt-1">{{ $t('formBuilder.editingComponent') }}</p>
            </div>

            <ComponentPropertiesEditor
              v-if="selectedComponent"
              :key="`${selectedComponentIndex}-${tabEditIndexComputed ?? 'gen'}`"
              :component="selectedComponent"
              :tabEditIndex="tabEditIndexComputed"
              @update="updateSelectedComponent"
              @tree-node-update="handleTreeNodeUpdate"
            />
          </div>

          <!-- No Component Selected Message -->
          <div v-else class="text-center py-8">
            <div class="mb-4">
              <svg
                class="w-16 h-16 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
            <h4 class="text-gray-500 font-medium mb-2">
              {{ $t('formBuilder.noComponentSelected') }}
            </h4>
            <p class="text-gray-400 text-sm">{{ $t('formBuilder.selectComponentToEdit') }}</p>

            <!-- Quick Actions -->
            <div class="mt-6 space-y-2">
              <button
                @click="showMobileComponents = true"
                class="lg:hidden w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {{ $t('formBuilder.addComponent') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add-to-Tab Modal -->
    <div
      v-if="showAddToTabModal"
      class="fixed inset-0 z-[2000] flex items-center justify-center"
      @click.self="closeAddToTabModal"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/30"></div>

      <!-- Modal Panel -->
      <div class="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[85vh] overflow-hidden z-[2001]">
        <div class="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
          <h3 class="text-base sm:text-lg font-semibold text-gray-800">
            {{ $t('formBuilder.addComponent') }}
          </h3>
          <button @click="closeAddToTabModal" class="p-2 rounded hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-4 sm:p-6 overflow-y-auto" style="max-height: 70vh;">
          <div class="space-y-6">
            <div v-for="category in componentCategories" :key="category.name" class="">
              <div class="mb-2 flex items-center justify-between">
                <div class="text-sm sm:text-base font-semibold text-gray-700">{{ getCategoryText(category.name) }}</div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  v-for="comp in category.components"
                  :key="comp.type"
                  @click="selectComponentForTab(comp)"
                  class="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span class="shrink-0" v-html="comp.icon"></span>
                  <span class="text-sm font-medium text-gray-800">{{ getComponentLabel(comp.type) }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 sm:px-6 py-3 border-t flex justify-end gap-2">
          <button @click="closeAddToTabModal" class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">
            {{ $t('common.cancel') || 'Cancel' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Tab Properties Modal -->
    <div
      v-if="showEditTabModal"
      class="fixed inset-0 z-[2000] flex items-center justify-center"
      @click.self="closeEditTabModal"
    >
      <div class="absolute inset-0 bg-black/30"></div>

      <div class="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-md z-[2001]">
        <div class="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
          <h3 class="text-base sm:text-lg font-semibold text-gray-800">
            {{ $t('formBuilder.editTab') || 'Edit Tab' }}
          </h3>
          <button @click="closeEditTabModal" class="p-2 rounded hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-4 sm:p-6 space-y-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {{ $t('formBuilder.properties.label') || 'Label' }}
            </label>
            <input
              v-model="editTabForm.label"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {{ $t('formBuilder.properties.key') || 'Key' }}
            </label>
            <input
              v-model="editTabForm.key"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="px-4 sm:px-6 py-3 border-t flex justify-end gap-2">
          <button @click="closeEditTabModal" class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">
            {{ $t('common.cancel') || 'Cancel' }}
          </button>
          <button @click="saveEditTab" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            {{ $t('common.save') || 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Survey Question Modal -->
  <SurveyQuestionModal
    :is-open="showSurveyQuestionModal"
    :question="editingSurveyQuestion"
    :is-editing="isEditingSurveyQuestion"
    @close="closeSurveyQuestionModal"
    @save="saveSurveyQuestion"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import ComponentPropertiesEditor from './ComponentPropertiesEditor.vue'
import ComponentPreview from './ComponentPreview.vue'
import FormSectionManager from './FormSectionManager.vue'
import FormStepper from './FormStepper.vue'
import SurveyQuestionModal from './SurveyQuestionModal.vue'
import { isRTLSync } from '../i18n'
import { useFormsStore } from '../stores/forms'
import { useAuthStore } from '../stores/auth'
import { useNotifications } from '../composables/useNotifications'

// Define component emits
const emit = defineEmits<{
  'form-updated': [schema: any]
}>()

// Initialize notifications
const { success, error: showError } = useNotifications()

// Types
interface FormComponent {
  type: string
  key: string
  label: string
  input?: boolean
  placeholder?: string
  required?: boolean
  validate?: any
  conditional?: any
  [key: string]: any
}

interface FormSection {
  id: string
  title: string
  componentIds: string[]
  order: number
}

interface FormSchema {
  id?: number
  title: string
  name: string
  path: string
  components: FormComponent[]
  sections?: FormSection[]
  settings?: any
}

interface ComponentDefinition {
  type: string
  key?: string
  label: string
  icon: string
  description: string
  defaultConfig?: Partial<FormComponent>
  required?: boolean
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  backgroundColor?: string
}

interface TableCell {
  components: FormComponent[]
}

interface TableRow {
  cells: TableCell[]
}

// Composables
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const formsStore = useFormsStore()
const authStore = useAuthStore()

// Reactive state
const formSchema = ref<FormSchema>({
  title: '',
  name: '',
  path: '',
  components: [],
  sections: [],
})
const selectedComponent = ref<FormComponent | null>(null)
const selectedComponentIndex = ref<number>(-1)
const searchTerm = ref('')
const showMobileComponents = ref(false)
const showSectionManager = ref(false)
const showStepper = ref(false)
const currentSectionIndex = ref(0)
const isDesktop = ref(true)
// Track nested component location for proper editing
const selectedComponentPath = ref<{
  containerIndex: number
  columnIndex?: number
  componentIndex?: number
  path: string
  containerType?: string
  rowIndex?: number
  cellIndex?: number
  tabIndex?: number
} | null>(null)
const saving = ref(false)
const isDragOver = ref(false)
const loading = ref(false)
const isEditMode = ref(false)
const isPublicForm = ref(false)

// Tab context for adding components - using a ref for proper reactivity in template
const currentTabContext = ref<{
  tabIndex: number
  tabsComponent: FormComponent | null
  tabsComponentIndex: number
} | null>(null)

// Local modal state for adding components into a tab
const showAddToTabModal = ref(false)

// When a component is picked from the modal, add it to the current tab
const selectComponentForTab = (componentDef: ComponentDefinition) => {
  addComponent(componentDef)
  showAddToTabModal.value = false
}
const closeAddToTabModal = () => {
  showAddToTabModal.value = false
  currentTabContext.value = null
}

// Open add-to-tab modal and store context
const openAddToTabModalHandler = (tabsComponent: FormComponent, tabIndex: number) => {
  try {
    currentTabContext.value = {
      tabIndex,
      tabsComponent,
      tabsComponentIndex: getOriginalComponentIndex(tabsComponent)
    }
    showAddToTabModal.value = true
  } catch (e) {
    console.error('❌ Error opening add-to-tab modal:', e)
  }
}

// ===== Tab Edit Modal State =====
const showEditTabModal = ref(false)
const editTabForm = ref<{ label: string; key: string }>({ label: '', key: '' })
const currentTabEditContext = ref<{ tabsComponent: FormComponent; tabsIndex: number; tabIndex: number } | null>(null)
const tabEditIndexComputed = computed<number | null>(() => currentTabEditContext.value ? currentTabEditContext.value.tabIndex : null)

// ===== Survey Question Modal State =====
const showSurveyQuestionModal = ref(false)
const editingSurveyQuestion = ref<any>(null)
const isEditingSurveyQuestion = ref(false)
const currentSurveyContext = ref<{ surveyComponent: FormComponent; surveyIndex: number; questionIndex?: number } | null>(null)

// Survey Question Modal Handlers
const closeSurveyQuestionModal = () => {
  showSurveyQuestionModal.value = false
  editingSurveyQuestion.value = null
  isEditingSurveyQuestion.value = false
  currentSurveyContext.value = null
}

const saveSurveyQuestion = (question: any) => {
  console.log('📋 Saving survey question:', question)

  if (!currentSurveyContext.value) {
    console.error('❌ No survey context available')
    return
  }

  const { surveyIndex, questionIndex } = currentSurveyContext.value

  try {
    const targetSurvey = formSchema.value.components[surveyIndex]
    if (!targetSurvey || targetSurvey.type !== 'survey') {
      console.error('❌ Target Survey not found')
      return
    }

    // Initialize questions if not exists
    if (!targetSurvey.questions) {
      targetSurvey.questions = []
    }

    if (isEditingSurveyQuestion.value && questionIndex !== undefined) {
      // Update existing question
      targetSurvey.questions[questionIndex] = question
      console.log('✅ Survey question updated')
      success(t('survey.questionUpdated') || 'تم تحديث السؤال بنجاح')
    } else {
      // Add new question
      targetSurvey.questions.push(question)
      console.log('✅ Survey question added')
      success(t('survey.questionAdded') || 'تم إضافة السؤال بنجاح')
    }

    // Update the component in formSchema array to trigger reactivity
    const updatedSurvey = JSON.parse(JSON.stringify(targetSurvey))
    formSchema.value.components.splice(surveyIndex, 1, updatedSurvey)

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated')
      window.dispatchEvent(event)
    })

    closeSurveyQuestionModal()

  } catch (error: unknown) {
    console.error('❌ Error saving survey question:', error)
    showError(t('survey.errorSavingQuestion') || 'خطأ في حفظ السؤال')
  }
}

// Section and Stepper state
const sectionManagerRef = ref<InstanceType<typeof FormSectionManager> | null>(null)

// Reactive window width
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

// Update window width on resize
if (typeof window !== 'undefined') {
  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
  }

  window.addEventListener('resize', updateWindowWidth)

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
  })
}

// Component definitions organized by categories
const componentCategories = [
  {
    name: 'Basic',
    components: [
      { type: 'textfield', label: 'Text Field', description: 'Single line text input field', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>' },
      { type: 'textarea', label: 'Text Area', description: 'Multi-line text input field', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>' },
      { type: 'number', label: 'Number', description: 'Numeric input field with validation', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>' },
      { type: 'email', label: 'Email', description: 'Email address input with validation', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>' },
      { type: 'password', label: 'Password', description: 'Secure password input field', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>' },
      { type: 'select', label: 'Select', description: 'Dropdown selection field', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>' },
      { type: 'radio', label: 'Radio', description: 'Single choice radio buttons', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
      { type: 'checkbox', label: 'Checkbox', description: 'Multiple choice checkboxes', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
      { type: 'button', label: 'Button', description: 'Action button component', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>' }
    ]
  },
  {
    name: 'Layout',
    components: [
      { type: 'columns', label: 'Columns', description: 'Multi-column layout container', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>' },
      { type: 'panel', label: 'Panel', description: 'Collapsible content panel', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H3m16 14H5"></path></svg>' },
      { type: 'fieldset', label: 'Fieldset', description: 'Grouped form fields container', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>' },
      { type: 'table', label: 'Table', description: 'Data table with rows and columns', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h12a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1z"></path></svg>' },
      { 
        type: 'tabs', 
        label: 'Tabs', 
        description: 'Tabbed content container',
        icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707L16.586 6.586A1 1 0 0015.879 6H14V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4.121a1 1 0 00-.707.293L1.293 8.414A1 1 0 001 9.121V19a2 2 0 002 2z"></path></svg>',
        defaultConfig: {
          input: false,
          tableView: false,
          components: [
            {
              label: 'الاسم',
              key: 'tab1',
              components: []
            },
            {
              label: 'العمر', 
              key: 'tab2',
              components: []
            }
          ]
        }
      },
      { type: 'well', label: 'Well', description: 'Styled content well container', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H3m16 14H5"></path></svg>' },
      { type: 'htmlelement', label: 'HTML Element', description: 'Custom HTML element', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>' },
      { type: 'content', label: 'Content', description: 'Static content display', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>' }
    ]
  },
  {
    name: 'Data',
    components: [
      { type: 'hidden', label: 'Hidden', description: 'Hidden field for storing data', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>' },
      { type: 'datagrid', label: 'Data Grid', description: 'Editable data grid with rows and columns', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm0 0V9a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>' },
      { type: 'editgrid', label: 'Edit Grid', description: 'Editable grid for managing data entries', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>' }
    ]
  },
  {
    name: 'Premium',
    components: [
      { type: 'signature', label: 'Signature', description: 'حقل التقاط التوقيع الرقمي', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>' },
      { type: 'file', label: 'File', description: 'File upload and attachment field', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>' },
      { type: 'survey', label: 'Survey', description: 'Survey questions and ratings', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>' }
    ]
  }
]

// Computed property for filtered components based on search
const filteredComponents = computed(() => {
  if (!searchTerm.value) {
    return componentCategories
  }

  const searchLower = searchTerm.value.toLowerCase()
  return componentCategories.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.label.toLowerCase().includes(searchLower) ||
      component.type.toLowerCase().includes(searchLower)
    )
  })).filter(category => category.components.length > 0)
})

// Computed property for filtered form components (for the main form area)
const filteredFormComponents = computed(() => {
  if (!formSchema.value.components) {
    return []
  }

  // If sections are enabled, filter components by current section
  if (showSectionManager.value || showStepper.value) {
    if (!formSchema.value.sections || formSchema.value.sections.length === 0) {
      return []
    }

    const currentSection = formSchema.value.sections[currentSectionIndex.value]
    if (!currentSection || !currentSection.componentIds) {
      return []
    }

    return formSchema.value.components.filter(component =>
      currentSection.componentIds.includes(component.key)
    )
  }

  // Return all components if sections are not enabled
  return formSchema.value.components
})

// Computed property to determine if components should be visible
const shouldShowComponents = computed(() => {
  // Always show on desktop (lg and above)
  if (windowWidth.value >= 1024) {
    return true
  }
  // On mobile, show palette only when toggled
  return showMobileComponents.value
})

// Helper functions for component categories
const getCategoryIconClass = (categoryName: string) => {
  const iconClasses = {
    'Basic': 'bg-gradient-to-br from-blue-500 to-blue-600',
    'Layout': 'bg-gradient-to-br from-green-500 to-green-600',
    'Data': 'bg-gradient-to-br from-purple-500 to-purple-600',
    'Premium': 'bg-gradient-to-br from-orange-500 to-orange-600'
  }
  return iconClasses[categoryName as keyof typeof iconClasses] || 'bg-gradient-to-br from-gray-500 to-gray-600'
}

// Alias for template compatibility
const getComponentIconClass = getCategoryIconClass


// Function to get component label by type using i18n
const getComponentLabel = (componentType: string) => {
  // Use i18n translation system for component labels
  const translationKey = `formBuilder.componentLabels.${componentType}`
  const translatedLabel = t(translationKey)

  // If translation exists and is not the same as the key, return it
  if (translatedLabel && translatedLabel !== translationKey) {
    return translatedLabel
  }

  // Fallback: Find the component in all categories
  for (const category of componentCategories) {
    const component = category.components.find(comp => comp.type === componentType)
    if (component) {
      return component.label
    }
  }

  // Final fallback to type if not found
  return componentType
}

// Function to get component description by type using i18n
const getComponentDescription = (componentType: string) => {
  // Use i18n translation system for component descriptions
  const translationKey = `formBuilder.componentDescriptions.${componentType}`
  const translatedDescription = t(translationKey)

  // If translation exists and is not the same as the key, return it
  if (translatedDescription && translatedDescription !== translationKey) {
    return translatedDescription
  }

  // Fallback to component type
  return componentType
}

// Helpers: generate a unique, slugified key across the entire form
const slugifyKey = (str: string) => {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const collectAllKeys = (): Set<string> => {
  const keys = new Set<string>()
  const visit = (node: any) => {
    if (!node || typeof node !== 'object') return
    if (node.key && typeof node.key === 'string') keys.add(node.key)
    if (Array.isArray(node.components)) node.components.forEach(visit)
    if (Array.isArray(node.columns)) node.columns.forEach((col: any) => visit({ components: col.components }))
    if (Array.isArray(node.rows)) {
      node.rows.forEach((row: any) => {
        if (Array.isArray(row.cells)) row.cells.forEach((cell: any) => visit({ components: cell.components }))
      })
    }
  }
  if (formSchema.value && Array.isArray(formSchema.value.components)) {
    formSchema.value.components.forEach(visit)
  }
  return keys
}

const ensureUniqueKey = (base: string): string => {
  const allKeys = collectAllKeys()
  let candidate = slugifyKey(base || 'component')
  if (!allKeys.has(candidate)) return candidate
  let i = 1
  while (allKeys.has(`${candidate}-${i}`)) i++
  return `${candidate}-${i}`
}

const getCategoryText = (categoryName: string) => {
  // Use i18n translation system for category names
  const translationKey = `componentCategories.${categoryName}`
  const translatedCategory = t(translationKey)

  // If translation exists and is not the same as the key, return it
  if (translatedCategory && translatedCategory !== translationKey) {
    return translatedCategory
  }

  // Fallback to original category name
  return categoryName
}

// Function to get original component index in the form schema
const getOriginalComponentIndex = (component: any) => {
  if (!formSchema.value.components) {
    return -1
  }

  return formSchema.value.components.findIndex((comp: any) => {
    // Try to match by key first (most reliable)
    if (component.key && comp.key) {
      return comp.key === component.key
    }

    // Fallback to matching by reference
    return comp === component
  })
}

// Component Reordering Functions
const moveComponentUp = (componentIndex: number) => {
  try {
    if (componentIndex <= 0 || !formSchema.value.components) {
      console.log('❌ Cannot move component up: already at top or no components')
      return
    }

    console.log('⬆️ Moving component up from index:', componentIndex)

    // Create a copy of the components array
    const components = [...formSchema.value.components]

    // Swap components
    const temp = components[componentIndex]
    components[componentIndex] = components[componentIndex - 1]
    components[componentIndex - 1] = temp

    // Update the form schema
    formSchema.value.components = components

    // Update selected component index if needed
    if (selectedComponentIndex.value === componentIndex) {
      selectedComponentIndex.value = componentIndex - 1
    } else if (selectedComponentIndex.value === componentIndex - 1) {
      selectedComponentIndex.value = componentIndex
    }

    console.log('✅ Component moved up successfully')

    // Emit form updated event
    emit('form-updated', formSchema.value)
  } catch (error) {
    console.error('❌ Error moving component up:', error)
  }
}


const moveComponentDown = (componentIndex: number) => {
  try {
    if (!formSchema.value.components || componentIndex >= formSchema.value.components.length - 1) {
      console.log('❌ Cannot move component down: already at bottom or no components')
      return
    }

    console.log('⬇️ Moving component down from index:', componentIndex)

    // Create a copy of the components array
    const components = [...formSchema.value.components]

    // Swap components
    const temp = components[componentIndex]
    components[componentIndex] = components[componentIndex + 1]
    components[componentIndex + 1] = temp

    // Update the form schema
    formSchema.value.components = components

    // Update selected component index if needed
    if (selectedComponentIndex.value === componentIndex) {
      selectedComponentIndex.value = componentIndex + 1
    } else if (selectedComponentIndex.value === componentIndex + 1) {
      selectedComponentIndex.value = componentIndex
    }

    console.log('✅ Component moved down successfully')

    // Emit form updated event
    emit('form-updated', formSchema.value)
  } catch (error) {
    console.error('❌ Error moving component down:', error)
  }
}

// Mobile component toggle function
const toggleMobileComponents = () => {
  showMobileComponents.value = !showMobileComponents.value
}

// Component Reordering Drag and Drop Functions
let draggedComponentIndex = ref<number>(-1)
let dropTargetIndex = ref<number>(-1)

const handleComponentDragStart = (event: DragEvent, component: any, componentIndex: number) => {
  console.log('🎯 Starting drag for component:', component.type, 'at index:', componentIndex)
  draggedComponentIndex.value = componentIndex

  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', componentIndex.toString())
    event.dataTransfer.effectAllowed = 'move'
    // Add visual feedback
    event.dataTransfer.setDragImage(event.target as Element, 0, 0)
  }
}

const handleComponentDragOver = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dropTargetIndex.value = targetIndex
}

const handleComponentDragEnter = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  dropTargetIndex.value = targetIndex
}

const handleComponentDragLeave = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  // Only clear if we're actually leaving the component
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    if (dropTargetIndex.value === targetIndex) {
      dropTargetIndex.value = -1
    }
  }
}

const handleComponentDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()

  const sourceIndex = draggedComponentIndex.value
  console.log('🎯 Dropping component from index:', sourceIndex, 'to index:', targetIndex)

  if (sourceIndex === -1 || sourceIndex === targetIndex) {
    console.log('❌ Invalid drop: same position or invalid source')
    resetDragState()
    return
  }

  try {
    if (!formSchema.value.components) {
      console.log('❌ No components to reorder')
      resetDragState()
      return
    }

    // Create a copy of the components array
    const components = [...formSchema.value.components]

    // Remove the dragged component from its original position
    const [draggedComponent] = components.splice(sourceIndex, 1)

    // Insert the component at the new position
    components.splice(targetIndex, 0, draggedComponent)

    // Update the form schema
    formSchema.value.components = components

    // Update selected component index if needed
    if (selectedComponentIndex.value === sourceIndex) {
      selectedComponentIndex.value = targetIndex
    } else if (selectedComponentIndex.value > sourceIndex && selectedComponentIndex.value <= targetIndex) {
      selectedComponentIndex.value = selectedComponentIndex.value - 1
    } else if (selectedComponentIndex.value < sourceIndex && selectedComponentIndex.value >= targetIndex) {
      selectedComponentIndex.value = selectedComponentIndex.value + 1
    }

    console.log('✅ Component reordered successfully')

    // Emit form updated event
    emit('form-updated', formSchema.value)
  } catch (error) {
    console.error('❌ Error reordering component:', error)
  }

  resetDragState()
}

const resetDragState = () => {
  draggedComponentIndex.value = -1
  dropTargetIndex.value = -1
}

// Original Drag and Drop Functions (for adding new components)
const handleDragStart = (event: DragEvent, component: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(component))
    event.dataTransfer.effectAllowed = 'copy'
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
  isDragOver.value = true
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  // Only set to false if we're leaving the drop zone entirely
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  ) {
    isDragOver.value = false
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  try {
    const componentData = event.dataTransfer?.getData('application/json')
    if (componentData) {
      const component = JSON.parse(componentData)
      onDrop(component)
    }
  } catch (error) {
    console.error('Error handling drop:', error)
  }
}

// Generate unique key for components
const generateUniqueKey = (type: string) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${type}_${timestamp}_${random}`
}

// Create component from type with default configuration
const createComponentFromType = (componentType: string): FormComponent | null => {
  try {
    // Basic component configuration based on type
    const baseComponent: Partial<FormComponent> = {
      type: componentType,
      key: generateUniqueKey(componentType),
      label: getComponentLabel(componentType),
      input: true
    }

    // Add type-specific configurations
    switch (componentType) {
      case 'textfield':
        return {
          ...baseComponent,
          placeholder: 'Enter text',
          validate: { required: false }
        } as FormComponent

      case 'textarea':
        return {
          ...baseComponent,
          placeholder: 'Enter text',
          rows: 3,
          validate: { required: false }
        } as FormComponent

      case 'email':
        return {
          ...baseComponent,
          placeholder: 'Enter email',
          validate: { required: false, email: true }
        } as FormComponent

      case 'number':
        return {
          ...baseComponent,
          placeholder: 'Enter number',
          validate: { required: false }
        } as FormComponent

      case 'checkbox':
        return {
          ...baseComponent,
          input: true,
          defaultValue: false
        } as FormComponent

      case 'select':
        return {
          ...baseComponent,
          data: {
            values: [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' }
            ]
          },
          validate: { required: false }
        } as FormComponent

      case 'radio':
        return {
          ...baseComponent,
          values: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' }
          ],
          validate: { required: false }
        } as FormComponent

      case 'date':
        return {
          ...baseComponent,
          format: 'yyyy-MM-dd',
          validate: { required: false }
        } as FormComponent

      case 'time':
        return {
          ...baseComponent,
          format: 'HH:mm',
          validate: { required: false }
        } as FormComponent

      case 'datetime':
        return {
          ...baseComponent,
          format: 'yyyy-MM-dd HH:mm',
          validate: { required: false }
        } as FormComponent

      case 'file':
        return {
          ...baseComponent,
          storage: 'base64',
          validate: { required: false }
        } as FormComponent

      case 'button':
        return {
          ...baseComponent,
          input: false,
          action: 'submit',
          theme: 'primary'
        } as FormComponent

      case 'hidden':
        return {
          ...baseComponent,
          input: true,
          defaultValue: ''
        } as FormComponent

      case 'content':
        return {
          ...baseComponent,
          input: false,
          html: '<p>Content goes here</p>'
        } as FormComponent

      case 'htmlelement':
        return {
          ...baseComponent,
          input: false,
          tag: 'div',
          content: '<p>HTML content</p>',
          className: '',
          attrs: []
        } as FormComponent

      // Container components
      case 'panel':
        return {
          ...baseComponent,
          input: false,
          title: getComponentLabel(componentType),
          components: []
        } as FormComponent

      case 'fieldset':
        return {
          ...baseComponent,
          input: false,
          legend: getComponentLabel(componentType),
          components: []
        } as FormComponent

      case 'well':
        return {
          ...baseComponent,
          input: false,
          components: []
        } as FormComponent

      case 'container':
        return {
          ...baseComponent,
          input: false,
          components: []
        } as FormComponent

      case 'columns':
        return {
          ...baseComponent,
          input: false,
          columns: [
            { width: 6, components: [] },
            { width: 6, components: [] }
          ]
        } as FormComponent

      case 'table':
        return {
          ...baseComponent,
          input: false,
          numCols: 2,
          rows: [
            {
              cells: [
                { components: [] },
                { components: [] }
              ]
            },
            {
              cells: [
                { components: [] },
                { components: [] }
              ]
            }
          ]
        } as FormComponent

      case 'tabs':
        return {
          ...baseComponent,
          input: false,
          components: [
            {
              label: 'Tab 1',
              key: generateUniqueKey('tab'),
              components: []
            },
            {
              label: 'Tab 2',
              key: generateUniqueKey('tab'),
              components: []
            }
          ]
        } as FormComponent

      case 'datagrid':
        return {
          ...baseComponent,
          input: true,
          components: [],
          defaultValue: [{ _isEmpty: true, _components: [] }]
        } as FormComponent

      case 'editgrid':
        return {
          ...baseComponent,
          input: true,
          components: [],
          templates: {}
        } as FormComponent

      case 'tree':
        return {
          ...baseComponent,
          input: true,
          data: { tree: [] },
          validate: { required: false }
        } as FormComponent

      case 'survey':
        return {
          ...baseComponent,
          input: true,
          // Provide a starter question so the preview works out of the box
          questions: [
            {
              id: generateUniqueKey('question'),
              key: 'question1',
              type: 'radio',
              label: 'سؤال 1',
              description: '',
              values: [
                { label: 'خيار 1', value: 'option1' },
                { label: 'خيار 2', value: 'option2' }
              ],
              validate: { required: false }
            }
          ],
          validate: { required: false }
        } as FormComponent

      case 'resource':
        return {
          ...baseComponent,
          input: true,
          data: [],
          validate: { required: false }
        } as FormComponent

      case 'signature':
        return {
          ...baseComponent,
          input: true,
          width: 400,
          height: 150,
          strokeColor: '#000000',
          strokeWidth: 2,
          backgroundColor: '#ffffff',
          validate: { required: false }
        } as FormComponent

      case 'tagpad':
        return {
          ...baseComponent,
          input: true,
          tags: [],
          maxTags: 10,
          validate: { required: false }
        } as FormComponent


      default:
        // Return basic component for unknown types
        return {
          ...baseComponent,
          validate: { required: false }
        } as FormComponent
    }
  } catch (error) {
    console.error('Error creating component from type:', componentType, error)
    return null
  }
}

// Drop handler function
const onDrop = (component: any) => {
  try {
    console.log('📦 Dropping component:', component.type)

    // Create a new component with unique key
    const newComponent: FormComponent = {
      ...component,
      key: generateUniqueKey(component.type),
      label: getComponentLabel(component.type)
    }

    // Add to current section if sections are enabled
    if (formSchema.value.sections && formSchema.value.sections.length > 0) {
      const currentSection = formSchema.value.sections[currentSectionIndex.value]
      if (currentSection) {
        currentSection.componentIds.push(newComponent.key)
      }
    }

    // Add to form components
    formSchema.value.components.push(newComponent)

    console.log('✅ Component added successfully:', newComponent.type)
    success(t('formBuilder.componentAdded'))

  } catch (error) {
    console.error('❌ Error dropping component:', error)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Load a comprehensive demo schema to verify major components/containers quickly
function loadDemoSchema() {
  try {
    const demo: any = {
      title: t('formBuilder.demoTitle') || 'نموذج توضيحي شامل',
      name: 'comprehensive_demo_form',
      display: 'form',
      type: 'form',
      components: [
        // Basic Input Components
        { 
          type: 'textfield', 
          key: 'firstName', 
          label: 'الاسم الأول', 
          input: true, 
          validate: { required: true },
          placeholder: 'أدخل اسمك الأول'
        },
        { 
          type: 'email', 
          key: 'email', 
          label: 'البريد الإلكتروني', 
          input: true,
          validate: { required: true },
          placeholder: 'example@email.com'
        },
        { 
          type: 'password', 
          key: 'password', 
          label: 'كلمة المرور', 
          input: true,
          validate: { required: true, minLength: 6 }
        },
        { 
          type: 'number', 
          key: 'age', 
          label: 'العمر', 
          input: true,
          validate: { min: 18, max: 100 }
        },
        { 
          type: 'textarea', 
          key: 'bio', 
          label: 'نبذة شخصية', 
          input: true,
          rows: 4,
          placeholder: 'اكتب نبذة مختصرة عن نفسك'
        },

        // Selection Components
        { 
          type: 'select', 
          key: 'country', 
          label: 'البلد', 
          input: true,
          data: { 
            values: [
              { label: 'السعودية', value: 'sa' },
              { label: 'الإمارات', value: 'ae' },
              { label: 'مصر', value: 'eg' },
              { label: 'الأردن', value: 'jo' }
            ]
          }
        },
        { 
          type: 'radio', 
          key: 'gender', 
          label: 'الجنس', 
          input: true,
          values: [
            { label: 'ذكر', value: 'male' },
            { label: 'أنثى', value: 'female' }
          ]
        },
        { 
          type: 'checkbox', 
          key: 'interests', 
          label: 'الاهتمامات', 
          input: true,
          values: [
            { label: 'التقنية', value: 'tech' },
            { label: 'الرياضة', value: 'sports' },
            { label: 'الفن', value: 'art' },
            { label: 'السفر', value: 'travel' }
          ]
        },

        // File Upload Component (Available)
        { 
          type: 'file', 
          key: 'profilePicture', 
          label: 'صورة شخصية', 
          input: true,
          fileMaxSize: '5MB',
          fileTypes: [
            { label: 'Image', value: 'image/*' }
          ]
        },

        // Layout Components with Enhanced Structure
        { 
          type: 'columns', 
          key: 'personalInfo', 
          label: 'المعلومات الشخصية', 
          columns: [
            { 
              width: 6, 
              components: [
                { type: 'textfield', key: 'city', label: 'المدينة', input: true, placeholder: 'الرياض' }
              ]
            },
            { 
              width: 6, 
              components: [
                { type: 'textfield', key: 'district', label: 'الحي', input: true, placeholder: 'العليا' }
              ]
            }
          ]
        },

        { 
          type: 'panel', 
          key: 'contactPanel', 
          title: 'معلومات الاتصال', 
          theme: 'primary',
          collapsible: true,
          components: [
            { type: 'email', key: 'workEmail', label: 'بريد العمل', input: true },
            { type: 'textfield', key: 'workPhone', label: 'هاتف العمل', input: true, placeholder: '+966 50 123 4567' },
            { type: 'checkbox', key: 'allowContact', label: 'السماح بالتواصل', input: true }
          ]
        },

        { 
          type: 'tabs', 
          key: 'detailsTabs', 
          components: [
            { 
              label: 'التعليم', 
              key: 'educationTab', 
              components: [
                { type: 'textfield', key: 'university', label: 'الجامعة', input: true },
                { type: 'textfield', key: 'degree', label: 'الدرجة العلمية', input: true },
                { type: 'number', key: 'graduationYear', label: 'سنة التخرج', input: true }
              ]
            },
            { 
              label: 'الخبرة', 
              key: 'experienceTab', 
              components: [
                { type: 'textarea', key: 'workExperience', label: 'الخبرة العملية', input: true, rows: 5 },
                { type: 'select', key: 'experienceLevel', label: 'مستوى الخبرة', input: true, data: { values: [
                  { label: 'مبتدئ', value: 'junior' },
                  { label: 'متوسط', value: 'mid' },
                  { label: 'خبير', value: 'senior' }
                ]}}
              ]
            }
          ]
        },

        // Enhanced Table with proper structure
        { 
          type: 'table', 
          key: 'skillsTable', 
          label: 'جدول المهارات', 
          headers: ['المهارة', 'المستوى', 'سنوات الخبرة'],
          numCols: 3,
          rows: [
            { 
              cells: [
                { components: [{ type: 'textfield', key: 'skill1_name', label: 'المهارة', input: true, defaultValue: 'JavaScript' }] },
                { components: [{ type: 'select', key: 'skill1_level', label: 'المستوى', input: true, data: { values: [
                  { label: 'مبتدئ', value: 'beginner' },
                  { label: 'متوسط', value: 'intermediate' },
                  { label: 'متقدم', value: 'advanced' }
                ]}}] },
                { components: [{ type: 'number', key: 'skill1_years', label: 'السنوات', input: true, defaultValue: 2 }] }
              ]
            },
            { 
              cells: [
                { components: [{ type: 'textfield', key: 'skill2_name', label: 'المهارة', input: true, defaultValue: 'Vue.js' }] },
                { components: [{ type: 'select', key: 'skill2_level', label: 'المستوى', input: true, data: { values: [
                  { label: 'مبتدئ', value: 'beginner' },
                  { label: 'متوسط', value: 'intermediate' },
                  { label: 'متقدم', value: 'advanced' }
                ]}}] },
                { components: [{ type: 'number', key: 'skill2_years', label: 'السنوات', input: true, defaultValue: 1 }] }
              ]
            }
          ]
        },

        // Enhanced DataGrid with proper structure
        { 
          type: 'datagrid', 
          key: 'projects', 
          label: 'المشاريع', 
          input: true,
          addAnother: 'إضافة مشروع آخر',
          defaultValue: [
            { 
              _isEmpty: false,
              _components: [
                { type: 'textfield', key: 'projectName', label: 'اسم المشروع' },
                { type: 'textarea', key: 'projectDesc', label: 'وصف المشروع' },
                { type: 'select', key: 'projectStatus', label: 'حالة المشروع' }
              ],
              projectName: 'نظام إدارة المحتوى',
              projectDesc: 'نظام شامل لإدارة المحتوى باستخدام Vue.js',
              projectStatus: 'completed'
            }
          ]
        },

        // Enhanced EditGrid
        { 
          type: 'editgrid', 
          key: 'certifications', 
          label: 'الشهادات', 
          input: true,
          templates: {
            header: '<div class="row"><div class="col-sm-6">الشهادة</div><div class="col-sm-4">الجهة المانحة</div><div class="col-sm-2">الإجراءات</div></div>',
            row: '<div class="row"><div class="col-sm-6">{{ row.certName }}</div><div class="col-sm-4">{{ row.certProvider }}</div><div class="col-sm-2"><button class="btn btn-sm btn-danger" onclick="removeRow()">حذف</button></div></div>'
          },
          components: [
            { type: 'textfield', key: 'certName', label: 'اسم الشهادة', input: true },
            { type: 'textfield', key: 'certProvider', label: 'الجهة المانحة', input: true },
            { type: 'textfield', key: 'certDate', label: 'تاريخ الحصول', input: true, placeholder: '2024-01-15' }
          ]
        },

        // Container Components

        { 
          type: 'fieldset', 
          key: 'preferences', 
          legend: 'التفضيلات', 
          components: [
            { type: 'radio', key: 'theme', label: 'المظهر المفضل', input: true, values: [
              { label: 'فاتح', value: 'light' },
              { label: 'داكن', value: 'dark' },
              { label: 'تلقائي', value: 'auto' }
            ]},
            { type: 'checkbox', key: 'notifications', label: 'تفعيل الإشعارات', input: true, defaultValue: true }
          ]
        },

        { 
          type: 'well', 
          key: 'infoWell', 
          components: [
            { type: 'content', key: 'welcomeInfo', html: '<div class="alert alert-info"><h4>مرحباً بك!</h4><p>هذا نموذج توضيحي شامل يعرض جميع المكونات المتاحة في منشئ النماذج.</p></div>' }
          ]
        },

        // Advanced Specialized Components
        { 
          type: 'htmlelement', 
          key: 'customHtml', 
          tag: 'div',
          content: '<div class="custom-section"><h3 style="color: #2563eb;">قسم مخصص</h3><p>هذا مثال على عنصر HTML مخصص يمكن تخصيصه بالكامل.</p></div>',
          className: 'p-4 bg-blue-50 rounded-lg border border-blue-200',
          attrs: [
            { name: 'data-section', value: 'custom' },
            { name: 'id', value: 'custom-html-section' }
          ]
        },

        { 
          type: 'signature', 
          key: 'digitalSignature', 
          label: 'التوقيع الرقمي', 
          input: true,
          width: '400',
          height: '150',
          backgroundColor: 'rgb(245,245,245)',
          penColor: 'black'
        },

        // Premium Components (Available)
        { 
          type: 'survey', 
          key: 'satisfactionSurvey', 
          label: 'استطلاع الرضا', 
          input: true,
          questions: [
            {
              id: 'q1',
              question: 'ما مدى رضاك عن الخدمة؟',
              type: 'rating',
              scale: 5
            },
            {
              id: 'q2', 
              question: 'هل تنصح بخدماتنا؟',
              type: 'boolean'
            },
            {
              id: 'q3',
              question: 'اختر أفضل ميزة:',
              type: 'choice',
              choices: ['السرعة', 'الجودة', 'السعر', 'الدعم']
            }
          ]
        },

        // Action Components
        { 
          type: 'button', 
          key: 'submitBtn', 
          label: 'إرسال النموذج', 
          action: 'submit',
          theme: 'primary',
          size: 'md',
          block: false
        }
      ]
    }

    if (!formSchema.value.sections || !Array.isArray(formSchema.value.sections)) {
      formSchema.value.sections = []
    }

    formSchema.value.components.splice(0, formSchema.value.components.length, ...demo.components)
    formSchema.value.title = demo.title
    formSchema.value.name = demo.name

    selectedComponent.value = null
    selectedComponentIndex.value = -1
    selectedComponentPath.value = null as any

    nextTick(() => {
      const evt = new CustomEvent('component-updated')
      window.dispatchEvent(evt)
      success(t('formBuilder.messages.importSuccess') || 'Demo loaded')
    })
  } catch (e) {
    console.error('Error loading demo schema', e)
    showError(t('formBuilder.errors.importFailed') || 'Failed to load demo')
  }
}

/**
 * Update table header - Updated for new structure
 */
const handleUpdateTableHeader = (tableComponent: FormComponent, tableIndex: number, headerIndex: number, newHeaderName: string) => {
  console.log('✏️ Updating table header:', { tableIndex, headerIndex, newHeaderName })
  console.log('✏️ Table component:', tableComponent)

  try {
    // If tableIndex is -1, find the component in the schema
    let actualTableIndex = tableIndex
    if (tableIndex === -1) {
      actualTableIndex = formSchema.value.components.findIndex(comp => comp === tableComponent)
      console.log('✏️ Found actual table index:', actualTableIndex)
    }

    if (actualTableIndex === -1) {
      throw new Error('Table component not found in schema')
    }

    const targetTable = formSchema.value.components[actualTableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      throw new Error('Table component not found or invalid type')
    }

    // Initialize headers array if needed
    if (!targetTable.headers || !Array.isArray(targetTable.headers)) {
      targetTable.headers = [`${t('submissions.table.defaultColumn')} 1`, `${t('submissions.table.defaultColumn')} 2`]
    }

    // Ensure we have enough headers
    while (targetTable.headers.length <= headerIndex) {
      targetTable.headers.push(`${t('submissions.table.defaultColumn')} ${targetTable.headers.length + 1}`)
    }

    // Update the specific header
    targetTable.headers[headerIndex] = newHeaderName || `${t('submissions.table.defaultColumn')} ${headerIndex + 1}`

    // Deep copy and update for Vue reactivity
    const updatedTable = JSON.parse(JSON.stringify(targetTable))
    formSchema.value.components.splice(actualTableIndex, 1, updatedTable)
    formSchema.value = { ...formSchema.value }

    // Emit form updated event
    emit('form-updated', formSchema.value)

    console.log('✅ Table header updated successfully')
    success(t('submissions.table.headerUpdated'))

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          action: 'update-table-header',
          tableIndex: actualTableIndex,
          headerIndex,
          newHeaderName,
          forceRerender: true
        }
      }))
    })

  } catch (error: unknown) {
    console.error('❌ Error updating table header:', error)
    showError(t('formBuilder.errorUpdatingHeader'))
  }
}

// Table Management Functions


/**
 * Add new column to table - Updated for new structure
 */
const handleAddTableColumn = (tableComponent: FormComponent, tableIndex: number) => {
  console.log('➕ Adding new column to Table:', { tableIndex })

  try {
    // Get the target Table component
    const targetTable = formSchema.value.components[tableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      throw new Error('Table component not found')
    }

    // Initialize table structure if needed
    if (!targetTable.headers || !Array.isArray(targetTable.headers)) {
      targetTable.headers = [`${t('submissions.table.defaultColumn')} 1`, `${t('submissions.table.defaultColumn')} 2`]
    }
    if (!targetTable.rows || !Array.isArray(targetTable.rows)) {
      targetTable.rows = []
    }

    // Add new header
    const newColumnIndex = targetTable.headers.length
    targetTable.headers.push(`${t('submissions.table.defaultColumn')} ${newColumnIndex + 1}`)

    // Add new cell to each existing row
    targetTable.rows.forEach((row: any) => {
      if (!row.cells || !Array.isArray(row.cells)) {
        row.cells = []
      }
      row.cells.push({
        components: []
      })
    })

    // If no rows exist, create default rows
    if (targetTable.rows.length === 0) {
      for (let i = 0; i < 2; i++) {
        const newRow: TableRow = {
          cells: []
        }
        for (let j = 0; j < targetTable.headers.length; j++) {
          newRow.cells.push({
            components: []
          } as TableCell)
        }
        targetTable.rows.push(newRow)
      }
    }

    // Deep copy and update for Vue reactivity
    const updatedTable = JSON.parse(JSON.stringify(targetTable))
    formSchema.value.components.splice(tableIndex, 1, updatedTable)
    formSchema.value = { ...formSchema.value }

    emit('form-updated', formSchema.value)

    console.log('✅ Table column added successfully')
    success(t('submissions.table.columnAdded'))

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          action: 'add-table-column',
          tableIndex,
          forceRerender: true
        }
      }))
    })

  } catch (err) {
    console.error('❌ Error adding table column:', err)
    showError(t('submissions.table.errorAddingColumn'))
  }
}

/**
 * Delete table column - Updated for new structure
 */
const handleDeleteTableColumn = (tableComponent: FormComponent, tableIndex: number, columnIndex: number) => {
  console.log('🗑️ Deleting Table column:', { tableIndex, columnIndex })

  try {
    // Get the target Table component
    const targetTable = formSchema.value.components[tableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      throw new Error('Table component not found')
    }

    // Validate table structure
    if (!targetTable.headers || !Array.isArray(targetTable.headers)) {
      throw new Error('Table has no headers')
    }
    if (!targetTable.rows || !Array.isArray(targetTable.rows)) {
      throw new Error('Table has no rows')
    }

    // Don't allow deleting if only one column remains
    if (targetTable.headers.length <= 1) {
      showError(t('submissions.table.cannotDeleteLastColumn'))
      return
    }

    // Remove header
    targetTable.headers.splice(columnIndex, 1)

    // Remove column from each row
    targetTable.rows.forEach((row: any) => {
      if (row.cells && Array.isArray(row.cells) && row.cells.length > columnIndex) {
        row.cells.splice(columnIndex, 1)
      }
    })

    // Deep copy and update for Vue reactivity
    const updatedTable = JSON.parse(JSON.stringify(targetTable))
    formSchema.value.components.splice(tableIndex, 1, updatedTable)
    formSchema.value = { ...formSchema.value }

    emit('form-updated', formSchema.value)

    console.log('✅ Table column deleted successfully')
    success(t('submissions.table.columnDeleted'))

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          action: 'delete-table-column',
          tableIndex,
          columnIndex,
          forceRerender: true
        }
      }))
    })

  } catch (err) {
    console.error('❌ Error deleting table column:', err)
    showError(t('submissions.table.errorDeletingColumn'))
  }
}

/**
 * Add new row to table - Updated for new structure
 */
const handleAddTableRow = (tableComponent: FormComponent, tableIndex: number) => {
  console.log('➕ Adding new row to Table:', { tableIndex })

  try {
    // Get the target Table component
    const targetTable = formSchema.value.components[tableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      throw new Error('Table component not found')
    }

    // Initialize table structure if needed
    if (!targetTable.headers || !Array.isArray(targetTable.headers)) {
      targetTable.headers = [`${t('submissions.table.defaultColumn')} 1`, `${t('submissions.table.defaultColumn')} 2`]
    }
    if (!targetTable.rows || !Array.isArray(targetTable.rows)) {
      targetTable.rows = []
    }

    console.log('🔍 Current table state before adding row:', {
      headersCount: targetTable.headers.length,
      rowsCount: targetTable.rows.length,
      existingRows: targetTable.rows
    })

    // Create new row with proper cell structure
    const newRow: TableRow = {
      cells: []
    }

    // Add empty cells for each column
    for (let i = 0; i < targetTable.headers.length; i++) {
      newRow.cells.push({
        components: []
      } as TableCell)
    }

    // Add the new row to existing rows (preserve existing rows)
    const existingRowsCount = targetTable.rows.length
    targetTable.rows.push(newRow)

    console.log('🔍 After adding row:', {
      previousRowsCount: existingRowsCount,
      newRowsCount: targetTable.rows.length,
      newRowIndex: targetTable.rows.length - 1,
      allRows: targetTable.rows.map((row: TableRow, idx: number) => ({ index: idx, cellsCount: row.cells?.length || 0 }))
    })

    // Enhanced Vue reactivity with multiple update strategies
    const updatedTable = JSON.parse(JSON.stringify(targetTable))

    // Strategy 1: Replace the table component
    formSchema.value.components.splice(tableIndex, 1, updatedTable)

    // Strategy 2: Force formSchema reference update
    formSchema.value = { ...formSchema.value }

    // Strategy 3: Force components array update
    formSchema.value.components = [...formSchema.value.components]

    emit('form-updated', formSchema.value)

    console.log('✅ Table row added successfully - Total rows:', updatedTable.rows.length)
    success(t('submissions.table.rowAdded'))

    // Enhanced UI update with multiple events
    nextTick(() => {
      // Primary update event
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          action: 'add-table-row',
          tableIndex,
          newRowIndex: updatedTable.rows.length - 1,
          totalRows: updatedTable.rows.length,
          forceRerender: true
        }
      }))

      // Secondary table-specific update event
      window.dispatchEvent(new CustomEvent('table-updated', {
        detail: {
          tableIndex,
          action: 'row-added',
          rowCount: updatedTable.rows.length
        }
      }))

      // Delayed additional update for complex reactivity
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('force-table-rerender', {
          detail: { tableIndex }
        }))
      }, 50)
    })

  } catch (err) {
    console.error('❌ Error adding table row:', err)
    showError(t('submissions.table.errorAddingRow'))
  }
}

/**
 * Delete table row - New function for new structure
 */
const handleDeleteTableRow = (tableComponent: FormComponent, tableIndex: number, rowIndex: number) => {
  console.log('🗑️ Deleting Table row:', { tableIndex, rowIndex })

  try {
    // Get the target Table component
    const targetTable = formSchema.value.components[tableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      throw new Error('Table component not found')
    }

    // Validate table structure
    if (!targetTable.rows || !Array.isArray(targetTable.rows)) {
      throw new Error('Table has no rows')
    }

    // Don't allow deleting if only one row remains
    if (targetTable.rows.length <= 1) {
      showError(t('submissions.table.cannotDeleteLastRow'))
      return
    }

    // Remove the row
    targetTable.rows.splice(rowIndex, 1)

    // Deep copy and update for Vue reactivity
    const updatedTable = JSON.parse(JSON.stringify(targetTable))
    formSchema.value.components.splice(tableIndex, 1, updatedTable)
    formSchema.value = { ...formSchema.value }

    emit('form-updated', formSchema.value)

    console.log('✅ Table row deleted successfully')
    success(t('submissions.table.rowDeleted'))

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          action: 'delete-table-row',
          tableIndex,
          rowIndex,
          forceRerender: true
        }
      }))
    })

  } catch (err) {
    console.error('❌ Error deleting table row:', err)
    showError(t('submissions.table.errorDeletingRow'))
  }
}

/**
 * Handle adding component to table cell - Updated for new structure
 */
const handleAddComponentToTableCell = (tableComponent: FormComponent, tableIndex: number, data: any) => {
  console.log('➕ Adding component to Table cell:', {
    tableComponent: tableComponent.type,
    tableIndex,
    data
  })

  try {
    const targetTable = formSchema.value.components[tableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      console.error('❌ Target Table not found')
      return
    }

    const { rowIndex, cellIndex, componentType } = data

    // Initialize table structure with new format
    if (!targetTable.headers || !Array.isArray(targetTable.headers)) {
      targetTable.headers = [`${t('submissions.table.defaultColumn')} 1`, `${t('submissions.table.defaultColumn')} 2`]
    }
    if (!targetTable.rows || !Array.isArray(targetTable.rows)) {
      targetTable.rows = []
    }

    // Ensure we have enough rows
    while (targetTable.rows.length <= rowIndex) {
      const newRow: TableRow = {
        cells: []
      }
      // Add cells for each header
      for (let i = 0; i < targetTable.headers.length; i++) {
        newRow.cells.push({
          components: []
        } as TableCell)
      }
      targetTable.rows.push(newRow)
    }

    // Ensure the target row has proper cell structure
    const targetRow = targetTable.rows[rowIndex]
    if (!targetRow.cells || !Array.isArray(targetRow.cells)) {
      targetRow.cells = []
    }

    // Ensure we have enough cells in the row
    while (targetRow.cells.length <= cellIndex) {
      targetRow.cells.push({
        components: []
      })
    }

    // Validate target cell exists
    const targetCell = targetRow.cells[cellIndex]
    if (!targetCell) {
      console.error('❌ Target cell not found:', { rowIndex, cellIndex })
      return
    }

    // Ensure cell has components array
    if (!targetCell.components || !Array.isArray(targetCell.components)) {
      targetCell.components = []
    }

    // Create new component with unique key
    const newComponent: FormComponent = {
      type: componentType,
      key: generateUniqueKey(componentType),
      label: getComponentLabel(componentType),
      input: true
    }

    console.log('🔧 Adding component to cell:', {
      rowIndex,
      cellIndex,
      component: newComponent
    })

    // Add component to the target cell
    targetCell.components.push(newComponent)

    // Deep copy and update for Vue reactivity
    const updatedTable = JSON.parse(JSON.stringify(targetTable))
    formSchema.value.components.splice(tableIndex, 1, updatedTable)
    formSchema.value = { ...formSchema.value }

    // Emit form updated event
    emit('form-updated', formSchema.value)

    console.log('✅ Component added to table cell successfully')
    success(t('submissions.table.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          action: 'add-table-cell-component',
          tableIndex,
          rowIndex,
          cellIndex,
          componentType,
          forceRerender: true
        }
      }))

      window.dispatchEvent(new CustomEvent('table-cell-updated', {
        detail: {
          tableIndex,
          rowIndex,
          cellIndex,
          componentType,
          action: 'add'
        }
      }))
    })

  } catch (err) {
    console.error('❌ Error adding component to table cell:', err)
    showError(t('submissions.table.errorAddingComponent'))
  }
}



// Handle editing component in column
const handleEditColumnComponent = (columnsComponent: FormComponent, columnsIndex: number, data: { columnIndex: number; componentIndex: number; component: FormComponent }) => {
  try {
    console.log('🔧 Editing column component:', { columnsIndex, data })
    console.log('🔧 Columns component passed:', columnsComponent)
    console.log('🔧 Form schema components:', formSchema.value.components)

    // Extract data from the object parameter
    let columnIndex: number, componentIndex: number, component: FormComponent
    
    console.log('🔧 Raw data received:', data)
    console.log('🔧 Data type:', typeof data)
    console.log('🔧 Data properties:', Object.keys(data || {}))
    console.log('🔧 Data values:', Object.values(data || {}))
    
    // Handle the data extraction more robustly
    if (typeof data === 'object' && data !== null) {
      // Try to extract the values with fallbacks
      const rawColumnIndex = data.columnIndex ?? (data as any)[0]
      const rawComponentIndex = data.componentIndex ?? (data as any)[1] 
      const rawComponent = data.component ?? (data as any)[2]
      
      console.log('🔧 Raw extracted values:', { rawColumnIndex, rawComponentIndex, rawComponent })
      
      // Convert to proper types
      columnIndex = typeof rawColumnIndex === 'number' ? rawColumnIndex : parseInt(String(rawColumnIndex), 10)
      componentIndex = typeof rawComponentIndex === 'number' ? rawComponentIndex : parseInt(String(rawComponentIndex), 10)
      component = rawComponent
      
      console.log('🔧 After type conversion:', { columnIndex, componentIndex, component: component?.type })
      
      // Final validation
      if (isNaN(columnIndex) || isNaN(componentIndex) || !component) {
        console.error('❌ Failed to extract valid data:', { 
          columnIndex, 
          componentIndex, 
          component,
          originalData: data
        })
        throw new Error('Invalid data: could not extract valid columnIndex, componentIndex, or component')
      }
    } else {
      console.error('❌ Invalid data format for handleEditColumnComponent:', data)
      console.error('❌ Expected object with columnIndex, componentIndex, component properties')
      throw new Error('Invalid data format')
    }

    console.log('🔧 Final extracted values:', { columnIndex, componentIndex, componentType: component?.type })

    // Get the target Columns component
    const targetColumns = formSchema.value.components[columnsIndex]
    console.log('🔧 Target columns at index', columnsIndex, ':', targetColumns)
    
    if (!targetColumns || targetColumns.type !== 'columns') {
      console.error('❌ Columns component not found or wrong type:', { targetColumns, columnsIndex, type: targetColumns?.type })
      throw new Error('Columns component not found')
    }

    console.log('🔧 Target columns structure:', JSON.stringify(targetColumns, null, 2))
    console.log('🔧 Columns array:', targetColumns.columns)
    console.log('🔧 Requested columnIndex:', columnIndex)
    console.log('🔧 Available column indices:', targetColumns.columns ? Object.keys(targetColumns.columns) : 'No columns')

    // Validate column and component indices
    if (!targetColumns.columns || !targetColumns.columns[columnIndex]) {
      console.error('❌ Column not found at index', columnIndex, ':', {
        hasColumns: !!targetColumns.columns,
        columnsLength: targetColumns.columns?.length,
        columnIndex,
        availableColumns: targetColumns.columns
      })
      throw new Error('Column not found')
    }

    if (!targetColumns.columns[columnIndex].components || !targetColumns.columns[columnIndex].components[componentIndex]) {
      throw new Error('Component not found in column')
    }

    // Set up the selected component for editing
    selectedComponent.value = { ...component }
    selectedComponentIndex.value = -1 // Not a root component
    selectedComponentPath.value = {
      containerIndex: columnsIndex,
      columnIndex: columnIndex,
      componentIndex: componentIndex,
      path: `columns.${columnIndex}.components.${componentIndex}`,
      containerType: 'columns'
    }

    console.log('✅ Column component selected for editing')
    success(t('formBuilder.componentSelected'))

  } catch (err) {
    console.error('❌ Error editing column component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Handle deleting component from column
const handleDeleteColumnComponent = (columnsComponent: FormComponent, columnsIndex: number, data: { columnIndex: number; componentIndex: number; component: FormComponent }) => {
  try {
    console.log('🗑️ Deleting column component:', { columnsIndex, data })

    // Extract data from the object parameter
    let columnIndex: number, componentIndex: number, component: FormComponent
    
    // Ensure we're working with the correct data structure
    if (typeof data === 'object' && data !== null && 'columnIndex' in data) {
      columnIndex = Number(data.columnIndex)
      componentIndex = Number(data.componentIndex)
      component = data.component
    } else {
      console.error('❌ Invalid data format for handleDeleteColumnComponent:', data)
      throw new Error('Invalid data format')
    }

    // Validate extracted values
    if (isNaN(columnIndex) || isNaN(componentIndex)) {
      console.error('❌ Invalid indices:', { columnIndex, componentIndex })
      throw new Error('Invalid column or component index')
    }

    console.log('🗑️ Extracted values:', { columnIndex, componentIndex, componentType: component?.type })

    // Get the target Columns component
    const targetColumns = formSchema.value.components[columnsIndex]
    if (!targetColumns || targetColumns.type !== 'columns') {
      throw new Error('Columns component not found')
    }

    // Validate column and component indices
    if (!targetColumns.columns || !targetColumns.columns[columnIndex]) {
      throw new Error('Column not found')
    }

    if (!targetColumns.columns[columnIndex].components || !targetColumns.columns[columnIndex].components[componentIndex]) {
      throw new Error('Component not found in column')
    }

    // Remove the component from the column
    targetColumns.columns[columnIndex].components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedColumns = JSON.parse(JSON.stringify(targetColumns))
    formSchema.value.components.splice(columnsIndex, 1, updatedColumns)

    // Clear selection if the deleted component was selected
    if (selectedComponentPath.value &&
        selectedComponentPath.value.containerIndex === columnsIndex &&
        selectedComponentPath.value.columnIndex === columnIndex &&
        selectedComponentPath.value.componentIndex === componentIndex) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Remove from sections if it exists there
    if (formSchema.value.sections) {
      formSchema.value.sections.forEach(section => {
        if (section.componentIds) {
          const componentIndex = section.componentIds.findIndex(id => id === component.key)
          if (componentIndex !== -1) {
            section.componentIds.splice(componentIndex, 1)
          }
        }
      })
    }

    console.log('✅ Column component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error deleting column component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Handle adding component to column
const handleAddComponentToColumn = (columnsComponent: FormComponent, columnsIndex: number, columnIndex: number, componentType: string) => {
  try {
    console.log('🔥 Adding component to column:', { columnsIndex, columnIndex, componentType })

    // Get the target Columns component
    const targetColumns = formSchema.value.components[columnsIndex]
    if (!targetColumns || targetColumns.type !== 'columns') {
      console.error('❌ Columns component not found:', { targetColumns, columnsIndex })
      throw new Error('Columns component not found')
    }

    // Debug: Log the columns structure
    console.log('🔍 Target columns structure:', targetColumns)
    console.log('🔍 Available columns:', targetColumns.columns)
    console.log('🔍 Column index requested:', columnIndex)
    console.log('🔍 Columns array length:', targetColumns.columns ? targetColumns.columns.length : 'undefined')

    // Initialize columns array if it doesn't exist
    if (!targetColumns.columns || !Array.isArray(targetColumns.columns)) {
      console.log('🔧 Columns array not found, initializing default columns structure')
      targetColumns.columns = [
        { width: 6, components: [] },
        { width: 6, components: [] }
      ]
      console.log('🔧 Default columns created:', targetColumns.columns)
    }

    // Validate column index
    if (columnIndex < 0 || columnIndex >= targetColumns.columns.length) {
      console.error('❌ Column index out of bounds:', { 
        columnIndex, 
        availableColumns: targetColumns.columns.length,
        columns: targetColumns.columns 
      })
      throw new Error(`Column index ${columnIndex} out of bounds. Available columns: ${targetColumns.columns.length}`)
    }

    // Validate specific column exists
    if (!targetColumns.columns[columnIndex]) {
      console.error('❌ Column at index not found:', { 
        columnIndex, 
        column: targetColumns.columns[columnIndex] 
      })
      throw new Error('Column not found')
    }

    // Create new component based on type
    const newComponent = createComponentFromType(componentType)
    if (!newComponent) {
      throw new Error('Failed to create component')
    }

    // Initialize components array if it doesn't exist
    if (!targetColumns.columns[columnIndex].components) {
      console.log('🔧 Initializing components array for column:', columnIndex)
      targetColumns.columns[columnIndex].components = []
    }

    console.log('🔧 Adding component to column:', {
      columnIndex,
      componentType,
      existingComponents: targetColumns.columns[columnIndex].components.length
    })

    // Add the component to the column
    targetColumns.columns[columnIndex].components.push(newComponent)

    console.log('🔧 Component added, new count:', targetColumns.columns[columnIndex].components.length)

    // Update the component in formSchema array to trigger reactivity
    const updatedColumns = JSON.parse(JSON.stringify(targetColumns))
    formSchema.value.components.splice(columnsIndex, 1, updatedColumns)

    console.log('✅ Component added to column successfully')
    success(t('formBuilder.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error adding component to column:', err)
    console.error('❌ Error details:', {
      message: (err as Error).message,
      stack: (err as Error).stack,
      columnsIndex,
      columnIndex,
      componentType
    })
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Handle editing component in table cell
const handleEditTableCellComponent = (tableComponent: FormComponent, tableIndex: number, data: { rowIndex: number; cellIndex: number; componentIndex: number; component: FormComponent }) => {
  try {
    console.log('🔧 Editing table cell component:', { tableIndex, data })

    const { rowIndex, cellIndex, componentIndex, component } = data

    // Get the target Table component
    const targetTable = formSchema.value.components[tableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      throw new Error('Table component not found')
    }

    // Validate table structure and indices
    if (!targetTable.rows || !targetTable.rows[rowIndex]) {
      throw new Error('Table row not found')
    }

    if (!targetTable.rows[rowIndex].cells || !targetTable.rows[rowIndex].cells[cellIndex]) {
      throw new Error('Table cell not found')
    }

    if (!targetTable.rows[rowIndex].cells[cellIndex].components ||
        !targetTable.rows[rowIndex].cells[cellIndex].components[componentIndex]) {
      throw new Error('Component not found in table cell')
    }

    // Set up the selected component for editing
    selectedComponent.value = { ...component }
    selectedComponentIndex.value = -1 // Not a root component
    selectedComponentPath.value = {
      containerIndex: tableIndex,
      rowIndex: rowIndex,
      cellIndex: cellIndex,
      componentIndex: componentIndex,
      path: `rows.${rowIndex}.cells.${cellIndex}.components.${componentIndex}`,
      containerType: 'table'
    }

    console.log('✅ Table cell component selected for editing')
    success(t('formBuilder.componentSelected'))

  } catch (err) {
    console.error('❌ Error editing table cell component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Handle deleting component from table cell
const handleDeleteTableCellComponent = (tableComponent: FormComponent, tableIndex: number, data: { rowIndex: number; cellIndex: number; componentIndex: number; component: FormComponent }) => {
  try {
    console.log('🗑️ Deleting table cell component:', { tableIndex, data })

    const { rowIndex, cellIndex, componentIndex, component } = data

    // Get the target Table component
    const targetTable = formSchema.value.components[tableIndex]
    if (!targetTable || targetTable.type !== 'table') {
      throw new Error('Table component not found')
    }

    // Validate table structure and indices
    if (!targetTable.rows || !targetTable.rows[rowIndex]) {
      throw new Error('Table row not found')
    }

    if (!targetTable.rows[rowIndex].cells || !targetTable.rows[rowIndex].cells[cellIndex]) {
      throw new Error('Table cell not found')
    }

    if (!targetTable.rows[rowIndex].cells[cellIndex].components ||
        !targetTable.rows[rowIndex].cells[cellIndex].components[componentIndex]) {
      throw new Error('Component not found in table cell')
    }

    // Remove the component from the table cell
    targetTable.rows[rowIndex].cells[cellIndex].components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedTable = JSON.parse(JSON.stringify(targetTable))
    formSchema.value.components.splice(tableIndex, 1, updatedTable)

    // Clear selection if the deleted component was selected
    if (selectedComponentPath.value &&
        selectedComponentPath.value.containerIndex === tableIndex &&
        selectedComponentPath.value.rowIndex === rowIndex &&
        selectedComponentPath.value.cellIndex === cellIndex &&
        selectedComponentPath.value.componentIndex === componentIndex) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Remove from sections if it exists there
    if (formSchema.value.sections) {
      formSchema.value.sections.forEach(section => {
        if (section.componentIds) {
          const componentIndex = section.componentIds.findIndex(id => id === component.key)
          if (componentIndex !== -1) {
            section.componentIds.splice(componentIndex, 1)
          }
        }
      })
    }

    console.log('✅ Table cell component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error deleting table cell component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Handle adding new column to columns component
const handleAddColumn = (columnsComponent: FormComponent, columnsIndex: number, newColumn: { width: number; components: FormComponent[] }) => {
  try {
    console.log('➕ Adding new column:', { columnsIndex, newColumn })

    // Get the target Columns component
    const targetColumns = formSchema.value.components[columnsIndex]
    if (!targetColumns || targetColumns.type !== 'columns') {
      throw new Error('Columns component not found')
    }

    // Ensure columns array exists
    if (!targetColumns.columns) {
      targetColumns.columns = []
    }

    // Add the new column to the columns array
    const columnToAdd = {
      width: newColumn.width || 6,
      components: [],
      currentWidth: newColumn.width || 6,
      offset: 0,
      push: 0,
      pull: 0,
      size: 'md'
    }

    targetColumns.columns.push(columnToAdd)

    // Update the component in formSchema array to trigger reactivity
    const updatedColumns = JSON.parse(JSON.stringify(targetColumns))
    formSchema.value.components.splice(columnsIndex, 1, updatedColumns)

    console.log('✅ New column added successfully')
    success(t('formBuilder.columnAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error adding new column:', err)
    showError(t('formBuilder.errorAddingColumn'))
  }
}

// Helper function to remove component from nested containers
const removeComponentFromContainer = (containerComponent: FormComponent, componentKey: string) => {
  try {
    // Handle different container types
    switch (containerComponent.type) {
      case 'columns':
        if (containerComponent.columns) {
          containerComponent.columns.forEach((column: any) => {
            if (column.components) {
              const componentIndex = column.components.findIndex((comp: FormComponent) => comp.key === componentKey)
              if (componentIndex !== -1) {
                column.components.splice(componentIndex, 1)
                console.log(`✅ Removed component ${componentKey} from column`)
              }
            }
          })
        }
        break

      case 'panel':
      case 'fieldset':
      case 'well':
      case 'container':
        if (containerComponent.components) {
          const componentIndex = containerComponent.components.findIndex((comp: FormComponent) => comp.key === componentKey)
          if (componentIndex !== -1) {
            containerComponent.components.splice(componentIndex, 1)
            console.log(`✅ Removed component ${componentKey} from ${containerComponent.type}`)
          }
        }
        break

      case 'tabs':
        if (containerComponent.components) {
          containerComponent.components.forEach((tab: any) => {
            if (tab.components) {
              const componentIndex = tab.components.findIndex((comp: FormComponent) => comp.key === componentKey)
              if (componentIndex !== -1) {
                tab.components.splice(componentIndex, 1)
                console.log(`✅ Removed component ${componentKey} from tab`)
              }
            }
          })
        }
        break

      case 'table':
        if (containerComponent.rows) {
          containerComponent.rows.forEach((row: any) => {
            if (row.cells) {
              row.cells.forEach((cell: any) => {
                if (cell.components) {
                  const componentIndex = cell.components.findIndex((comp: any) => comp.key === componentKey)
                  if (componentIndex !== -1) {
                    cell.components.splice(componentIndex, 1)
                    console.log(`✅ Removed component ${componentKey} from table cell`)
                  }
                }
              })
            }
          })
        }
        break

      case 'datagrid':
      case 'editgrid':
        if (containerComponent.components) {
          const componentIndex = containerComponent.components.findIndex((comp: FormComponent) => comp.key === componentKey)
          if (componentIndex !== -1) {
            containerComponent.components.splice(componentIndex, 1)
            console.log(`✅ Removed component ${componentKey} from ${containerComponent.type}`)
          }
        }
        break

      default:
        // For other container types that might have components
        if (containerComponent.components) {
          const componentIndex = containerComponent.components.findIndex((comp: FormComponent) => comp.key === componentKey)
          if (componentIndex !== -1) {
            containerComponent.components.splice(componentIndex, 1)
            console.log(`✅ Removed component ${componentKey} from ${containerComponent.type}`)
          }
        }
        break
    }

    // Recursively check nested containers
    if (containerComponent.components) {
      containerComponent.components.forEach((nestedComponent: FormComponent) => {
        removeComponentFromContainer(nestedComponent, componentKey)
      })
    }

    // Handle columns recursively
    if (containerComponent.columns) {
      containerComponent.columns.forEach((column: any) => {
        if (column.components) {
          column.components.forEach((nestedComponent: FormComponent) => {
            removeComponentFromContainer(nestedComponent, componentKey)
          })
        }
      })
    }

    // Handle tabs recursively
    if (containerComponent.type === 'tabs' && containerComponent.components) {
      containerComponent.components.forEach((tab: any) => {
        if (tab.components) {
          tab.components.forEach((nestedComponent: FormComponent) => {
            removeComponentFromContainer(nestedComponent, componentKey)
          })
        }
      })
    }

  } catch (err) {
    console.error('❌ Error removing component from container:', err)
  }
}




// Simple DataGrid Functions - Form.io Style

// Add component to DataGrid (as a new column)
const handleAddComponentToDataGrid = (dataGridComponent: FormComponent, dataGridIndex: number, newComponentOrType: any) => {
  console.log('➕ Adding component to DataGrid as column:', { dataGridIndex, newComponentOrType })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found or invalid type')
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Support both string componentType and object with type
    const componentType = typeof newComponentOrType === 'string' ? newComponentOrType : newComponentOrType?.type
    if (!componentType) {
      console.error('❌ Invalid component type for DataGrid')
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Create new component with proper configuration
    const componentToAdd = createComponentFromType(componentType)
    if (!componentToAdd) {
      console.error('❌ Failed to create new component')
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Set component properties from provided object if available
    if (typeof newComponentOrType === 'object' && newComponentOrType) {
      if (newComponentOrType.label) componentToAdd.label = newComponentOrType.label
      if (newComponentOrType.key) componentToAdd.key = newComponentOrType.key
    }

    // Initialize components array if it doesn't exist
    if (!targetDataGrid.components) {
      targetDataGrid.components = []
    }

    // Add component to DataGrid components (creates new column)
    targetDataGrid.components.push(componentToAdd)

    // Update formSchema with deep copy to ensure Vue reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    console.log('✅ Component added to DataGrid successfully')
    success(t('formBuilder.componentAdded'))

    // Emit form update event
    emit('form-updated', formSchema.value)

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: {
          forceRerender: true,
          dataGridIndex,
          componentType: componentType
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error) {
    console.error('❌ Error adding component to DataGrid:', error)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Add component to DataGrid column (like Columns component)
const handleAddComponentToDataGridColumn = (dataGridComponent: FormComponent, dataGridIndex: number, data: { columnIndex: number; componentType: string; component?: any }) => {
  console.log('🔵 Adding component to DataGrid column:', { dataGridIndex, data })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found or invalid type')
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    const { columnIndex } = data

    // Validate column index
    if (!targetDataGrid.components || columnIndex >= targetDataGrid.components.length) {
      console.error('❌ Invalid column index')
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Create new component with proper configuration
    const componentType = data.componentType || data.component?.type
    if (!componentType) {
      console.error('❌ Invalid component type for DataGrid column')
      showError(t('formBuilder.errorAddingComponent'))
      return
    }
    const componentToAdd = createComponentFromType(componentType)
    if (!componentToAdd) {
      console.error('❌ Failed to create new component')
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Set component properties from newComponent
    if (data.component && typeof data.component === 'object') {
      if (data.component.label) componentToAdd.label = data.component.label
      if (data.component.key) componentToAdd.key = data.component.key
    }

    // Get the target column component
    const targetColumn = targetDataGrid.components[columnIndex]

    // Initialize components array in the column if it doesn't exist (like Columns)
    if (!targetColumn.components) {
      targetColumn.components = []
    }

    // Add the component to the column's components array (like Columns)
    targetColumn.components.push(componentToAdd)

    // Update formSchema with deep copy to ensure Vue reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    console.log('✅ Component added to DataGrid column successfully')
    success(t('formBuilder.componentAdded'))

    // Emit form update
    emit('form-updated', formSchema.value)

    // Trigger UI update with custom events
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          forceRerender: true,
          dataGridIndex,
          columnIndex,
          componentType: componentToAdd.type
        }
      }))

      window.dispatchEvent(new CustomEvent('datagrid-column-updated', {
        detail: {
          dataGridIndex,
          columnIndex,
          componentType: componentToAdd.type
        }
      }))
    })

  } catch (error) {
    console.error('❌ Error adding component to DataGrid column:', error)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Add component to DataGrid cell
const handleAddComponentToDataGridCell = (dataGridComponent: FormComponent, dataGridIndex: number, data: { rowIndex: number; columnIndex: number; componentType: string }) => {
  console.log('➕ Adding component to DataGrid cell:', { dataGridIndex, data })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      return
    }

    const newComponent = createComponentFromType(data.componentType)
    if (!newComponent) {
      console.error('❌ Failed to create component')
      return
    }

    const { rowIndex, columnIndex } = data
    const targetRow = targetDataGrid.defaultValue?.[rowIndex]
    if (!targetRow) {
      console.error('❌ Target row not found')
      return
    }

    // Initialize _components array
    if (!targetRow._components) {
      targetRow._components = []
    }

    // Ensure array has enough slots
    const totalColumns = targetDataGrid.components?.length || 1
    while (targetRow._components.length < totalColumns) {
      targetRow._components.push(null)
    }

    // Add component at specific column
    targetRow._components[columnIndex] = newComponent
    targetRow[newComponent.key] = getDefaultValue(newComponent)

    // Update formSchema to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated'))
    })

    success(t('formBuilder.componentAddedSuccessfully'))
    console.log('✅ Component added to DataGrid cell')
  } catch (err) {
    console.error('❌ Error adding component to DataGrid cell:', err)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Get default value for component type
const getDefaultValue = (component: any) => {
  switch (component.type) {
    case 'textfield':
    case 'textarea':
    case 'email':
    case 'url':
    case 'password':
    case 'phone':
      return ''
    case 'number':
    case 'currency':
      return null
    case 'checkbox':
      return false
    case 'select':
    case 'radio':
      return null
    case 'date':
    case 'time':
    case 'datetime':
      return ''
    case 'range':
      return component.min || 0
    case 'color':
      return '#000000'
    case 'file':
      return ''
    case 'hidden':
      return component.defaultValue || ''
    default:
      return null
  }
}

// Add new row to DataGrid (implementation moved to line 4549)

// Delete row from DataGrid (implementation moved to line 4580)

// Edit component in DataGrid cell
const handleEditDataGridCellComponent = (dataGridComponent: FormComponent, dataGridIndex: number, rowIndex: number, componentIndex: number, component: FormComponent) => {
  console.log('🔧 Editing DataGrid cell component:', { dataGridIndex, rowIndex, componentIndex, component })

  try {
    // Set the selected component for editing in the properties panel
    selectedComponent.value = component
    selectedComponentIndex.value = componentIndex
    selectedComponentPath.value = {
      containerIndex: dataGridIndex,
      componentIndex: componentIndex,
      containerType: 'datagrid',
      path: `components.${dataGridIndex}.defaultValue.${rowIndex}._components.${componentIndex}`,
      rowIndex: rowIndex,
      cellIndex: componentIndex
    }

    success(t('formBuilder.componentSelected'))
    console.log('✅ DataGrid cell component selected for editing')
  } catch (err) {
    console.error('❌ Error editing DataGrid cell component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Delete component from DataGrid cell
const handleDeleteDataGridCellComponent = (dataGridComponent: FormComponent, dataGridIndex: number, rowIndex: number, componentIndex: number, component: FormComponent) => {
  console.log('🗑️ Deleting DataGrid cell component:', { dataGridIndex, rowIndex, componentIndex, component })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      return
    }

    const targetRow = targetDataGrid.defaultValue?.[rowIndex]
    if (!targetRow || !targetRow._components) {
      console.error('❌ Target row or components not found')
      return
    }

    // Remove component from cell
    targetRow._components[componentIndex] = null

    // Remove component data from row
    if (component.key && targetRow[component.key] !== undefined) {
      delete targetRow[component.key]
    }

    // Clear selection if this component was selected
    if (selectedComponent.value?.key === component.key) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Update formSchema to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated'))
    })

    success(t('formBuilder.componentDeletedSuccessfully'))
    console.log('✅ DataGrid cell component deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting DataGrid cell component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Edit component in DataGrid column (like Columns component)
const handleEditDataGridColumnComponent = (dataGridComponent: FormComponent, dataGridIndex: number, data: { columnIndex: number; componentIndex: number; component: FormComponent }) => {
  console.log('🔧 Editing DataGrid column component:', { dataGridIndex, data })

  try {
    const { columnIndex, componentIndex, component } = data

    // Set the selected component for editing in the properties panel
    selectedComponent.value = component
    selectedComponentIndex.value = componentIndex
    selectedComponentPath.value = {
      containerIndex: dataGridIndex,
      componentIndex: componentIndex,
      containerType: 'datagrid-column',
      path: `components.${dataGridIndex}.components.${componentIndex}`,
      columnIndex: columnIndex
    }

    success(t('formBuilder.componentSelected'))
    console.log('✅ DataGrid column component selected for editing')
  } catch (err) {
    console.error('❌ Error editing DataGrid column component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Delete component from DataGrid column (like Columns component)
const handleDeleteDataGridColumnComponent = (dataGridComponent: FormComponent, dataGridIndex: number, data: { columnIndex: number; componentIndex: number; component: FormComponent }) => {
  console.log('🗑️ Deleting DataGrid column component:', { dataGridIndex, data })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    const { columnIndex, componentIndex, component } = data

    // Validate column index
    if (!targetDataGrid.components || columnIndex >= targetDataGrid.components.length) {
      console.error('❌ Invalid column index')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    const targetColumn = targetDataGrid.components[columnIndex]
    if (!targetColumn.components || componentIndex >= targetColumn.components.length) {
      console.error('❌ Invalid component index')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    // Remove component from column
    targetColumn.components.splice(componentIndex, 1)

    // Clear selection if this component was selected
    if (selectedComponent.value?.key === component.key) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Update formSchema to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    // Emit form update
    emit('form-updated', formSchema.value)

    // Trigger UI update with custom events
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          forceRerender: true,
          dataGridIndex,
          columnIndex,
          componentIndex
        }
      }))

      window.dispatchEvent(new CustomEvent('datagrid-column-updated', {
        detail: {
          dataGridIndex,
          columnIndex,
          componentIndex
        }
      }))
    })

    success(t('formBuilder.componentDeletedSuccessfully'))
    console.log('✅ DataGrid column component deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting DataGrid column component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// New functions for DataGrid column components (direct column editing)
const handleEditDataGridComponent = (dataGridComponent: FormComponent, dataGridIndex: number, componentIndex: number, gridComponent: FormComponent) => {
  console.log('🔧 Editing DataGrid column component:', { dataGridIndex, componentIndex, gridComponent })

  try {
    // Set the selected component for editing in the properties panel
    selectedComponent.value = gridComponent
    selectedComponentIndex.value = componentIndex
    selectedComponentPath.value = {
      containerIndex: dataGridIndex,
      componentIndex: componentIndex,
      containerType: 'datagrid',
      path: `components.${dataGridIndex}.components.${componentIndex}`
    }

    success(t('formBuilder.componentSelected'))
    console.log('✅ DataGrid column component selected for editing')
  } catch (err) {
    console.error('❌ Error editing DataGrid column component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

const handleDeleteDataGridComponent = (dataGridComponent: FormComponent, dataGridIndex: number, componentIndex: number, gridComponent: FormComponent) => {
  console.log('🗑️ Deleting DataGrid column component:', { dataGridIndex, componentIndex, gridComponent })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    // Validate component index
    if (!targetDataGrid.components || componentIndex >= targetDataGrid.components.length) {
      console.error('❌ Invalid component index')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    // Remove component from DataGrid columns
    targetDataGrid.components.splice(componentIndex, 1)

    // Clear selection if this component was selected
    if (selectedComponent.value?.key === gridComponent.key) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Trigger reactivity and updates
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated'))
      window.dispatchEvent(new CustomEvent('datagrid-updated', {
        detail: {
          dataGridIndex,
          componentIndex
        }
      }))
    })

    success(t('formBuilder.componentDeletedSuccessfully'))
    console.log('✅ DataGrid column component deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting DataGrid column component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Delete component from DataGrid cell (unified method)
const handleDeleteComponentFromDataGridCell = (dataGridComponent: FormComponent, dataGridIndex: number, data: { rowIndex: number; columnIndex: number; component: FormComponent }) => {
  console.log('🗑️ Deleting component from DataGrid cell:', { dataGridIndex, data })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    const { rowIndex, columnIndex, component } = data
    const targetRow = targetDataGrid.defaultValue?.[rowIndex]
    if (!targetRow || !targetRow._components) {
      console.error('❌ Target row or components not found')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    // Remove component from cell
    targetRow._components[columnIndex] = null

    // Remove component data from row
    if (component.key && targetRow[component.key] !== undefined) {
      delete targetRow[component.key]
    }

    // Clear selection if this component was selected
    if (selectedComponent.value?.key === component.key) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Update formSchema to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    // Trigger UI update with multiple events
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          forceRerender: true,
          dataGridIndex,
          rowIndex,
          columnIndex
        }
      }))
      window.dispatchEvent(new CustomEvent('datagrid-cell-updated'))
      window.dispatchEvent(new CustomEvent('force-datagrid-rerender'))
    })

    success(t('formBuilder.componentDeleted'))
    console.log('✅ Component deleted from DataGrid cell successfully')
  } catch (err) {
    console.error('❌ Error deleting component from DataGrid cell:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Handle editing component in Panel
const handleEditPanelComponent = (panelComponent: FormComponent, panelIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🔧 Editing Panel component:', { panelIndex, componentIndex, component })

    // Set the selected component for editing in the properties panel
    selectedComponent.value = component
    selectedComponentIndex.value = componentIndex
    selectedComponentPath.value = {
      containerIndex: panelIndex,
      componentIndex: componentIndex,
      containerType: 'panel',
      path: `components.${panelIndex}.components.${componentIndex}`
    }

    console.log('✅ Panel component selected for editing')
    success(t('formBuilder.componentSelected'))

  } catch (err) {
    console.error('❌ Error editing panel component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Handle editing component in Fieldset
const handleEditFieldsetComponent = (fieldsetComponent: FormComponent, fieldsetIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🔧 Editing Fieldset component:', { fieldsetIndex, componentIndex, component })

    // Set the selected component for editing in the properties panel
    selectedComponent.value = component
    selectedComponentIndex.value = componentIndex
    selectedComponentPath.value = {
      containerIndex: fieldsetIndex,
      componentIndex: componentIndex,
      containerType: 'fieldset',
      path: `components.${fieldsetIndex}.components.${componentIndex}`
    }

    console.log('✅ Fieldset component selected for editing')
    success(t('formBuilder.componentSelected'))

  } catch (err) {
    console.error('❌ Error editing fieldset component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Handle editing component in Well
const handleEditWellComponent = (wellComponent: FormComponent, wellIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🔧 Editing Well component:', { wellIndex, componentIndex, component })

    // Set the selected component for editing in the properties panel
    selectedComponent.value = component
    selectedComponentIndex.value = componentIndex
    selectedComponentPath.value = {
      containerIndex: wellIndex,
      componentIndex: componentIndex,
      containerType: 'well',
      path: `components.${wellIndex}.components.${componentIndex}`
    }

    console.log('✅ Well component selected for editing')
    success(t('formBuilder.componentSelected'))

  } catch (err) {
    console.error('❌ Error editing well component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Handle editing component in Container
const handleEditContainerComponent = (containerComponent: FormComponent, containerIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🔧 Editing Container component:', { containerIndex, componentIndex, component })

    // Set the selected component for editing in the properties panel
    selectedComponent.value = component
    selectedComponentIndex.value = componentIndex
    selectedComponentPath.value = {
      containerIndex: containerIndex,
      componentIndex: componentIndex,
      containerType: 'container',
      path: `components.${containerIndex}.components.${componentIndex}`
    }

    console.log('✅ Container component selected for editing')
    success(t('formBuilder.componentSelected'))

  } catch (err) {
    console.error('❌ Error editing container component:', err)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

// Handle deleting component from Panel
const handleDeletePanelComponent = (panelComponent: FormComponent, panelIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🗑️ Deleting Panel component:', { panelIndex, componentIndex, component })

    // Get the target Panel component
    const targetPanel = formSchema.value.components[panelIndex]
    if (!targetPanel || targetPanel.type !== 'panel') {
      throw new Error('Panel component not found')
    }

    // Validate component index
    if (!targetPanel.components || !targetPanel.components[componentIndex]) {
      throw new Error('Component not found in panel')
    }

    // Remove the component from the panel
    targetPanel.components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedPanel = JSON.parse(JSON.stringify(targetPanel))
    formSchema.value.components.splice(panelIndex, 1, updatedPanel)

    // Clear selection if the deleted component was selected
    if (selectedComponentPath.value &&
        selectedComponentPath.value.containerIndex === panelIndex &&
        selectedComponentPath.value.componentIndex === componentIndex) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Remove component from sections if it exists
    if (formSchema.value.sections) {
      formSchema.value.sections.forEach(section => {
        if (section.componentIds) {
          const componentIndex = section.componentIds.findIndex(id => id === component.key)
          if (componentIndex !== -1) {
            section.componentIds.splice(componentIndex, 1)
            console.log(`✅ Removed component ${component.key} from section`)
          }
        }
      })
    }

    console.log('✅ Panel component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error deleting panel component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Handle adding component to Panel
const handleAddComponentToPanel = (panelComponent: FormComponent, panelIndex: number, componentType: string) => {
  try {
    console.log('🔥 Adding component to panel:', { panelIndex, componentType })

    // Get the target Panel component
    const targetPanel = formSchema.value.components[panelIndex]
    if (!targetPanel || targetPanel.type !== 'panel') {
      throw new Error('Panel component not found')
    }

    // Create new component based on type
    const newComponent = createComponentFromType(componentType)
    if (!newComponent) {
      throw new Error('Failed to create component')
    }

    // Initialize components array if it doesn't exist
    if (!targetPanel.components) {
      targetPanel.components = []
    }

    // Add the component to the panel
    targetPanel.components.push(newComponent)

    // Update the component in formSchema array to trigger reactivity
    const updatedPanel = JSON.parse(JSON.stringify(targetPanel))
    formSchema.value.components.splice(panelIndex, 1, updatedPanel)

    console.log('✅ Component added to panel successfully')
    success(t('formBuilder.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error adding component to panel:', err)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Handle adding component to Fieldset
const handleAddComponentToFieldset = (fieldsetComponent: FormComponent, fieldsetIndex: number, componentType: string) => {
  try {
    console.log('🔥 Adding component to fieldset:', { fieldsetIndex, componentType })

    // Get the target Fieldset component
    const targetFieldset = formSchema.value.components[fieldsetIndex]
    if (!targetFieldset || targetFieldset.type !== 'fieldset') {
      throw new Error('Fieldset component not found')
    }

    // Create new component based on type
    const newComponent = createComponentFromType(componentType)
    if (!newComponent) {
      throw new Error('Failed to create component')
    }

    // Initialize components array if it doesn't exist
    if (!targetFieldset.components) {
      targetFieldset.components = []
    }

    // Add the component to the fieldset
    targetFieldset.components.push(newComponent)

    // Update the component in formSchema array to trigger reactivity
    const updatedFieldset = JSON.parse(JSON.stringify(targetFieldset))
    formSchema.value.components.splice(fieldsetIndex, 1, updatedFieldset)

    console.log('✅ Component added to fieldset successfully')
    success(t('formBuilder.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error adding component to fieldset:', err)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Handle adding component to Well
const handleAddComponentToWell = (wellComponent: FormComponent, wellIndex: number, componentType: string) => {
  try {
    console.log('🔥 Adding component to well:', { wellIndex, componentType })

    // Get the target Well component
    const targetWell = formSchema.value.components[wellIndex]
    if (!targetWell || targetWell.type !== 'well') {
      throw new Error('Well component not found')
    }

    // Create new component based on type
    const newComponent = createComponentFromType(componentType)
    if (!newComponent) {
      throw new Error('Failed to create component')
    }

    // Initialize components array if it doesn't exist
    if (!targetWell.components) {
      targetWell.components = []
    }

    // Add the component to the well
    targetWell.components.push(newComponent)

    // Update the component in formSchema array to trigger reactivity
    const updatedWell = JSON.parse(JSON.stringify(targetWell))
    formSchema.value.components.splice(wellIndex, 1, updatedWell)

    console.log('✅ Component added to well successfully')
    success(t('formBuilder.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error adding component to well:', err)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Handle adding component to Container
const handleAddComponentToContainer = (containerComponent: FormComponent, containerIndex: number, componentType: string) => {
  try {
    console.log('🔥 Adding component to container:', { containerIndex, componentType })

    // Get the target Container component
    const targetContainer = formSchema.value.components[containerIndex]
    if (!targetContainer || targetContainer.type !== 'container') {
      throw new Error('Container component not found')
    }

    // Create new component based on type
    const newComponent = createComponentFromType(componentType)
    if (!newComponent) {
      throw new Error('Failed to create component')
    }

    // Initialize components array if it doesn't exist
    if (!targetContainer.components) {
      targetContainer.components = []
    }

    // Add the component to the container
    targetContainer.components.push(newComponent)

    // Update the component in formSchema array to trigger reactivity
    const updatedContainer = JSON.parse(JSON.stringify(targetContainer))
    formSchema.value.components.splice(containerIndex, 1, updatedContainer)

    console.log('✅ Component added to container successfully')
    success(t('formBuilder.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error adding component to container:', err)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Handle deleting component from Fieldset
const handleDeleteFieldsetComponent = (fieldsetComponent: FormComponent, fieldsetIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🗑️ Deleting Fieldset component:', { fieldsetIndex, componentIndex, component })

    // Get the target Fieldset component
    const targetFieldset = formSchema.value.components[fieldsetIndex]
    if (!targetFieldset || targetFieldset.type !== 'fieldset') {
      throw new Error('Fieldset component not found')
    }

    // Validate component index
    if (!targetFieldset.components || !targetFieldset.components[componentIndex]) {
      throw new Error('Component not found in fieldset')
    }

    // Remove the component from the fieldset
    targetFieldset.components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedFieldset = JSON.parse(JSON.stringify(targetFieldset))
    formSchema.value.components.splice(fieldsetIndex, 1, updatedFieldset)

    // Clear selection if the deleted component was selected
    if (selectedComponentPath.value &&
        selectedComponentPath.value.containerIndex === fieldsetIndex &&
        selectedComponentPath.value.componentIndex === componentIndex) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Remove component from sections if it exists
    if (formSchema.value.sections) {
      formSchema.value.sections.forEach(section => {
        if (section.componentIds) {
          const componentIndex = section.componentIds.findIndex(id => id === component.key)
          if (componentIndex !== -1) {
            section.componentIds.splice(componentIndex, 1)
            console.log(`✅ Removed component ${component.key} from section`)
          }
        }
      })
    }

    console.log('✅ Fieldset component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error deleting fieldset component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Handle deleting component from Well
const handleDeleteWellComponent = (wellComponent: FormComponent, wellIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🗑️ Deleting Well component:', { wellIndex, componentIndex, component })

    // Get the target Well component
    const targetWell = formSchema.value.components[wellIndex]
    if (!targetWell || targetWell.type !== 'well') {
      throw new Error('Well component not found')
    }

    // Validate component index
    if (!targetWell.components || !targetWell.components[componentIndex]) {
      throw new Error('Component not found in well')
    }

    // Remove the component from the well
    targetWell.components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedWell = JSON.parse(JSON.stringify(targetWell))
    formSchema.value.components.splice(wellIndex, 1, updatedWell)

    // Clear selection if the deleted component was selected
    if (selectedComponentPath.value &&
        selectedComponentPath.value.containerIndex === wellIndex &&
        selectedComponentPath.value.componentIndex === componentIndex) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Remove component from sections if it exists
    if (formSchema.value.sections) {
      formSchema.value.sections.forEach(section => {
        if (section.componentIds) {
          const componentIndex = section.componentIds.findIndex(id => id === component.key)
          if (componentIndex !== -1) {
            section.componentIds.splice(componentIndex, 1)
            console.log(`✅ Removed component ${component.key} from section`)
          }
        }
      })
    }

    console.log('✅ Well component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error deleting well component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// Handle deleting component from Container
const handleDeleteContainerComponent = (containerComponent: FormComponent, containerIndex: number, componentIndex: number, component: FormComponent) => {
  try {
    console.log('🗑️ Deleting Container component:', { containerIndex, componentIndex, component })

    // Get the target Container component
    const targetContainer = formSchema.value.components[containerIndex]
    if (!targetContainer || targetContainer.type !== 'container') {
      throw new Error('Container component not found')
    }

    // Validate component index
    if (!targetContainer.components || !targetContainer.components[componentIndex]) {
      throw new Error('Component not found in container')
    }

    // Remove the component from the container
    targetContainer.components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedContainer = JSON.parse(JSON.stringify(targetContainer))
    formSchema.value.components.splice(containerIndex, 1, updatedContainer)

    // Clear selection if the deleted component was selected
    if (selectedComponentPath.value &&
        selectedComponentPath.value.containerIndex === containerIndex &&
        selectedComponentPath.value.componentIndex === componentIndex) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    // Remove component from sections if it exists
    if (formSchema.value.sections) {
      formSchema.value.sections.forEach(section => {
        if (section.componentIds) {
          const componentIndex = section.componentIds.findIndex(id => id === component.key)
          if (componentIndex !== -1) {
            section.componentIds.splice(componentIndex, 1)
            console.log(`✅ Removed component ${component.key} from section`)
          }
        }
      })
    }

    console.log('✅ Container component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error deleting container component:', err)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

// EditGrid Management Functions
const handleEditEditGridComponent = (editGridComponent: FormComponent, editGridIndex: number, componentIndex: number, gridComponent: FormComponent) => {
  try {
    console.log('🔧 Editing EditGrid component:', { editGridIndex, componentIndex, gridComponent })

    // Set the nested component as selected for editing, prefilling label if missing
    const prefilled = { ...gridComponent }
    if (!prefilled.label) {
      try {
        prefilled.label = getComponentLabel(prefilled.type)
      } catch (_) {
        prefilled.label = prefilled.type as unknown as string
      }
    }
    selectedComponent.value = prefilled
    selectedComponentIndex.value = -1 // Don't use regular index for nested components

    // Track the nested component location
    selectedComponentPath.value = {
      containerIndex: editGridIndex,
      componentIndex,
      path: `components.${componentIndex}`,
      containerType: 'editgrid'
    }

    console.log('✅ EditGrid component selected for editing:', gridComponent.type)
    console.log('🔧 Component path:', selectedComponentPath.value)
    success(t('formBuilder.componentSelected'))

  } catch (error: unknown) {
    console.error('❌ Error editing EditGrid component:', error)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

const handleDeleteEditGridComponent = (editGridComponent: FormComponent, editGridIndex: number, componentIndex: number, gridComponent: FormComponent) => {
  try {
    console.log('🗑️ Deleting EditGrid component:', { editGridIndex, componentIndex, gridComponent })

    // Get the target EditGrid
    const targetEditGrid = formSchema.value.components[editGridIndex]
    if (!targetEditGrid || targetEditGrid.type !== 'editgrid') {
      throw new Error('EditGrid component not found')
    }

    // Ensure components array exists
    if (!targetEditGrid.components) {
      targetEditGrid.components = []
    }

    // Remove the component from EditGrid
    targetEditGrid.components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedEditGrid = JSON.parse(JSON.stringify(targetEditGrid))
    formSchema.value.components.splice(editGridIndex, 1, updatedEditGrid)

    // Clear selection if this component was selected
    if (selectedComponentIndex.value === editGridIndex && selectedComponentPath.value?.path === `components.${componentIndex}`) {
      selectedComponentIndex.value = -1
      selectedComponent.value = null
      selectedComponentPath.value = null
    }

    // Remove from sections if it exists there
    if (gridComponent.key) {
      removeComponentFromSections(gridComponent.key)
    }

    console.log('✅ EditGrid component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error deleting EditGrid component:', error)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

const handleAddComponentToEditGrid = (editGridComponent: FormComponent, editGridIndex: number, newComponent: FormComponent) => {
  try {
    console.log('➕ Adding component to EditGrid:', { editGridIndex, newComponent })

    // Get the target EditGrid
    const targetEditGrid = formSchema.value.components[editGridIndex]
    if (!targetEditGrid || targetEditGrid.type !== 'editgrid') {
      throw new Error('EditGrid component not found')
    }

    // Ensure components array exists
    if (!targetEditGrid.components) {
      targetEditGrid.components = []
    }

    // Ensure the new component has a visible label
    if (!newComponent.label) {
      try {
        newComponent.label = getComponentLabel(newComponent.type)
      } catch (_) {
        newComponent.label = newComponent.type as unknown as string
      }
    }

    // Ensure the new component has a unique key
    const desiredBase = (newComponent.key || newComponent.label || newComponent.type) as unknown as string
    newComponent.key = ensureUniqueKey(desiredBase)

    // Add the new component to EditGrid
    targetEditGrid.components.push(newComponent)

    // Update the component in formSchema array to trigger reactivity
    const updatedEditGrid = JSON.parse(JSON.stringify(targetEditGrid))
    formSchema.value.components.splice(editGridIndex, 1, updatedEditGrid)

    console.log('✅ Component added to EditGrid successfully')
    success(t('formBuilder.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { forceRerender: true }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error adding component to EditGrid:', error)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Tabs Management Functions
const handleEditTabComponent = (tabsComponent: FormComponent, tabsIndex: number, tabIndex: number, componentIndex: number, tabComponent: FormComponent) => {
  try {
    console.log('🔧 Editing Tab component:', { tabsIndex, tabIndex, componentIndex, tabComponent })

    // Set the nested component as selected for editing
    const prefilled = { ...tabComponent }
    if (!prefilled.label) {
      // Prefill label for editor using translated default label
      try {
        prefilled.label = getComponentLabel(prefilled.type)
      } catch (_) {
        prefilled.label = prefilled.type
      }
    }
    selectedComponent.value = prefilled
    selectedComponentIndex.value = -1 // Don't use regular index for nested components

    // Track the nested component location
    selectedComponentPath.value = {
      containerIndex: tabsIndex,
      componentIndex,
      path: `components.${tabIndex}.components.${componentIndex}`,
      containerType: 'tabs',
      tabIndex
    }

    console.log('✅ Tab component selected for editing:', tabComponent.type)
    console.log('🔧 Component path:', selectedComponentPath.value)
    success(t('formBuilder.componentSelected'))

  } catch (error: unknown) {
    console.error('❌ Error editing Tab component:', error)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

const handleDeleteTabComponent = (tabsComponent: FormComponent, tabsIndex: number, tabIndex: number, componentIndex: number, tabComponent: FormComponent) => {
  try {
    console.log('🗑️ Deleting Tab component:', { tabsIndex, tabIndex, componentIndex, tabComponent })

    // Get the target tabs component
    const targetTabs = formSchema.value.components[tabsIndex]
    if (!targetTabs || targetTabs.type !== 'tabs') {
      throw new Error('Tabs component not found')
    }

    // Ensure tabs structure exists
    if (!targetTabs.components || !targetTabs.components[tabIndex] || !targetTabs.components[tabIndex].components) {
      throw new Error('Tab structure not found')
    }

    // Remove the component from the specific tab
    targetTabs.components[tabIndex].components.splice(componentIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedTabs = JSON.parse(JSON.stringify(targetTabs))
    formSchema.value.components.splice(tabsIndex, 1, updatedTabs)

    // Clear selection if this component was selected
    if (selectedComponent.value && selectedComponent.value.key === tabComponent.key) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    }

    console.log('✅ Tab component deleted successfully')
    success(t('formBuilder.componentDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('tab-component-deleted', {
        detail: {
          tabsIndex,
          tabIndex,
          componentIndex,
          component: tabComponent
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error deleting Tab component:', error)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}

const handleAddComponentToTab = (tabsComponent: FormComponent, tabsIndex: number, tabIndex: number, newComponent: FormComponent) => {
  try {
    console.log('➕ Adding component to Tab:', { tabsIndex, tabIndex, newComponent })

    // Ensure the new component has a visible label
    if (!newComponent.label) {
      try {
        newComponent.label = getComponentLabel(newComponent.type)
      } catch (_) {
        newComponent.label = newComponent.type
      }
    }

    // Ensure the new component has a unique key (same behavior as columns/other containers)
    const desiredBase = newComponent.key || newComponent.label || newComponent.type
    newComponent.key = ensureUniqueKey(desiredBase as unknown as string)

    // Get the target tabs component
    const targetTabs = formSchema.value.components[tabsIndex]
    if (!targetTabs || targetTabs.type !== 'tabs') {
      throw new Error('Tabs component not found')
    }

    // Ensure tabs structure exists
    if (!targetTabs.components) {
      targetTabs.components = []
    }

    // Ensure specific tab exists
    if (!targetTabs.components[tabIndex]) {
      targetTabs.components[tabIndex] = {
        label: `Tab ${tabIndex + 1}`,
        key: `tab${tabIndex + 1}`,
        components: []
      }
    }

    // Ensure tab components array exists
    if (!targetTabs.components[tabIndex].components) {
      targetTabs.components[tabIndex].components = []
    }

    // Add the new component to the specific tab
    targetTabs.components[tabIndex].components.push(newComponent)

    // Update the component in formSchema array to trigger reactivity
    const updatedTabs = JSON.parse(JSON.stringify(targetTabs))
    formSchema.value.components.splice(tabsIndex, 1, updatedTabs)

    console.log('✅ Component added to Tab successfully')
    success(t('formBuilder.componentAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('tab-component-added', {
        detail: {
          tabsIndex,
          tabIndex,
          component: newComponent
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error adding component to Tab:', error)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// New Tab Management Functions
const handleAddNewTab = (tabsComponent: FormComponent, tabsIndex: number, newTab: any) => {
  try {
    console.log('➕ Adding new tab:', { tabsIndex, newTab, tabsComponent })

    // Validate tabs component
    if (!tabsComponent || tabsComponent.type !== 'tabs') {
      console.error('❌ Invalid tabs component - not a tabs type:', tabsComponent?.type)
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Initialize components array if it doesn't exist
    if (!tabsComponent.components) {
      console.log('🔧 Initializing components array for tabs component')
      tabsComponent.components = []
    }

    // Validate newTab structure
    if (!newTab || !newTab.label || !newTab.key) {
      console.error('❌ Invalid new tab structure:', newTab)
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Ensure newTab has components array
    if (!newTab.components) {
      newTab.components = []
    }

    // Create a deep copy of the tabs component
    const targetTabs = JSON.parse(JSON.stringify(tabsComponent))

    // Ensure the copied component has components array
    if (!targetTabs.components) {
      targetTabs.components = []
    }

    // Add the new tab to the components array
    targetTabs.components.push(newTab)

    console.log('📝 Tabs component before update:', {
      originalLength: tabsComponent.components?.length || 0,
      newLength: targetTabs.components.length,
      newTab: newTab
    })

    // Update the component in formSchema array to trigger reactivity
    formSchema.value.components.splice(tabsIndex, 1, targetTabs)

    console.log('✅ New tab added successfully')
    success(t('formBuilder.tabAdded'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('tab-added', {
        detail: {
          tabsIndex,
          newTab,
          forceRerender: true
        }
      })
      window.dispatchEvent(event)

      // Additional event for component update
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          action: 'tab-added',
          componentType: 'tabs',
          forceRerender: true
        }
      }))
    })

    // Emit form update
    emit('form-updated', formSchema.value)

  } catch (error: unknown) {
    console.error('❌ Error adding new tab:', error)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

const handleUpdateTabName = (tabsComponent: FormComponent, tabsIndex: number, tabIndex: number, newName: string) => {
  try {
    console.log('✏️ Updating tab name:', { tabsIndex, tabIndex, newName })

    if (!tabsComponent || !tabsComponent.components || !tabsComponent.components[tabIndex]) {
      console.error('❌ Invalid tabs component or tab index')
      showError(t('formBuilder.errorEditingComponent'))
      return
    }

    // Create a deep copy of the tabs component
    const targetTabs = JSON.parse(JSON.stringify(tabsComponent))

    // Update the tab name
    targetTabs.components[tabIndex].label = newName

    // Update the component in formSchema array to trigger reactivity
    formSchema.value.components.splice(tabsIndex, 1, targetTabs)

    console.log('✅ Tab name updated successfully')
    success(t('formBuilder.tabRenamed'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('tab-renamed', {
        detail: {
          tabsIndex,
          tabIndex,
          newName
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error updating tab name:', error)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

const handleEditTab = (tabsComponent: FormComponent, tabsIndex: number, tabIndex: number) => {
  try {
    console.log('🔧 Editing tab (properties panel):', { tabsIndex, tabIndex })

    // Resolve the latest tabs component from formSchema by index
    const resolvedTabs = formSchema.value.components[tabsIndex]
    if (!resolvedTabs || resolvedTabs.type !== 'tabs') {
      console.error('❌ Invalid tabs component reference at index:', tabsIndex)
      showError(t('formBuilder.errorEditingComponent'))
      return
    }

    // Ensure tabs array exists
    if (!resolvedTabs.components || !Array.isArray(resolvedTabs.components)) {
      resolvedTabs.components = [
        { label: 'الاسم', key: 'tab1', components: [] },
        { label: 'العمر', key: 'tab2', components: [] }
      ]
      const initialized = JSON.parse(JSON.stringify(resolvedTabs))
      formSchema.value.components.splice(tabsIndex, 1, initialized)
    }

    if (!resolvedTabs.components[tabIndex]) {
      console.error('❌ Tab index out of range:', tabIndex)
      showError(t('formBuilder.errorEditingComponent'))
      return
    }

    // Select tabs component into properties panel
    selectedComponent.value = resolvedTabs
    selectedComponentIndex.value = tabsIndex
    selectedComponentPath.value = {
      containerIndex: tabsIndex,
      path: `tabs.${tabIndex}`,
      containerType: 'tabs',
      tabIndex
    } as any

    // Store edit context for the editor
    currentTabEditContext.value = { tabsComponent: resolvedTabs, tabsIndex, tabIndex }
  } catch (error: unknown) {
    console.error('❌ Error opening tab edit in properties panel:', error)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

const closeEditTabModal = () => {
  showEditTabModal.value = false
  currentTabEditContext.value = null
}

const saveEditTab = () => {
  try {
    if (!currentTabEditContext.value) return
    const { tabsIndex, tabIndex } = currentTabEditContext.value

    // Resolve fresh tabs from schema and clone
    const latestTabs = formSchema.value.components[tabsIndex]
    if (!latestTabs || latestTabs.type !== 'tabs') {
      showError(t('formBuilder.errorEditingComponent'))
      return
    }
    const targetTabs = JSON.parse(JSON.stringify(latestTabs))
    if (!targetTabs.components || !targetTabs.components[tabIndex]) {
      showError(t('formBuilder.errorEditingComponent'))
      return
    }

    targetTabs.components[tabIndex].label = editTabForm.value.label?.trim() || targetTabs.components[tabIndex].label
    targetTabs.components[tabIndex].key = editTabForm.value.key?.trim() || targetTabs.components[tabIndex].key

    // Apply update
    formSchema.value.components.splice(tabsIndex, 1, targetTabs)

    success(t('formBuilder.tabUpdated') || 'Tab updated')
    showEditTabModal.value = false
    currentTabEditContext.value = null

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('tab-updated', { detail: { tabsIndex, tabIndex } }))
    })

  } catch (error: unknown) {
    console.error('❌ Error saving tab edit:', error)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

const handleDeleteTab = (tabsComponent: FormComponent, tabsIndex: number, tabIndex: number) => {
  try {
    console.log('🗑️ Deleting tab:', { tabsIndex, tabIndex })

    if (!tabsComponent || !tabsComponent.components || !tabsComponent.components[tabIndex]) {
      console.error('❌ Invalid tabs component or tab index')
      showError(t('formBuilder.errorDeletingComponent'))
      return
    }

    // Don't allow deleting the last tab
    if (tabsComponent.components.length <= 1) {
      console.warn('⚠️ Cannot delete the last tab')
      showError('Cannot delete the last tab')
      return
    }

    // Create a deep copy of the tabs component
    const targetTabs = JSON.parse(JSON.stringify(tabsComponent))

    // Remove the tab from the components array
    targetTabs.components.splice(tabIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    formSchema.value.components.splice(tabsIndex, 1, targetTabs)

    console.log('✅ Tab deleted successfully')
    success(t('formBuilder.tabDeleted'))

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('tab-deleted', {
        detail: {
          tabsIndex,
          tabIndex
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error deleting tab:', error)
    showError(t('formBuilder.errorDeletingComponent'))
  }
}


const addComponent = (componentDef: ComponentDefinition) => {
  try {
    const newComponent: FormComponent = {
      ...componentDef.defaultConfig,
      type: componentDef.type,
      key: generateUniqueKey(componentDef.type),
      label: getComponentLabel(componentDef.type), // Use translated label
    }

    // Set translated labels for options if they exist
    if (newComponent.data?.values && Array.isArray(newComponent.data.values)) {
      newComponent.data.values = newComponent.data.values.map((option: any, index: number) => ({
        ...option,
        label: t(`formBuilder.defaultOptions.option${index + 1}`),
      }))
    }

    if (newComponent.values && Array.isArray(newComponent.values)) {
      newComponent.values = newComponent.values.map((option: any, index: number) => ({
        ...option,
        label: t(`formBuilder.defaultOptions.option${index + 1}`),
      }))
    }

    // Set translated placeholder if needed
    if (newComponent.placeholder) {
      const placeholderKey = `formBuilder.placeholders.${componentDef.type}`
      const translatedPlaceholder = t(placeholderKey)
      if (translatedPlaceholder !== placeholderKey) {
        newComponent.placeholder = translatedPlaceholder
      }
    }

    // Set translated labels for fileTypes if they exist
    if (newComponent.fileTypes) {
      newComponent.fileTypes = newComponent.fileTypes.map((fileType: any) => ({
        ...fileType,
        label: fileType.value === '*' ? t('formBuilder.fileTypes.any') : fileType.label,
      }))
    }

    // Check if we're adding to a tab using module-level context
    if (currentTabContext.value && currentTabContext.value.tabsComponent) {
      console.log('🔧 Adding component to tab using currentTabContext:', {
        tabIndex: currentTabContext.value.tabIndex,
        component: newComponent,
        tabsComponent: currentTabContext.value.tabsComponent
      })
      
      // Add to the specific tab
      handleAddComponentToTab(
        currentTabContext.value.tabsComponent,
        currentTabContext.value.tabsComponentIndex,
        currentTabContext.value.tabIndex,
        newComponent
      )
      
      // Clear tab context
      currentTabContext.value = null
    } else {
      // Normal component addition to main form
      formSchema.value.components.push(newComponent)

      // Auto-assign to current section if sections exist
      if (formSchema.value.sections && formSchema.value.sections.length > 0 && sectionManagerRef.value) {
        sectionManagerRef.value.assignComponentToCurrentSection(newComponent.key)
      }

      selectComponent(newComponent, formSchema.value.components.length - 1)
    }
  } catch (err) {
    console.error('Error adding component:', err)
    showError(t('formBuilder.errors.addComponentFailed'))
  }
}


const selectComponent = (component: FormComponent, index: number) => {
  selectedComponent.value = { ...component }
  selectedComponentIndex.value = index
  selectedComponentPath.value = null // Clear nested component path for regular components
  console.log('Selected component:', component, 'Index:', index) // Debug log
}

const updateSelectedComponent = (updatedComponent: FormComponent) => {
  try {
    // Handle nested components (components inside columns, panels, etc.)
    if (selectedComponentPath.value) {
      const { containerIndex, columnIndex, componentIndex } = selectedComponentPath.value

      console.log('🔧 Updating nested component:', {
        containerIndex,
        columnIndex,
        componentIndex,
        componentType: updatedComponent.type
      })

      // Get the container component
      const containerComponent = formSchema.value.components[containerIndex]
      if (!containerComponent) {
        console.error('❌ Container component not found')
        return
      }

      // Handle column components
      if (columnIndex !== undefined && componentIndex !== undefined) {
        if (!containerComponent.columns || !containerComponent.columns[columnIndex]) {
          console.error('❌ Column not found')
          return
        }

        // Update the specific component in the column
        containerComponent.columns[columnIndex].components[componentIndex] = updatedComponent

        // Trigger Vue reactivity by replacing the entire container component
        const updatedContainer = { ...containerComponent }
        formSchema.value.components.splice(containerIndex, 1, updatedContainer)

        console.log('✅ Nested component updated successfully')
      }

      selectedComponent.value = { ...updatedComponent }

    } else if (selectedComponentIndex.value >= 0) {
      // Handle regular components (not nested)
      formSchema.value.components[selectedComponentIndex.value] = updatedComponent
      selectedComponent.value = { ...updatedComponent }
      console.log('✅ Regular component updated successfully')
    }

  } catch (error: unknown) {
    console.error('❌ Error updating selected component:', error)
    showError(t('formBuilder.errorEditingComponent'))
  }
}

const editComponent = (component: FormComponent, index: number) => {
  // If user explicitly edits the component (e.g., Tabs container), clear tab edit context
  if (currentTabEditContext.value) {
    currentTabEditContext.value = null
  }
  selectComponent(component, index)
}

// Deep clone component with new unique keys for all nested elements
const deepCloneWithNewKeys = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepCloneWithNewKeys(item))
  }

  const cloned: any = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]

      // Handle special cases for different component types
      if (key === 'key' && typeof value === 'string') {
        // Generate new unique key for components
        const type = obj.type || 'component'
        cloned[key] = generateUniqueKey(type)
      } else if (key === 'id' && typeof value === 'string') {
        // Generate new unique ID for tree nodes, survey questions, etc.
        const type = obj.type || 'item'
        cloned[key] = generateUniqueKey(type)
      } else if (key === 'value' && typeof value === 'string' && obj.type) {
        // Generate new unique value for tree nodes
        cloned[key] = generateUniqueKey(obj.type)
      } else if (key === 'components' && Array.isArray(value)) {
        // Recursively clone nested components
        cloned[key] = value.map(comp => deepCloneWithNewKeys(comp))
      } else if (key === 'columns' && Array.isArray(value)) {
        // Handle columns structure (for columns component)
        cloned[key] = value.map(column => ({
          ...deepCloneWithNewKeys(column),
          components: column.components ? column.components.map((comp: any) => deepCloneWithNewKeys(comp)) : []
        }))
      } else if (key === 'rows' && Array.isArray(value)) {
        // Handle table rows structure - supports both old and new formats
        cloned[key] = value.map((row: any) => {
          // New structure: row is an object with cells array
          if (row && typeof row === 'object' && row.cells && Array.isArray(row.cells)) {
            return {
              ...deepCloneWithNewKeys(row),
              cells: row.cells.map((cell: any) => ({
                ...deepCloneWithNewKeys(cell),
                components: cell.components ? cell.components.map((comp: any) => deepCloneWithNewKeys(comp)) : []
              }))
            }
          }
          // Old structure: row is array of cells directly
          else if (Array.isArray(row)) {
            return row.map((cell: any) => ({
              ...deepCloneWithNewKeys(cell),
              components: cell.components ? cell.components.map((comp: any) => deepCloneWithNewKeys(comp)) : []
            }))
          }
          // Fallback: clone as-is
          else {
            return deepCloneWithNewKeys(row)
          }
        })
      } else if (key === 'defaultValue' && Array.isArray(value)) {
        // Handle DataGrid defaultValue with row-specific components
        cloned[key] = value.map((rowData: any) => {
          const clonedRow = { ...rowData }
          if (rowData._components && Array.isArray(rowData._components)) {
            clonedRow._components = rowData._components.map((comp: any) => deepCloneWithNewKeys(comp))
          }
          return clonedRow
        })
      } else if (key === 'data' && obj.type === 'tree' && value && value.tree) {
        // Handle tree component data structure
        cloned[key] = {
          ...value,
          tree: value.tree.map((node: any) => deepCloneWithNewKeys(node))
        }
      } else if (key === 'children' && Array.isArray(value)) {
        // Handle tree node children
        cloned[key] = value.map((child: any) => deepCloneWithNewKeys(child))
      } else if (key === 'questions' && Array.isArray(value)) {
        // Handle survey questions
        cloned[key] = value.map((question: any) => deepCloneWithNewKeys(question))
      } else if (key === 'values' && Array.isArray(value)) {
        // Handle resource values
        cloned[key] = value.map((val: any) => deepCloneWithNewKeys(val))
      } else if (typeof value === 'object' && value !== null) {
        // Recursively clone nested objects
        cloned[key] = deepCloneWithNewKeys(value)
      } else {
        // Copy primitive values as-is
        cloned[key] = value
      }
    }
  }

  return cloned
}

const duplicateComponent = (component: FormComponent, index: number) => {
  console.log('📋 DUPLICATE BUTTON CLICKED - Duplicating component at index:', index)
  console.log('📋 Component type:', component.type)
  console.log('📋 Original component data:', component)

  try {
    // Use deep clone with new keys to handle all nested structures
    const duplicated = deepCloneWithNewKeys(component)

    // Ensure the main component has a new key (safety check)
    if (!duplicated.key || duplicated.key === component.key) {
      duplicated.key = generateUniqueKey(component.type)
    }

    // Special handling for table components
    if (component.type === 'table') {
      console.log('📋 Special handling for table component duplication')

      // Ensure headers are properly copied
      if (component.headers && Array.isArray(component.headers)) {
        duplicated.headers = [...component.headers]
        console.log('📋 Table headers copied:', duplicated.headers)
      }

      // Ensure rows structure is properly maintained
      if (component.rows && Array.isArray(component.rows)) {
        console.log('📋 Original table rows count:', component.rows.length)
        console.log('📋 Duplicated table rows count:', duplicated.rows?.length || 0)

        // Verify each row structure
        duplicated.rows?.forEach((row: any, rowIndex: number) => {
          if (row.cells && Array.isArray(row.cells)) {
            console.log(`📋 Row ${rowIndex} has ${row.cells.length} cells`)
            row.cells.forEach((cell: any, cellIndex: number) => {
              if (cell.components && Array.isArray(cell.components)) {
                console.log(`📋 Row ${rowIndex}, Cell ${cellIndex} has ${cell.components.length} components`)
              }
            })
          }
        })
      }
    }

    // Add the duplicated component right after the original
    formSchema.value.components.splice(index + 1, 0, duplicated)

    console.log('✅ Component duplicated successfully. Total components:', formSchema.value.components.length)
    console.log('✅ New component key:', duplicated.key)
    console.log('✅ Duplicated component data:', duplicated)

    // Show success message
    success(t('duplication.componentDuplicated'))

    // Trigger UI update with special handling for tables
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          forceRerender: true,
          action: 'component-duplicated',
          componentType: component.type
        }
      }))

      // Additional update for table components
      if (component.type === 'table') {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('force-table-rerender', {
            detail: { action: 'table-duplicated' }
          }))
        }, 100)
      }
    })

  } catch (error) {
    console.error('❌ Error duplicating component:', error)
    console.error('❌ Error details:', (error as Error).message)
    console.error('❌ Component that failed to duplicate:', component)
    showError(t('duplication.errorDuplicatingComponent'))
  }
}

const deleteComponent = (index: number) => {
  // Validation
  if (index < 0 || index >= formSchema.value.components.length) {
    console.error('❌ Invalid component index for deletion:', index)
    return false
  }

  try {
    const componentToDelete = formSchema.value.components[index]
    if (!componentToDelete) {
      console.error('❌ Component not found at index:', index)
      return false
    }

    // Remove component from all sections
    if (formSchema.value.sections && componentToDelete.key) {
      formSchema.value.sections.forEach(section => {
        const componentIndex = section.componentIds.indexOf(componentToDelete.key)
        if (componentIndex > -1) {
          section.componentIds.splice(componentIndex, 1)
        }
      })
    }

    // Remove component from nested containers (columns, panels, tabs, etc.)
    if (componentToDelete.key) {
      formSchema.value.components.forEach(containerComponent => {
        removeComponentFromContainer(containerComponent, componentToDelete.key)
      })
    }

    // Clear selection if deleting selected component
    if (selectedComponentIndex.value === index) {
      selectedComponent.value = null
      selectedComponentIndex.value = -1
      selectedComponentPath.value = null
    } else if (selectedComponentIndex.value > index) {
      selectedComponentIndex.value--
    }

    // Remove the component
    formSchema.value.components.splice(index, 1)

    // Minimal success logging
    console.log('✅ Component deleted:', componentToDelete.type, 'Remaining:', formSchema.value.components.length)

    // Efficient reactivity update
    nextTick(() => {
      // Trigger re-render if needed
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('component-deleted', {
          detail: { deletedComponent: componentToDelete, remainingCount: formSchema.value.components.length }
        })
        window.dispatchEvent(event)
      }
    })

    return true
  } catch (error: unknown) {
    console.error('❌ Error deleting component:', error)
    return false
  }
}

// DataGrid Column Management Functions
const handleAddDataGridColumn = (dataGridComponent: FormComponent, dataGridIndex: number) => {
  console.log('➕ Adding new column to DataGrid:', { dataGridIndex })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      return
    }

    // Create a new component for the column
    const newComponent = createComponentFromType('textfield')
    if (!newComponent) {
      console.error('❌ Failed to create new component')
      return
    }

    // TypeScript now knows newComponent is not null after the guard clause
    newComponent.key = generateUniqueKey('column')
    newComponent.label = `Column ${(targetDataGrid.components?.length || 0) + 1}`

    // Add component to DataGrid
    if (!targetDataGrid.components) {
      targetDataGrid.components = []
    }
    targetDataGrid.components.push(newComponent)

    // Add default value for new column in all existing rows
    if (targetDataGrid.defaultValue && Array.isArray(targetDataGrid.defaultValue)) {
      targetDataGrid.defaultValue.forEach((row: any) => {
        if (row && typeof row === 'object' && !row._isEmpty) {
          row[newComponent.key] = ''
        }
      })
    }

    // Update the component in formSchema array to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    console.log('✅ Column added to DataGrid')
    success(t('formBuilder.columnAdded') || 'Column added successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('datagrid-column-added', {
        detail: {
          dataGridIndex,
          newColumnIndex: updatedDataGrid.components.length - 1
        }
      })
      window.dispatchEvent(event)
    })

  } catch (err) {
    console.error('❌ Error adding DataGrid column:', err)
    showError(t('formBuilder.errorAddingColumn') || 'Error adding column')
  }
}



const handleDeleteDataGridColumn = (dataGridComponent: FormComponent, dataGridIndex: number, columnIndex: number) => {
  console.log('🗑️ Deleting DataGrid column:', { dataGridIndex, columnIndex })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      return
    }

    if (!targetDataGrid.components || columnIndex < 0 || columnIndex >= targetDataGrid.components.length) {
      console.error('❌ Invalid column index:', columnIndex)
      return
    }

    // Get the component key before deletion
    const componentToDelete = targetDataGrid.components[columnIndex]
    const componentKey = componentToDelete.key

    // Remove component from DataGrid
    targetDataGrid.components.splice(columnIndex, 1)

    // Remove data for this column from all rows
    if (targetDataGrid.defaultValue && Array.isArray(targetDataGrid.defaultValue)) {
      targetDataGrid.defaultValue.forEach((row: any) => {
        if (row && typeof row === 'object' && componentKey) {
          delete row[componentKey]
        }
      })
    }

    // Update the component in formSchema array to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    console.log('✅ Column deleted from DataGrid')
    success(t('formBuilder.columnDeleted') || 'Column deleted successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('datagrid-column-deleted', {
        detail: {
          dataGridIndex,
          deletedColumnIndex: columnIndex
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error deleting DataGrid column:', error)
    showError(t('formBuilder.errorDeletingColumn') || 'Error deleting column')
  }
}

const handleUpdateDataGridHeader = (dataGridComponent: FormComponent, dataGridIndex: number, columnIndex: number, newHeaderName: string) => {
  console.log('✏️ Updating DataGrid header:', { dataGridIndex, columnIndex, newHeaderName })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      return
    }

    if (!targetDataGrid.components || columnIndex < 0 || columnIndex >= targetDataGrid.components.length) {
      console.error('❌ Invalid column index:', columnIndex)
      return
    }

    // Update the component label
    targetDataGrid.components[columnIndex].label = newHeaderName

    // Update the component in formSchema array to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    console.log('✅ DataGrid header updated')
    success(t('formBuilder.headerUpdated') || 'Header updated successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('datagrid-header-updated', {
        detail: {
          dataGridIndex,
          columnIndex,
          newHeaderName
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error updating DataGrid header:', error)
    showError(t('formBuilder.errorUpdatingHeader') || 'Error updating header')
  }
}

const handleUpdateDataGridCell = (dataGridComponent: FormComponent, dataGridIndex: number, rowIndex: number, fieldKey: string, newValue: any) => {
  console.log('📝 Updating DataGrid cell:', { dataGridIndex, rowIndex, fieldKey, newValue })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      return
    }

    if (!targetDataGrid.defaultValue || !Array.isArray(targetDataGrid.defaultValue)) {
      console.error('❌ DataGrid has no data rows')
      return
    }

    if (rowIndex < 0 || rowIndex >= targetDataGrid.defaultValue.length) {
      console.error('❌ Invalid row index:', rowIndex)
      return
    }

    // Update the cell value in the specified row
    if (!targetDataGrid.defaultValue[rowIndex]) {
      targetDataGrid.defaultValue[rowIndex] = {}
    }
    targetDataGrid.defaultValue[rowIndex][fieldKey] = newValue

    // Update the component in formSchema array to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    console.log('✅ DataGrid cell updated')
    success(t('formBuilder.cellUpdated') || 'Cell updated successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('datagrid-cell-updated', {
        detail: {
          dataGridIndex,
          rowIndex,
          fieldKey,
          newValue
        }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error updating DataGrid cell:', error)
    showError(t('formBuilder.errorUpdatingCell') || 'Error updating cell')
  }
}

// ===== TREE COMPONENT HANDLERS =====

const handleAddTreeNode = (treeComponent: FormComponent, treeIndex: number, treeComponentData: FormComponent) => {
  console.log('🌳 Handling add tree node:', {
    treeComponent: treeComponent.type,
    treeIndex,
    treeComponentData
  })

  try {
    const targetTree = formSchema.value.components[treeIndex]
    if (!targetTree || targetTree.type !== 'tree') {
      console.error('❌ Target Tree not found')
      return
    }

    // Initialize tree data if not exists
    if (!targetTree.data) {
      targetTree.data = { tree: [] }
    }
    if (!targetTree.data.tree) {
      targetTree.data.tree = []
    }

    // Create new tree node
    const newNode = {
      id: generateUniqueKey('node'),
      label: t('formBuilder.rootNode') || 'New Node',
      value: generateUniqueKey('node'),
      children: [],
      expanded: false
    }

    targetTree.data.tree.push(newNode)

    // Force Vue reactivity by updating the entire formSchema
    // First update the original component
    formSchema.value.components[treeIndex] = {
      ...targetTree,
      data: {
        ...targetTree.data,
        tree: [...targetTree.data.tree]
      }
    }

    console.log('✅ New tree node added:', newNode)
    console.log('✅ Updated tree data:', formSchema.value.components[treeIndex].data.tree)
    success(t('formBuilder.componentAdded') || 'Node added successfully')

    // Trigger UI update with multiple methods to ensure reactivity
    nextTick(() => {
      const event = new CustomEvent('component-updated', {
        detail: { type: 'tree-node-added', treeIndex, nodeId: newNode.id }
      })
      window.dispatchEvent(event)

      // Also trigger a force update for the tree component specifically
      const treeUpdateEvent = new CustomEvent('tree-updated', {
        detail: { treeIndex, action: 'add-node', nodeId: newNode.id }
      })
      window.dispatchEvent(treeUpdateEvent)
    })

  } catch (error: unknown) {
    console.error('❌ Error adding tree node:', error)
    showError(t('formBuilder.errorAddingComponent') || 'Error adding node')
  }
}

const handleEditTreeNode = (treeComponent: FormComponent, treeIndex: number, node: any, treeComponentData: FormComponent) => {
  console.log('🌳 Handling edit tree node:', {
    treeComponent: treeComponent.type,
    treeIndex,
    node
  })

  try {
    // Create a temporary component for the tree node to edit its properties
    const nodeComponent: FormComponent = {
      type: 'treenode',
      key: `tree_node_${node.id}`,
      label: node.label || 'Tree Node',
      input: false,
      // Store the node data for editing
      nodeData: {
        id: node.id,
        label: node.label,
        value: node.value,
        expanded: node.expanded
      },
      // Store tree information for updating
      treeInfo: {
        treeIndex,
        treeComponent: treeComponent
      }
    }

    // Set this as the selected component for editing
    selectedComponent.value = nodeComponent
    selectedComponentPath.value = {
      containerIndex: treeIndex,
      componentIndex: -1, // Special case for tree nodes
      path: `tree.node.${node.id}`,
      containerType: 'tree-node'
    }

    console.log('✏️ Tree node selected for editing:', node)
    success(t('formBuilder.componentSelected') || 'Node selected for editing')

  } catch (error: unknown) {
    console.error('❌ Error editing tree node:', error)
    showError(t('formBuilder.errorSelectingComponent') || 'Error selecting node for editing')
  }
}

const handleDeleteTreeNode = (treeComponent: FormComponent, treeIndex: number, node: any, treeComponentData: FormComponent) => {
  console.log('🌳 Handling delete tree node:', {
    treeComponent: treeComponent.type,
    treeIndex,
    node
  })

  try {
    const targetTree = formSchema.value.components[treeIndex]
    if (!targetTree || targetTree.type !== 'tree') {
      console.error('❌ Target Tree not found')
      return
    }

    if (!targetTree.data || !targetTree.data.tree || !Array.isArray(targetTree.data.tree)) {
      console.error('❌ No tree data to delete from')
      return
    }

    // Add confirmation dialog for deletion
    const confirmed = confirm(t('formBuilder.confirmDeleteNode') || 'Are you sure you want to delete this node?')
    if (!confirmed) {
      console.log('🚫 Node deletion cancelled by user')
      return
    }

    // Find and remove the node recursively (handle nested nodes)
    const removeNodeRecursively = (nodes: any[], targetId: any): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId) {
          nodes.splice(i, 1)
          return true
        }
        if (nodes[i].children && removeNodeRecursively(nodes[i].children, targetId)) {
          return true
        }
      }
      return false
    }

    if (removeNodeRecursively(targetTree.data.tree, node.id)) {
      // Force Vue reactivity by updating the entire formSchema
      formSchema.value.components[treeIndex] = {
        ...targetTree,
        data: {
          ...targetTree.data,
          tree: [...targetTree.data.tree]
        }
      }

      // Clear selection if the deleted node was selected
      if (selectedComponent.value && selectedComponent.value.nodeData?.id === node.id) {
        selectedComponent.value = null
        selectedComponentPath.value = null
      }

      console.log('✅ Tree node deleted successfully:', node.id)
      success(t('formBuilder.componentDeleted') || 'Node deleted successfully')

      // Trigger UI update
      nextTick(() => {
        const event = new CustomEvent('component-updated', {
          detail: { type: 'tree-node-deleted', treeIndex, nodeId: node.id }
        })
        window.dispatchEvent(event)

        // Also trigger tree-specific update
        const treeUpdateEvent = new CustomEvent('tree-updated', {
          detail: { treeIndex, action: 'delete-node', nodeId: node.id }
        })
        window.dispatchEvent(treeUpdateEvent)
      })
    } else {
      console.error('❌ Node not found for deletion:', node.id)
      showError(t('formBuilder.errorDeletingComponent') || 'Node not found for deletion')
    }

  } catch (error: unknown) {
    console.error('❌ Error deleting tree node:', error)
    showError(t('formBuilder.errorDeletingComponent') || 'Error deleting node')
  }
}

// Handle tree node property updates
const handleTreeNodeUpdate = (updateData: any) => {
  console.log('🌳 Handling tree node update:', updateData)

  try {
    const { nodeId, nodeData, treeIndex } = updateData

    if (typeof treeIndex !== 'number' || !nodeId || !nodeData) {
      console.error('❌ Invalid tree node update data')
      return
    }

    const targetTree = formSchema.value.components[treeIndex]
    if (!targetTree || targetTree.type !== 'tree') {
      console.error('❌ Target Tree not found for update')
      return
    }

    if (!targetTree.data || !targetTree.data.tree || !Array.isArray(targetTree.data.tree)) {
      console.error('❌ No tree data to update')
      return
    }

    // Find and update the node recursively
    const updateNodeRecursively = (nodes: any[], targetId: any, newData: any): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId) {
          // Update node properties
          nodes[i] = {
            ...nodes[i],
            label: newData.label || nodes[i].label,
            value: newData.value || nodes[i].value,
            expanded: typeof newData.expanded === 'boolean' ? newData.expanded : nodes[i].expanded
          }
          console.log('✅ Tree node updated:', nodes[i])
          return true
        }
        if (nodes[i].children && updateNodeRecursively(nodes[i].children, targetId, newData)) {
          return true
        }
      }
      return false
    }

    if (updateNodeRecursively(targetTree.data.tree, nodeId, nodeData)) {
      // Force Vue reactivity by updating the entire formSchema
      formSchema.value.components[treeIndex] = {
        ...targetTree,
        data: {
          ...targetTree.data,
          tree: [...targetTree.data.tree]
        }
      }

      console.log('✅ Tree node properties updated successfully:', nodeId)
      success(t('formBuilder.nodeUpdated') || 'Node properties updated successfully')

      // Trigger UI update
      nextTick(() => {
        const event = new CustomEvent('component-updated', {
          detail: { type: 'tree-node-updated', treeIndex, nodeId }
        })
        window.dispatchEvent(event)

        // Also trigger tree-specific update
        const treeUpdateEvent = new CustomEvent('tree-updated', {
          detail: { treeIndex, action: 'update-node', nodeId }
        })
        window.dispatchEvent(treeUpdateEvent)
      })
    } else {
      console.error('❌ Node not found for update:', nodeId)
      showError(t('formBuilder.errorUpdatingNode') || 'Node not found for update')
    }

  } catch (error: unknown) {
    console.error('❌ Error updating tree node:', error)
    showError(t('formBuilder.errorUpdatingNode') || 'Error updating node properties')
  }
}

const handleAddTreeChildNode = (treeComponent: FormComponent, treeIndex: number, parentNode: any, treeComponentData: FormComponent) => {
  console.log('🌳 Handling add tree child node:', {
    treeComponent: treeComponent.type,
    treeIndex,
    parentNode
  })

  try {
    const targetTree = formSchema.value.components[treeIndex]
    if (!targetTree || targetTree.type !== 'tree') {
      console.error('❌ Target Tree not found')
      return
    }

    // Initialize tree data if not exists
    if (!targetTree.data) {
      targetTree.data = { tree: [] }
    }
    if (!targetTree.data.tree) {
      targetTree.data.tree = []
    }

    // Create new child node
    const newChildNode = {
      id: generateUniqueKey('child'),
      label: t('formBuilder.childNode') || 'New Child Node',
      value: generateUniqueKey('child'),
      children: [],
      expanded: false
    }

    // Find parent node and add child (simplified implementation)
    const findAndAddChild = (nodes: any[]): boolean => {
      for (const node of nodes) {
        if (node.id === parentNode.id) {
          if (!node.children) node.children = []
          node.children.push(newChildNode)
          node.expanded = true // Expand parent to show new child
          return true
        }
        if (node.children && findAndAddChild(node.children)) {
          return true
        }
      }
      return false
    }

    if (targetTree.data.tree && findAndAddChild(targetTree.data.tree)) {
      // Force Vue reactivity by updating the entire formSchema
      formSchema.value.components[treeIndex] = {
        ...targetTree,
        data: {
          ...targetTree.data,
          tree: [...targetTree.data.tree]
        }
      }

      console.log('✅ Child node added to tree')
      success(t('formBuilder.componentAdded') || 'Child node added successfully')

      // Trigger UI update
      nextTick(() => {
        const event = new CustomEvent('component-updated', {
          detail: { type: 'tree-child-added', treeIndex, parentNodeId: parentNode.id }
        })
        window.dispatchEvent(event)

        // Also trigger tree-specific update
        const treeUpdateEvent = new CustomEvent('tree-updated', {
          detail: { treeIndex, action: 'add-child', parentNodeId: parentNode.id }
        })
        window.dispatchEvent(treeUpdateEvent)
      })
    }

  } catch (error: unknown) {
    console.error('❌ Error adding tree child node:', error)
    showError(t('formBuilder.errorAddingComponent') || 'Error adding child node')
  }
}

// ===== SURVEY COMPONENT HANDLERS =====

const handleAddSurveyQuestion = (question: any, surveyComponent: FormComponent) => {
  console.log('📋 Handling add survey question:', {
    question,
    surveyComponent: surveyComponent.type
  })

  try {
    const surveyIndex = formSchema.value.components.findIndex(comp => comp.key === surveyComponent.key)
    if (surveyIndex === -1) {
      console.error('❌ Target Survey not found')
      return
    }

    const targetSurvey = formSchema.value.components[surveyIndex]
    if (!targetSurvey || targetSurvey.type !== 'survey') {
      console.error('❌ Target Survey not found')
      return
    }

    // Initialize survey questions if not exists
    if (!targetSurvey.questions) {
      targetSurvey.questions = []
    }

    // Add the new question
    targetSurvey.questions.push(question)

    // Update the component in formSchema array to trigger reactivity
    const updatedSurvey = JSON.parse(JSON.stringify(targetSurvey))
    formSchema.value.components.splice(surveyIndex, 1, updatedSurvey)

    console.log('✅ New survey question added')
    success(t('survey.questionAdded') || 'Question added successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated')
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error adding survey question:', error)
    showError(t('survey.errorAddingQuestion') || 'Error adding question')
  }
}

const handleUpdateSurveyQuestion = (question: any, questionIndex: number, surveyComponent: FormComponent) => {
  console.log('📋 Handling update survey question:', {
    question,
    questionIndex,
    surveyComponent: surveyComponent.type
  })

  try {
    const surveyIndex = formSchema.value.components.findIndex(comp => comp.key === surveyComponent.key)
    if (surveyIndex === -1) {
      console.error('❌ Target Survey not found')
      return
    }

    const targetSurvey = formSchema.value.components[surveyIndex]
    if (!targetSurvey || targetSurvey.type !== 'survey') {
      console.error('❌ Target Survey not found')
      return
    }

    if (!targetSurvey.questions || !Array.isArray(targetSurvey.questions)) {
      console.error('❌ No survey questions to update')
      return
    }

    if (questionIndex < 0 || questionIndex >= targetSurvey.questions.length) {
      console.error('❌ Invalid question index:', questionIndex)
      return
    }

    // Update the question
    targetSurvey.questions[questionIndex] = question

    // Update the component in formSchema array to trigger reactivity
    const updatedSurvey = JSON.parse(JSON.stringify(targetSurvey))
    formSchema.value.components.splice(surveyIndex, 1, updatedSurvey)

    console.log('✅ Survey question updated')
    success(t('survey.questionUpdated') || 'Question updated successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated')
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error updating survey question:', error)
    showError(t('survey.errorUpdatingQuestion') || 'Error updating question')
  }
}

const handleEditSurveyQuestion = (question: any, questionIndex: number, surveyComponent: FormComponent) => {
  console.log('📋 Handling edit survey question:', {
    question,
    questionIndex,
    surveyComponent: surveyComponent.type
  })

  try {
    // This is now handled by the modal in ComponentPreview
    console.log('✏️ Edit survey question:', question)
    success(t('survey.questionEditOpened') || 'Question edit opened')

  } catch (error: unknown) {
    console.error('❌ Error editing survey question:', error)
    showError(t('survey.errorEditingQuestion') || 'Error editing question')
  }
}

const handleDeleteSurveyQuestion = (question: any, questionIndex: number, surveyComponent: FormComponent) => {
  console.log('📋 Handling delete survey question:', {
    question,
    questionIndex,
    surveyComponent: surveyComponent.type
  })

  try {
    const surveyIndex = formSchema.value.components.findIndex(comp => comp.key === surveyComponent.key)
    if (surveyIndex === -1) {
      console.error('❌ Target Survey not found')
      return
    }

    const targetSurvey = formSchema.value.components[surveyIndex]
    if (!targetSurvey || targetSurvey.type !== 'survey') {
      console.error('❌ Target Survey not found')
      return
    }

    if (!targetSurvey.questions || !Array.isArray(targetSurvey.questions)) {
      console.error('❌ No survey questions to delete')
      return
    }

    if (questionIndex < 0 || questionIndex >= targetSurvey.questions.length) {
      console.error('❌ Invalid question index:', questionIndex)
      return
    }

    // Remove the question
    targetSurvey.questions.splice(questionIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedSurvey = JSON.parse(JSON.stringify(targetSurvey))
    formSchema.value.components.splice(surveyIndex, 1, updatedSurvey)

    console.log('✅ Survey question deleted')
    success(t('survey.questionDeleted') || 'Question deleted successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated')
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error deleting survey question:', error)
    showError(t('survey.errorDeletingQuestion') || 'Error deleting question')
  }
}

// New survey question handlers for preview
const handleEditSurveyQuestionNew = (surveyComponent: FormComponent, surveyIndex: number, questionIndex: number, question: any) => {
  console.log('📋 Handling edit survey question (NEW):', {
    questionIndex,
    question,
    surveyIndex
  })

  try {
    const targetSurvey = formSchema.value.components[surveyIndex]
    if (!targetSurvey || targetSurvey.type !== 'survey') {
      console.error('❌ Target Survey not found')
      return
    }

    // Open modal for editing
    currentSurveyContext.value = { surveyComponent, surveyIndex, questionIndex }
    editingSurveyQuestion.value = { ...question }
    isEditingSurveyQuestion.value = true
    showSurveyQuestionModal.value = true

  } catch (error: unknown) {
    console.error('❌ Error editing survey question:', error)
    showError(t('survey.errorEditingQuestion') || 'Error editing question')
  }
}

const handleDeleteSurveyQuestionNew = (surveyComponent: FormComponent, surveyIndex: number, questionIndex: number, question: any) => {
  console.log('📋 Handling delete survey question (NEW):', {
    questionIndex,
    question,
    surveyIndex
  })

  try {
    const targetSurvey = formSchema.value.components[surveyIndex]
    if (!targetSurvey || targetSurvey.type !== 'survey') {
      console.error('❌ Target Survey not found')
      return
    }

    if (!targetSurvey.questions || !Array.isArray(targetSurvey.questions)) {
      console.error('❌ No survey questions to delete')
      return
    }

    if (questionIndex < 0 || questionIndex >= targetSurvey.questions.length) {
      console.error('❌ Invalid question index:', questionIndex)
      return
    }

    // Remove the question
    targetSurvey.questions.splice(questionIndex, 1)

    // Update the component in formSchema array to trigger reactivity
    const updatedSurvey = JSON.parse(JSON.stringify(targetSurvey))
    formSchema.value.components.splice(surveyIndex, 1, updatedSurvey)

    console.log('✅ Survey question deleted')
    success(t('survey.questionDeleted') || 'تم حذف السؤال بنجاح')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated')
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error deleting survey question:', error)
    showError(t('survey.errorDeletingQuestion') || 'خطأ في حذف السؤال')
  }
}

const openSurveyQuestionModalForComponent = (surveyComponent: FormComponent, surveyIndex: number) => {
  console.log('📋 Opening survey question modal for component:', {
    surveyIndex,
    surveyComponent: surveyComponent.type
  })

  try {
    // Open modal for adding new question
    currentSurveyContext.value = { surveyComponent, surveyIndex }
    editingSurveyQuestion.value = null
    isEditingSurveyQuestion.value = false
    showSurveyQuestionModal.value = true
  } catch (error: unknown) {
    console.error('❌ Error opening survey question modal:', error)
  }
}

const handlePreviewSurvey = (surveyComponent: FormComponent, surveyIndex: number, surveyComponentData: FormComponent) => {
  console.log('📋 Handling preview survey:', {
    surveyComponent: surveyComponent.type,
    surveyIndex,
    surveyComponentData
  })

  try {
    // For now, just log the action - in a real implementation, this would open a preview modal
    console.log('👁️ Preview survey:', surveyComponentData)
    success(t('survey.previewOpened') || 'Survey preview opened')

  } catch (error: unknown) {
    console.error('❌ Error previewing survey:', error)
    showError(t('survey.errorPreviewingSurvey') || 'Error previewing survey')
  }
}

// ===== RESOURCE COMPONENT HANDLERS =====

const handleConfigureResource = (resourceComponent: FormComponent, resourceIndex: number, resourceComponentData: FormComponent) => {
  console.log('🔗 Handling configure resource:', {
    resourceComponent: resourceComponent.type,
    resourceIndex,
    resourceComponentData
  })

  try {
    // For now, just log the action - in a real implementation, this would open a configuration modal
    console.log('⚙️ Configure resource:', resourceComponentData)
    success(t('resource.configurationOpened') || 'Resource configuration opened')

  } catch (error: unknown) {
    console.error('❌ Error configuring resource:', error)
    showError(t('resource.errorConfiguringResource') || 'Error configuring resource')
  }
}

const handleRefreshResource = (resourceComponent: FormComponent, resourceIndex: number, resourceComponentData: FormComponent) => {
  console.log('🔗 Handling refresh resource:', {
    resourceComponent: resourceComponent.type,
    resourceIndex,
    resourceComponentData
  })

  try {
    const targetResource = formSchema.value.components[resourceIndex]
    if (!targetResource || targetResource.type !== 'resource') {
      console.error('❌ Target Resource not found')
      return
    }

    // Simulate refreshing resource data
    if (!targetResource.data) {
      targetResource.data = []
    }

    // Add timestamp to indicate refresh
    targetResource.lastRefresh = new Date().toISOString()

    // Update the component in formSchema array to trigger reactivity
    const updatedResource = JSON.parse(JSON.stringify(targetResource))
    formSchema.value.components.splice(resourceIndex, 1, updatedResource)

    console.log('✅ Resource refreshed')
    success(t('resource.resourceRefreshed') || 'Resource refreshed successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('component-updated')
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error refreshing resource:', error)
    showError(t('resource.errorRefreshingResource') || 'Error refreshing resource')
  }
}

const handleViewResourceItem = (resourceComponent: FormComponent, resourceIndex: number, item: any, itemIndex: number, resourceComponentData: FormComponent) => {
  console.log('🔗 Handling view resource item:', {
    resourceComponent: resourceComponent.type,
    resourceIndex,
    item,
    itemIndex
  })

  try {
    // For now, just log the action - in a real implementation, this would open a view modal
    console.log('👁️ View resource item:', item)
    success(t('resource.itemViewOpened') || 'Resource item view opened')

  } catch (error: unknown) {
    console.error('❌ Error viewing resource item:', error)
    showError(t('resource.errorViewingItem') || 'Error viewing resource item')
  }
}

const handleEditResourceItem = (resourceComponent: FormComponent, resourceIndex: number, item: any, itemIndex: number, resourceComponentData: FormComponent) => {
  console.log('🔗 Handling edit resource item:', {
    resourceComponent: resourceComponent.type,
    resourceIndex,
    item,
    itemIndex
  })

  try {
    // For now, just log the action - in a real implementation, this would open an edit modal
    console.log('✏️ Edit resource item:', item)
    success(t('resource.itemEditOpened') || 'Resource item edit opened')

  } catch (error: unknown) {
    console.error('❌ Error editing resource item:', error)
    showError(t('resource.errorEditingItem') || 'Error editing resource item')
  }
}

const addComponentMobile = (componentDef: ComponentDefinition) => {
  addComponent(componentDef)
  // Auto-hide components panel after adding on mobile for better UX
  showMobileComponents.value = false
}

// ===== SIGNATURE COMPONENT HANDLERS =====

const handleSignatureChange = (componentKey: string, signatureData: string) => {
  try {
    console.log('✍️ Handling signature change:', { componentKey, signatureDataLength: signatureData?.length || 0 })

    // Find the signature component in the form schema
    const signatureComponent = formSchema.value.components.find(comp => comp.key === componentKey)
    if (!signatureComponent || signatureComponent.type !== 'signature') {
      console.error('❌ Signature component not found:', componentKey)
      return
    }

    // Update the signature component's value
    signatureComponent.value = signatureData
    signatureComponent.signed = !!signatureData

    // Also update defaultValue for form submission
    signatureComponent.defaultValue = signatureData

    console.log('✅ Signature data updated successfully')
    success(t('signature.signatureSaved') || 'Signature saved successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('signature-updated', {
        detail: { componentKey, signatureData, signed: !!signatureData }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error handling signature change:', error)
    showError(t('signature.errorSaving') || 'Error saving signature')
  }
}

const handleSignatureClear = (componentKey: string) => {
  try {
    console.log('🗑️ Handling signature clear:', { componentKey })

    // Find the signature component in the form schema
    const signatureComponent = formSchema.value.components.find(comp => comp.key === componentKey)
    if (!signatureComponent || signatureComponent.type !== 'signature') {
      console.error('❌ Signature component not found:', componentKey)
      return
    }

    // Clear the signature component's value
    signatureComponent.value = ''
    signatureComponent.signed = false
    signatureComponent.defaultValue = ''

    console.log('✅ Signature cleared successfully')
    success(t('signature.signatureCleared') || 'Signature cleared successfully')

    // Trigger UI update
    nextTick(() => {
      const event = new CustomEvent('signature-cleared', {
        detail: { componentKey }
      })
      window.dispatchEvent(event)
    })

  } catch (error: unknown) {
    console.error('❌ Error handling signature clear:', error)
    showError(t('signature.errorClearing') || 'Error clearing signature')
  }
}

// Remove getComponentPreview function as we now use ComponentPreview component

const saveForm = async () => {
  if (!formSchema.value.title?.trim()) {
    showError(t('formBuilder.errors.titleRequired'))
    return
  }

  if (!formSchema.value.name?.trim()) {
    showError(t('formBuilder.errors.nameRequired'))
    return
  }

  saving.value = true
  try {
    await saveFormToAPI(formSchema.value)
    success(t('formBuilder.messages.saveSuccess'))
  } catch (err) {
    console.error('Error saving form:', err)
    showError(t('formBuilder.errors.saveFailed', err instanceof Error ? err.message : 'Unknown error'))
  } finally {
    saving.value = false
  }
}

const saveFormToAPI = async (form: FormSchema) => {
  try {
    // Ensure sections are included in the schema
    const formSchemaWithSections = {
      ...form,
      sections: form.sections || []
    }

    if (form.id) {
      // Update existing form
      const result = await formsStore.updateForm(form.id, {
        title: form.title,
        description: form.name, // Use name as description for now
        schema: formSchemaWithSections,
        status: 'published',
        is_public: isPublicForm.value,
      })
      if (result.success && result.data) {
        // Update the local form schema with the returned data
        formSchema.value.id = result.data.id
        if (result.data.schema && typeof result.data.schema === 'object') {
          // Merge the schema data while preserving our local structure
          formSchema.value.title = result.data.title || formSchema.value.title
          if (result.data.schema.components) {
            formSchema.value.components = result.data.schema.components
          }
        }
      }
      return result.data
    } else {
      // Create new form
      const result = await formsStore.createForm({
        title: form.title,
        description: form.name, // Use name as description for now
        schema: formSchemaWithSections,
        status: 'published',
        language: 'en',
        is_public: isPublicForm.value,
        allow_anonymous: isPublicForm.value,
      })
      if (result.success && result.data) {
        // Update the local form schema with the returned data
        formSchema.value.id = result.data.id
        if (result.data.schema && typeof result.data.schema === 'object') {
          // Merge the schema data while preserving our local structure
          formSchema.value.title = result.data.title || formSchema.value.title
          if (result.data.schema.components) {
            formSchema.value.components = result.data.schema.components
          }
        }
      }
      return result.data
    }
  } catch (error: unknown) {
    console.error('Error saving form:', error)
    throw error
  }
}

const previewForm = () => {
  // Check if form has components
  if (!formSchema.value.components || formSchema.value.components.length === 0) {
    showError(t('formBuilder.errors.noComponentsToPreview'))
    return
  }

  // Ensure form has required properties for Form.io
  if (!formSchema.value.title?.trim()) {
    formSchema.value.title = t('formBuilder.defaultTitle')
  }

  if (!formSchema.value.name?.trim()) {
    formSchema.value.name = 'preview-form'
  }

  // Navigate to preview page with form data
  const formDataString = encodeURIComponent(JSON.stringify(formSchema.value))
  router.push({
    name: 'FormPreview',
    query: {
      formData: formDataString,
    },
  })
}

const exportForm = async () => {
  try {
    // Check if form has content to export
    if (!formSchema.value.title?.trim() || formSchema.value.components.length === 0) {
      showError(t('formBuilder.errors.noContentToExport'))
      return
    }

    // Export form schema as JSON
    const exportData = JSON.stringify(formSchema.value, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(exportData)
    const exportFileDefaultName = `${formSchema.value.name || 'form'}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    success(t('formBuilder.messages.exportSuccess'))
  } catch (err) {
    console.error('Error exporting form:', err)
    showError(t('formBuilder.errors.exportFailed'))
  }
}

// Import form schema from JSON file
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerImport = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  // Check file type
  if (!file.name.endsWith('.json')) {
    showError(t('formBuilder.errors.invalidFileType'))
    return
  }

  try {
    const fileContent = await file.text()
    const importedSchema = JSON.parse(fileContent)

    // Validate imported schema
    if (!importedSchema || typeof importedSchema !== 'object') {
      showError(t('formBuilder.errors.invalidSchemaFormat'))
      return
    }

    // Confirm import with user
    const confirmImport = confirm(t('formBuilder.confirmImport'))
    if (!confirmImport) {
      return
    }

    // Import the schema
    formSchema.value = {
      title: importedSchema.title || t('formBuilder.defaultTitle'),
      name: importedSchema.name || 'imported-form',
      path: importedSchema.path || 'imported-form',
      components: importedSchema.components || [],
      sections: importedSchema.sections || []
    }

    // Update sections if they exist
    if (importedSchema.sections && Array.isArray(importedSchema.sections)) {
      formSchema.value.sections = importedSchema.sections
    }

    // Reset current section to first section or 0
    currentSectionIndex.value = 0

    // Clear selection
    selectedComponent.value = null
    selectedComponentPath.value = null

    // Force update
    nextTick(() => {
      const event = new CustomEvent('form-imported', {
        detail: { schema: formSchema.value }
      })
      window.dispatchEvent(event)
    })

    success(t('formBuilder.messages.importSuccess'))
  } catch (err) {
    console.error('Error importing form:', err)
    showError(t('formBuilder.errors.importFailed'))
  } finally {
    // Clear the file input
    if (target) {
      target.value = ''
    }
  }
}

// Load existing form if formId is provided
const loadExistingForm = async (formId: number) => {
  loading.value = true
  try {
    const result = await formsStore.fetchForm(formId)
    if (result.success && result.data) {
      const form = result.data
      isEditMode.value = true

      // Populate form schema with existing data
      formSchema.value = {
        id: form.id,
        title: form.title || '',
        name: (form as any).name || form.title?.toLowerCase().replace(/\s+/g, '-') || '',
        path: (form as any).path || (form as any).name || '',
        components: [],
      }

      // Update public form state
      isPublicForm.value = form.is_public || false

      // Parse and load form schema components
      if (form.schema) {
        try {
          let schema
          if (typeof form.schema === 'string') {
            schema = JSON.parse(form.schema)
          } else {
            schema = form.schema
          }

          if (schema.components && Array.isArray(schema.components)) {
            formSchema.value.components = schema.components
          }

          // Load sections if available
          if (schema.sections && Array.isArray(schema.sections)) {
            formSchema.value.sections = schema.sections
          } else {
            // Initialize sections if not present
            formSchema.value.sections = []
          }

          // Update other schema properties if available
          if (schema.title) formSchema.value.title = schema.title
          if (schema.name) formSchema.value.name = schema.name
          if (schema.path) formSchema.value.path = schema.path
        } catch (parseError) {
          console.error('Error parsing form schema:', parseError)
          showError(t('formBuilder.errors.loadFormFailed'))
        }
      }

      success(t('formBuilder.messages.formLoaded'))
    } else {
      showError(result.error || t('formBuilder.errors.loadFormFailed'))
    }
  } catch (err) {
    console.error('Error loading form:', err)
    showError(t('formBuilder.errors.loadFormFailed'))
  } finally {
    loading.value = false
  }
}

// Section and Stepper Methods
const initializeSections = () => {
  if (!formSchema.value.sections || formSchema.value.sections.length === 0) {
    // Create default section
    formSchema.value.sections = [{
      id: generateSectionId(),
      title: t('formBuilder.sections.untitledSection'),
      componentIds: [],
      order: 0
    }]
  }
}

const generateSectionId = (): string => {
  return 'section_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const toggleSectionManager = () => {
  showSectionManager.value = !showSectionManager.value
  if (showSectionManager.value) {
    initializeSections()
  }
}

const toggleStepper = () => {
  showStepper.value = !showStepper.value
  if (showStepper.value) {
    initializeSections()
  }
}

const onSectionChanged = (sectionIndex: number) => {
  currentSectionIndex.value = sectionIndex
}

const onComponentAssigned = (componentId: string, sectionId: string) => {
  console.log('Component assigned:', componentId, 'to section:', sectionId)
}

const onComponentRemoved = (componentId: string, sectionId: string) => {
  console.log('Component removed:', componentId, 'from section:', sectionId)
}

const onStepChanged = (step: number) => {
  currentSectionIndex.value = step
}

const getCurrentSectionTitle = () => {
  if (showSectionManager.value) {
    if (formSchema.value.sections && formSchema.value.sections.length > 0) {
      const currentSection = formSchema.value.sections[currentSectionIndex.value]
      if (currentSection) {
        return `${t('formBuilder.sections.currentSection')}: ${currentSection.title || t('formBuilder.sections.untitledSection')}`
      }
    }
    return t('formBuilder.sections.managingSections')
  } else if (showStepper.value) {
    if (formSchema.value.sections && formSchema.value.sections.length > 0) {
      const currentStep = formSchema.value.sections[currentSectionIndex.value]
      if (currentStep) {
        return `${t('formBuilder.stepper.currentStep')}: ${currentStep.title || t('formBuilder.stepper.untitledStep')}`
      }
    }
    return t('formBuilder.stepper.managingSteps')
  }
  return t('formBuilder.sections.sectionMode')
}

const onEditComponentFromStepper = (componentId: string) => {
  const componentIndex = formSchema.value.components.findIndex(c => c.key === componentId)
  if (componentIndex >= 0) {
    const component = formSchema.value.components[componentIndex]
    selectComponent(component, componentIndex)
  }
}

// Initialize form based on route parameters
const initializeForm = async () => {
  const formId = route.query.formId

  if (formId && !isNaN(Number(formId))) {
    await loadExistingForm(Number(formId))
  } else {
    // Initialize with empty form
    formSchema.value = {
      title: t('formBuilder.defaultTitle') || 'New Form',
      name: 'untitled-form',
      path: 'untitled-form',
      components: [],
      sections: [],
    }
    isEditMode.value = false
  }

  // Initialize sections if needed
  initializeSections()
}

// Watch for route changes to handle navigation between forms
watch(
  () => route.query.formId,
  (newFormId, oldFormId) => {
    if (newFormId !== oldFormId) {
      initializeForm()
    }
  },
)

// Watch for changes to selectedComponent and update nested components
watch(
  () => selectedComponent.value,
  (newComponent, oldComponent) => {
    if (newComponent && selectedComponentPath.value && selectedComponentPath.value.containerType) {
      // Update nested component in container (Panel, Fieldset, Well, Container)
      updateNestedComponent(newComponent)
    }
  },
  { deep: true }
)

// Function to update nested components in containers
const updateNestedComponent = (updatedComponent: FormComponent) => {
  if (!selectedComponentPath.value || !updatedComponent) return

  try {
    const { containerIndex, componentIndex, containerType, rowIndex, cellIndex, tabIndex } = selectedComponentPath.value

    if (containerIndex >= 0 && componentIndex !== undefined && componentIndex >= 0) {
      const containerComponent = formSchema.value.components[containerIndex]

      // Handle table components
      if (containerType === 'table' && typeof rowIndex === 'number' && typeof cellIndex === 'number') {
        if (containerComponent && containerComponent.rows &&
            containerComponent.rows[rowIndex] &&
            containerComponent.rows[rowIndex].cells &&
            containerComponent.rows[rowIndex].cells[cellIndex] &&
            containerComponent.rows[rowIndex].cells[cellIndex].components) {

          // Create a deep copy to ensure Vue reactivity
          const updatedContainer = JSON.parse(JSON.stringify(containerComponent))

          // Update the specific nested component in table cell
          if (componentIndex !== undefined && updatedContainer.rows[rowIndex].cells[cellIndex].components[componentIndex]) {
            updatedContainer.rows[rowIndex].cells[cellIndex].components[componentIndex] = { ...updatedComponent }

            // Replace the container component in the form schema
            formSchema.value.components.splice(containerIndex, 1, updatedContainer)

            console.log(`✅ Updated table cell nested component:`, updatedComponent.type)

            // Trigger UI update
            nextTick(() => {
              // Emit custom event to force re-render if needed
              window.dispatchEvent(new CustomEvent('component-updated'))
            })
          }
        }
      }
      // Handle tabs components
      else if (containerType === 'tabs' && typeof tabIndex === 'number') {
        if (containerComponent && containerComponent.components &&
            containerComponent.components[tabIndex] &&
            containerComponent.components[tabIndex].components) {

          // Create a deep copy to ensure Vue reactivity
          const updatedContainer = JSON.parse(JSON.stringify(containerComponent))

          // Update the specific nested component in tab
          if (tabIndex !== undefined && componentIndex !== undefined && updatedContainer.components[tabIndex].components[componentIndex]) {
            updatedContainer.components[tabIndex].components[componentIndex] = { ...updatedComponent }

            // Replace the container component in the form schema
            formSchema.value.components.splice(containerIndex, 1, updatedContainer)

            console.log(`✅ Updated tabs nested component:`, updatedComponent.type)

            // Trigger UI update
            nextTick(() => {
              // Emit custom event to force re-render if needed
              window.dispatchEvent(new CustomEvent('component-updated'))
            })
          }
        }
      }
      // Handle Tree Node components
      else if (containerType === 'tree-node' && containerComponent) {
        if (containerComponent.type === 'tree' && containerComponent.data?.tree) {
          console.log('🌳 Updating tree node component')
          // Tree node updates are handled by handleTreeNodeUpdate function
          // This is just a placeholder for the tree node update logic
          return
        }
      }
      // Handle DataGrid components (new row-specific system)
      else if (containerType === 'datagrid' && typeof rowIndex === 'number' && containerComponent) {
        if (containerComponent.defaultValue && containerComponent.defaultValue[rowIndex] &&
            containerComponent.defaultValue[rowIndex]._components) {

          // Create a deep copy to ensure Vue reactivity
          const updatedContainer = JSON.parse(JSON.stringify(containerComponent))

          // Update the specific nested component in row-specific _components
          if (rowIndex !== undefined && componentIndex !== undefined && updatedContainer.defaultValue[rowIndex]._components[componentIndex]) {
            updatedContainer.defaultValue[rowIndex]._components[componentIndex] = { ...updatedComponent }

            // Replace the container component in the form schema
            formSchema.value.components.splice(containerIndex, 1, updatedContainer)

            console.log(`✅ Updated DataGrid row-specific nested component:`, updatedComponent.type)

            // Trigger UI update
            nextTick(() => {
              // Emit custom event to force re-render if needed
              window.dispatchEvent(new CustomEvent('component-updated'))
            })
          }
        }
      }
      // Handle EditGrid components (old system)
      else if (containerType === 'editgrid' && containerComponent && containerComponent.components) {
        // Create a deep copy to ensure Vue reactivity
        const updatedContainer = JSON.parse(JSON.stringify(containerComponent))

        // Update the specific nested component
        if (updatedContainer.components[componentIndex]) {
          updatedContainer.components[componentIndex] = { ...updatedComponent }

          // Replace the container component in the form schema
          formSchema.value.components.splice(containerIndex, 1, updatedContainer)

          console.log(`✅ Updated EditGrid nested component:`, updatedComponent.type)

          // Trigger UI update
          nextTick(() => {
            // Emit custom event to force re-render if needed
            window.dispatchEvent(new CustomEvent('component-updated'))
          })
        }
      }
      // Handle other container types (Panel, Fieldset, Well, Container)
      else if (containerComponent && containerComponent.components) {
        // Create a deep copy to ensure Vue reactivity
        const updatedContainer = JSON.parse(JSON.stringify(containerComponent))

        // Update the specific nested component
        if (updatedContainer.components[componentIndex]) {
          updatedContainer.components[componentIndex] = { ...updatedComponent }

          // Replace the container component in the form schema
          formSchema.value.components.splice(containerIndex, 1, updatedContainer)

          console.log(`✅ Updated ${containerType} nested component:`, updatedComponent.type)

          // Trigger UI update
          nextTick(() => {
            // Emit custom event to force re-render if needed
            window.dispatchEvent(new CustomEvent('component-updated'))
          })
        }
      }
    }
  } catch (error: unknown) {
    console.error('❌ Error updating nested component:', error)
  }
}

// Watch for selectedComponent changes to update nested components
watch(
  () => selectedComponent.value,
  (newComponent, oldComponent) => {
    if (newComponent && selectedComponentPath.value && selectedComponentPath.value.containerType) {
      console.log('🔄 selectedComponent changed, updating nested component:', newComponent.type)
      console.log('🔄 Container type:', selectedComponentPath.value.containerType)
      // Update nested component in container (Panel, Fieldset, Well, Container, Table, Tabs)
      updateNestedComponent(newComponent)
    }
  },
  { deep: true }
)

// (Removed duplicate handleEditTab definition)

// Lifecycle
onMounted(() => {
  initializeForm()
})

// Handle nested component drop (for drag & drop into containers)
const handleNestedComponentDrop = (componentData: any, targetComponent: FormComponent, targetIndex: number, containerPath: string) => {
  console.log('🔥 Handling nested component drop:', {
    componentData,
    targetComponent: targetComponent.type,
    targetIndex,
    containerPath
  })

  try {
    // Create the new component from the dragged data
    const newComponent = createComponentFromType(componentData.type)
    if (!newComponent) {
      console.error('❌ Failed to create component from type:', componentData.type)
      showError(t('formBuilder.errorAddingComponent'))
      return
    }

    // Parse container path to determine where to add the component
    const pathParts = containerPath.split('.')

    // Handle different container types based on the path
    if (pathParts[0] === 'datagrid-cell') {
      // Handle DataGrid cell - check this first to avoid confusion with 'columns' in path
      const rowIndex = parseInt(pathParts[1])
      const columnIndex = parseInt(pathParts[2])
      if (!isNaN(rowIndex) && !isNaN(columnIndex)) {
        console.log('🔥 Adding component to DataGrid cell:', { rowIndex, columnIndex, componentType: newComponent.type })
        handleAddComponentToDataGridCell(targetComponent, targetIndex, {
          rowIndex,
          columnIndex,
          componentType: newComponent.type
        })
      }
    } else if (pathParts.includes('columns') && targetComponent.type === 'columns') {
      // Handle columns container - only if target is actually a columns component
      const columnIndex = parseInt(pathParts[pathParts.indexOf('columns') + 1])
      if (!isNaN(columnIndex)) {
        // For columns, targetComponent IS the columns component and targetIndex IS the columns index
        handleAddComponentToColumn(targetComponent, targetIndex, columnIndex, newComponent.type)
      }
    } else if (pathParts.includes('rows')) {
      // Handle table rows
      const rowIndex = parseInt(pathParts[pathParts.indexOf('rows') + 1])
      const cellIndex = parseInt(pathParts[pathParts.indexOf('cells') + 1])
      if (!isNaN(rowIndex) && !isNaN(cellIndex)) {
        handleAddComponentToTableCell(targetComponent, targetIndex, { rowIndex, cellIndex, componentType: newComponent.type })
        // Don't show success message here - handleAddComponentToTableCell already shows one
        return
      }
    } else if (pathParts.includes('tabs')) {
      // Handle tabs
      const tabIndex = parseInt(pathParts[pathParts.indexOf('tabs') + 1])
      if (!isNaN(tabIndex)) {
        handleAddComponentToTab(targetComponent, targetIndex, tabIndex, newComponent)
      }
    } else if (pathParts.includes('components')) {
      // Handle other container types (panel, fieldset, well, container, etc.)
      handleAddComponentToContainer(targetComponent, targetIndex, newComponent.type)
    } else {
      // Default: add to general container
      handleAddComponentToContainer(targetComponent, targetIndex, newComponent.type)
    }

    console.log('✅ Nested component drop handled successfully')
    success(t('formBuilder.componentAdded'))

  } catch (error: unknown) {
    console.error('❌ Error handling nested component drop:', error)
    showError(t('formBuilder.errorAddingComponent'))
  }
}

// Helper function to remove component from sections when deleted
const removeComponentFromSections = (componentKey: string) => {
  try {
    console.log('🗑️ Removing component from sections:', componentKey)

    if (!formSchema.value.sections || formSchema.value.sections.length === 0) {
      console.log('🗑️ No sections to remove from')
      return
    }

    // Remove component from all sections
    formSchema.value.sections.forEach((section: any) => {
      if (section.componentIds && section.componentIds.includes(componentKey)) {
        const idx = section.componentIds.indexOf(componentKey)
        section.componentIds.splice(idx, 1)
        console.log(`🗑️ Removed component ${componentKey} from section ${section.title}`)
      }
    })

    console.log('✅ Component removed from sections successfully')
  } catch (error: unknown) {
    console.error('❌ Error removing component from sections:', error)
  }
}

// Add new row to DataGrid
const handleAddDataGridRow = (dataGridComponent: FormComponent, dataGridIndex: number) => {
  console.log('➕ Adding new EMPTY row to DataGrid:', { dataGridIndex })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      showError(t('formBuilder.errorAddingRow'))
      return
    }

    // Initialize defaultValue if it doesn't exist
    if (!targetDataGrid.defaultValue) {
      targetDataGrid.defaultValue = []
    }

    // Create new COMPLETELY EMPTY row with structure for each column
    const newRow: any = {}

    // Initialize _components array for the row (for component management)
    newRow._components = new Array(targetDataGrid.components?.length || 0).fill(null)

    // Add EMPTY default values for each column component (ignore any existing defaultValue)
    if (targetDataGrid.components) {
      targetDataGrid.components.forEach((column: any) => {
        if (column.key) {
          // Always create empty values regardless of column.defaultValue
          switch (column.type) {
            case 'textfield':
            case 'textarea':
            case 'email':
            case 'password':
            case 'url':
            case 'phoneNumber':
              newRow[column.key] = ''
              break
            case 'number':
              newRow[column.key] = null
              break
            case 'checkbox':
              newRow[column.key] = false
              break
            case 'select':
            case 'radio':
            case 'selectboxes':
              newRow[column.key] = null
              break
            case 'datetime':
            case 'day':
            case 'time':
              newRow[column.key] = null
              break
            case 'currency':
              newRow[column.key] = null
              break
            case 'file':
              newRow[column.key] = []
              break
            default:
              newRow[column.key] = ''
          }
        }
      })
    }

    // Mark this as an empty row initially
    newRow._isEmpty = true

    // Add the new EMPTY row
    targetDataGrid.defaultValue.push(newRow)

    console.log('✅ Created new empty row:', newRow)

    // Update formSchema to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          forceRerender: true,
          dataGridIndex,
          action: 'add-empty-row'
        }
      }))
    })

    emit('form-updated', formSchema.value)
    success(t('formBuilder.rowAddedSuccessfully'))
  } catch (err) {
    console.error('❌ Error adding empty row to DataGrid:', err)
    showError(t('formBuilder.errorAddingRow'))
  }
}

// Delete row from DataGrid
const handleDeleteDataGridRow = (dataGridComponent: FormComponent, dataGridIndex: number, rowIndex: number) => {
  console.log('🗑️ Deleting row from DataGrid:', { dataGridIndex, rowIndex })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      showError(t('formBuilder.errorDeletingRow'))
      return
    }

    if (!targetDataGrid.defaultValue || rowIndex >= targetDataGrid.defaultValue.length) {
      console.error('❌ Target row not found')
      showError(t('formBuilder.errorDeletingRow'))
      return
    }

    // Remove the row
    targetDataGrid.defaultValue.splice(rowIndex, 1)

    // Update formSchema to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    // Trigger UI update
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('component-updated', {
        detail: {
          forceRerender: true,
          dataGridIndex,
          action: 'delete-row',
          rowIndex
        }
      }))
    })

    emit('form-updated', formSchema.value)
    success(t('formBuilder.rowDeletedSuccessfully'))
  } catch (err) {
    console.error('❌ Error deleting row from DataGrid:', err)
    showError(t('formBuilder.errorDeletingRow'))
  }
}

// Update DataGrid cell value
const handleUpdateDataGridCellValue = (dataGridComponent: FormComponent, dataGridIndex: number, data: any) => {
  console.log('📝 Updating DataGrid cell value:', { dataGridIndex, data })

  try {
    const targetDataGrid = formSchema.value.components[dataGridIndex]
    if (!targetDataGrid || targetDataGrid.type !== 'datagrid') {
      console.error('❌ Target DataGrid not found')
      return
    }

    const { rowIndex, fieldKey, value } = data

    if (!targetDataGrid.defaultValue || rowIndex >= targetDataGrid.defaultValue.length) {
      console.error('❌ Target row not found')
      return
    }

    // Update the cell value
    targetDataGrid.defaultValue[rowIndex][fieldKey] = value

    // Update formSchema to trigger reactivity
    const updatedDataGrid = JSON.parse(JSON.stringify(targetDataGrid))
    formSchema.value.components.splice(dataGridIndex, 1, updatedDataGrid)

    // Trigger UI update (less frequent for performance)
    nextTick(() => {
      window.dispatchEvent(new CustomEvent('datagrid-cell-value-updated', {
        detail: {
          dataGridIndex,
          rowIndex,
          fieldKey,
          value
        }
      }))
    })

    emit('form-updated', formSchema.value)
  } catch (err) {
    console.error('❌ Error updating DataGrid cell value:', err)
  }
}
</script>

<style scoped>
.form-builder-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.builder-content {
  flex: 1;
  overflow: hidden;
}

.components-palette {
  min-width: 256px;
  max-height: calc(100vh - 80px);
}

.component-item {
  transition: all 0.2s ease;
}

.component-item:hover {
  transform: translateY(-1px);
}

.drop-zone {
  position: relative;
  transition: all 0.2s ease;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.drop-zone::-webkit-scrollbar {
  width: 6px;
}

.drop-zone::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.drop-zone::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.drop-zone::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.drop-zone.drag-over {
  background-color: #eff6ff;
  border: 2px dashed #3b82f6;
}

.form-component-wrapper.selected .component-preview {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.component-controls {
  backdrop-filter: blur(4px);
}

.properties-panel {
  min-width: 320px;
  max-height: calc(100vh - 80px);
}

.preview-modal {
  backdrop-filter: blur(4px);
}

.rtl {
  direction: rtl;
}

.rtl .components-palette {
  border-right: none;
  border-left: 1px solid #e5e7eb;
}

.rtl .properties-panel {
  border-left: none;
  border-right: 1px solid #e5e7eb;
}

/* Component List Transitions */
.component-list-enter-active,
.component-list-leave-active {
  transition: all 0.3s ease;
}

.component-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.component-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.component-list-move {
  transition: transform 0.3s ease;
}

/* Section transition effects */
.section-transition {
  transition: all 0.3s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
