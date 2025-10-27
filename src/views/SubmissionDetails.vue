<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div
            class="flex items-center space-x-3"
            :class="{ 'space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
          >
            <router-link
              to="/my-submissions"
              class="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                {{ submission?.form?.title || t('userSubmissions.unknownForm') }}
              </h1>
              <p class="text-sm text-gray-600 mt-1">
                {{ t('userSubmissions.submissionId') }}: #{{ submission?.id }}
              </p>
            </div>
          </div>

          <router-link
            v-if="submission"
            :to="`/forms/${submission.form_id}/fill`"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <svg
              class="w-4 h-4 mr-2"
              :class="{ 'mr-2': !isRTLSync(), 'ml-2': isRTLSync() }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{ t('userSubmissions.submitAgain') }}
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div
          class="flex items-center space-x-3"
          :class="{ 'space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"
          ></div>
          <span class="text-lg text-gray-600">{{ t('userSubmissions.loading') }}</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div class="flex flex-col items-center space-y-4">
          <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 class="text-lg font-medium text-red-800 mb-2">
              {{ t('userSubmissions.errorTitle') }}
            </h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button
              @click="loadSubmission"
              class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              {{ t('userSubmissions.retry') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Submission Details -->
      <div v-else-if="submission" class="space-y-6">
        <!-- Submission Info Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            {{ t('userSubmissions.submissionInfo') }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div class="flex flex-col space-y-1">
              <span class="text-gray-500 font-medium">{{ t('userSubmissions.status') }}:</span>
              <span
                :class="getStatusBadgeClass(submission.status)"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit"
              >
                {{ getStatusText(submission.status) }}
              </span>
            </div>
            <div class="flex flex-col space-y-1">
              <span class="text-gray-500 font-medium">{{ t('userSubmissions.submittedAt') }}:</span>
              <span class="font-medium text-gray-900">{{
                formatDate(submission.submitted_at || submission.created_at)
              }}</span>
            </div>
            <div v-if="submission.user" class="flex flex-col space-y-1">
              <span class="text-gray-500 font-medium">{{ t('submissions.table.submitter') }}:</span>
              <div>
                <div class="font-medium text-gray-900">{{ submission.user.name }}</div>
                <div class="text-xs text-gray-500">ID: {{ submission.user.id }}</div>
                <div v-if="submission.user.email" class="text-xs text-blue-600">
                  {{ submission.user.email }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submission Data Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div
              class="flex items-center space-x-3"
              :class="{ 'space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
            >
              <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <svg
                  class="w-5 h-5 text-white"
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
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ t('userSubmissions.submissionData') }}
                </h2>
                <p class="text-sm text-gray-600">
                  {{ Object.keys(getFilteredData(submission?.data || {})).length }} حقل مملوء
                </p>
              </div>
            </div>

            <!-- Search and Filter Controls -->
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <!-- Section Filter (only show if there are sections) -->
              <div v-if="hasSections" class="w-full sm:w-36">
                <select
                  v-model="selectedSection"
                  class="w-full px-3 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">جميع الأقسام</option>
                  <option v-for="section in formSections" :key="section.id" :value="section.id">
                    {{ section.title }}
                  </option>
                </select>
              </div>

              <div class="relative flex-1 sm:flex-initial">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="البحث في البيانات..."
                  class="w-full sm:w-56 px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'pr-10 pl-4': !isRTLSync(), 'pl-10 pr-4': isRTLSync() }"
                />
                <svg
                  class="absolute top-2.5 w-4 h-4 text-gray-400"
                  :class="{ 'right-3': !isRTLSync(), 'left-3': isRTLSync() }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <button
                @click="exportSubmission"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'mr-2': !isRTLSync(), 'ml-2': isRTLSync() }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                تصدير
              </button>
            </div>
          </div>
          <!-- Data Display with Grid Layout -->
          <div v-if="submission.data && typeof submission.data === 'object'">
            <!-- Grid Layout for Data Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div
                v-for="(value, key) in filteredData"
                :key="key"
                class="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group overflow-hidden"
              >
                <!-- Card Header -->
                <div class="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div class="flex items-center justify-between">
                    <div
                      class="flex items-center space-x-3"
                      :class="{ 'space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                    >
                      <div class="p-1.5 bg-blue-500 rounded-lg">
                        <svg
                          class="w-4 h-4 text-white"
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
                      <div>
                        <h3 class="font-semibold text-gray-900 text-sm">
                          {{ getFieldLabel(key) }}
                        </h3>
                        <p class="text-xs text-gray-500">{{ getFieldType(value) }}</p>
                      </div>
                    </div>
                    <div class="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                      {{ getFieldLabel(key) }}
                    </div>
                  </div>
                </div>

                <!-- Card Content -->
                <div class="p-4">
                  <!-- Array Data Display (DataGrid/EditGrid) -->
                  <div v-if="Array.isArray(value)" class="space-y-3">
                    <div class="flex items-center justify-between mb-3">
                      <div class="text-sm font-semibold text-gray-700">{{ value.length }} صف</div>
                      <div class="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                        {{
                          key.includes('editgrid')
                            ? 'شبكة تحرير'
                            : key.includes('datagrid')
                              ? 'جدول بيانات'
                              : 'قائمة'
                        }}
                      </div>
                    </div>
                    <div
                      v-for="(item, index) in value"
                      :key="index"
                      class="bg-white rounded-lg border border-gray-300 overflow-hidden hover:border-blue-300 transition-colors"
                    >
                      <!-- Row Header -->
                      <div
                        class="bg-gradient-to-r from-gray-50 to-blue-50 px-3 py-2 border-b border-gray-300"
                      >
                        <div class="flex items-center justify-between">
                          <span class="text-sm font-medium text-gray-700"
                            >الصف {{ index + 1 }}</span
                          >
                          <span class="text-xs text-gray-500">
                            {{ Object.keys(item).length }} حقل
                          </span>
                        </div>
                      </div>

                      <!-- Row Content -->
                      <div class="p-3">
                        <div v-if="typeof item === 'object' && item !== null" class="space-y-2">
                          <div
                            v-for="([subKey, subValue], subIndex) in Object.entries(item)"
                            :key="subIndex"
                            class="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div class="text-sm font-medium text-gray-600 min-w-[120px]">
                              {{ getNestedFieldLabel(key, subKey) }}:
                            </div>
                            <div class="text-sm text-gray-900 text-left flex-1">
                              <!-- Signature Data -->
                              <div v-if="isSignatureData(subValue)" class="text-blue-600">
                                <img
                                  :src="String(subValue)"
                                  alt="توقيع"
                                  class="max-w-xs max-h-16 border border-gray-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
                                  @click="
                                    openSignaturePreview(String(subValue), `${key}_${index}_${subKey}`)
                                  "
                                />
                              </div>
                              <!-- File Data -->
                              <div v-else-if="isFileData(subValue)" class="text-blue-600">
                                <div v-if="Array.isArray(subValue)" class="space-y-1">
                                  <div
                                    v-for="(file, fileIndex) in subValue.slice(0, 2)"
                                    :key="fileIndex"
                                    class="text-xs"
                                  >
                                    {{ (file as any).name }}
                                  </div>
                                  <div v-if="subValue.length > 2" class="text-xs text-gray-500">
                                    و {{ subValue.length - 2 }} ملف آخر...
                                  </div>
                                </div>
                                <div v-else class="text-xs">
                                  {{ (subValue as any).name }}
                                </div>
                              </div>
                              <!-- Regular Data -->
                              <div v-else class="break-words">
                                {{ String(subValue) }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-sm text-gray-900">
                          {{ String(item) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Signature Data Display -->
                  <div v-else-if="isSignatureData(value)" class="space-y-3">
                    <div
                      class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div
                          class="flex items-center space-x-2"
                          :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                        >
                          <svg
                            class="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          <span class="text-xs font-medium text-green-700">توقيع رقمي</span>
                        </div>
                        <button
                          @click="downloadSignature(value, key)"
                          class="text-xs text-green-600 hover:text-green-700 transition-colors"
                        >
                          تحميل
                        </button>
                      </div>
                      <div class="bg-white rounded p-2 border border-green-200">
                        <img
                          :src="value"
                          :alt="'توقيع'"
                          class="max-w-full max-h-20 mx-auto border border-gray-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
                          @error="handleSignatureError"
                          @click="openSignaturePreview(value, key)"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- File Data Display -->
                  <div v-else-if="isFileData(value)" class="space-y-3">
                    <!-- Single File -->
                    <div
                      v-if="!Array.isArray(value)"
                      class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div
                          class="flex items-center space-x-2"
                          :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                        >
                          <div
                            class="w-8 h-8 rounded-full flex items-center justify-center"
                            :class="getFileIconClass(value.type)"
                          >
                            <svg
                              class="w-4 h-4"
                              :class="getFileIconColor(value.type)"
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
                          <div class="flex-1 min-w-0">
                            <div class="text-xs font-medium text-blue-700 truncate">
                              {{ value.name }}
                            </div>
                            <div class="text-xs text-blue-600">
                              {{ getFileTypeLabel(value.type) }} • {{ formatFileSize(value.size) }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Image Preview for single file -->
                      <div
                        v-if="isImageFile(value.type)"
                        class="bg-white rounded p-2 border border-blue-200"
                      >
                        <img
                          :src="value.data"
                          :alt="value.name"
                          class="max-w-full max-h-20 mx-auto border border-gray-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
                          @click="openFilePreview(value, key)"
                        />
                      </div>
                    </div>

                    <!-- Multiple Files -->
                    <div v-else class="space-y-2">
                      <div class="text-xs font-medium text-gray-600 mb-2">
                        {{ value.length }} ملف مرفوع
                      </div>
                      <div
                        v-for="(file, fileIndex) in value.slice(0, 3)"
                        :key="fileIndex"
                        class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-200"
                      >
                        <div class="flex items-center justify-between">
                          <div
                            class="flex items-center space-x-2"
                            :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                          >
                            <div
                              class="w-6 h-6 rounded-full flex items-center justify-center"
                              :class="getFileIconClass(file.type)"
                            >
                              <svg
                                class="w-3 h-3"
                                :class="getFileIconColor(file.type)"
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
                            <div
                              class="flex-1 min-w-0 cursor-pointer"
                              :class="{ 'cursor-pointer': isImageFile(file.type) }"
                              @click="
                                isImageFile(file.type)
                                  ? openFilePreview(file, `${key}_${fileIndex}`)
                                  : null
                              "
                            >
                              <div class="text-xs font-medium text-blue-700 truncate">
                                {{ file.name }}
                              </div>
                              <div class="text-xs text-blue-600">
                                {{ getFileTypeLabel(file.type) }} • {{ formatFileSize(file.size) }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Image Preview for multiple files -->
                        <div
                          v-if="isImageFile(file.type)"
                          class="mt-2 bg-white rounded p-2 border border-blue-200"
                        >
                          <img
                            :src="file.data"
                            :alt="file.name"
                            class="max-w-full max-h-16 mx-auto border border-gray-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
                            @click="openFilePreview(file, `${key}_${fileIndex}`)"
                          />
                        </div>
                      </div>
                      <div v-if="value.length > 3" class="text-xs text-gray-500 text-center py-2">
                        و {{ value.length - 3 }} ملف آخر...
                      </div>
                    </div>
                  </div>

                  <!-- Regular Text/Object Data Display -->
                  <div v-else class="space-y-2">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div class="text-sm text-gray-900 leading-relaxed">
                        <div v-if="typeof value === 'object' && value !== null" class="space-y-1">
                          <div
                            v-for="([objKey, objValue], objIndex) in Object.entries(value).slice(0, 3)"
                            :key="objIndex"
                            class="text-xs"
                          >
                            <span class="font-medium text-gray-600"
                              >{{ getNestedFieldLabel(key, objKey) }}:</span
                            >
                            <span class="text-gray-900 mr-1"
                              >{{ String(objValue).substring(0, 30)
                              }}{{ String(objValue).length > 30 ? '...' : '' }}</span
                            >
                          </div>
                          <div v-if="Object.keys(value).length > 3" class="text-xs text-gray-500">
                            و {{ Object.keys(value).length - 3 }} حقل آخر...
                          </div>
                        </div>
                        <div v-else class="break-words">
                          {{ String(value).substring(0, 100)
                          }}{{ String(value).length > 100 ? '...' : '' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Show message if no user data found -->
            <div v-if="Object.keys(filteredData).length === 0" class="text-center py-16">
              <div class="flex flex-col items-center space-y-4">
                <div class="p-4 bg-gray-100 rounded-full">
                  <svg
                    class="w-12 h-12 text-gray-400"
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
                <div class="text-gray-500 text-lg font-medium">
                  {{ searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد بيانات مدخلة من المستخدم' }}
                </div>
                <div class="text-gray-400 text-sm">
                  {{
                    searchQuery
                      ? 'جرب كلمات بحث أخرى'
                      : 'قد يكون النموذج فارغاً أو لم يتم ملء أي حقول'
                  }}
                </div>
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  مسح البحث
                </button>
              </div>
            </div>
          </div>

          <!-- Fallback for non-object data -->
          <div v-else class="text-center py-8">
            <pre
              class="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border"
              >{{ JSON.stringify(submission.data, null, 2) }}</pre
            >
          </div>

          <!-- Data Summary -->
          <div
            v-if="Object.keys(filteredData).length > 0"
            class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-center justify-between">
              <div
                class="flex items-center space-x-2"
                :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span class="text-blue-800 font-medium">ملخص البيانات</span>
              </div>
              <span class="text-blue-600 text-sm"
                >{{ Object.keys(filteredData).length }} حقل مملوء</span
              >
            </div>
          </div>
        </div>

        <!-- Form Components Info (if available) -->
        <div
          v-if="submission.form && submission.form.components"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            {{ t('userSubmissions.formComponents') }}
          </h2>
          <div class="text-xs text-gray-500 italic">
            {{ t('userSubmissions.componentsHidden') }}
          </div>
        </div>
      </div>
    </div>

    <!-- File Preview Modal -->
    <div
      v-if="showFilePreview"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      @click="closeFilePreview"
    >
      <div class="relative max-w-4xl max-h-screen p-4" @click.stop>
        <!-- Close Button -->
        <button
          @click="closeFilePreview"
          class="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- File Info -->
        <div class="mb-4 text-center">
          <h3 class="text-white text-lg font-medium">{{ previewFileName }}</h3>
        </div>

        <!-- Image Preview -->
        <div class="bg-white rounded-lg p-4 shadow-2xl">
          <img
            :src="previewFile"
            :alt="previewFileName"
            class="max-w-[80%] max-h-[50vh] mx-auto object-contain rounded"
          />

          <!-- Download Icon -->
          <div class="mt-4 text-center">
            <button
              @click="downloadFile(previewFileData, previewFileKey)"
              class="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
              title="تحميل الملف"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Signature Preview Modal -->
    <div
      v-if="showSignaturePreview"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      @click="closeSignaturePreview"
    >
      <div class="relative max-w-4xl max-h-screen p-4" @click.stop>
        <!-- Close Button -->
        <button
          @click="closeSignaturePreview"
          class="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Signature Info -->
        <div class="mb-4 text-center">
          <div
            class="flex items-center justify-center space-x-2 mb-2"
            :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
          >
            <svg
              class="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <h3 class="text-white text-lg font-medium">{{ previewSignatureField }}</h3>
          </div>
          <p class="text-gray-300 text-sm">التوقيع الرقمي</p>
        </div>

        <!-- Signature Preview -->
        <div class="bg-white rounded-lg p-6 shadow-2xl">
          <img
            :src="previewSignature"
            :alt="previewSignatureField"
            class="max-w-[80%] max-h-[50vh] mx-auto object-contain rounded border-2 border-gray-200"
          />

          <!-- Download Icon -->
          <div class="mt-4 text-center">
            <button
              @click="downloadSignature(previewSignature, previewSignatureField)"
              class="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
              title="تحميل التوقيع"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSubmissionsStore } from '../stores/submissions'
import { useNotifications } from '../composables/useNotifications'
import { isRTLSync } from '../i18n'

// Types
interface FormComponent {
  key: string
  id?: string
  label?: string
  type: string
  validate?: { required?: boolean }
  components?: FormComponent[]
  columns?: Array<{ components: FormComponent[] }>
  rows?: Array<{ cells: Array<{ components: FormComponent[] }> }>
}

interface Submission {
  id: number
  form_id: number
  form?: {
    id: number
    title: string
    components?: FormComponent[]
  }
  data: Record<string, any>
  metadata?: {
    submitted_at?: string
    user_agent?: string
    ip_address?: string
    user_id?: number
    user_name?: string
    user_email?: string
    field_labels?: Record<string, string>
  }
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected'
  submitted_at: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email?: string
  }
}

// Composables
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const submissionsStore = useSubmissionsStore()
const { error: showError } = useNotifications()

// Reactive state
const submission = ref<Submission | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedSection = ref<string>('all')

// Computed properties will be defined after methods

// Section and filtering methods
const getFormSections = () => {
  if (!submission.value?.form) return []

  // Try to get sections from form schema first
  let schema = (submission.value.form as any).schema
  if (typeof schema === 'string') {
    try {
      schema = JSON.parse(schema)
    } catch (e) {
      console.error('Error parsing form schema:', e)
      return []
    }
  }

  // If schema has sections, use them
  if (schema && schema.sections && Array.isArray(schema.sections)) {
    return schema.sections
  }

  // Fallback: Look for sections in form components
  const components = submission.value.form.components || schema?.components
  const sections: Array<{ id: string; title: string; componentIds: string[] }> = []

  if (components && Array.isArray(components)) {
    components.forEach((component: FormComponent) => {
      if (
        component.type === 'panel' ||
        component.type === 'fieldset' ||
        component.type === 'tabs'
      ) {
        sections.push({
          id: component.key || component.id || 'unknown',
          title: (component as any).title || component.label || component.key,
          componentIds: (component.components || []).map(
            (comp: FormComponent) => comp.key || comp.id || 'unknown',
          ),
        })
      }
    })
  }

  // If no sections found but we have components, create a default section
  if (sections.length === 0 && components && components.length > 0) {
    sections.push({
      id: 'default',
      title: 'جميع الحقول',
      componentIds: components.map((comp: FormComponent) => comp.key || comp.id || 'unknown'),
    })
  }

  return sections
}

const getSectionOptions = () => {
  const sections = getFormSections()
  const options = [{ value: 'all', label: 'جميع الأقسام' }]

  sections.forEach((section: any) => {
    options.push({
      value: section.id,
      label: section.title,
    })
  })

  return options
}

const getFieldsForSection = (sectionId: string) => {
  if (sectionId === 'all') return Object.keys(submission.value?.data || {})

  const sections = getFormSections()
  const section = sections.find((s: any) => s.id === sectionId)

  if (!section) return []

  const fieldKeys: string[] = []

  const extractKeys = (components: FormComponent[]) => {
    components.forEach((component: FormComponent) => {
      if (component.key) {
        fieldKeys.push(component.key)
      }
      if (component.components && Array.isArray(component.components)) {
        extractKeys(component.components)
      }
      // Handle columns structure (for layout components)
      if (component.columns && Array.isArray(component.columns)) {
        component.columns.forEach((column: { components: FormComponent[] }) => {
          if (column.components && Array.isArray(column.components)) {
            extractKeys(column.components)
          }
        })
      }
    })
  }

  if (section.components && Array.isArray(section.components)) {
    extractKeys(section.components)
  }

  // If section has componentIds array (from stepper format), use those
  if (section.componentIds && Array.isArray(section.componentIds)) {
    fieldKeys.push(...section.componentIds)
  }

  return fieldKeys
}

// Helper methods
const getFieldType = (value: unknown): string => {
  if (isSignatureData(value)) {
    return 'توقيع رقمي'
  }
  if (isFileData(value)) {
    if (Array.isArray(value)) {
      return `ملفات (${value.length} ملف)`
    }
    return 'ملف'
  }
  if (Array.isArray(value)) {
    // Check if it's EditGrid/DataGrid data
    if (value.length > 0 && value.every((item) => typeof item === 'object' && item !== null)) {
      return `جدول بيانات (${value.length} صف)`
    }
    return `مصفوفة (${value.length} عنصر)`
  }
  if (typeof value === 'object' && value !== null) {
    return 'كائن'
  }
  if (typeof value === 'string') {
    return value.length > 100 ? 'نص طويل' : 'نص قصير'
  }
  if (typeof value === 'number') {
    return 'رقم'
  }
  if (typeof value === 'boolean') {
    return 'منطقي'
  }
  return 'غير محدد'
}

// Methods
const loadSubmission = async () => {
  const submissionId = route.params.id as string
  if (!submissionId) {
    error.value = 'Invalid submission ID'
    return
  }

  loading.value = true
  error.value = null

  try {
    console.log('Loading submission with ID:', submissionId)

    // Try to get submission from store first
    const existingSubmission = submissionsStore.getSubmissionById(parseInt(submissionId))
    console.log('Existing submission from store:', existingSubmission)

    if (existingSubmission) {
      submission.value = existingSubmission
      console.log('Using existing submission:', submission.value)
    } else {
      // If not found in store, fetch from API
      console.log('Fetching from API...')
      const response = await submissionsStore.fetchSubmission(parseInt(submissionId))
      console.log('API response:', response)

      if (response.success && response.data) {
        submission.value = response.data
        console.log('Loaded submission from API:', submission.value)
      } else {
        throw new Error(response.error || 'Failed to fetch submission')
      }
    }

    console.log('Final submission data:', submission.value?.data)
    console.log('📋 Field Labels from metadata:', submission.value?.metadata?.field_labels)
    console.log('📊 Metadata full:', submission.value?.metadata)
    console.log('Filtered data:', getFilteredData(submission.value?.data))
  } catch (err) {
    console.error('Error loading submission:', err)
    error.value = t('userSubmissions.errors.loadFailed')
    showError(t('userSubmissions.errors.loadFailed'))
  } finally {
    loading.value = false
  }
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    submitted: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const statusTexts = {
    submitted: t('submissions.status.submitted'),
    reviewed: t('submissions.status.reviewed'),
    approved: t('submissions.status.approved'),
    rejected: t('submissions.status.rejected'),
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? t('common.yes') : t('common.no')
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

const formatSimpleValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return 'لا توجد بيانات'
  }

  // Handle signature data
  if (isSignatureData(value)) {
    return 'توقيع رقمي'
  }

  // Handle file data
  if (isFileData(value)) {
    if (Array.isArray(value)) {
      return `${value.length} ملف مرفوع`
    }
    return `ملف: ${(value as any).name || 'ملف غير معروف'}`
  }

  if (typeof value === 'boolean') {
    return value ? 'نعم' : 'لا'
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return 'لا توجد بيانات'

    // Handle DataGrid/EditGrid data - array of objects with form data
    if (value.every((item) => typeof item === 'object' && item !== null)) {
      let result = ''
      value.forEach((item, index) => {
        result += `الصف ${index + 1}:\n`
        Object.entries(item).forEach(([key, val]) => {
          if (val !== null && val !== undefined && val !== '') {
            const label = getFieldLabel(key)
            // Handle signature data in nested objects
            if (isSignatureData(val)) {
              result += `  ${label}: توقيع رقمي\n`
            } else if (isFileData(val)) {
              // Handle file data in nested objects
              if (Array.isArray(val)) {
                result += `  ${label}: ${val.length} ملف مرفوع\n`
              } else {
                result += `  ${label}: ملف - ${(val as any).name || 'ملف غير معروف'}\n`
              }
            } else if (Array.isArray(val)) {
              // Handle nested arrays
              result += `  ${label}: ${val.length} عنصر\n`
            } else if (typeof val === 'object' && val !== null) {
              // Handle nested objects
              result += `  ${label}: كائن بيانات\n`
            } else {
              result += `  ${label}: ${String(val)}\n`
            }
          }
        })
        result += '\n'
      })
      return result.trim()
    }

    // Handle simple arrays
    const simpleValues = value.filter(
      (item) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean',
    )

    if (simpleValues.length > 0) {
      return simpleValues.join(', ')
    }

    return `${value.length} عنصر`
  }

  if (typeof value === 'object') {
    // For objects, try to extract meaningful text values
    const entries = Object.entries(value).filter(
      ([key, val]) => val !== null && val !== undefined && val !== '',
    )

    if (entries.length > 0) {
      return entries
        .map(([key, val]) => {
          const label = getFieldLabel(key)
          if (isSignatureData(val)) {
            return `${label}: توقيع رقمي`
          }
          return `${label}: ${String(val)}`
        })
        .join('\n')
    }

    return 'بيانات معقدة'
  }

  return String(value).trim()
}

const getFilteredData = (data: Record<string, any>) => {
  if (!data || typeof data !== 'object') return {}

  // Filter out system fields and empty values
  const filtered: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    // Skip system fields completely - FIRST PRIORITY
    if (key === 'isEmpty' || key === 'components' || key === 'rowId') {
      console.log('Skipping system field:', key)
      continue
    }

    // Additional check for components array regardless of key name
    if (Array.isArray(value) && value.length > 0) {
      // Check if ALL items in array are component definitions
      const allAreComponents = value.every(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          ((item.type && (item.key || item.label)) || // Has type and (key or label)
            item.type === 'textarea' ||
            item.type === 'textfield' || // Specific component types
            item.input !== undefined ||
            item.tableView !== undefined), // Form.io properties
      )

      if (allAreComponents) {
        console.log('Skipping component definitions array (all items are components) for key:', key)
        continue
      }
    }

    // Skip keys that start with 'row_' (table row identifiers)
    if (key.startsWith('row_')) {
      console.log('Skipping row identifier:', key)
      continue
    }

    // Skip if the value is exactly the string "isEmpty"
    if (value === 'isEmpty') {
      console.log('Skipping isEmpty value for key:', key)
      continue
    }

    // Skip if the value is exactly the string "لا توجد بيانات"
    if (value === 'لا توجد بيانات') {
      console.log('Skipping "لا توجد بيانات" value for key:', key)
      continue
    }

    // Skip if key contains system patterns
    if (key.includes('isEmpty') || key.includes('components') || key.includes('rowId')) {
      console.log('Skipping key with system pattern:', key)
      continue
    }

    // Skip completely empty values
    if (value === '' || value === null || value === undefined) {
      continue
    }

    // Skip arrays that contain only component definitions (form builder components)
    if (Array.isArray(value)) {
      // Skip empty arrays
      if (value.length === 0) {
        console.log('Skipping empty array for key:', key)
        continue
      }

      // Check if this is a component definitions array
      const hasComponentDefinitions = value.some(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          ((item.type && item.key) || // Standard component definition
            item.type === 'textarea' || // Specific textarea component
            item.type === 'textfield' || // Specific textfield component
            (item.label && item.type) || // Has label and type
            (item.input !== undefined && item.tableView !== undefined)), // Form.io component properties
      )

      if (hasComponentDefinitions) {
        console.log('Skipping component definitions array for key:', key)
        continue
      }
    }

    // Skip objects that only contain component definitions
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Check if this is a component definition object
      if (value.type && value.key && (value.label || value.input !== undefined)) {
        continue
      }

      // Check if object contains only system fields
      const objectKeys = Object.keys(value)
      const systemKeys = [
        'isEmpty',
        'components',
        'rowId',
        'type',
        'key',
        'label',
        'input',
        'tableView',
        'validate',
        'rows',
        'placeholder',
        'spellcheck',
      ]
      const hasUserData = objectKeys.some(
        (objKey) =>
          !systemKeys.includes(objKey) &&
          value[objKey] !== null &&
          value[objKey] !== undefined &&
          value[objKey] !== '',
      )

      if (!hasUserData) {
        continue
      }
    }

    // Additional strict filtering for specific problematic values
    if (typeof value === 'string') {
      // Skip if value contains component definition patterns
      if (value.includes('"type":') && value.includes('"key":')) {
        console.log('Skipping stringified component definition for key:', key)
        continue
      }

      // Skip if value is a stringified component array
      if (value.startsWith('[') && value.includes('"type"') && value.includes('"textarea"')) {
        console.log('Skipping stringified component array for key:', key)
        continue
      }

      // Skip if value contains JSON-like component definitions
      if (value.includes('textarea_') && value.includes('"label"') && value.includes('"type"')) {
        console.log('Skipping JSON component definition for key:', key)
        continue
      }
    }

    // Skip if this is clearly a component definition array
    if (Array.isArray(value)) {
      // Check if this is a components array (even if not all items have all properties)
      const isComponentArray =
        value.length > 0 &&
        value.some(
          (item) =>
            typeof item === 'object' &&
            item !== null &&
            (item.type === 'textarea' ||
              item.type === 'textfield' ||
              item.type ||
              item.key ||
              item.label),
        )

      // Also check if the key is literally 'components'
      if (key === 'components' || isComponentArray) {
        console.log('Skipping component definition array for key:', key)
        continue
      }
    }

    // For DataGrid and other complex data, include if it has meaningful content
    if (Array.isArray(value) && value.length > 0) {
      // Check if array contains actual user data (not just empty objects or component definitions)
      const hasData = value.some((item) => {
        if (typeof item === 'object' && item !== null) {
          // Skip if this looks like a component definition
          if (item.type && item.key) {
            return false
          }

          // Check for actual user input data
          return Object.entries(item).some(([itemKey, itemVal]) => {
            // Skip system fields in nested objects
            if (
              itemKey === 'isEmpty' ||
              itemKey === 'components' ||
              itemKey === 'rowId' ||
              itemKey.startsWith('row_')
            ) {
              return false
            }
            return itemVal !== null && itemVal !== undefined && itemVal !== ''
          })
        }
        return item !== null && item !== undefined && item !== ''
      })

      if (hasData) {
        // Clean the array data before including it
        const cleanedArray = value
          .map((item) => {
            if (typeof item === 'object' && item !== null) {
              const cleanedItem: Record<string, any> = {}
              Object.entries(item).forEach(([itemKey, itemVal]) => {
                // Only include non-system fields with actual data
                if (
                  itemKey !== 'isEmpty' &&
                  itemKey !== 'components' &&
                  itemKey !== 'rowId' &&
                  !itemKey.startsWith('row_') &&
                  itemVal !== null &&
                  itemVal !== undefined &&
                  itemVal !== ''
                ) {
                  cleanedItem[itemKey] = itemVal
                }
              })
              return Object.keys(cleanedItem).length > 0 ? cleanedItem : null
            }
            return item
          })
          .filter((item) => item !== null)

        if (cleanedArray.length > 0) {
          filtered[key] = cleanedArray
        }
      }
      continue
    }

    // Final validation before including the data
    // Only include if it's clearly user input data
    const isUserData =
      // Must not be a system field name
      !['isEmpty', 'components', 'rowId'].includes(key) &&
      !key.startsWith('row_') &&
      // Must not be system values
      value !== 'isEmpty' &&
      value !== 'لا توجد بيانات' &&
      // Must not be stringified component definitions
      !(
        typeof value === 'string' &&
        (value.includes('"type":') || value.includes('"key":') || value.includes('"label":'))
      ) &&
      // Must have actual content
      value !== null &&
      value !== undefined &&
      value !== ''

    if (isUserData) {
      console.log('Including user data for key:', key, 'value:', value)
      filtered[key] = value
    } else {
      console.log('Excluding non-user data for key:', key, 'value:', value)
    }
  }

  console.log('Final filtered data:', filtered)
  return filtered
}

// Helper function specifically for nested fields in DataGrid/EditGrid
const getNestedFieldLabel = (parentKey: string, childKey: string): string => {
  const fieldLabels = submission.value?.metadata?.field_labels
  
  console.log(`🔍 getNestedFieldLabel called:`, { parentKey, childKey })
  console.log(`📋 Available field_labels:`, fieldLabels)
  
  if (!fieldLabels) {
    console.log(`⚠️ No field_labels available, using fallback`)
    return getFieldLabel(childKey)
  }

  // Try multiple patterns to find the label
  const searchPatterns = [
    // Pattern 1: Full parent_child key (e.g., "datagrid_1760871342680_0p2wb1joj_textfield_1760871347055_1q35gdj8m")
    `${parentKey}_${childKey}`,
    
    // Pattern 2: Try to find any key in field_labels that contains both parent and child
    null, // Will search manually below
    
    // Pattern 3: Just the child key
    childKey,
  ]

  console.log(`🔍 Trying search patterns:`, searchPatterns.filter(p => p !== null))

  // Try direct patterns first
  for (const pattern of searchPatterns) {
    if (pattern && fieldLabels[pattern]) {
      console.log(`✅ Found nested label via pattern "${pattern}":`, fieldLabels[pattern])
      return fieldLabels[pattern]
    }
  }

  // Search through all field_labels for matching patterns
  for (const [key, label] of Object.entries(fieldLabels)) {
    // Check if the key contains both parent and child identifiers
    if (key.includes(parentKey) && key.includes(childKey)) {
      console.log(`✅ Found nested label via search "${key}":`, label)
      return label
    }
  }

  // Fallback to searching form components
  if (submission.value?.form?.components) {
    // First try to find parent component (DataGrid/EditGrid)
    const parentComponent = findComponentByKey(submission.value.form.components, parentKey)
    
    if (parentComponent?.components) {
      // Then search for child within parent
      const childComponent = findComponentByKey(parentComponent.components, childKey)
      if (childComponent?.label) {
        console.log(`✅ Found nested label via components "${childKey}":`, childComponent.label)
        return childComponent.label
      }
    }
  }

  // Last resort: use generic getFieldLabel
  console.log(`⚠️ No nested label found, using fallback for "${childKey}"`)
  return getFieldLabel(childKey)
}

const getFieldLabel = (fieldKey: string | number): string => {
  // Convert to string to handle both string and number keys
  const keyStr = String(fieldKey)

  // Handle very short keys that might be suffixes (like 'a', 'b', etc.)
  if (keyStr.length === 1 && keyStr.match(/^[a-z]$/)) {
    return 'حقل نص'
  }

  const fieldLabels = submission.value?.metadata?.field_labels

  // Handle dotted nested keys by prioritizing the last segment label
  if (keyStr.includes('.')) {
    const segments = keyStr.split('.')
    const lastSegment = segments[segments.length - 1]
    const parentKey = segments[segments.length - 2] || ''

    // Try full dotted key in metadata first
    if (fieldLabels && fieldLabels[keyStr]) {
      console.log(`✅ Found label via dotted key "${keyStr}":`, fieldLabels[keyStr])
      return fieldLabels[keyStr]
    }

    // Try to find with parent_child pattern (e.g., "datagrid_xxx_textfield_yyy")
    if (fieldLabels && parentKey) {
      // Look for pattern: parentKey_lastSegment
      const compositeKey = `${parentKey}_${lastSegment}`
      if (fieldLabels[compositeKey]) {
        console.log(`✅ Found label via composite key "${compositeKey}":`, fieldLabels[compositeKey])
        return fieldLabels[compositeKey]
      }

      // Try to find any key that ends with both parent and child
      for (const [key, label] of Object.entries(fieldLabels)) {
        if (key.includes(parentKey) && key.endsWith(lastSegment)) {
          console.log(`✅ Found label via pattern match "${key}":`, label)
          return label
        }
      }
    }

    // Then try last segment in metadata
    if (fieldLabels && fieldLabels[lastSegment]) {
      console.log(`✅ Found label via last segment "${lastSegment}":`, fieldLabels[lastSegment])
      return fieldLabels[lastSegment]
    }
    
    // Try to find component by last segment
    if (submission.value?.form?.components) {
      const lastComp = findComponentByKey(submission.value.form.components, lastSegment)
      if (lastComp?.label) {
        console.log(`✅ Found label via component "${lastSegment}":`, lastComp.label)
        return lastComp.label
      }
    }
  }

  // First priority: Use field_labels from submission metadata (sent from PublicForm.vue)
  if (fieldLabels && fieldLabels[keyStr]) {
    console.log(`✅ SubmissionDetails: Found label for "${keyStr}":`, fieldLabels[keyStr])
    return fieldLabels[keyStr]
  }

  // Try to find in fieldLabels by searching for keys that contain our keyStr
  if (fieldLabels) {
    // Look for any key in field_labels that ends with our keyStr
    for (const [key, label] of Object.entries(fieldLabels)) {
      if (key.endsWith(keyStr) || key.includes(`_${keyStr}`)) {
        console.log(`✅ Found label via pattern "${key}":`, label)
        return label
      }
    }
  }

  console.log(`⚠️ SubmissionDetails: No label found in metadata for "${keyStr}", trying form components...`)

  // Second priority: Try to find the field in form components
  if (submission.value?.form?.components) {
    const component = findComponentByKey(submission.value.form.components, keyStr)
    if (component && component.label) {
      console.log(`✅ SubmissionDetails: Found component label for "${keyStr}":`, component.label)
      return component.label
    }
  }

  // Third priority: Special handling for common field patterns
  if (keyStr.includes('signature')) {
    return 'التوقيع الرقمي'
  }
  if (keyStr.includes('datagrid')) {
    return 'جدول البيانات'
  }
  if (keyStr.includes('textarea')) {
    return 'منطقة نص'
  }
  if (keyStr.includes('textfield')) {
    return 'حقل نص'
  }
  if (keyStr.includes('column')) {
    return 'عمود'
  }
  if (keyStr.includes('row')) {
    return 'صف'
  }
  if (keyStr.includes('number')) {
    return 'حقل رقم'
  }
  if (keyStr.includes('email')) {
    return 'البريد الإلكتروني'
  }
  if (keyStr.includes('select')) {
    return 'قائمة اختيار'
  }
  if (keyStr.includes('checkbox')) {
    return 'مربع اختيار'
  }
  if (keyStr.includes('radio')) {
    return 'اختيار واحد'
  }
  if (keyStr.includes('editgrid')) {
    return 'شبكة التحرير'
  }
  if (keyStr.includes('table')) {
    return 'جدول'
  }
  if (keyStr.includes('panel')) {
    return 'لوحة'
  }
  if (keyStr.includes('fieldset')) {
    return 'مجموعة حقول'
  }
  if (keyStr.includes('well')) {
    return 'صندوق'
  }
  if (keyStr.includes('container')) {
    return 'حاوية'
  }
  if (keyStr.includes('tabs')) {
    return 'تبويبات'
  }

  // Fourth priority: Try to extract meaningful labels from complex field keys
  // Handle Form.io generated field keys like "eld_1760871347055_1q35gdj8m"
  if (keyStr.match(/^[a-z]{3}_\d+_[a-z0-9]+$/)) {
    console.log(`🔍 SubmissionDetails: Detected Form.io generated key: "${keyStr}"`)

    // Try to find this field in form components by matching partial keys
    if (submission.value?.form?.components) {
      const foundComponent = findComponentByPartialKey(submission.value.form.components, keyStr)
      if (foundComponent && foundComponent.label) {
        console.log(`✅ SubmissionDetails: Found component by partial key match:`, {
          key: keyStr,
          label: foundComponent.label,
        })
        return foundComponent.label
      }
    }

    // Try to find by the last part of the key (the unique identifier)
    const lastPart = keyStr.split('_').pop()
    if (lastPart && submission.value?.form?.components) {
      const foundByLastPart = findComponentByLastPart(submission.value.form.components, lastPart)
      if (foundByLastPart && foundByLastPart.label) {
        console.log(`✅ SubmissionDetails: Found component by last part match:`, {
          key: keyStr,
          lastPart: lastPart,
          label: foundByLastPart.label,
        })
        return foundByLastPart.label
      }
    }

    // Fallback: try to extract meaningful part from the key
    const meaningfulPart = keyStr.replace(/^[a-z]{3}_\d+_/, '').replace(/[0-9]/g, '')
    if (meaningfulPart.length > 2) {
      return meaningfulPart.charAt(0).toUpperCase() + meaningfulPart.slice(1)
    }
  }

  // Handle other complex field patterns
  if (keyStr.includes('Field_')) {
    const afterField = keyStr.split('Field_')[1]
    if (afterField) {
      const meaningfulPart = afterField.split('_')[0]
      if (meaningfulPart && meaningfulPart.length > 2) {
        return meaningfulPart.charAt(0).toUpperCase() + meaningfulPart.slice(1)
      }
    }
  }

  // Handle generic field patterns like "textfield_1", "textfield-1"
  if (keyStr.match(/^(textfield|textarea|number|email|select|checkbox|radio|signature)[-_]?\d*$/)) {
    const fieldType = keyStr.replace(/[-_]\d*$/, '')
    const typeLabels = {
      textfield: 'حقل نص',
      textarea: 'منطقة نص',
      number: 'حقل رقم',
      email: 'البريد الإلكتروني',
      select: 'قائمة اختيار',
      checkbox: 'مربع اختيار',
      radio: 'اختيار واحد',
      signature: 'التوقيع الرقمي',
    }
    return typeLabels[fieldType as keyof typeof typeLabels] || fieldType
  }

  // Handle field patterns with comma (like "textfield,a" or "شسؤؤ,textfield")
  if (keyStr.includes(',')) {
    const parts = keyStr.split(',')
    if (parts.length >= 2) {
      const firstPart = parts[0].trim()
      const secondPart = parts[1].trim()
      
      // First, try to find the exact key in metadata
      if (submission.value?.metadata?.field_labels && submission.value.metadata.field_labels[firstPart]) {
        return submission.value.metadata.field_labels[firstPart]
      }
      
      // Try to find by second part (field type)
      if (submission.value?.metadata?.field_labels && submission.value.metadata.field_labels[secondPart]) {
        return submission.value.metadata.field_labels[secondPart]
      }
      
      // Check if first part is a meaningful label (Arabic text or meaningful English)
      if (firstPart.length > 2 && !firstPart.match(/^[a-z]{3}_\d+_[a-z0-9]+$/) && !firstPart.match(/^(textfield|textarea|number|email|select|checkbox|radio|signature)[-_]?\d*$/)) {
        return firstPart
      }
      
      // Fallback to field type labels
      const fieldType = secondPart
      const typeLabels = {
        textfield: 'حقل نص',
        'textfield-1': 'حقل نص',
        'textfield-2': 'حقل نص',
        'textfield-3': 'حقل نص',
        'textfield-4': 'حقل نص',
        'textfield-5': 'حقل نص',
        textarea: 'منطقة نص',
        number: 'حقل رقم',
        email: 'البريد الإلكتروني',
        select: 'قائمة اختيار',
        checkbox: 'مربع اختيار',
        radio: 'اختيار واحد',
        signature: 'التوقيع الرقمي',
        a: 'حقل نص', // Handle the 'a' suffix
      }

      if (typeLabels[fieldType as keyof typeof typeLabels]) {
        return typeLabels[fieldType as keyof typeof typeLabels]
      }
      
      // If second part looks like a field type pattern, use appropriate label
      if (fieldType.match(/^(textfield|textarea|number|email|select|checkbox|radio|signature)/)) {
        const baseType = fieldType.replace(/[-_]\d*$/, '')
        if (typeLabels[baseType as keyof typeof typeLabels]) {
          return typeLabels[baseType as keyof typeof typeLabels]
        }
      }
    }
  }

  // Fallback to formatted key
  const formattedKey = keyStr.replace(/[_-]/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
  console.log(`🔄 SubmissionDetails: Using formatted key for "${keyStr}": "${formattedKey}"`)
  return formattedKey
}

// Signature detection and handling functions
const isSignatureData = (value: unknown): boolean => {
  if (typeof value !== 'string') return false

  // Check if it's a base64 image data URL (signature format)
  const base64ImagePattern = /^data:image\/(png|jpeg|jpg|gif|svg\+xml);base64,/i
  return base64ImagePattern.test(value)
}

const handleSignatureError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img) {
    img.style.display = 'none'
    const container = img.parentElement
    if (container) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-8 text-gray-500">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span class="text-sm">خطأ في تحميل التوقيع</span>
        </div>
      `
    }
  }
}

const downloadSignature = (signatureData: string, fieldKey: string) => {
  try {
    // Create a link element for download
    const link = document.createElement('a')
    link.href = signatureData
    link.download = `signature-${fieldKey}-${submission.value?.id || 'unknown'}-${new Date().toISOString().split('T')[0]}.png`

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show success notification
    console.log('Signature downloaded successfully')
  } catch (error) {
    console.error('Error downloading signature:', error)
    showError(t('signature.downloadError'))
  }
}

// File detection and handling functions
const isFileData = (value: unknown): boolean => {
  if (!value) return false

  // Check if it's a single file object with base64 data
  if (
    typeof value === 'object' &&
    (value as any).data &&
    (value as any).name &&
    (value as any).type
  ) {
    return typeof (value as any).data === 'string' && (value as any).data.startsWith('data:')
  }

  // Check if it's an array of file objects
  if (Array.isArray(value)) {
    return (
      value.length > 0 &&
      value.every(
        (item) =>
          typeof item === 'object' &&
          (item as any).data &&
          (item as any).name &&
          (item as any).type &&
          typeof (item as any).data === 'string' &&
          (item as any).data.startsWith('data:'),
      )
    )
  }

  return false
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

const downloadFile = (fileData: { data: string; name: string; type: string }, fieldKey: string) => {
  try {
    const link = document.createElement('a')
    link.href = fileData.data
    link.download = fileData.name || `file-${fieldKey}-${submission.value?.id || 'unknown'}`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('File downloaded successfully')
  } catch (error) {
    console.error('Error downloading file:', error)
    showError('حدث خطأ أثناء تحميل الملف')
  }
}

const previewFile = ref('')
const previewFileName = ref('')
const previewFileData = ref<any>(null)
const previewFileKey = ref('')
const showFilePreview = ref(false)

const previewSignature = ref('')
const previewSignatureField = ref('')
const showSignaturePreview = ref(false)

const openFilePreview = (fileData: { data: string; name: string; type: string }, key?: string) => {
  if (isImageFile(fileData.type)) {
    previewFile.value = fileData.data
    previewFileName.value = fileData.name
    previewFileData.value = fileData
    previewFileKey.value = key || ''
    showFilePreview.value = true
  }
}

const closeFilePreview = () => {
  showFilePreview.value = false
  previewFile.value = ''
  previewFileName.value = ''
  previewFileData.value = null
  previewFileKey.value = ''
}

const openSignaturePreview = (signatureData: string, fieldKey: string) => {
  previewSignature.value = signatureData
  previewSignatureField.value = getFieldLabel(fieldKey)
  showSignaturePreview.value = true
}

const closeSignaturePreview = () => {
  showSignaturePreview.value = false
  previewSignature.value = ''
  previewSignatureField.value = ''
}

const findComponentByKey = (components: FormComponent[], key: string): FormComponent | null => {
  for (const component of components) {
    if (component.key === key) {
      return component
    }

    // Search in nested components (like columns, panels, etc.)
    if (component.components && Array.isArray(component.components)) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in columns
    if (component.columns && Array.isArray(component.columns)) {
      for (const column of component.columns) {
        if (column.components && Array.isArray(column.components)) {
          const found = findComponentByKey(column.components, key)
          if (found) return found
        }
      }
    }

    // Search in EditGrid components
    if (
      component.type === 'editgrid' &&
      component.components &&
      Array.isArray(component.components)
    ) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in DataGrid components
    if (
      component.type === 'datagrid' &&
      component.components &&
      Array.isArray(component.components)
    ) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in Panel components
    if (component.type === 'panel' && component.components && Array.isArray(component.components)) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in Fieldset components
    if (
      component.type === 'fieldset' &&
      component.components &&
      Array.isArray(component.components)
    ) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in Well components
    if (component.type === 'well' && component.components && Array.isArray(component.components)) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in Container components
    if (
      component.type === 'container' &&
      component.components &&
      Array.isArray(component.components)
    ) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in Tabs components
    if (component.type === 'tabs' && component.components && Array.isArray(component.components)) {
      const found = findComponentByKey(component.components, key)
      if (found) return found
    }

    // Search in table rows and cells
    if (component.type === 'table' && component.rows) {
      for (const row of component.rows) {
        if (row.cells && Array.isArray(row.cells)) {
          for (const cell of row.cells) {
            if (cell.components && Array.isArray(cell.components)) {
              const found = findComponentByKey(cell.components, key)
              if (found) return found
            }
          }
        }
      }
    }
  }
  return null
}

// Helper function to find components by partial key matching
const findComponentByPartialKey = (
  components: FormComponent[],
  partialKey: string,
): FormComponent | null => {
  for (const component of components) {
    // Direct match
    if (component.key === partialKey) {
      return component
    }

    // Partial match for Form.io generated keys
    if (component.key && component.key.includes(partialKey.split('_').pop() || '')) {
      return component
    }

    // Search in nested components
    if (component.components && Array.isArray(component.components)) {
      const found = findComponentByPartialKey(component.components, partialKey)
      if (found) return found
    }

    // Search in columns
    if (component.columns && Array.isArray(component.columns)) {
      for (const column of component.columns) {
        if (column.components && Array.isArray(column.components)) {
          const found = findComponentByPartialKey(column.components, partialKey)
          if (found) return found
        }
      }
    }

    // Search in EditGrid/DataGrid components
    if ((component.type === 'editgrid' || component.type === 'datagrid') && component.components) {
      const found = findComponentByPartialKey(component.components, partialKey)
      if (found) return found
    }

    // Search in other container types
    if (
      (component.type === 'panel' ||
        component.type === 'fieldset' ||
        component.type === 'well' ||
        component.type === 'container') &&
      component.components
    ) {
      const found = findComponentByPartialKey(component.components, partialKey)
      if (found) return found
    }
  }
  return null
}

// Helper function to find components by the last part of their key
const findComponentByLastPart = (
  components: FormComponent[],
  lastPart: string,
): FormComponent | null => {
  for (const component of components) {
    // Check if the component's key ends with the last part
    if (component.key && component.key.endsWith(lastPart)) {
      return component
    }

    // Search in nested components
    if (component.components && Array.isArray(component.components)) {
      const found = findComponentByLastPart(component.components, lastPart)
      if (found) return found
    }

    // Search in columns
    if (component.columns && Array.isArray(component.columns)) {
      for (const column of component.columns) {
        if (column.components && Array.isArray(column.components)) {
          const found = findComponentByLastPart(column.components, lastPart)
          if (found) return found
        }
      }
    }

    // Search in EditGrid/DataGrid components
    if ((component.type === 'editgrid' || component.type === 'datagrid') && component.components) {
      const found = findComponentByLastPart(component.components, lastPart)
      if (found) return found
    }

    // Search in other container types
    if (
      (component.type === 'panel' ||
        component.type === 'fieldset' ||
        component.type === 'well' ||
        component.type === 'container') &&
      component.components
    ) {
      const found = findComponentByLastPart(component.components, lastPart)
      if (found) return found
    }
  }
  return null
}

// Export functions

const exportSubmission = () => {
  if (!submission.value) return

  const exportData = {
    submissionId: submission.value.id,
    formTitle: submission.value.form?.title || 'نموذج غير معروف',
    submittedAt: submission.value.submitted_at || submission.value.created_at,
    status: submission.value.status,
    user: submission.value.user,
    data: getFilteredData(submission.value.data),
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `submission-${submission.value.id}-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Computed properties (defined after all methods)
// Computed properties for sections
const formSections = computed(() => getFormSections())
const sectionOptions = computed(() => getSectionOptions())
const hasSections = computed(() => formSections.value.length > 0)

const filteredData = computed(() => {
  let data = getFilteredData(submission.value?.data || {})
  console.log('📊 SubmissionDetails: Starting filteredData computation', {
    originalDataKeys: Object.keys(data),
    selectedSection: selectedSection.value,
    hasSections: hasSections.value,
    searchQuery: searchQuery.value,
  })

  // Filter by section first
  if (selectedSection.value !== 'all' && hasSections.value) {
    const sectionFields = getFieldsForSection(selectedSection.value)
    console.log('📊 SubmissionDetails: Section filtering', {
      selectedSection: selectedSection.value,
      sectionFields,
      availableDataKeys: Object.keys(data),
    })

    const sectionData: Record<string, any> = {}

    sectionFields.forEach((fieldKey) => {
      if (data[fieldKey] !== undefined) {
        sectionData[fieldKey] = data[fieldKey]
        console.log('📊 SubmissionDetails: Including field in section', { fieldKey, hasData: true })
      } else {
        console.log('📊 SubmissionDetails: Field not found in data', { fieldKey, hasData: false })
      }
    })

    data = sectionData
    console.log('📊 SubmissionDetails: After section filtering', {
      filteredKeys: Object.keys(data),
    })
  }

  // Then filter by search query
  if (!searchQuery.value.trim()) {
    console.log('📊 SubmissionDetails: No search query, returning section-filtered data', {
      finalKeys: Object.keys(data),
    })
    return data
  }

  const query = searchQuery.value.toLowerCase()
  const filtered: Record<string, any> = {}

  Object.entries(data).forEach(([key, value]) => {
    const fieldLabel = getFieldLabel(key).toLowerCase()
    const keyString = String(key).toLowerCase()
    const valueString = String(value).toLowerCase()

    if (fieldLabel.includes(query) || keyString.includes(query) || valueString.includes(query)) {
      filtered[key] = value
      console.log('📊 SubmissionDetails: Field matches search', { key, fieldLabel, query })
    }
  })

  console.log('📊 SubmissionDetails: Final filtered data', { finalKeys: Object.keys(filtered) })
  return filtered
})

// Lifecycle
onMounted(() => {
  loadSubmission()
})
</script>

<style scoped>
/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Enhanced animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-6 > * {
  animation: fadeInUp 0.5s ease-out;
}

/* Signature display styles */
.signature-container {
  margin: 0.5rem 0;
}

.signature-display {
  transition: all 0.3s ease;
}

.signature-display:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.signature-preview {
  transition: all 0.2s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.signature-preview img {
  transition: transform 0.2s ease;
  cursor: pointer;
}

.signature-preview img:hover {
  transform: scale(1.02);
}

/* Signature error state */
.signature-error {
  background: #fef2f2;
  border: 2px dashed #fca5a5;
  color: #dc2626;
}

/* Download button hover effect */
.signature-download-btn {
  transition: all 0.2s ease;
}

.signature-download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* RTL support for signature display */
[dir='rtl'] .signature-display .flex {
  direction: rtl;
}

[dir='rtl'] .signature-preview {
  text-align: right;
}

/* Responsive signature display */
@media (max-width: 640px) {
  .signature-preview {
    padding: 1rem;
  }

  .signature-preview img {
    max-height: 8rem;
  }
}

@media (max-width: 480px) {
  .signature-display {
    padding: 1rem;
  }

  .signature-preview img {
    max-height: 6rem;
  }
}
</style>
