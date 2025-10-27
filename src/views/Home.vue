<template>
  <div class="home-view">
    <!-- Hero Section -->
    <div
      class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-blue-700 to-purple-800"
    >
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M40%2040L20%2020h40v40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"
      ></div>

      <!-- Floating Form Elements -->
      <div
        class="absolute top-20 left-4 sm:left-10 w-16 sm:w-24 h-12 sm:h-16 bg-white/10 rounded-lg blur-sm animate-float transform rotate-12"
      ></div>
      <div
        class="absolute top-32 right-8 sm:right-16 w-16 sm:w-20 h-16 sm:h-20 bg-emerald-300/20 rounded-xl blur-xl animate-float-delayed"
      ></div>
      <div
        class="absolute bottom-32 left-1/4 w-12 sm:w-18 h-8 sm:h-12 bg-purple-300/25 rounded-lg blur-sm animate-float-slow transform -rotate-6"
      ></div>
      <div
        class="absolute top-1/2 right-1/4 w-12 sm:w-16 h-16 sm:h-24 bg-blue-300/15 rounded-lg blur-sm animate-float transform rotate-45"
      ></div>

      <div class="relative px-4 py-20 sm:py-28 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="text-center">
          <!-- Service Badge -->
          <div
            class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-6 sm:mb-8 shadow-lg"
          >
            <svg class="w-4 sm:w-5 h-4 sm:h-5 text-emerald-300 mr-2" :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs sm:text-sm font-semibold text-white/95">
              {{ isRTLSync() ? '🎯 منصة إنشاء النماذج الذكية' : '🎯 Smart Form Building Platform' }}
            </span>
          </div>

          <!-- Main Title -->
          <h1
            class="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-white via-emerald-100 to-blue-100 bg-clip-text text-transparent leading-tight tracking-tight"
            :class="{ 'arabic-text': isRTLSync }"
          >
            {{ isRTLSync() ? 'أنشئ نماذجك بذكاء' : 'Build Forms Intelligently' }}
          </h1>

          <!-- Subtitle -->
          <p
            class="text-lg sm:text-2xl md:text-3xl mb-12 sm:mb-16 text-white/90 max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-0"
            :class="{ 'arabic-text': isRTLSync }"
          >
            {{ isRTLSync() ? 'منصة متطورة لإنشاء النماذج التفاعلية مع دعم كامل للغة العربية وأحدث التقنيات' : 'Advanced platform for creating interactive forms with full Arabic support and cutting-edge technology' }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 sm:mb-20 px-4 sm:px-0">
            <router-link
              to="/builder"
              class="group relative inline-flex items-center px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 w-full sm:w-auto justify-center"
            >
              <span class="relative z-10 text-base sm:text-lg">{{ isRTLSync() ? 'ابدأ الإنشاء الآن' : 'Start Building Now' }}</span>
              <svg
                class="ml-2 sm:ml-3 w-5 sm:w-6 h-5 sm:h-6 transition-transform group-hover:translate-x-2"
                :class="{ 'ml-2 sm:ml-3': !isRTLSync, 'mr-2 sm:mr-3 rotate-180': isRTLSync }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
            </router-link>

            <button
              class="inline-flex items-center px-6 sm:px-10 py-4 sm:py-5 border-2 border-white/40 text-white font-bold rounded-3xl backdrop-blur-md hover:bg-white/15 transition-all duration-500 hover:border-white/60 w-full sm:w-auto justify-center"
            >
              <svg
                class="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3"
                :class="{ 'mr-2 sm:mr-3': !isRTLSync, 'ml-2 sm:ml-3': isRTLSync }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-base sm:text-lg">{{ isRTLSync() ? 'شاهد العرض التوضيحي' : 'Watch Live Demo' }}</span>
            </button>
          </div>

          <!-- Enhanced Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0">
            <div class="text-center group">
              <div class="text-3xl sm:text-4xl font-black text-emerald-300 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">∞</div>
              <div class="text-white/80 text-sm sm:text-base font-medium">{{ isRTLSync() ? 'نماذج لا محدودة' : 'Unlimited Forms' }}</div>
            </div>
            <div class="text-center group">
              <div class="text-3xl sm:text-4xl font-black text-blue-300 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">2</div>
              <div class="text-white/80 text-sm sm:text-base font-medium">{{ isRTLSync() ? 'لغات مدعومة' : 'Supported Languages' }}</div>
            </div>
            <div class="text-center group">
              <div class="text-3xl sm:text-4xl font-black text-purple-300 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">100%</div>
              <div class="text-white/80 text-sm sm:text-base font-medium">{{ isRTLSync() ? 'متجاوب تماماً' : 'Fully Responsive' }}</div>
            </div>
            <div class="text-center group">
              <div class="text-3xl sm:text-4xl font-black text-pink-300 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">{{ $t('common.rtl') }}</div>
              <div class="text-white/80 text-sm sm:text-base font-medium">{{ isRTLSync() ? 'دعم كامل للعربية' : 'Full Arabic Support' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Wave Bottom -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" class="w-full h-auto">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- Services Section -->
    <div class="py-32 bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-24">
          <div
            class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 text-sm font-bold mb-8 shadow-lg"
          >
            <svg class="w-5 h-5 text-emerald-600 mr-2" :class="{ 'mr-2': !isRTLSync, 'ml-2': isRTLSync }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
            {{ isRTLSync() ? '⚡ خدماتنا المتميزة' : '⚡ Our Premium Services' }}
          </div>
          <h2
            class="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight"
            :class="{ 'arabic-text': isRTLSync }"
          >
            {{ isRTLSync() ? 'حلول شاملة لإنشاء النماذج' : 'Complete Form Solutions' }}
          </h2>
          <p
            class="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light"
            :class="{ 'arabic-text': isRTLSync }"
          >
            {{ isRTLSync() ? 'نوفر لك كل ما تحتاجه لإنشاء نماذج احترافية وتفاعلية بأحدث التقنيات' : 'Everything you need to create professional and interactive forms with cutting-edge technology' }}
          </p>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <!-- Drag & Drop Builder -->
          <div
            class="group relative bg-white rounded-4xl p-10 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/15 to-blue-600/15 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-1000"
            ></div>
            <div class="relative">
              <div
                class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
              >
                <svg
                  class="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ isRTLSync() ? 'منشئ السحب والإفلات' : 'Drag & Drop Builder' }}
              </h3>
              <p class="text-lg text-gray-600 leading-relaxed mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ isRTLSync() ? 'أنشئ نماذجك بسهولة باستخدام واجهة السحب والإفلات البديهية مع مكونات جاهزة ومتنوعة' : 'Create your forms easily using an intuitive drag-and-drop interface with ready-made and diverse components' }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'سهل الاستخدام' : 'Easy to Use' }}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'مكونات جاهزة' : 'Ready Components' }}</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'معاينة فورية' : 'Live Preview' }}</span>
              </div>
            </div>
          </div>

          <!-- Multi-language Support -->
          <div
            class="group relative bg-white rounded-4xl p-10 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-purple-600/15 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-1000"
            ></div>
            <div class="relative">
              <div
                class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
              >
                <svg
                  class="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ $t('home.features.multiLanguage') }}
              </h3>
              <p class="text-lg text-gray-600 leading-relaxed mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ $t('home.features.multiLanguageDesc') }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{{ $t('home.features.arabicEnglish') }}</span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{{ $t('home.features.rtlLayout') }}</span>
                <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">{{ $t('home.features.instantSwitch') }}</span>
              </div>
            </div>
          </div>

          <!-- Advanced Validation -->
          <div
            class="group relative bg-white rounded-4xl p-10 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-1000"
            ></div>
            <div class="relative">
              <div
                class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
              >
                <svg
                  class="w-10 h-10 text-white"
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
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ isRTLSync() ? 'التحقق المتقدم' : 'Advanced Validation' }}
              </h3>
              <p class="text-lg text-gray-600 leading-relaxed mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ isRTLSync() ? 'نظام تحقق متطور مع قواعد مخصصة ورسائل خطأ واضحة لضمان جودة البيانات' : 'Advanced validation system with custom rules and clear error messages to ensure data quality' }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'قواعد مخصصة' : 'Custom Rules' }}</span>
                <span class="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'تحقق فوري' : 'Real-time Check' }}</span>
                <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'رسائل واضحة' : 'Clear Messages' }}</span>
              </div>
            </div>
          </div>

          <!-- Export & Integration -->
          <div
            class="group relative bg-white rounded-4xl p-10 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/15 to-red-600/15 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-1000"
            ></div>
            <div class="relative">
              <div
                class="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
              >
                <svg
                  class="w-10 h-10 text-white"
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
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ isRTLSync() ? 'التصدير والتكامل' : 'Export & Integration' }}
              </h3>
              <p class="text-lg text-gray-600 leading-relaxed mb-6" :class="{ 'arabic-text': isRTLSync }">
                {{ isRTLSync() ? 'صدّر نماذجك بصيغ متعددة وادمجها بسهولة مع أنظمتك الحالية عبر APIs متطورة' : 'Export your forms in multiple formats and easily integrate them with your existing systems via advanced APIs' }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'صيغ متعددة' : 'Multiple Formats' }}</span>
                <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'APIs متطورة' : 'Advanced APIs' }}</span>
                <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">{{ isRTLSync() ? 'تكامل سهل' : 'Easy Integration' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Call to Action Section -->
    <div
      class="py-32 bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900 relative overflow-hidden"
    >
      <!-- Advanced Background Effects -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M50%2050L25%2025h50v50z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"
      ></div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 left-20 w-32 h-20 bg-emerald-400/10 rounded-2xl blur-xl animate-float transform rotate-12"></div>
      <div class="absolute bottom-20 right-20 w-24 h-32 bg-blue-400/10 rounded-2xl blur-xl animate-float-delayed transform -rotate-12"></div>
      <div class="absolute top-1/2 left-10 w-20 h-20 bg-purple-400/10 rounded-full blur-xl animate-float-slow"></div>

      <div class="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div
          class="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-md border border-white/30 mb-12 shadow-2xl"
        >
          <svg class="w-6 h-6 text-emerald-300 mr-3" :class="{ 'mr-3': !isRTLSync, 'ml-3': isRTLSync }" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>
          <span class="text-lg font-bold text-white/95">
            {{ isRTLSync() ? '🚀 ابدأ رحلتك الآن' : '🚀 Start Your Journey Now' }}
          </span>
        </div>

        <h3
          class="text-6xl md:text-7xl font-black text-white mb-10 leading-tight"
          :class="{ 'arabic-text': isRTLSync }"
        >
          {{ isRTLSync() ? 'جاهز للبدء؟' : 'Ready to Begin?' }}
        </h3>

        <p
          class="text-2xl md:text-3xl text-emerald-100 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
          :class="{ 'arabic-text': isRTLSync }"
        >
          {{ isRTLSync() ? 'انضم إلى آلاف المطورين الذين يثقون في منصتنا لإنشاء نماذج احترافية وتفاعلية' : 'Join thousands of developers who trust our platform to create professional and interactive forms' }}
        </p>

        <div class="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
          <router-link
            to="/builder"
            class="group relative inline-flex items-center px-12 py-6 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 text-white font-black rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-700 transform hover:scale-110 hover:-translate-y-3 text-xl"
          >
            <span class="relative z-10">{{ isRTLSync() ? 'ابدأ الإنشاء مجاناً' : 'Start Building Free' }}</span>
            <svg
              class="ml-4 w-7 h-7 transition-transform group-hover:translate-x-3"
              :class="{ 'ml-4': !isRTLSync, 'mr-4 rotate-180': isRTLSync }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            ></div>
          </router-link>

          <button
            class="inline-flex items-center px-12 py-6 border-3 border-white/50 text-white font-bold rounded-full backdrop-blur-md hover:bg-white/15 hover:border-white/70 transition-all duration-700 text-xl hover:scale-105"
          >
            <svg
              class="w-7 h-7 mr-4"
              :class="{ 'mr-4': !isRTLSync, 'ml-4': isRTLSync }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ isRTLSync() ? 'شاهد العرض المباشر' : 'Watch Live Demo' }}</span>
          </button>
        </div>

        <!-- Enhanced Trust Indicators -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-white mb-2" :class="{ 'arabic-text': isRTLSync }">
              {{ isRTLSync() ? 'مجاني بالكامل' : 'Completely Free' }}
            </h4>
            <p class="text-white/70 text-center" :class="{ 'arabic-text': isRTLSync }">
              {{ isRTLSync() ? 'لا توجد رسوم خفية' : 'No hidden fees' }}
            </p>
          </div>

          <div class="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-white mb-2" :class="{ 'arabic-text': isRTLSync }">
              {{ isRTLSync() ? 'مفتوح المصدر' : 'Open Source' }}
            </h4>
            <p class="text-white/70 text-center" :class="{ 'arabic-text': isRTLSync }">
              {{ isRTLSync() ? 'شفاف وقابل للتخصيص' : 'Transparent & customizable' }}
            </p>
          </div>

          <div class="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-white mb-2" :class="{ 'arabic-text': isRTLSync }">
              {{ isRTLSync() ? 'دعم فني متميز' : 'Premium Support' }}
            </h4>
            <p class="text-white/70 text-center" :class="{ 'arabic-text': isRTLSync }">
              {{ isRTLSync() ? 'مساعدة على مدار الساعة' : '24/7 assistance' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLSync } from '../i18n'

// Composables
const { t } = useI18n()

// Computed properties
const isRTL = computed(() => isRTLSync())
</script>

<style scoped>
/* Professional Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Animation Classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: -2s;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
  animation-delay: -4s;
}

.animate-gradient {
  background-size: 400% 400%;
  animation: gradient-shift 8s ease infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

.animate-slide-in-up {
  animation: slide-in-up 0.8s ease-out;
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

/* Enhanced Hover Effects */
.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.hover\:shadow-white\/25:hover {
  box-shadow: 0 25px 50px -12px rgba(255, 255, 255, 0.25);
}

/* Professional Card Styling */
.group:hover .group-hover\:scale-150 {
  transform: scale(1.5);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Glass Morphism Effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Gradient Text */
.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}

.text-transparent {
  color: transparent;
}

/* RTL Support */
[dir='rtl'] .rotate-180 {
  transform: rotate(180deg);
}

[dir='rtl'] .group-hover\:translate-x-1:hover {
  transform: translateX(-0.25rem);
}

/* Smooth Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Arabic Text Styling */
.arabic-text {
  font-family: 'Noto Sans Arabic', 'Cairo', 'Amiri', Arial, sans-serif;
  line-height: 1.8;
  font-weight: 500;
}

/* Professional Gradients */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading States */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Focus States */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: #3b82f6;
}

/* Responsive Design Helpers */
@media (max-width: 640px) {
  .animate-float,
  .animate-float-delayed,
  .animate-float-slow {
    animation-duration: 4s;
  }
}

/* Performance Optimizations */
.transform {
  transform: translateZ(0);
}

.will-change-transform {
  will-change: transform;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .dark\:bg-gray-900 {
    background-color: #111827;
  }

  .dark\:text-white {
    color: #ffffff;
  }
}
</style>
