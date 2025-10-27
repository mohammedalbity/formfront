import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FormBuilderView from '../views/FormBuilderView.vue'
import FormPreview from '../views/FormPreview.vue'
import Login from '../views/Login.vue'
import FormsManagement from '../views/FormsManagement.vue'
import FormSubmissions from '../views/FormSubmissions.vue'
import PublicForm from '../views/PublicForm.vue'
import UserSubmissions from '../views/UserSubmissions.vue'
import SubmissionDetails from '../views/SubmissionDetails.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminUsers from '../views/AdminUsers.vue'
import FormAnalytics from '../views/FormAnalytics.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login',
        requiresGuest: true
      }
    },
    {
      path: '/builder',
      name: 'FormBuilder',
      component: FormBuilderView,
      meta: {
        title: 'Form Builder',
        requiresAuth: true
      }
    },
    {
      path: '/preview',
      name: 'FormPreview',
      component: FormPreview,
      meta: {
        title: 'Form Preview'
      }
    },
    {
      path: '/forms',
      name: 'FormsManagement',
      component: FormsManagement,
      meta: {
        title: 'Forms Management',
        requiresAuth: true
      }
    },
    {
      path: '/forms/:formId/submissions',
      name: 'FormSubmissions',
      component: FormSubmissions,
      meta: {
        title: 'Form Submissions',
        requiresAuth: true
      }
    },
    {
      path: '/forms/:id/fill',
      name: 'PublicForm',
      component: PublicForm,
      meta: {
        title: 'Fill Form'
      }
    },
    {
      path: '/my-submissions',
      name: 'UserSubmissions',
      component: UserSubmissions,
      meta: {
        title: 'My Submissions',
        requiresAuth: true
      }
    },
    {
      path: '/submissions/:id',
      name: 'SubmissionDetails',
      component: SubmissionDetails,
      meta: {
        title: 'Submission Details',
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
      meta: {
        title: 'Profile',
        requiresAuth: true
      }
    },
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: AdminUsers,
      meta: {
        title: 'User Management',
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/forms/:id/analytics',
      name: 'FormAnalytics',
      component: FormAnalytics,
      meta: {
        title: 'Form Analytics',
        requiresAuth: true
      }
    }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  document.title = `${to.meta.title} - Form.io Builder` || 'Form.io Builder'
  
  // Initialize auth if not done yet
  if (!authStore.isInitialized) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.warn('Failed to initialize auth during navigation:', error)
    }
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect to intended page or home
    const redirectPath = to.query.redirect as string || '/'
    next(redirectPath)
    return
  }
  
  next()
})

export default router
