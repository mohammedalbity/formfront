<template>
  <!-- Modal Backdrop -->
  <Transition name="modal-backdrop">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm" @click.self="closeModal">
      <div class="flex min-h-screen items-center justify-center p-4 sm:p-6">
        
        <!-- Modal Content -->
        <Transition name="modal-content">
          <div v-if="isOpen" class="relative z-[10000] w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            
            <!-- Gradient Header -->
            <div class="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-6 py-6 sm:px-8">
              <div class="absolute inset-0 bg-black/10"></div>
              <div class="relative flex items-center justify-between">
                <div class="flex items-center space-x-3 rtl:space-x-reverse">
                  <!-- Icon -->
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <!-- Title -->
                  <div>
                    <h3 class="text-xl font-bold text-white">
                      {{ isEditing ? tr('survey.editQuestionModal.title', 'تعديل السؤال') : tr('survey.addQuestion', 'إضافة سؤال') }}
                    </h3>
                    <p class="text-sm text-white/80 mt-1">
                      {{ isEditing ? tr('survey.editQuestionModal.subtitle', 'تعديل تفاصيل السؤال') : tr('survey.addQuestionModal.subtitle', 'أضف سؤال جديد للاستطلاع') }}
                    </p>
                  </div>
                </div>
                
                <!-- Close Button -->
                <button
                  @click="closeModal"
                  class="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <svg class="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="max-h-[70vh] overflow-y-auto bg-gray-50/30">
              <div class="p-6 sm:p-8">
                <form @submit.prevent="saveQuestion" class="space-y-8">
                  <!-- Question Type Section -->
                  <div class="group">
                    <div class="mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                        <svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ tr('survey.questionTypeSection', 'نوع السؤال') }}</h4>
                    </div>
                    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all group-hover:shadow-md">
                      <CustomSelect
                        v-model="localQuestion.type"
                        :label="tr('survey.questionType', 'نوع السؤال')"
                        :options="questionTypeOptions"
                        container-class="w-full"
                        select-classes="text-base"
                      />
                    </div>
                  </div>

                  <!-- Question Content Section -->
                  <div class="group">
                    <div class="mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ tr('survey.questionContentSection', 'محتوى السؤال') }}</h4>
                    </div>
                    <div class="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all group-hover:shadow-md">
                      
                      <!-- Question Text -->
                      <div>
                        <label class="mb-3 flex items-center text-sm font-semibold text-gray-900">
                          {{ tr('survey.questionText', 'نص السؤال') }}
                          <span class="ml-1 text-red-500">*</span>
                          <div class="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">{{ tr('common.required', 'إلزامي') }}</div>
                        </label>
                        <div class="relative">
                          <textarea
                            v-model="localQuestion.question"
                            :placeholder="tr('survey.placeholders.questionText', 'أدخل نص السؤال هنا...')"
                            rows="4"
                            class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base transition-all duration-200 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                            :class="{ 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20': errors.question }"
                          ></textarea>
                          <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                            {{ localQuestion.question.length }}/500
                          </div>
                        </div>
                        <Transition name="error">
                          <p v-if="errors.question" class="mt-2 flex items-center text-sm text-red-600">
                            <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {{ errors.question }}
                          </p>
                        </Transition>
                      </div>

                      <!-- Question Label -->
                      <div>
                        <label class="mb-3 flex items-center text-sm font-semibold text-gray-900">
                          {{ tr('survey.questionLabel', 'تسمية السؤال') }}
                          <div class="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{{ tr('common.optional', 'اختياري') }}</div>
                        </label>
                        <input
                          v-model="localQuestion.label"
                          type="text"
                          :placeholder="tr('survey.placeholders.questionLabel', 'تسمية مختصرة للسؤال')"
                          class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base transition-all duration-200 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Settings Section -->
                  <div class="group">
                    <div class="mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                        <svg class="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ tr('survey.questionSettings', 'إعدادات السؤال') }}</h4>
                    </div>
                    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all group-hover:shadow-md">
                      
                      <!-- Required Toggle -->
                      <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                        <div class="flex items-center space-x-3 rtl:space-x-reverse">
                          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                            <svg class="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                          </div>
                          <div>
                            <label for="questionRequired" class="text-sm font-semibold text-gray-900">
                              {{ tr('survey.requiredQuestion', 'سؤال إلزامي') }}
                            </label>
                            <p class="text-xs text-gray-500">{{ tr('survey.requiredQuestionDescription', 'يجب على المستخدم الإجابة على هذا السؤال') }}</p>
                          </div>
                        </div>
                        <label class="relative inline-flex cursor-pointer items-center">
                          <input
                            v-model="localQuestion.required"
                            type="checkbox"
                            id="questionRequired"
                            class="peer sr-only"
                          />
                          <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Options Section -->
                  <div v-if="needsOptions" class="group">
                    <div class="mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                        <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ tr('survey.optionsSection', 'الخيارات') }}</h4>
                    </div>
                    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all group-hover:shadow-md">
                      
                      <!-- Add Option Button -->
                      <div class="mb-6 flex items-center justify-between">
                        <p class="text-sm text-gray-600">{{ tr('survey.optionsDescription', 'أضف الخيارات المتاحة لهذا السؤال') }}</p>
                        <button
                          type="button"
                          @click="addOption"
                          class="inline-flex items-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/25"
                        >
                          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          {{ tr('survey.addOption', 'إضافة خيار') }}
                        </button>
                      </div>

                      <!-- Options List -->
                      <div v-if="localQuestion.values && localQuestion.values.length > 0" class="space-y-4">
                        <TransitionGroup name="option" tag="div" class="space-y-4">
                          <div
                            v-for="(option, index) in localQuestion.values"
                            :key="index"
                            class="group relative flex items-center space-x-4 rtl:space-x-reverse rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-purple-300 hover:bg-white hover:shadow-md"
                          >
                            <!-- Option Number -->
                            <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-sm font-semibold text-purple-600">
                              {{ index + 1 }}
                            </div>
                            
                            <!-- Option Fields -->
                            <div class="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label class="mb-2 block text-xs font-semibold text-gray-700">
                                  {{ tr('survey.optionLabel', 'تسمية الخيار') }}
                                </label>
                                <input
                                  v-model="option.label"
                                  type="text"
                                  :placeholder="tr('survey.placeholders.optionLabel', 'مثلاً: نعم')"
                                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                  :class="{ 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20': errors[`option_${index}`] }"
                                />
                              </div>
                              <div>
                                <label class="mb-2 block text-xs font-semibold text-gray-700">
                                  {{ tr('survey.optionValue', 'قيمة الخيار') }}
                                </label>
                                <input
                                  v-model="option.value"
                                  type="text"
                                  :placeholder="tr('survey.placeholders.optionValue', 'مثلاً: yes')"
                                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                              </div>
                            </div>
                  
                            
                            <!-- Action Buttons -->
                            <div class="flex flex-col space-y-2">
                              <button
                                v-if="index > 0"
                                type="button"
                                @click="moveOptionUp(index)"
                                class="group/btn flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                :title="tr('survey.editQuestionModal.moveUp', 'نقل لأعلى')"
                              >
                                <svg class="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                                </svg>
                              </button>
                              <button
                                v-if="index < localQuestion.values.length - 1"
                                type="button"
                                @click="moveOptionDown(index)"
                                class="group/btn flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                :title="tr('survey.editQuestionModal.moveDown', 'نقل لأسفل')"
                              >
                                <svg class="h-4 w-4 transition-transform group-hover/btn:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </button>
                              <button
                                type="button"
                                @click="removeOption(index)"
                                class="group/btn flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-all duration-200 hover:bg-red-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                :title="tr('survey.editQuestionModal.deleteOption', 'حذف الخيار')"
                              >
                                <svg class="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </TransitionGroup>
                      </div>

                      
                      <!-- Empty State -->
                      <div v-else class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8">
                        <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <p class="mt-2 text-sm text-gray-500">{{ tr('survey.noOptionsYet', 'لا توجد خيارات بعد') }}</p>
                        <p class="text-xs text-gray-400">{{ tr('survey.clickAddOptionToStart', 'انقر إضافة خيار للبدء') }}</p>
                      </div>

                      <Transition name="error">
                        <p v-if="errors.options" class="mt-2 flex items-center text-sm text-red-600">
                          <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {{ errors.options }}
                        </p>
                      </Transition>
                    </div>
                  </div>

                  <!-- Placeholder Section -->
                  <div v-if="needsPlaceholder" class="group">
                    <div class="mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                        <svg class="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ tr('survey.placeholderSection', 'نص المساعدة') }}</h4>
                    </div>
                    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all group-hover:shadow-md">
                      <label class="mb-3 flex items-center text-sm font-semibold text-gray-900">
                        {{ tr('formBuilder.properties.placeholder', 'نص المساعدة') }}
                        <div class="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{{ tr('common.optional', 'اختياري') }}</div>
                      </label>
                      <input
                        v-model="localQuestion.placeholder"
                        type="text"
                        :placeholder="tr('survey.placeholders.inputPlaceholder', 'مثلاً: أدخل إجابتك هنا...')"
                        class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base transition-all duration-200 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 bg-gray-50 px-6 py-6 sm:px-8">
              <div class="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                
                <!-- Validation Status -->
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <div class="flex h-6 w-6 items-center justify-center rounded-full" :class="isValid ? 'bg-green-100' : 'bg-red-100'">
                    <svg v-if="isValid" class="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <svg v-else class="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <span class="text-sm" :class="isValid ? 'text-green-600' : 'text-red-600'">
                    {{ isValid ? tr('survey.validationPassed', 'جاهز للحفظ') : tr('survey.validationFailed', 'يرجى إكمال الحقول المطلوبة') }}
                  </span>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex space-x-3 rtl:space-x-reverse">
                  <button
                    type="button"
                    @click="closeModal"
                    class="inline-flex items-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-500/20"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    {{ tr('survey.editQuestionModal.cancel', 'إلغاء') }}
                  </button>
                  
                  <button
                    type="button"
                    @click="saveQuestion"
                    :disabled="!isValid"
                    class="inline-flex items-center rounded-xl border border-transparent bg-gradient-to-r px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50"
                    :class="isValid 
                      ? 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl focus:ring-purple-500/25' 
                      : 'from-gray-400 to-gray-500'"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {{ isEditing ? tr('survey.editQuestionModal.save', 'حفظ') : tr('survey.addQuestion', 'إضافة سؤال') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal Transitions */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: all 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-content-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Option Transitions */
.option-enter-active,
.option-leave-active {
  transition: all 0.3s ease;
}

.option-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.9);
}

.option-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}

.option-move {
  transition: transform 0.3s ease;
}

/* Error Transitions */
.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom Scrollbar */
.max-h-\[70vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[70vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-radius: 10px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
}

/* Gradient Animation */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Focus Ring Enhancement */
.focus\:ring-4:focus {
  box-shadow: 0 0 0 4px var(--tw-ring-color);
}

/* RTL Support */
[dir="rtl"] .rtl\:space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}
</style>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomSelect from './CustomSelect.vue'

const { t } = useI18n()

// i18n helper with safe fallback
const tr = (key: string, fallback: string) => {
  const translated = t(key) as string
  return translated !== key ? translated : fallback
}

interface SurveyOption {
  label: string
  value: string | number
}

interface SurveyQuestion {
  id?: string
  type: string
  question: string
  label?: string
  required: boolean
  values?: SurveyOption[]
  placeholder?: string
}

interface Props {
  isOpen: boolean
  question?: SurveyQuestion | null
  isEditing?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', question: SurveyQuestion): void
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  question: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

// Local state
const localQuestion = ref<SurveyQuestion>({
  type: 'radio',
  question: '',
  label: '',
  required: false,
  values: [],
  placeholder: ''
})

const errors = ref<Record<string, string>>({})

// Methods - Define resetForm first
const resetForm = () => {
  localQuestion.value = {
    type: 'textfield', // Start with a type that doesn't need options
    question: '',
    label: '',
    required: false,
    values: [], // Start with empty options
    placeholder: ''
  }
}

// Computed properties
const needsOptions = computed(() => {
  return ['radio', 'checkbox', 'select'].includes(localQuestion.value.type)
})

const needsPlaceholder = computed(() => {
  return ['textfield', 'textarea', 'number', 'email'].includes(localQuestion.value.type)
})

const isValid = computed(() => {
  return localQuestion.value.question.trim().length > 0 &&
    (!needsOptions.value || (localQuestion.value.values && localQuestion.value.values.length >= 2))
})

// Question type options for CustomSelect
const questionTypeOptions = computed(() => [
  { value: 'radio', label: t('survey.questionTypes.radio') },
  { value: 'checkbox', label: t('survey.questionTypes.checkbox') },
  { value: 'select', label: t('survey.questionTypes.select') },
  { value: 'textfield', label: t('survey.questionTypes.textfield') },
  { value: 'textarea', label: t('survey.questionTypes.textarea') },
  { value: 'number', label: t('survey.questionTypes.number') },
  { value: 'email', label: t('survey.questionTypes.email') },
  { value: 'rating', label: t('survey.questionTypes.rating') }
])

// Watch for prop changes
watch(() => props.question, (newQuestion) => {
  if (newQuestion) {
    localQuestion.value = JSON.parse(JSON.stringify(newQuestion))
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    errors.value = {}
    if (!props.question) {
      resetForm()
    }
  }
})

// Watch for question type changes to update options automatically
watch(() => localQuestion.value.type, (newType, oldType) => {
  // Only update if the type actually changed
  if (newType !== oldType) {
    handleTypeChange()
  }
})

const handleTypeChange = () => {
  if (needsOptions.value) {
    // Generate smart default options based on question type
    let defaultOptions = []
    
    switch (localQuestion.value.type) {
      case 'radio':
        defaultOptions = [
          { label: t('survey.defaultOptions.yes'), value: 'yes' },
          { label: t('survey.defaultOptions.no'), value: 'no' },
          { label: t('survey.defaultOptions.maybe'), value: 'maybe' }
        ]
        break
        
      case 'checkbox':
        defaultOptions = [
          { label: t('survey.defaultOptions.option1'), value: 'option1' },
          { label: t('survey.defaultOptions.option2'), value: 'option2' },
          { label: t('survey.defaultOptions.option3'), value: 'option3' },
          { label: t('survey.defaultOptions.other'), value: 'other' }
        ]
        break
        
      case 'select':
        defaultOptions = [
          { label: t('survey.defaultOptions.selectOption'), value: '' },
          { label: t('survey.defaultOptions.excellent'), value: 'excellent' },
          { label: t('survey.defaultOptions.good'), value: 'good' },
          { label: t('survey.defaultOptions.average'), value: 'average' },
          { label: t('survey.defaultOptions.poor'), value: 'poor' }
        ]
        break
        
      default:
        defaultOptions = [
          { label: t('survey.defaultOptions.option1'), value: 'option1' },
          { label: t('survey.defaultOptions.option2'), value: 'option2' }
        ]
    }
    
    // Always update options when question type changes to provide smart defaults
    localQuestion.value.values = defaultOptions
  } else {
    // Clear options for question types that don't need them
    localQuestion.value.values = []
  }
}

const addOption = () => {
  if (!localQuestion.value.values) {
    localQuestion.value.values = []
  }
  const optionNumber = localQuestion.value.values.length + 1
  localQuestion.value.values.push({
    label: `${t('formBuilder.defaultOptions.option1')} ${optionNumber}`,
    value: `option${optionNumber}`
  })
}

const removeOption = (index: number) => {
  if (localQuestion.value.values && localQuestion.value.values.length > 2) {
    localQuestion.value.values.splice(index, 1)
  }
}

const moveOptionUp = (index: number) => {
  if (localQuestion.value.values && index > 0) {
    const temp = localQuestion.value.values[index]
    localQuestion.value.values[index] = localQuestion.value.values[index - 1]
    localQuestion.value.values[index - 1] = temp
  }
}

const moveOptionDown = (index: number) => {
  if (localQuestion.value.values && index < localQuestion.value.values.length - 1) {
    const temp = localQuestion.value.values[index]
    localQuestion.value.values[index] = localQuestion.value.values[index + 1]
    localQuestion.value.values[index + 1] = temp
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!localQuestion.value.question.trim()) {
    errors.value.question = t('survey.validation.questionTextRequired')
  }
  
  if (needsOptions.value) {
    if (!localQuestion.value.values || localQuestion.value.values.length < 2) {
      errors.value.options = t('survey.validation.minimumTwoOptions')
    } else {
      localQuestion.value.values.forEach((option, index) => {
        if (!option.label.trim()) {
          errors.value[`option_${index}`] = t('survey.validation.optionLabelRequired')
        }
      })
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const saveQuestion = () => {
  if (!validateForm()) {
    return
  }
  
  // Generate ID if it's a new question
  if (!localQuestion.value.id) {
    localQuestion.value.id = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Clean up values if not needed
  if (!needsOptions.value) {
    localQuestion.value.values = []
  }
  
  // Clean up placeholder if not needed
  if (!needsPlaceholder.value) {
    localQuestion.value.placeholder = ''
  }
  
  emit('save', JSON.parse(JSON.stringify(localQuestion.value)))
  closeModal()
}

const closeModal = () => {
  emit('close')
}

// Expose methods for parent component
defineExpose({
  resetForm,
  validateForm
})
</script>

<style scoped>
/* Additional styles for better UX */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Custom scrollbar for modal body */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
