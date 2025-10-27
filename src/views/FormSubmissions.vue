<template>
  <div
    class="form-submissions-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
  >
    <!-- Enhanced Header with Background -->
    <div class="relative overflow-hidden bg-white shadow-sm border-b">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5"></div>
      <div class="relative px-6 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="space-y-2">
              <div
                class="flex items-center space-x-3"
                :class="{ 'space-x-3': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
              >
                <button
                  @click="goBack"
                  class="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <div class="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h1
                    class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                  >
                    {{ t('submissions.title') }}
                  </h1>
                  <p class="text-lg text-gray-600" v-if="currentForm">
                    {{ (currentForm as any).title }}
                  </p>
                </div>
              </div>
              <p class="text-lg text-gray-600 max-w-2xl">
                {{ t('submissions.subtitle') }}
              </p>
              <div
                class="flex items-center space-x-4 text-sm text-gray-500"
                :class="{ 'space-x-4': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
              >
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    :class="{ 'mr-1': !isRTLSync(), 'ml-1': isRTLSync() }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  {{ submissions.length }} {{ t('submissions.totalSubmissions') }}
                </span>
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    :class="{ 'mr-1': !isRTLSync(), 'ml-1': isRTLSync() }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ t('submissions.lastUpdated') }}
                </span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="exportSubmissions"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
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
                {{ t('submissions.export') }}
              </button>
              <button
                @click="refreshSubmissions"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  :class="{ 'mr-2': !isRTLSync(), 'ml-2': isRTLSync() }"
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
                {{ t('submissions.refresh') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Loading State -->
    <div v-if="loading" class="px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col items-center justify-center py-16">
          <div class="relative">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div
              class="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"
            ></div>
          </div>
          <p class="mt-4 text-lg text-gray-600 font-medium">{{ t('submissions.loading') }}</p>
          <p class="mt-1 text-sm text-gray-500">{{ t('submissions.loadingDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Error State -->
    <div v-else-if="error" class="px-6">
      <div class="max-w-7xl mx-auto">
        <div
          class="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-2xl p-8 text-center shadow-lg"
        >
          <div
            class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-red-800 mb-2">{{ t('submissions.errorTitle') }}</h3>
          <p class="text-red-600 mb-6 max-w-md mx-auto">{{ error }}</p>
          <button
            @click="() => loadSubmissions()"
            class="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ t('submissions.retry') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div v-if="!loading && !error" class="px-4 sm:px-6 py-4">
      <div class="max-w-7xl mx-auto">
        <div
          class="!bg-white backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 sm:p-6"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Status Filter -->
            <CustomSelect
              v-model="filters.status"
              :label="t('submissions.filters.status')"
              :placeholder="t('submissions.filters.allStatuses')"
              :options="statusOptions"
              @change="applyFilters"
            />

            <!-- From Date Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('submissions.filters.fromDate') }}
              </label>
              <input
                v-model="filters.from_date"
                @change="applyFilters"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <!-- To Date Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('submissions.filters.toDate') }}
              </label>
              <input
                v-model="filters.to_date"
                @change="applyFilters"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <!-- Clear Filters -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> &nbsp; </label>
              <button
                @click="clearFilters"
                class="w-full px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                {{ t('submissions.filters.clear') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submissions Table -->
    <div v-if="submissions.length > 0" class="px-4 sm:px-6 py-4 sm:py-6">
      <div class="max-w-7xl mx-auto">
        <div
          class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div class="overflow-x-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    <span class="hidden md:inline">{{ t('submissions.table.submittedAt') }}</span>
                    <span class="md:hidden">{{ t('common.date') }}</span>
                  </th>
                  <th
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ t('submissions.table.status') }}
                  </th>
                  <th
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    {{ t('submissions.table.submitter') }}
                  </th>
                  <th
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    {{ t('submissions.table.data') }}
                  </th>
                  <th
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span class="hidden sm:inline">{{ t('submissions.table.actions') }}</span>
                    <span class="sm:hidden">{{ t('submissions.table.actionsShort') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="submission in submissions"
                  :key="submission.id"
                  class="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell text-center"
                  >
                    <span class="hidden md:inline">{{
                      formatDate(submission.submitted_at || submission.created_at)
                    }}</span>
                    <span class="md:hidden">{{
                      formatDate(submission.submitted_at || submission.created_at, 'short')
                    }}</span>
                  </td>
                  <td
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-center"
                  >
                    <span
                      :class="getStatusBadgeClass(submission.status)"
                      class="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <span class="hidden sm:inline">{{ getStatusText(submission.status) }}</span>
                      <span class="sm:hidden">{{
                        getStatusText(submission.status).charAt(0)
                      }}</span>
                    </span>
                  </td>
                  <td
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell text-center"
                  >
                    <div class="max-w-32 sm:max-w-none mx-auto">
                      <div v-if="getUserName(submission)" class="group relative">
                        <div
                          class="flex items-center justify-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                          :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                        >
                          <div class="flex-shrink-0">
                            <div
                              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                            >
                              {{ getUserName(submission)?.charAt(0).toUpperCase() }}
                            </div>
                          </div>
                          <span
                            class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
                          >
                            {{ getUserName(submission) }}
                          </span>
                        </div>
                      </div>
                      <div
                        v-else
                        class="flex items-center justify-center space-x-2 p-2 rounded-lg text-gray-400 italic"
                        :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                      >
                        <div class="flex-shrink-0">
                          <div
                            class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                        <span>{{ t('submissions.anonymous') }}</span>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-500 hidden lg:table-cell text-center"
                  >
                    <div class="max-w-xs truncate mx-auto">
                      {{ getSubmissionPreview(submission.data) }}
                    </div>
                  </td>
                  <td
                    class="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-center text-xs sm:text-sm font-medium"
                  >
                    <div
                      class="flex flex-col sm:flex-row justify-center gap-1 sm:gap-0 sm:space-x-2"
                      :class="{ 'sm:space-x-2': !isRTLSync(), 'sm:space-x-reverse': isRTLSync() }"
                    >
                      <button
                        @click="viewSubmission(submission)"
                        class="text-blue-600 hover:text-blue-900 font-medium hover:underline text-xs sm:text-sm px-1 py-0.5 rounded"
                      >
                        <span class="hidden sm:inline">{{ t('submissions.view') }}</span>
                        <span class="sm:hidden">{{ t('submissions.mobile.view') }}</span>
                      </button>
                      <!-- Review Actions Based on Status -->
                      <div class="relative">
                        <!-- For Submitted Status -->
                        <div v-if="submission.status === 'submitted'">
                          <button
                            @click.stop="toggleStatusMenu(submission.id)"
                            class="text-green-600 hover:text-green-900 font-medium hover:underline text-xs sm:text-sm px-1 py-0.5 rounded"
                          >
                            <span class="hidden sm:inline">{{ t('submissions.review') }}</span>
                            <span class="sm:hidden">{{ t('submissions.mobile.review') }}</span>
                          </button>
                          <div
                            v-if="activeStatusMenu === submission.id"
                            class="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-48 bg-white rounded-md shadow-lg z-[9999] border"
                          >
                            <div class="py-1">
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'reviewed')"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                  />
                                </svg>
                                {{ t('submissions.markAsReviewed') }}
                              </button>
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'approved')"
                                class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {{ t('submissions.approve') }}
                              </button>
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'rejected')"
                                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {{ t('submissions.reject') }}
                              </button>
                            </div>
                          </div>
                        </div>

                        <!-- For Reviewed Status -->
                        <div v-else-if="submission.status === 'reviewed'">
                          <button
                            @click.stop="toggleStatusMenu(submission.id)"
                            class="text-blue-600 hover:text-blue-900 font-medium hover:underline text-xs sm:text-sm px-1 py-0.5 rounded"
                          >
                            <span class="hidden sm:inline">{{
                              t('submissions.finalizeReview')
                            }}</span>
                            <span class="sm:hidden">{{ t('submissions.mobile.finalize') }}</span>
                          </button>
                          <div
                            v-if="activeStatusMenu === submission.id"
                            class="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-48 bg-white rounded-md shadow-lg z-[9999] border"
                          >
                            <div class="py-1">
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'approved')"
                                class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {{ t('submissions.approve') }}
                              </button>
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'rejected')"
                                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {{ t('submissions.reject') }}
                              </button>
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'submitted')"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                                {{ t('submissions.backToSubmitted') }}
                              </button>
                            </div>
                          </div>
                        </div>

                        <!-- For Approved Status -->
                        <div v-else-if="submission.status === 'approved'">
                          <button
                            @click.stop="toggleStatusMenu(submission.id)"
                            class="text-green-600 hover:text-green-900 font-medium hover:underline text-xs sm:text-sm px-1 py-0.5 rounded"
                          >
                            <span class="hidden sm:inline">{{
                              t('submissions.changeStatus')
                            }}</span>
                            <span class="sm:hidden">{{ t('submissions.mobile.approve') }}</span>
                          </button>
                          <div
                            v-if="activeStatusMenu === submission.id"
                            class="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-48 bg-white rounded-md shadow-lg z-[9999] border"
                          >
                            <div class="py-1">
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'rejected')"
                                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {{ t('submissions.reject') }}
                              </button>
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'reviewed')"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                                {{ t('submissions.backToReview') }}
                              </button>
                            </div>
                          </div>
                        </div>

                        <!-- For Rejected Status -->
                        <div v-else-if="submission.status === 'rejected'">
                          <button
                            @click.stop="toggleStatusMenu(submission.id)"
                            class="text-red-600 hover:text-red-900 font-medium hover:underline text-xs sm:text-sm px-1 py-0.5 rounded"
                          >
                            <span class="hidden sm:inline">{{
                              t('submissions.changeStatus')
                            }}</span>
                            <span class="sm:hidden">{{ t('submissions.mobile.reject') }}</span>
                          </button>
                          <div
                            v-if="activeStatusMenu === submission.id"
                            class="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-48 bg-white rounded-md shadow-lg z-[9999] border"
                          >
                            <div class="py-1">
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'approved')"
                                class="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {{ t('submissions.approve') }}
                              </button>
                              <button
                                @click.stop="updateSubmissionStatus(submission, 'reviewed')"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                                {{ t('submissions.backToReview') }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        @click="deleteSubmission(submission)"
                        class="text-red-600 hover:text-red-900 font-medium hover:underline text-xs sm:text-sm"
                      >
                        {{ t('submissions.delete') }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            {{
              t('submissions.pagination.showing', {
                from: pagination.from,
                to: pagination.to,
                total: pagination.total,
              })
            }}
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page <= 1"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('submissions.pagination.previous') }}
            </button>
            <span
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md"
            >
              {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.last_page"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('submissions.pagination.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Empty State -->
    <div v-else class="px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center py-16">
          <div
            class="mx-auto w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-8"
          >
            <svg
              class="h-16 w-16 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            {{ t('submissions.noSubmissions') }}
          </h3>
          <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {{ t('submissions.noSubmissionsDesc') }}
          </p>
          <button
            @click="goBack"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
          >
            <svg
              class="w-5 h-5 mr-2"
              :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {{ t('submissions.backToForms') }}
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useFormsStore } from '../stores/forms'
import { useSubmissionsStore } from '../stores/submissions'
import { useNotifications } from '../composables/useNotifications'
import { isRTLSync } from '../i18n'
import CustomSelect from '../components/CustomSelect.vue'

// Types
interface Submission {
  id: number
  form_id: number
  data: any
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected'
  submitted_at: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
  reviewer?: {
    id: number
    name: string
  }
  review_notes?: string
  reviewed_at?: string
  ip_address?: string
  user_agent?: string
  metadata?: any
}

// Composables
const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const formsStore = useFormsStore()
const submissionsStore = useSubmissionsStore()
const { success, error: showError } = useNotifications()

// Reactive state
const submissions = ref<Submission[]>([])
const currentForm = ref(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeStatusMenu = ref<number | null>(null)
const filters = ref({
  status: '',
  from_date: '',
  to_date: '',
  user_search: '',
})
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

// Computed
const isRTLDirection = computed(() => isRTLSync())
const formId = computed(() => Number(route.params.formId))

// Methods
const toggleStatusMenu = (submissionId: number) => {
  activeStatusMenu.value = activeStatusMenu.value === submissionId ? null : submissionId
}
const loadSubmissions = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    // Load form details
    const formResult = await formsStore.fetchForm(formId.value)
    if (formResult.success && formResult.data) {
      currentForm.value = formResult.data as any
    }

    // Prepare filters
    const params: any = {
      form_id: formId.value,
      page,
      per_page: 15,
    }

    if (filters.value.status) {
      params.status = filters.value.status
    }
    if (filters.value.from_date) {
      params.from_date = filters.value.from_date
    }
    if (filters.value.to_date) {
      params.to_date = filters.value.to_date
    }
    if (filters.value.user_search) {
      params.user_search = filters.value.user_search
    }

    // Load submissions
    const result = await submissionsStore.fetchSubmissions(params)
    if (result.success) {
      submissions.value = submissionsStore.submissions
      pagination.value = submissionsStore.pagination
    } else {
      error.value = result.error || t('submissions.errors.loadFailed')
    }
  } catch (err) {
    console.error('Error loading submissions:', err)
    error.value = t('submissions.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

const refreshSubmissions = () => {
  loadSubmissions()
}

const goBack = () => {
  router.push({ name: 'FormsManagement' })
}

const viewSubmission = (submission: Submission) => {
  router.push({ 
    name: 'SubmissionDetails', 
    params: { id: submission.id.toString() } 
  })
}

const deleteSubmission = async (submission: Submission) => {
  if (confirm(t('submissions.confirmDelete', { id: submission.id }))) {
    try {
      const result = await submissionsStore.deleteSubmission(submission.id)
      if (result.success) {
        await loadSubmissions(pagination.value.current_page)
        success(t('submissions.deleteSuccess'))
      } else {
        showError(result.error || t('submissions.errors.deleteFailed'))
      }
    } catch (err) {
      console.error('Error deleting submission:', err)
      showError(t('submissions.errors.deleteFailed'))
    }
  }
}

const updateSubmissionStatus = async (submission: Submission, status: string) => {
  try {
    const result = await submissionsStore.updateSubmission(submission.id, {
      status: status as 'submitted' | 'reviewed' | 'approved' | 'rejected',
    })
    if (result.success) {
      await loadSubmissions(pagination.value.current_page)
      success(t('submissions.statusUpdateSuccess'))
      activeStatusMenu.value = null
    } else {
      showError(result.error || t('submissions.errors.updateFailed'))
    }
  } catch (err) {
    console.error('Error updating submission status:', err)
    showError(t('submissions.errors.updateFailed'))
  }
}

// Close status menu when clicking outside
const closeStatusMenu = () => {
  activeStatusMenu.value = null
}

// Add click outside listener
onMounted(() => {
  if (formId.value) {
    loadSubmissions()
  } else {
    error.value = t('submissions.errors.invalidFormId')
  }

  // Add global click listener to close status menu
  document.addEventListener('click', closeStatusMenu)
})

// Clean up listener
onUnmounted(() => {
  document.removeEventListener('click', closeStatusMenu)
})

const applyFilters = () => {
  pagination.value.current_page = 1
  loadSubmissions(1)
}

const clearFilters = () => {
  filters.value = {
    status: '',
    from_date: '',
    to_date: '',
    user_search: '',
  }
  applyFilters()
}

// Helper function to get status text (fixes Vue i18n message compiler syntax error)
const getStatusText = (status: string): string => {
  return t('submissions.status.' + status)
}

// Helper function to translate field names for DataGrid columns
const translateFieldName = (fieldKey: string): string => {
  // Try to get translation from fieldNames section
  const translationKey = `submissions.fieldNames.${fieldKey}`
  const translated = t(translationKey)

  // If translation exists and is different from the key, use it
  if (translated && translated !== translationKey) {
    return translated
  }

  // Fallback: format the key by replacing underscores/hyphens with spaces and capitalizing
  return String(fieldKey)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

// Helper function to get field label from form schema
const getFieldLabel = (fieldKey: string): string => {
  if (!currentForm.value || !(currentForm.value as any).components) {
    return translateFieldName(fieldKey)
  }

  // Recursive function to search through components
  const findComponent = (components: any[], key: string): any => {
    for (const component of components) {
      if (component.key === key) {
        return component
      }

      // Search in DataGrid components (special handling)
      if (
        component.type === 'datagrid' &&
        component.components &&
        Array.isArray(component.components)
      ) {
        const found = findComponent(component.components, key)
        if (found) return found
      }

      // Search in EditGrid components (special handling)
      if (
        component.type === 'editgrid' &&
        component.components &&
        Array.isArray(component.components)
      ) {
        const found = findComponent(component.components, key)
        if (found) return found
      }

      // Search in nested components (panels, fieldsets, etc.)
      if (component.components && Array.isArray(component.components)) {
        const found = findComponent(component.components, key)
        if (found) return found
      }

      // Search in columns (for layout components)
      if (component.columns && Array.isArray(component.columns)) {
        for (const column of component.columns) {
          if (column.components && Array.isArray(column.components)) {
            const found = findComponent(column.components, key)
            if (found) return found
          }
        }
      }

      // Search in tabs (for tabs components)
      if (
        component.type === 'tabs' &&
        component.components &&
        Array.isArray(component.components)
      ) {
        for (const tab of component.components) {
          if (tab.components && Array.isArray(tab.components)) {
            const found = findComponent(tab.components, key)
            if (found) return found
          }
        }
      }

      // Search in table rows and cells
      if (component.type === 'table' && component.rows && Array.isArray(component.rows)) {
        for (const row of component.rows) {
          if (row.cells && Array.isArray(row.cells)) {
            for (const cell of row.cells) {
              if (cell.components && Array.isArray(cell.components)) {
                const found = findComponent(cell.components, key)
                if (found) return found
              }
            }
          }
        }
      }
    }
    return null
  }

  const component = findComponent((currentForm.value as any).components, fieldKey)
  if (component && component.label) {
    return component.label
  }

  // Fallback to translateFieldName if no label found
  return translateFieldName(fieldKey)
}

// Special function to get field labels for DataGrid columns
const getDatagridFieldLabel = (fieldKey: string, datagridValue?: any[]): string => {
  if (!currentForm.value || !(currentForm.value as any).components) {
    return translateFieldName(fieldKey)
  }

  // Enhanced recursive function specifically for DataGrid components
  const findDatagridComponent = (components: any[], key: string): any => {
    for (const component of components) {
      // Direct match
      if (component.key === key) {
        return component
      }

      // Special handling for DataGrid components
      if (
        component.type === 'datagrid' &&
        component.components &&
        Array.isArray(component.components)
      ) {
        // Search in DataGrid components
        for (const dgComponent of component.components) {
          if (dgComponent.key === key) {
            return dgComponent
          }
        }
        // Recursive search in nested DataGrid components
        const found = findDatagridComponent(component.components, key)
        if (found) return found
      }

      // Search in EditGrid components
      if (
        component.type === 'editgrid' &&
        component.components &&
        Array.isArray(component.components)
      ) {
        const found = findDatagridComponent(component.components, key)
        if (found) return found
      }

      // Search in other nested components
      if (component.components && Array.isArray(component.components)) {
        const found = findDatagridComponent(component.components, key)
        if (found) return found
      }

      // Search in columns (for layout components)
      if (component.columns && Array.isArray(component.columns)) {
        for (const column of component.columns) {
          if (column.components && Array.isArray(column.components)) {
            const found = findDatagridComponent(column.components, key)
            if (found) return found
          }
        }
      }

      // Search in tabs
      if (
        component.type === 'tabs' &&
        component.components &&
        Array.isArray(component.components)
      ) {
        for (const tab of component.components) {
          if (tab.components && Array.isArray(tab.components)) {
            const found = findDatagridComponent(tab.components, key)
            if (found) return found
          }
        }
      }

      // Search in table rows and cells
      if (component.type === 'table' && component.rows && Array.isArray(component.rows)) {
        for (const row of component.rows) {
          if (row.cells && Array.isArray(row.cells)) {
            for (const cell of row.cells) {
              if (cell.components && Array.isArray(cell.components)) {
                const found = findDatagridComponent(cell.components, key)
                if (found) return found
              }
            }
          }
        }
      }
    }
    return null
  }

  const component = findDatagridComponent((currentForm.value as any).components, fieldKey)
  if (component && component.label) {
    return component.label
  }

  // Priority 4: Check in the passed datagridValue first (most accurate for current data)
  if (datagridValue && Array.isArray(datagridValue)) {
    for (const row of datagridValue) {
      if (row && typeof row === 'object' && row._components && Array.isArray(row._components)) {
        for (const comp of row._components) {
          if (comp.key === fieldKey && comp.label) {
            return comp.label
          }
        }
        // Break after checking first row since all rows should have same component structure
        break
      }
    }
  }

  // No additional fallback needed

  // Enhanced key cleaning for better label extraction
  let cleanKey = fieldKey.toLowerCase()

  // Remove timestamp-like numbers and random suffixes
  cleanKey = cleanKey.replace(/_\d+_[a-z0-9]+$/i, '')
  cleanKey = cleanKey.replace(/_\d+$/, '')

  // Remove common prefixes
  cleanKey = cleanKey.replace(/^(column|field|input|data)_?/i, '')

  // Extract meaningful component type names based on current language
  const isArabic = locale.value === 'ar'
  const componentTypeMap: { [key: string]: string } = isArabic
    ? {
        textfield: 'حقل نص',
        textarea: 'منطقة نص',
        number: 'رقم',
        email: 'بريد إلكتروني',
        password: 'كلمة مرور',
        phoneNumber: 'رقم هاتف',
        address: 'عنوان',
        datetime: 'تاريخ ووقت',
        day: 'يوم',
        time: 'وقت',
        currency: 'عملة',
        select: 'قائمة اختيار',
        selectboxes: 'خيارات متعددة',
        radio: 'اختيار واحد',
        checkbox: 'مربع اختيار',
        file: 'ملف',
        button: 'زر',
        content: 'محتوى',
        html: 'HTML',
        well: 'مجموعة',
        columns: 'أعمدة',
        fieldset: 'مجموعة حقول',
        panel: 'لوحة',
        table: 'جدول',
        tabs: 'تبويبات',
        column: 'عمود',
      }
    : {
        textfield: 'Text Field',
        textarea: 'Text Area',
        number: 'Number',
        email: 'Email',
        password: 'Password',
        phoneNumber: 'Phone Number',
        address: 'Address',
        datetime: 'Date & Time',
        day: 'Day',
        time: 'Time',
        currency: 'Currency',
        select: 'Select',
        selectboxes: 'Multi Select',
        radio: 'Radio',
        checkbox: 'Checkbox',
        file: 'File',
        button: 'Button',
        content: 'Content',
        html: 'HTML',
        well: 'Well',
        columns: 'Columns',
        fieldset: 'Fieldset',
        panel: 'Panel',
        table: 'Table',
        tabs: 'Tabs',
        column: 'Column',
      }

  // Try to find component type in the key
  for (const [type, label] of Object.entries(componentTypeMap)) {
    if (cleanKey.includes(type)) {
      return label
    }
  }

  // Clean and format the key
  cleanKey = cleanKey.replace(/[_-]/g, ' ')

  if (cleanKey && cleanKey !== fieldKey.toLowerCase()) {
    return cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1)
  }

  // Final fallback to translateFieldName
  return translateFieldName(fieldKey)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadSubmissions(page)
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

const exportSubmissions = () => {
  try {
    const exportData = JSON.stringify(submissions.value, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(exportData)
    const exportFileDefaultName = `form-${formId.value}-submissions.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    success(t('submissions.exportSuccess'))
  } catch (err) {
    console.error('Error exporting submissions:', err)
    showError(t('submissions.errors.exportFailed'))
  }
}

const formatDate = (dateString: string, format?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)

  if (format === 'short') {
    return date.toLocaleDateString(isRTLSync() ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return date.toLocaleDateString(isRTLSync() ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getSubmissionPreview = (data: any) => {
  if (!data || typeof data !== 'object') return t('userSubmissions.noDataAvailable')

  const keys = Object.keys(data)
  if (keys.length === 0) return t('userSubmissions.emptySubmission')

  const firstKey = keys[0]
  const firstValue = data[firstKey]

  if (typeof firstValue === 'string') {
    return `${firstKey}: ${firstValue.substring(0, 50)}${firstValue.length > 50 ? '...' : ''}`
  }

  return t('userSubmissions.fieldsSubmitted', { count: keys.length })
}

// Helper functions for datagrid data display
const isDatagridData = (value: any[]): boolean => {
  if (!Array.isArray(value) || value.length === 0) return false

  // Check if all items are objects with similar structure
  const firstItem = value[0]
  if (typeof firstItem !== 'object' || firstItem === null) return false

  const firstKeys = Object.keys(firstItem)
  if (firstKeys.length === 0) return false

  // Check if at least 80% of items have similar keys (to handle slight variations)
  const similarItems = value.filter((item) => {
    if (typeof item !== 'object' || item === null) return false
    const itemKeys = Object.keys(item)
    const commonKeys = firstKeys.filter((key) => itemKeys.includes(key))
    return commonKeys.length >= Math.ceil(firstKeys.length * 0.8)
  })

  return similarItems.length >= Math.ceil(value.length * 0.8)
}

const getDatagridColumns = (value: any[]): string[] => {
  if (!Array.isArray(value) || value.length === 0) return []

  // Collect all unique keys from all objects
  const allKeys = new Set<string>()
  value.forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach((key) => {
        // Skip internal properties that start with underscore
        if (!key.startsWith('_')) {
          allKeys.add(key)
        }
      })
    }
  })

  return Array.from(allKeys).sort()
}

const formatObjectValue = (value: any): string => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? '✓' : '✗'
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

// Helper function to check if data is components array (technical component definitions)
const isComponentsData = (key: string, value: any): boolean => {
  return (
    key.toLowerCase() === 'components' &&
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'object' && item !== null && 'type' in item)
  )
}

// Helper function to detect EditGrid data
const isEditGridData = (value: any[]): boolean => {
  if (!Array.isArray(value) || value.length === 0) return false

  // EditGrid data is similar to datagrid but may have different structure
  return value.every((item) => typeof item === 'object' && item !== null)
}

// Helper function to detect Panel/Fieldset data (nested object with form data)
const isPanelData = (value: any): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  // Panel data usually contains form field values
  const keys = Object.keys(value)
  return (
    keys.length > 0 &&
    keys.some(
      (key) =>
        typeof value[key] === 'string' ||
        typeof value[key] === 'number' ||
        typeof value[key] === 'boolean' ||
        Array.isArray(value[key]),
    )
  )
}

// Helper function to detect Table data (structured table with rows/columns)
const isTableData = (value: any): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  // Table data may have rows property or be structured data
  return 'rows' in value || Object.keys(value).length > 2
}

// Helper function to detect Tree data
const isTreeData = (value: any): boolean => {
  if (typeof value !== 'object' || value === null) return false

  // Tree data usually has tree structure with nodes
  return 'tree' in value || 'nodes' in value || 'children' in value
}

// Helper functions to extract user information from metadata
const getUserName = (submission: Submission): string | null => {
  // Check metadata first (new structure)
  if (submission.metadata?.user_name) {
    return submission.metadata.user_name
  }
  // Fallback to user object (old structure)
  if (submission.user?.name) {
    return submission.user.name
  }
  return null
}

const getUserId = (submission: Submission): number | string | null => {
  // Check metadata first (new structure)
  if (submission.metadata?.user_id) {
    return submission.metadata.user_id
  }
  // Fallback to user object (old structure)
  if (submission.user?.id) {
    return submission.user.id
  }
  return null
}

const getUserEmail = (submission: Submission): string | null => {
  // Check metadata first (new structure)
  if (submission.metadata?.user_email) {
    return submission.metadata.user_email
  }
  // Fallback to user object (old structure)
  if (submission.user?.email) {
    return submission.user.email
  }
  return null
}

// Helper function to format component display
const formatComponentInfo = (component: any): string => {
  const type = component.type || 'unknown'
  const label = component.label || component.key || type
  const key = component.key || ''

  return `${label} (${type}${key ? ` - ${key}` : ''})`
}

// Status options for CustomSelect
const statusOptions = computed(() => [
  { value: '', label: t('submissions.filters.allStatuses') },
  { value: 'submitted', label: t('submissions.status.submitted') },
  { value: 'reviewed', label: t('submissions.status.reviewed') },
  { value: 'approved', label: t('submissions.status.approved') },
  { value: 'rejected', label: t('submissions.status.rejected') },
])

// Lifecycle
onMounted(() => {
  if (formId.value) {
    loadSubmissions()
  } else {
    error.value = t('submissions.errors.invalidFormId')
  }
})
</script>

<style scoped>
.form-submissions-container {
  min-height: 100vh;
}

/* Enhanced animations and transitions */
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

/* Custom backdrop blur for better browser support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Enhanced focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(147 51 234 / 0.5);
}

/* Enhanced button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Loading spinner enhancement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* RTL support enhancements */
[dir='rtl'] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Mobile responsiveness improvements */
@media (max-width: 640px) {
  .backdrop-blur-sm {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: rgba(255, 255, 255, 0.95);
  }
}

/* Print styles */
@media print {
  .form-submissions-container {
    background: white !important;
  }

  .backdrop-blur-sm {
    background: white !important;
    backdrop-filter: none !important;
  }
}
</style>
