<template>
  <!--  <Layout>-->
  <div
    class="forms-management-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
  >
    <!-- Enhanced Header with Background -->
    <div class="relative overflow-hidden bg-white shadow-sm border-b">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
      <div class="relative px-6 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="space-y-2">
              <div
                class="flex items-center space-x-3"
                :class="{ 'space-x-3': !isRTLSync, 'space-x-reverse': isRTLSync }"
              >
                <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
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
                <h1
                  class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                >
                  {{ $t('forms.management.title') }}
                </h1>
              </div>
              <p class="text-lg text-gray-600 max-w-2xl">
                {{ $t('forms.management.subtitle') }}
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {{ filteredForms.length }} {{ $t('forms.management.totalForms') }}
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
                  {{ $t('forms.management.lastUpdated') }}
                </span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
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
                {{ $t('forms.management.export') }}
              </button>
              <router-link
                to="/builder"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {{ $t('forms.management.createNew') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Search and Filters -->
    <div class="px-4 sm:px-6 py-4 sm:py-6">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Enhanced Search -->
            <div class="w-full lg:flex-[2]">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('forms.management.searchLabel') }}
              </label>
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  :class="{ 'left-0 pl-3': !isRTLSync, 'right-0 pr-3': isRTLSync }"
                >
                  <svg
                    class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
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
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="$t('forms.management.searchPlaceholder')"
                  class="block w-full py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-sm sm:text-base"
                  :class="{ 'pl-8 sm:pl-10 pr-3 sm:pr-4': !isRTLSync, 'pr-8 sm:pr-10 pl-3 sm:pl-4': isRTLSync }"
                />
              </div>
            </div>

            <!-- Enhanced Status Filter -->
            <div class="w-full lg:w-48">
              <CustomSelect
                v-model="statusFilter"
                :label="$t('forms.management.statusFilter')"
                :options="statusOptions"
              />
            </div>

            <!-- Enhanced Sort -->
            <div class="w-full lg:w-48">
              <CustomSelect
                v-model="sortBy"
                :label="$t('forms.management.sortBy')"
                :options="sortOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Loading State -->
    <div v-if="formsStore.isLoading" class="px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col items-center justify-center py-16">
          <div class="relative">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div
              class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"
            ></div>
          </div>
          <p class="mt-4 text-lg text-gray-600 font-medium">{{ $t('forms.management.loading') }}</p>
          <p class="mt-1 text-sm text-gray-500">{{ $t('forms.management.loadingDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Error State -->
    <div v-else-if="formsStore.error" class="px-6">
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
          <h3 class="text-xl font-bold text-red-800 mb-2">
            {{ $t('forms.management.errorTitle') }}
          </h3>
          <p class="text-red-600 mb-6 max-w-md mx-auto">{{ formsStore.error }}</p>
          <button
            @click="loadForms"
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
            {{ $t('forms.management.retry') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Forms Grid -->
    <div v-else-if="filteredForms.length > 0" class="px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div
            v-for="form in filteredForms"
            :key="form.id"
            class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <!-- Form Card Header with Gradient -->
            <div class="relative p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50/50">
              <div
                class="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"
              ></div>
              <div class="relative">
                <div class="flex justify-between items-start mb-3 sm:mb-4">
                  <div class="flex-1 min-w-0">
                    <h3
                      class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors duration-200 truncate"
                    >
                      {{ form.title }}
                    </h3>
                    <div
                      class="flex items-center space-x-1 sm:space-x-2"
                      :class="{ 'space-x-1 sm:space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                    >
                      <span
                        class="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold rounded-full shadow-sm"
                        :class="getStatusClass(form.status)"
                      >
                        <div
                          class="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full mr-1 sm:mr-1.5"
                          :class="{
                            'mr-1 sm:mr-1.5': !isRTLSync(),
                            'ml-1 sm:ml-1.5': isRTLSync(),
                            'bg-green-400': form.status === 'published',
                            'bg-red-400': form.status === 'archived',
                            'bg-yellow-400': form.status === 'draft',
                          }"
                        ></div>
                        <span class="hidden sm:inline">{{ getFormStatusText(form.status) }}</span>
                        <span class="sm:hidden">{{ $t('forms.mobile.statusShort.' + form.status) || getFormStatusText(form.status).charAt(0) }}</span>
                      </span>
                    </div>
                  </div>
                  <div
                    class="flex items-center space-x-1 sm:space-x-2"
                    :class="{ 'space-x-1 sm:space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
                  >
                    <button
                      @click="toggleFormStatus(form)"
                      class="p-1 sm:p-1.5 lg:p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                      :title="
                        (form.status === 'published')
                          ? $t('forms.management.deactivate')
                          : $t('forms.management.activate')
                      "
                    >
                      <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          v-if="form.status === 'published'"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                        <path
                          v-else
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteForm(form)"
                      class="p-1 sm:p-1.5 lg:p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                      :title="$t('forms.management.delete')"
                    >
                      <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <p class="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {{ form.description || $t('forms.management.noDescription') }}
                </p>

                <div class="flex items-center justify-between text-sm text-gray-500">
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1.5"
                      :class="{ 'mr-1.5': !isRTLSync(), 'ml-1.5': isRTLSync() }"
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
                    {{ formatDate(form.updated_at) }}
                  </div>
                  <div class="flex items-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {{ form.submissions_count || 0 }} {{ $t('forms.management.submissions') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Form Card Actions -->
            <div
              class="p-3 sm:p-4 bg-gradient-to-r from-gray-50/50 to-white/50 border-t border-gray-100/50"
            >
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <div
                  class="flex flex-wrap gap-1 sm:space-x-1"
                  :class="{ 'sm:space-x-1': !isRTLSync(), 'sm:space-x-reverse': isRTLSync() }"
                >
                  <button
                    @click="editForm(form)"
                    class="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <svg
                      class="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-1 sm:mr-1.5"
                      :class="{ 'mr-1 sm:mr-1.5': !isRTLSync(), 'ml-1 sm:ml-1.5': isRTLSync() }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    {{ $t('forms.management.edit') }}
                  </button>
                  <button
                    @click="duplicateForm(form)"
                    class="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                  >
                    <svg
                      class="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-1 sm:mr-1.5"
                      :class="{ 'mr-1 sm:mr-1.5': !isRTLSync(), 'ml-1 sm:ml-1.5': isRTLSync() }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="hidden sm:inline">{{ $t('forms.management.duplicate') }}</span>
                    <span class="sm:hidden">{{ $t('forms.management.duplicate') }}</span>
                  </button>
                  <button
                    v-if="form.is_public"
                    @click="shareForm(form)"
                    class="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    :title="$t('forms.management.shareForm')"
                  >
                    <svg
                      class="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-1 sm:mr-1.5"
                      :class="{ 'mr-1 sm:mr-1.5': !isRTLSync(), 'ml-1 sm:ml-1.5': isRTLSync() }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    {{ $t('forms.management.share') }}
                  </button>
                  <button
                    v-if="!form.is_public"
                    @click="makeFormPublic(form)"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-all duration-200"
                    :title="$t('forms.management.makePublic')"
                  >
                    <svg
                      class="w-4 h-4 mr-1.5"
                      :class="{ 'mr-1.5': !isRTLSync(), 'ml-1.5': isRTLSync() }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ $t('forms.management.makePublic') }}
                  </button>
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <button
                    @click="viewSubmissions(form)"
                    class="inline-flex text-nowrap items-center justify-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg
                      class="w-4 h-4"
                      :class="{ 'mr-1': !isRTLSync(), 'ml-1': isRTLSync() }"
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
                    {{ $t('forms.management.viewSubmissions') }}
                  </button>
                  <button
                    @click="$router.push(`/forms/${form.id}/analytics`)"
                    class="inline-flex text-nowrap items-center justify-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg
                      class="w-4 h-4"
                      :class="{ 'mr-1': !isRTLSync(), 'ml-1': isRTLSync() }"
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
                    {{ $t('analytics.viewAnalytics') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Empty State -->
    <div v-else class="px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center py-16">
          <div
            class="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-8"
          >
            <svg
              class="h-16 w-16 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            {{ searchQuery ? $t('forms.management.noResults') : $t('forms.management.noForms') }}
          </h3>
          <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {{
              searchQuery
                ? $t('forms.management.noResultsDesc')
                : $t('forms.management.noFormsDesc')
            }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/builder"
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {{ $t('forms.management.createFirst') }}
            </router-link>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="inline-flex items-center px-6 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ $t('forms.management.clearSearch') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Pagination -->
    <div
      v-if="formsStore.pagination && formsStore.pagination.total > formsStore.pagination.per_page"
      class="px-6 py-8"
    >
      <div class="max-w-7xl mx-auto">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <nav class="flex items-center justify-between">
            <div
              class="flex items-center space-x-4"
              :class="{ 'space-x-4': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
            >
              <button
                @click="changePage(formsStore.pagination.current_page - 1)"
                :disabled="formsStore.pagination.current_page <= 1"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {{ $t('forms.management.previous') }}
              </button>

              <div
                class="hidden sm:flex items-center space-x-2"
                :class="{ 'space-x-2': !isRTLSync(), 'space-x-reverse': isRTLSync() }"
              >
                <span
                  class="px-4 py-2 text-sm font-medium text-gray-900 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  {{ formsStore.pagination.current_page }}
                </span>
                <span class="text-gray-500">{{ $t('forms.management.of') }}</span>
                <span class="px-4 py-2 text-sm font-medium text-gray-700">
                  {{ Math.ceil(formsStore.pagination.total / formsStore.pagination.per_page) }}
                </span>
              </div>

              <button
                @click="changePage(formsStore.pagination.current_page + 1)"
                :disabled="
                  formsStore.pagination.current_page >=
                  Math.ceil(formsStore.pagination.total / formsStore.pagination.per_page)
                "
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {{ $t('forms.management.next') }}
                <svg
                  class="w-4 h-4 ml-2"
                  :class="{ 'ml-2': !isRTLSync, 'mr-2': isRTLSync }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div class="text-sm text-gray-600">
              {{
                $t('forms.management.showingResults', {
                  from:
                    (formsStore.pagination.current_page - 1) * formsStore.pagination.per_page + 1,
                  to: Math.min(
                    formsStore.pagination.current_page * formsStore.pagination.per_page,
                    formsStore.pagination.total,
                  ),
                  total: formsStore.pagination.total,
                })
              }}
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirm Modal for Making Form Public -->
  <ConfirmModal
    :is-visible="showConfirmModal"
    :title="$t('forms.management.makePublic')"
    :message="$t('forms.management.confirmMakePublic')"
    :confirm-text="$t('forms.management.makePublic')"
    :cancel-text="$t('common.cancel')"
    @confirm="confirmMakePublic"
    @cancel="cancelMakePublic"
  />
  <!--  </Layout>-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import CustomSelect from '../components/CustomSelect.vue'
import { useFormsStore } from '../stores/forms'
import { useAuthStore } from '../stores/auth'
import { useNotifications } from '../composables/useNotifications'
import { isRTLSync } from '../i18n'

// Composables
const { t } = useI18n()
const router = useRouter()
const formsStore = useFormsStore()
const authStore = useAuthStore()
const { success, error: showError } = useNotifications()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('created_at')

// Status filter options - تحديث القيم لتتطابق مع البيانات الفعلية
const statusOptions = computed(() => [
  { value: '', label: t('forms.management.allStatuses') },
  { value: 'published', label: t('forms.management.published') },
  { value: 'draft', label: t('forms.management.draft') },
  { value: 'archived', label: t('forms.management.archived') }
])

// Sort options
const sortOptions = computed(() => [
  { value: 'created_at', label: t('forms.management.sortByDate') },
  { value: 'title', label: t('forms.management.sortByTitle') },
  { value: 'updated_at', label: t('forms.management.sortByUpdated') }
])

// Confirm modal state
const showConfirmModal = ref(false)
const formToMakePublic = ref<any>(null)

// Computed - النماذج تأتي مفلترة من الخادم ومرتبة محلياً
const filteredForms = computed(() => {
  let forms = [...(formsStore.forms || [])]

  // الترتيب محلياً لأن الخادم لا يدعم sort_by
  forms.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'updated_at':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  return forms
})

// Methods
const loadForms = async () => {
  try {
    console.log('🔄 تحميل النماذج...', {
      search: searchQuery.value,
      status: statusFilter.value
    })
    const params: any = { page: 1 }
    
    // إضافة البحث فقط إذا كان غير فارغ
    if (searchQuery.value && searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    // إضافة الحالة فقط إذا كانت محددة
    if (statusFilter.value && statusFilter.value !== '') {
      params.status = statusFilter.value
    }
    
    await formsStore.fetchForms(params)
    console.log('✅ تم تحميل النماذج بنجاح. عدد النماذج:', formsStore.forms.length)
  } catch (error) {
    console.error('❌ خطأ في تحميل النماذج:', error)
    showError(t('forms.management.errorTitle'))
  }
}

const editForm = (form: any) => {
  router.push({
    name: 'FormBuilder',
    query: { formId: form.id },
  })
}

const duplicateForm = async (form: any) => {
  try {
    console.log('📋 نسخ النموذج:', form.title)
    const result = await formsStore.duplicateForm(form.id)
    if (result.success) {
      success(t('forms.management.duplicateSuccess', { title: form.title }))
      await loadForms() // تحديث بعد النسخ
    } else {
      showError(result.error || t('forms.management.duplicateError'))
    }
  } catch (error) {
    console.error('❌ خطأ في نسخ النموذج:', error)
    showError(t('forms.management.duplicateError'))
  }
}

const viewSubmissions = (form: any) => {
  router.push({
    name: 'FormSubmissions',
    params: { formId: form.id },
  })
}

const toggleFormStatus = async (form: any) => {
  try {
    let newStatus: 'draft' | 'published' | 'archived'
    let successMessage: string

    // تحديد الحالة الجديدة بناءً على الحالة الحالية
    switch (form.status) {
      case 'published':
      case 'active': // map legacy to archived
        newStatus = 'archived'
        successMessage = t('forms.management.archivedSuccess')
        break
      case 'archived':
      case 'inactive': // map legacy to published
        newStatus = 'published'
        successMessage = t('forms.management.publishedSuccess')
        break
      case 'draft':
        newStatus = 'published'
        successMessage = t('forms.management.publishedSuccess')
        break
      default:
        newStatus = 'published'
        successMessage = t('forms.management.publishedSuccess')
    }

    console.log('🔄 تحديث حالة النموذج:', form.id, 'من', form.status, 'إلى', newStatus)

    // استدعاء API لتحديث الحالة في قاعدة البيانات
    const result = await formsStore.updateForm(form.id, { status: newStatus })

    if (result.success) {
      // تحديث الحالة محلياً
      form.status = newStatus

      // إظهار رسالة نجاح
      success(successMessage)

      console.log('✅ تم تحديث حالة النموذج بنجاح في قاعدة البيانات')
    } else {
      // إظهار رسالة خطأ
      showError(result.error || t('forms.management.statusUpdateError'))
      console.error('❌ فشل في تحديث حالة النموذج:', result.error)
    }

  } catch (error) {
    console.error('❌ خطأ في تحديث حالة النموذج:', error)
    showError(t('forms.management.statusUpdateError'))
  }
}

const deleteForm = async (form: any) => {
  if (confirm(t('forms.management.confirmDelete', { title: form.title }))) {
    try {
      console.log('🗑️ حذف النموذج:', form.title)
      const result = await formsStore.deleteForm(form.id)
      if (result.success) {
        success(t('forms.management.deleteSuccess', { title: form.title }))
        await loadForms() // تحديث بعد الحذف
      } else {
        showError(result.error || t('forms.management.deleteError'))
      }
    } catch (error) {
      console.error('❌ خطأ في حذف النموذج:', error)
      showError(t('forms.management.deleteError'))
    }
  }
}

const shareForm = (form: any) => {
  const publicUrl = `${window.location.origin}/forms/${form.id}/fill`

  // Copy to clipboard
  navigator.clipboard
    .writeText(publicUrl)
    .then(() => {
      // Show success notification
      success(t('forms.management.linkCopied'))
    })
    .catch(() => {
      // Fallback: show the URL in a prompt
      prompt(t('forms.management.copyLink'), publicUrl)
    })
}

const makeFormPublic = (form: any) => {
  formToMakePublic.value = form
  showConfirmModal.value = true
}

const confirmMakePublic = async () => {
  if (formToMakePublic.value) {
    try {
      const result = await formsStore.updateForm(formToMakePublic.value.id, {
        is_public: true,
        allow_anonymous: true,
      })

      if (result.success) {
        // Update the form in the local list
        const index = formsStore.forms.findIndex((f) => f.id === formToMakePublic.value!.id)
        if (index !== -1) {
          formsStore.forms[index].is_public = true
          formsStore.forms[index].allow_anonymous = true
        }

        success(t('forms.management.madePublicSuccess'))
      } else {
        showError(t('forms.management.madePublicError'))
      }
    } catch (error) {
      console.error('Error making form public:', error)
      showError(t('forms.management.madePublicError'))
    }
  }

  // Close modal and reset state
  showConfirmModal.value = false
  formToMakePublic.value = null
}

const cancelMakePublic = () => {
  showConfirmModal.value = false
  formToMakePublic.value = null
}

const changePage = async (page: number) => {
  try {
    console.log('📄 تغيير الصفحة إلى:', page)
    const params: any = { page }
    
    // إضافة البحث فقط إذا كان غير فارغ
    if (searchQuery.value && searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    // إضافة الحالة فقط إذا كانت محددة
    if (statusFilter.value && statusFilter.value !== '') {
      params.status = statusFilter.value
    }
    
    await formsStore.fetchForms(params)
    console.log('✅ تم تحميل الصفحة', page, 'بنجاح')
  } catch (error) {
    console.error('❌ خطأ في تحميل الصفحة:', error)
    showError(t('forms.management.errorTitle'))
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'archived':
      return 'bg-red-100 text-red-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Helper function to get form status text (fixes Vue i18n message compiler syntax error)
const getFormStatusText = (status: string): string => {
  return t('forms.management.' + status)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(isRTLSync() ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Watchers
watch([searchQuery, statusFilter], async () => {
  // إرسال البحث والفلترة إلى الخادم للحصول على النتائج
  await loadForms()
}, { immediate: false })

// Watch sortBy for local sorting (backend doesn't support sort_by)
watch(sortBy, () => {
  // الترتيب يتم محلياً لأن الخادم لا يدعم sort_by
  // النتائج ستُرتب تلقائياً في filteredForms computed property
}, { immediate: false })

// Auto-refresh when returning to the page
const refreshFormsOnFocus = () => {
  console.log('🔄 تحديث النماذج عند العودة للصفحة')
  loadForms() // تحديث عند العودة للصفحة
}

// Lifecycle
onMounted(() => {
  loadForms() // تحديث عند تحميل الصفحة

  // إضافة مستمع للتحديث عند العودة للصفحة
  window.addEventListener('focus', refreshFormsOnFocus)

  // التحديث كل 30 ثانية إذا كانت الصفحة نشطة
  const refreshInterval = setInterval(() => {
    if (!document.hidden) {
      console.log('🔄 تحديث دوري للنماذج')
      loadForms()
    }
  }, 30000) // 30 ثانية

  // تنظيف المستمعات عند إلغاء تحميل المكون
  const cleanup = () => {
    window.removeEventListener('focus', refreshFormsOnFocus)
    clearInterval(refreshInterval)
  }

  // تنظيف عند إلغاء تحميل المكون
  window.addEventListener('beforeunload', cleanup)
})
</script>

<style scoped>
.forms-management-container {
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.group:hover .group-hover\:animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom backdrop blur for better browser support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Line clamp utility for description text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5);
}

/* Smooth hover transitions for cards */
.group {
  animation: fadeInUp 0.5s ease-out;
}

.group:nth-child(1) {
  animation-delay: 0.1s;
}
.group:nth-child(2) {
  animation-delay: 0.2s;
}
.group:nth-child(3) {
  animation-delay: 0.3s;
}
.group:nth-child(4) {
  animation-delay: 0.4s;
}
.group:nth-child(5) {
  animation-delay: 0.5s;
}
.group:nth-child(6) {
  animation-delay: 0.6s;
}

/* Enhanced gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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
  .group {
    animation-delay: 0s !important;
  }

  .backdrop-blur-sm {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background-color: rgba(255, 255, 255, 0.95);
  }
}

/* Print styles */
@media print {
  .forms-management-container {
    background: white !important;
  }

  .backdrop-blur-sm {
    background: white !important;
    backdrop-filter: none !important;
  }
}
</style>
