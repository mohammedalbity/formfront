<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-[9999]">
      <div class="px-2 sm:px-4 lg:px-6 xl:px-8">
        <div class="flex justify-between h-16 sm:h-18 lg:h-20">
          <!-- Logo and Navigation Links -->
          <div class="flex items-center">
            <div class="flex-shrink-0 group">
              <div class="flex items-center space-x-3" :class="{ 'space-x-reverse': isRTLSync }">
                <!-- Logo Icon -->
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
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
                <!-- Logo Text -->
                <div class="hidden sm:block">
                  <h1
                    class="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                  >
                    Form.io App
                  </h1>
                  <p class="text-xs text-gray-500 -mt-1 hidden lg:block">
                    {{ $t('footer.brand.subtitle') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Desktop Navigation -->
            <div
              class="hidden md:ml-10 md:flex md:space-x-8"
              :class="{ 'md:space-x-reverse md:mr-10 md:ml-0': isRTLSync }"
            >
              <router-link
                to="/"
                class="group relative border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50"
                active-class="text-blue-600 bg-blue-50"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
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
                {{ $t('nav.home') }}
                <div
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                ></div>
              </router-link>
              <router-link
                to="/builder"
                class="group relative border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50"
                active-class="text-blue-600 bg-blue-50"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                {{ $t('nav.builder') }}
                <div
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                ></div>
              </router-link>
              <router-link
                v-if="authStore.isAuthenticated"
                to="/forms"
                class="group relative border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50"
                active-class="text-blue-600 bg-blue-50"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
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
                {{ $t('nav.forms') }}
                <div
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                ></div>
              </router-link>
              <router-link
                v-if="authStore.isAuthenticated"
                to="/my-submissions"
                class="group relative border-transparent text-gray-600 hover:text-blue-600 inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50"
                active-class="text-blue-600 bg-blue-50"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
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
                {{ $t('nav.mySubmissions') }}
                <div
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                ></div>
              </router-link>
              <router-link
                v-if="authStore.isAdmin"
                to="/admin/users"
                class="group relative border-transparent text-gray-600 hover:text-purple-600 inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-purple-50"
                active-class="text-purple-600 bg-purple-50"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {{ $t('nav.adminUsers') || 'إدارة المستخدمين' }}
                <div
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                ></div>
              </router-link>
            </div>
          </div>

          <!-- Auth Section and Language Switcher -->
          <div class="flex items-center">
            <!-- Auth Section -->
            <div
              v-if="!authStore.isAuthenticated"
              class="hidden lg:flex items-center space-x-2 mr-2 lg:mr-4"
              :class="{ 'space-x-reverse': isRTLSync, 'mr-2 lg:mr-4': !isRTLSync, 'ml-2 lg:ml-4': isRTLSync }"
            >
              <router-link
                to="/login"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {{ $t('auth.signIn') }}
              </router-link>
            </div>

            <!-- User Menu (when authenticated) -->
            <div v-else class="relative mr-4" :class="{ 'mr-4': !isRTLSync, 'ml-4': isRTLSync }">
              <button
                @click="toggleUserMenu"
                class="group bg-white/50 backdrop-blur-sm rounded-xl px-4 py-1 inline-flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 border border-gray-200/50 shadow-sm hover:shadow-md"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2"
                  :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
                >
                  <span class="text-white text-sm font-bold">{{
                    authStore.user?.name?.charAt(0).toUpperCase() || 'U'
                  }}</span>
                </div>
                <span class="text-sm font-semibold">{{
                  authStore.user?.name || $t('auth.profile')
                }}</span>
                <svg
                  class="ml-2 h-4 w-4 transition-transform duration-200"
                  :class="{ 'ml-2': !isRTLSync, 'mr-2': isRTLSync, 'rotate-180': showUserMenu }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- User Dropdown -->
              <div
                v-show="showUserMenu"
                class="origin-top-right absolute right-0 mt-2 sm:mt-3 w-48 sm:w-56 rounded-xl sm:rounded-2xl shadow-2xl bg-white/95 backdrop-blur-lg ring-1 ring-gray-200/50 focus:outline-none z-[9999] border border-gray-100/50 animate-slide-in-up"
                :class="{ 'right-0': !isRTLSync, 'left-0': isRTLSync }"
              >
                <div class="py-1 sm:py-2">
                  <div class="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                    <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ authStore.user?.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
                  </div>
                  <router-link
                    to="/profile"
                    @click="closeUserMenu"
                    class="group flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 rounded-lg sm:rounded-xl mx-1 sm:mx-2"
                  >
                    <svg
                      class="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3"
                      :class="{ 'mr-2 sm:mr-3': !isRTLSync, 'ml-2 sm:ml-3': isRTLSync }"
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
                    {{ $t('profile.title') || 'الملف الشخصي' }}
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="group flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-lg sm:rounded-xl mx-1 sm:mx-2"
                  >
                    <svg
                      class="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3"
                      :class="{ 'mr-2 sm:mr-3': !isRTLSync, 'ml-2 sm:ml-3': isRTLSync }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {{ $t('auth.logout') }}
                  </button>
                </div>
              </div>
            </div>
            <!-- Language Switcher Button -->
            <button
              @click="toggleLanguage"
              class="group bg-white/50 backdrop-blur-sm rounded-xl px-2 sm:px-3 py-1 inline-flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 border border-gray-200/50 shadow-sm hover:shadow-md mr-2 sm:mr-4"
              :class="{ 'mr-2 sm:mr-4': !isRTLSync, 'ml-2 sm:ml-4': isRTLSync }"
              :title="currentLanguage === 'ar' ? $t('nav.switchToEnglish') : $t('nav.switchToArabic')"
            >
              <span class="sr-only">{{ $t('nav.language') }}</span>
              <div
                class="w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                :class="{
                  'bg-gradient-to-br from-green-500 to-green-600': currentLanguage === 'ar',
                  'bg-gradient-to-br from-blue-500 to-blue-600': currentLanguage === 'en'
                }"
              >
                <span class="text-white text-xs sm:text-sm font-bold">
                  {{ currentLanguage === 'ar' ? 'En' : 'ع' }}
                </span>
              </div>
              <span
                class="text-xs sm:text-sm font-medium transition-all duration-300 hidden sm:inline"
                :class="{ 'ml-2': !isRTLSync, 'mr-2': isRTLSync }"
              >
                {{ currentLanguage === 'ar' ? $t('nav.switchToEnglish') : $t('nav.switchToArabic') }}
              </span>
              <svg
                class="h-3 sm:h-4 w-3 sm:w-4 transition-transform duration-300 group-hover:rotate-180 hidden sm:inline"
                :class="{ 'ml-1': !isRTLSync, 'mr-1': isRTLSync }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <!-- Mobile menu button -->
            <div class="md:hidden">
              <button
                @click="toggleMobileMenu"
                class="group bg-white/50 backdrop-blur-sm rounded-xl p-3 inline-flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 border border-gray-200/50 shadow-sm hover:shadow-md"
              >
                <span class="sr-only">{{ $t('nav.openMenu') }}</span>
                <svg
                  class="h-5 w-5 transition-transform duration-300"
                  :class="{
                    hidden: showMobileMenu,
                    block: !showMobileMenu,
                    'rotate-180': showMobileMenu,
                  }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  class="h-5 w-5 transition-transform duration-300"
                  :class="{ block: showMobileMenu, hidden: !showMobileMenu }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div
        class="md:hidden overflow-hidden transition-all duration-300"
        :class="{ 'max-h-96 opacity-100': showMobileMenu, 'max-h-0 opacity-0': !showMobileMenu }"
      >
        <div class="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 px-3 py-4 space-y-1">
          <router-link
            to="/"
            class="group flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-sm font-medium transition-all duration-300"
            active-class="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
            @click="closeMobileMenu"
          >
            <svg
              class="w-4 h-4 mr-2.5"
              :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
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
            {{ $t('nav.home') }}
          </router-link>
          <router-link
            to="/builder"
            class="group flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-sm font-medium transition-all duration-300"
            active-class="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
            @click="closeMobileMenu"
          >
            <svg
              class="w-4 h-4 mr-2.5"
              :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
            {{ $t('nav.builder') }}
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/forms"
            class="group flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-sm font-medium transition-all duration-300"
            active-class="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
            @click="closeMobileMenu"
          >
            <svg
              class="w-4 h-4 mr-2.5"
              :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
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
            {{ $t('nav.forms') }}
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/my-submissions"
            class="group flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-sm font-medium transition-all duration-300"
            active-class="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
            @click="closeMobileMenu"
          >
            <svg
              class="w-4 h-4 mr-2.5"
              :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
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
            {{ $t('nav.mySubmissions') }}
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin/users"
            class="group flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-sm font-medium transition-all duration-300"
            active-class="bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 shadow-sm"
            @click="closeMobileMenu"
          >
            <svg
              class="w-4 h-4 mr-2.5"
              :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {{ $t('nav.adminUsers') || 'إدارة المستخدمين' }}
          </router-link>

          <!-- Mobile Auth Section -->
          <div v-if="!authStore.isAuthenticated" class="pt-3 border-t border-gray-200">
            <router-link
              to="/login"
              class="group flex items-center px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium transition-all duration-300 shadow-md"
              @click="closeMobileMenu"
            >
              <svg
                class="w-4 h-4 mr-2.5"
                :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              {{ $t('auth.signIn') }}
            </router-link>
          </div>

          <!-- Mobile User Menu -->
          <div v-else class="pt-3 border-t border-gray-200">
            <div class="px-3 py-2 bg-gray-50 rounded-lg mb-2">
              <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
            </div>
            <router-link
              to="/profile"
              @click="closeMobileMenu"
              class="group flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-all duration-300 mb-1"
            >
              <svg
                class="w-4 h-4 mr-2.5"
                :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
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
              {{ $t('profile.title') || 'الملف الشخصي' }}
            </router-link>
            <button
              @click="handleLogout"
              class="group flex items-center w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-all duration-300"
            >
              <svg
                class="w-4 h-4 mr-2.5"
                :class="{ 'mr-2.5': !isRTLSync, 'ml-2.5': isRTLSync }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {{ $t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 relative">
      <div class="px-4 sm:px-6 lg:px-4">
        <slot />
      </div>
    </main>

    <!-- Enhanced Modern Footer -->
    <footer
      v-if="$route.path !== '/builder'"
      class="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white mt-auto relative overflow-hidden"
    >
      <!-- Enhanced Background Pattern -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
        <div
          class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M40%2040L20%2020h40v40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"
        ></div>
      </div>

      <div class="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand Section -->
          <div class="col-span-1">
            <div class="flex items-center space-x-3 mb-4" :class="{ 'space-x-reverse': isRTLSync }">
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <svg
                  class="w-7 h-7 text-white"
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
                <h3
                  class="text-2xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                >
                  Form.io App
                </h3>
                <p class="text-purple-200 text-sm font-medium">
                  {{ $t('footer.brand.subtitle') }}
                </p>
              </div>
            </div>
            <p class="text-purple-100 text-sm leading-relaxed mb-6">
              {{ $t('footer.brand.description') }}
            </p>
            <!-- Social Links -->
            <div class="flex space-x-4" :class="{ 'space-x-reverse': isRTLSync }">
              <a
                href="#"
                class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg class="w-5 h-5 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg class="w-5 h-5 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg class="w-5 h-5 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-span-1">
            <h4 class="text-lg font-semibold text-white mb-4">
              {{ $t('footer.quickLinks') }}
            </h4>
            <ul class="space-y-2">
              <li>
                <router-link
                  to="/"
                  class="text-purple-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center group"
                >
                  <svg
                    class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                    :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
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
                  {{ $t('nav.home') }}
                </router-link>
              </li>
              <li>
                <router-link
                  to="/builder"
                  class="text-purple-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center group"
                >
                  <svg
                    class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                    :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  {{ $t('nav.builder') }}
                </router-link>
              </li>
              <li>
                <router-link
                  to="/forms"
                  class="text-purple-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center group"
                >
                  <svg
                    class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                    :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }"
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
                  {{ $t('nav.forms') }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Contact Information -->
          <div class="col-span-1">
            <h4 class="text-lg font-semibold text-white mb-4">
              {{ $t('footer.contactUs') }}
            </h4>
            <div class="space-y-3">
              <div class="flex items-center text-purple-200">
                <svg class="w-4 h-4 mr-2" :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">{{ $t('footer.supportEmail') }}</span>
              </div>
              <div class="flex items-center text-purple-200">
                <svg class="w-4 h-4 mr-2" :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm">{{ $t('footer.location') }}</span>
              </div>
              <div class="flex items-center text-purple-200">
                <svg class="w-4 h-4 mr-2" :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-sm">+967 781 929 607</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Bottom Bar -->
        <div class="border-t border-white/20 mt-10 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div
              class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6"
              :class="{ 'md:space-x-reverse': isRTLSync }"
            >
              <p class="text-purple-200 text-sm font-medium">
                © {{ new Date().getFullYear() }} Form.io App.
                {{ $t('footer.copyright') }}
              </p>
              <div
                class="flex items-center space-x-2 text-purple-300 text-xs"
                :class="{ 'space-x-reverse': isRTLSync }"
              >
                <span>{{ $t('footer.version') }} 2.0.0</span>
                <span>•</span>
                <span
                  >{{ $t('footer.lastUpdated') }}
                  {{ $t('footer.lastUpdatedDate') }}</span
                >
              </div>
            </div>
            <div
              class="flex items-center space-x-3 mt-4 md:mt-0"
              :class="{ 'space-x-reverse': isRTLSync }"
            >
              <div
                class="flex items-center space-x-2 text-purple-200 text-sm"
                :class="{ 'space-x-reverse': isRTLSync }"
              >
                <!--                <span>{{ isRTLSync ? 'مبني بـ' : 'Built with' }}</span>-->
                <svg
                  class="w-4 h-4 text-red-400 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ $t('footer.builtBy') }}</span>
              </div>
              <div class="h-4 w-px bg-white/20"></div>
              <a
                href="#"
                class="text-purple-300 hover:text-white text-sm transition-colors duration-200"
              >
                {{ $t('footer.support') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Notification Container -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { changeLanguage, getCurrentLanguage, isRTLSync } from '../i18n'
import { useAuthStore } from '../stores/auth'
import NotificationContainer from './NotificationContainer.vue'

// Composables
const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const showMobileMenu = ref(false)
const showUserMenu = ref(false)

// Computed properties
const currentLanguage = computed(() => getCurrentLanguage())
const currentLanguageLabel = computed(() => {
  return getCurrentLanguage() === 'ar' ? 'العربية' : 'English'
})

// Methods
const toggleLanguage = () => {
  const newLanguage = getCurrentLanguage() === 'ar' ? 'en' : 'ar'
  changeLanguage(newLanguage)
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showMobileMenu.value = false
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    closeUserMenu()
    closeMobileMenu()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods for external use
defineExpose({
  toggleLanguage,
})
</script>

<style scoped>
/* RTL specific adjustments */
[dir='rtl'] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

[dir='rtl'] .md\:space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Mobile menu animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
