<template>
  <Teleport to="body">
    <div class="notification-container fixed top-2 sm:top-4 right-2 sm:right-4 z-[99999] space-y-2 max-w-xs sm:max-w-sm" :class="{ 'right-2 sm:right-4': !isRTLSync, 'left-2 sm:left-4': isRTLSync }">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          :class="getNotificationClasses(notification.type)"
        >
          <div class="p-3 sm:p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="getNotificationIcon(notification.type)" class="h-5 sm:h-6 w-5 sm:w-6" :class="getIconClasses(notification.type)" />
              </div>
              <div class="ml-2 sm:ml-3 w-0 flex-1 pt-0.5" :class="{ 'ml-2 sm:ml-3': !isRTLSync, 'mr-2 sm:mr-3': isRTLSync }">
                <p class="text-xs sm:text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p v-if="notification.message" class="mt-1 text-xs sm:text-sm text-gray-500">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-2 sm:ml-4 flex-shrink-0 flex" :class="{ 'ml-2 sm:ml-4': !isRTLSync, 'mr-2 sm:mr-4': isRTLSync }">
                <button
                  @click="removeNotification(notification.id)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">{{ $t('common.close') }}</span>
                  <svg class="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Progress bar for timed notifications -->
          <div
            v-if="!notification.persistent && notification.duration"
            class="notification-progress h-1 bg-gray-200"
          >
            <div
              class="h-full transition-all ease-linear"
              :class="getProgressClasses(notification.type)"
              :style="{ 
                width: '100%',
                animation: `shrink ${notification.duration}ms linear forwards`
              }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useNotifications } from '../composables/useNotifications'
import { isRTLSync } from '../i18n'

const { notifications, removeNotification } = useNotifications()

const isRTLDirection = computed(() => isRTLSync())

const getNotificationClasses = (type: string) => {
  const classes = {
    success: 'border-l-4 border-green-400',
    error: 'border-l-4 border-red-400',
    warning: 'border-l-4 border-yellow-400',
    info: 'border-l-4 border-blue-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getIconClasses = (type: string) => {
  const classes = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getProgressClasses = (type: string) => {
  const classes = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getNotificationIcon = (type: string) => {
  const icons = {
    success: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 
        'fill-rule': 'evenodd', 
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        'clip-rule': 'evenodd'
      })
    ]),
    error: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 
        'fill-rule': 'evenodd', 
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
        'clip-rule': 'evenodd'
      })
    ]),
    warning: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 
        'fill-rule': 'evenodd', 
        d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
        'clip-rule': 'evenodd'
      })
    ]),
    info: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 
        'fill-rule': 'evenodd', 
        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
        'clip-rule': 'evenodd'
      })
    ])
  }
  return icons[type as keyof typeof icons] || icons.info
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* RTL support */
.notification-container.left-4 .notification-enter-from,
.notification-container.left-4 .notification-leave-to {
  transform: translateX(-100%);
}
</style>
