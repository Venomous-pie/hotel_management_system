import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from './useLoading'

interface LoginCredentials {
  username: string
  password: string
}

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'accounting'
  department: string | null
  phone: string | null
  lastLogin: string | null
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
}

const authState = ref<AuthState>({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null
})

export function useAuth() {
  const router = useRouter()
  const loading = useLoading()

  const isAuthenticated = computed(() => authState.value.isAuthenticated)
  const currentUser = computed(() => authState.value.user)
  const isLoading = computed(() => authState.value.isLoading || loading.isLoading.value)
  const error = computed(() => authState.value.error)

  const login = async (credentials: LoginCredentials) => {
    authState.value.error = null

    return loading.withLoading(
      async () => {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })

        let data
        try {
          data = await response.json()
        } catch (parseError) {
          throw new Error('Invalid response from server')
        }

        if (!response.ok) {
          // Debug: Log the actual response data
          console.warn('Login API error response:', { status: response.status, data })
          
          // Handle different error response formats
          let errorMessage = 'Login failed'
          
          if (data) {
            if (typeof data === 'string') {
              errorMessage = data
            } else if (typeof data === 'object') {
              // Try different common error properties
              if (data.error) {
                if (typeof data.error === 'string') {
                  errorMessage = data.error
                } else if (typeof data.error === 'object') {
                  // Handle nested error objects
                  if (data.error.message) {
                    errorMessage = data.error.message
                  } else if (data.error.details) {
                    errorMessage = data.error.details
                  } else if (data.error.msg) {
                    errorMessage = data.error.msg
                  } else {
                    console.warn('Could not extract error message from nested error object:', data.error)
                  }
                }
              } else if (data.message && typeof data.message === 'string') {
                errorMessage = data.message
              } else if (data.details && typeof data.details === 'string') {
                errorMessage = data.details
              } else if (data.msg && typeof data.msg === 'string') {
                errorMessage = data.msg
              } else {
                // If we can't extract a string message, use a default based on status
                console.warn('Could not extract error message from:', data)
              }
            }
          }
          
          // Handle specific status codes with user-friendly messages
          if (response.status === 401) {
            errorMessage = 'Invalid username or password'
          } else if (response.status === 403) {
            errorMessage = 'Access denied'
          } else if (response.status === 429) {
            errorMessage = 'Too many login attempts. Please try again later'
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later'
          }
          
          throw new Error(errorMessage)
        }

        if (data.success && data.data) {
          const { token, user } = data.data
          
          authState.value.isAuthenticated = true
          authState.value.user = user
          
          // Store token and user info
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user_data', JSON.stringify(user))
          
          // Navigate based on user role
          if (user.role === 'admin' || user.role === 'manager') {
            router.push('/admin/dashboard')
          } else if (user.role === 'receptionist') {
            router.push('/frontdesk')
          } else if (user.role === 'housekeeping') {
            router.push('/housekeeping')
          } else if (user.role === 'accounting') {
            router.push('/accounting')
          } else {
            // Default to frontdesk for other roles
            router.push('/frontdesk')
          }
        } else {
          throw new Error('Invalid response format')
        }
      },
      'login',
      'Signing in...',
      {
        onError: (error) => {
          // Ensure we always set a string error message
          let errorMessage = 'Login failed'
          
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'string') {
            errorMessage = error
          } else if (error && typeof error === 'object') {
            // Try to extract a meaningful message from error objects
            if (error.message) {
              errorMessage = error.message
            } else if (error.error) {
              errorMessage = error.error
            } else {
              console.warn('Unknown error object:', error)
              errorMessage = 'An unexpected error occurred'
            }
          }
          
          authState.value.error = errorMessage
        }
      }
    )
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Call logout endpoint
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      // Store current user role before clearing state
      const currentUserRole = authState.value.user?.role
      
      // Clear local state regardless of API call success
      authState.value.isAuthenticated = false
      authState.value.user = null
      authState.value.error = null
      
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      // Redirect to appropriate login page based on previous user role
      if (currentUserRole === 'admin' || currentUserRole === 'manager') {
        router.push('/admin')
      } else {
        router.push('/login')
      }
    }
  }

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (!token || !userData) {
      authState.value.isAuthenticated = false
      authState.value.user = null
      redirectToLogin()
      return false
    }

    try {
      // Check if token is expired before making API call
      const tokenPayload = parseJwtPayload(token)
      if (tokenPayload && isTokenExpired(tokenPayload)) {
        console.warn('Token expired, redirecting to login')
        clearAuthAndRedirect()
        return false
      }

      // Validate token with backend
      const response = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.user) {
          authState.value.isAuthenticated = true
          authState.value.user = data.data.user
          // Update stored user data
          localStorage.setItem('user_data', JSON.stringify(data.data.user))
          return true
        } else {
          console.warn('Invalid user data received')
          clearAuthAndRedirect()
          return false
        }
      } else if (response.status === 401 || response.status === 403) {
        console.warn('Token validation failed - unauthorized, redirecting to login')
        clearAuthAndRedirect()
        return false
      } else {
        console.warn(`Token validation failed - ${response.status}, redirecting to login`)
        clearAuthAndRedirect()
        return false
      }
    } catch (error) {
      console.warn('Auth validation failed:', error)
      clearAuthAndRedirect()
      return false
    }
  }

  const clearAuthAndRedirect = () => {
    // Clear invalid token - this is bussin fr 🔥
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    authState.value.isAuthenticated = false
    authState.value.user = null
    authState.value.error = null
    redirectToLogin()
  }

  const redirectToLogin = () => {
    const currentPath = router.currentRoute.value.path
    
    // Determine which login page to redirect to based on current path
    if (currentPath.startsWith('/admin')) {
      router.replace('/admin')
    } else {
      router.replace('/login')
    }
  }

  // Helper functions for JWT token handling
  const parseJwtPayload = (token: string) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.warn('Failed to parse JWT payload:', error)
      return null
    }
  }

  const isTokenExpired = (payload: any) => {
    if (!payload.exp) return false
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  }

  const getTokenExpirationTime = () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return null
    
    const payload = parseJwtPayload(token)
    return payload?.exp ? new Date(payload.exp * 1000) : null
  }

  const clearError = () => {
    authState.value.error = null
  }

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    error,
    login,
    logout,
    checkAuthStatus,
    clearError,
    getTokenExpirationTime
  }
}
