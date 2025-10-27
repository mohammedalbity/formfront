import { ref, reactive } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

const notifications = ref<Notification[]>([])

let notificationId = 0

export function useNotifications() {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${++notificationId}`
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      persistent: false,
      ...notification
    }

    notifications.value.push(newNotification)

    // Auto remove after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value.splice(0)
  }

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options })
  }

  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, ...options })
  }

  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }

  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options })
  }

  return {
    notifications: notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
