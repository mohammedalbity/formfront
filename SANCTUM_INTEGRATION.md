# Laravel Sanctum Integration Guide

## نظرة عامة | Overview

تم تكامل Vue 3 Form.io frontend مع Laravel Sanctum backend لتوفير نظام مصادقة آمن وفعال.

This Vue 3 Form.io frontend has been integrated with Laravel Sanctum backend to provide secure and efficient authentication system.

## المتطلبات | Requirements

### Backend Requirements
- Laravel 11+ with Sanctum installed
- CORS configured for frontend domain
- Session-based authentication enabled
- CSRF protection enabled

### Frontend Requirements
- Vue 3 with TypeScript
- Pinia for state management
- Vue Router for navigation
- Vue I18n for internationalization

## التكوين | Configuration

### Environment Variables

```bash
# .env file
VITE_API_BASE_URL=https://formend.fikra-ye.app
VITE_APP_NAME="Form.io Builder"
VITE_APP_ENV=development
VITE_SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,localhost:3000,127.0.0.1:3000
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,ar
VITE_DEBUG=true
VITE_LOG_LEVEL=info
```

### Laravel Backend Configuration

Ensure your Laravel backend has the following configuration:

#### config/sanctum.php
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),
```

#### config/cors.php
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## الميزات المُطبقة | Implemented Features

### 1. CSRF Protection
- Automatic CSRF token handling
- Token refresh on mismatch (419 errors)
- Middleware for CSRF validation

### 2. Session-based Authentication
- Cookie-based session management
- Automatic session validation
- Secure logout with session cleanup

### 3. API Client Integration
- Laravel Sanctum compatible HTTP client
- Automatic credential inclusion
- Error handling for authentication failures

### 4. Router Guards
- Protected routes with authentication checks
- Guest-only routes for login/register
- Automatic redirect to intended pages

### 5. State Management
- Pinia store for authentication state
- Persistent user data in localStorage
- Automatic session validation

## استخدام المكونات | Component Usage

### Authentication Composable

```typescript
import { useAuth } from '@/composables/useAuth'

export default {
  setup() {
    const {
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register
    } = useAuth()

    return {
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register
    }
  }
}
```

### CSRF Middleware

```typescript
import { useCSRF } from '@/middleware/csrf'

export default {
  setup() {
    const { ensureToken, validateToken } = useCSRF()

    const handleFormSubmit = async () => {
      await ensureToken()
      // Proceed with form submission
    }

    return { handleFormSubmit }
  }
}
```

## API Endpoints

### Authentication Endpoints
- `GET /sanctum/csrf-cookie` - Get CSRF cookie
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user

### Form Management Endpoints
- `GET /api/forms` - List forms
- `POST /api/forms` - Create form
- `GET /api/forms/{id}` - Get form
- `PUT /api/forms/{id}` - Update form
- `DELETE /api/forms/{id}` - Delete form

### Form Submission Endpoints
- `POST /api/forms/{id}/submit` - Submit form
- `GET /api/submissions` - List submissions
- `GET /api/submissions/{id}` - Get submission

## الأمان | Security Features

### 1. CSRF Protection
- Automatic CSRF token handling
- Token validation on all state-changing requests
- Protection against CSRF attacks

### 2. Session Security
- Secure cookie configuration
- HttpOnly cookies for session data
- SameSite cookie protection

### 3. Authentication Guards
- Route-level authentication checks
- Automatic redirect for unauthenticated users
- Session validation on app initialization

## استكشاف الأخطاء | Troubleshooting

### Common Issues

#### 1. CSRF Token Mismatch (419 Error)
```javascript
// Automatic handling in API client
// Manual refresh if needed
await csrfMiddleware.refreshCSRFToken()
```

#### 2. CORS Issues
Ensure Laravel backend CORS configuration allows your frontend domain:
```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

#### 3. Session Not Persisting
Check that cookies are being sent with requests:
```javascript
// Automatic in API client configuration
credentials: 'include'
```

### Debug Commands

```bash
# Test CSRF cookie endpoint
curl -X GET https://formend.fikra-ye.app/sanctum/csrf-cookie -c cookies.txt

# Test login with CSRF
curl -X POST https://formend.fikra-ye.app/api/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-token" \
  -b cookies.txt \
  -d '{"email":"test@example.com","password":"password"}'
```

## Development Scripts

```bash
# Start development server with Sanctum configuration
npm run dev:sanctum

# Test authentication endpoints
npm run test:auth

# Standard development server
npm run dev
```

## Production Deployment

### Frontend Configuration
1. Update `VITE_API_BASE_URL` to production Laravel URL
2. Update `VITE_SANCTUM_STATEFUL_DOMAINS` with production domains
3. Build application: `npm run build`

### Backend Configuration
1. Update `SANCTUM_STATEFUL_DOMAINS` in Laravel .env
2. Configure CORS for production frontend domain
3. Ensure HTTPS in production

## الدعم الفني | Technical Support

For issues related to:
- **Authentication**: Check auth store and API client
- **CSRF**: Review CSRF middleware and Laravel configuration
- **Sessions**: Verify cookie configuration and CORS settings
- **Routing**: Check router guards and navigation logic

## الملفات المُحدثة | Updated Files

### Core Files
- `src/services/apiClient.ts` - Sanctum-compatible API client
- `src/stores/auth.ts` - Authentication state management
- `src/utils/axios.ts` - HTTP client with credentials support

### Authentication
- `src/views/Login.vue` - Login/register form with redirect support
- `src/composables/useAuth.ts` - Authentication composable
- `src/middleware/csrf.ts` - CSRF protection middleware

### Configuration
- `src/router/index.ts` - Router guards for authentication
- `src/App.vue` - App initialization with auth setup
- `index.html` - CSRF meta tag
- `.env` / `.env.example` - Environment configuration
- `package.json` - Development scripts

This integration provides a complete, secure, and production-ready authentication system using Laravel Sanctum with Vue 3.
