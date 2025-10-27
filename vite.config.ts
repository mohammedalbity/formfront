import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Disable Vue template compiler optimizations that might conflict with i18n
          hoistStatic: false,
          cacheHandlers: false
        }
      }
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    // Ensure Vue i18n works properly in production
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  build: {
    sourcemap: true,
    // Additional build optimizations for i18n
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-i18n': ['vue-i18n']
        }
      }
    }
  },
})
