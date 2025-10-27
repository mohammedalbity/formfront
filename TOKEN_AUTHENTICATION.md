# Token-Based Authentication Integration

This document describes the token-based authentication system implemented in the Form.io Vue 3 application with Laravel backend integration.

## Overview

The application uses token-based authentication with Bearer tokens for secure API communication. This approach provides stateless authentication suitable for modern web applications and APIs.

## Authentication Flow

### 1. Login Process
```typescript
// User provides credentials
const credentials = {
  email: 'user@example.com',
  password: 'password'
}

// API call returns user data and token
const response = await apiClient.login(credentials)
if (response.success) {
  // Token is automatically stored in localStorage
  // User data is stored in Pinia store
  // User is redirected to intended page
}
```

### 2. Token Storage
- **API Token**: Stored in `localStorage` with key `api_token`
- **User Data**: Stored in `localStorage` with key `user_data`
- **Automatic Cleanup**: Tokens are cleared on logout or authentication errors

### 3. Request Authentication
```typescript
// Axios interceptor automatically adds Authorization header
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

## API Client Configuration

### Token Management
```typescript
class ApiClient {
  // Set authentication token
  setAuthToken(token: string): void {
    localStorage.setItem('api_token', token)
  }

  // Get stored token
  getAuthToken(): string | null {
    return localStorage.getItem('api_token')
  }

  // Clear authentication data
  clearAuthData(): void {
    localStorage.removeItem('api_token')
    localStorage.removeItem('user_data')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken() && !!this.getCurrentUser()
  }
}
```

### Request Interceptor
```typescript
// Automatically attach token to requests
this.client.interceptors.request.use((config) => {
  const token = this.getAuthToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})
```

## Authentication Store (Pinia)

### State Management
```typescript
const authStore = useAuthStore()

// Reactive authentication state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.isLoading)
```

### Authentication Methods
- `login(credentials)` - Authenticate user and store token
- `register(userData)` - Register new user and authenticate
- `logout()` - Clear tokens and user data
- `refreshUser()` - Validate token and refresh user data
- `initializeAuth()` - Initialize authentication on app start

## Router Guards

### Protected Routes
```typescript
// Routes requiring authentication
{
  path: '/builder',
  component: FormBuilderView,
  meta: { requiresAuth: true }
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  next()
})
```

## Error Handling

### Token Expiration
```typescript
// HTTP 401 responses trigger token cleanup
if (error.response?.status === 401) {
  apiClient.clearAuthData()
  // Redirect to login
}
```

### Network Errors
- Automatic retry mechanism with exponential backoff
- User-friendly error messages in Arabic and English
- Connectivity checks for offline scenarios

## Environment Configuration

### Required Variables
```bash
# Laravel Backend URL
VITE_API_BASE_URL=https://formend.fikra-ye.app

# Authentication Configuration
VITE_AUTH_GUARD=token

# Application Settings
VITE_APP_NAME="Form.io Builder"
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,ar
```

## Security Considerations

### Token Security
- Tokens stored in localStorage (consider httpOnly cookies for enhanced security)
- Automatic token cleanup on logout or errors
- No sensitive data in tokens (use server-side validation)

### API Security
- Bearer token authentication
- CORS configuration on backend
- Rate limiting and request validation

## Backend Requirements

### Laravel API Endpoints
```php
// Authentication routes
POST /api/login      // Login with credentials
POST /api/register   // Register new user
POST /api/logout     // Logout (invalidate token)
GET  /api/user       // Get authenticated user data
PUT  /api/user       // Update user profile
PUT  /api/user/password // Change password
```

### Token Response Format
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "1|abc123def456ghi789..."
  },
  "message": "Login successful"
}
```

## Migration from Sanctum

### Changes Made
1. ✅ Removed CSRF token handling
2. ✅ Removed `withCredentials` from axios configuration
3. ✅ Updated API client to use Bearer tokens
4. ✅ Modified authentication store for token-based auth
5. ✅ Updated composables to remove CSRF dependencies
6. ✅ Removed CSRF meta tag from HTML
7. ✅ Updated environment variables
8. ✅ Removed CSRF middleware
9. ✅ Updated error handling to remove CSRF errors

### Testing Checklist
- [ ] Login functionality with valid credentials
- [ ] Registration of new users
- [ ] Token persistence across browser sessions
- [ ] Automatic logout on token expiration
- [ ] Protected route access control
- [ ] API requests with proper Authorization headers
- [ ] Error handling for network failures
- [ ] Multi-language error messages

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check if token is valid and properly formatted
2. **CORS Errors**: Ensure backend CORS configuration allows frontend domain
3. **Token Not Sent**: Verify axios interceptor is properly configured
4. **Persistent Login Issues**: Check localStorage token storage

### Debug Tips
```typescript
// Check stored token
console.log('Token:', localStorage.getItem('api_token'))

// Check authentication state
console.log('Authenticated:', authStore.isAuthenticated)

// Monitor API requests
console.log('Request headers:', config.headers)
```

## Best Practices

1. **Token Refresh**: Implement token refresh mechanism for long-lived sessions
2. **Secure Storage**: Consider moving to httpOnly cookies for enhanced security
3. **Error Boundaries**: Use global error handling for authentication failures
4. **Loading States**: Provide clear feedback during authentication operations
5. **Validation**: Validate tokens on critical operations
6. **Cleanup**: Always clear tokens on logout or errors
