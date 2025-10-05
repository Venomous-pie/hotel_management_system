import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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

  const isAuthenticated = computed(() => authState.value.isAuthenticated)
  const currentUser = computed(() => authState.value.user)
  const isLoading = computed(() => authState.value.isLoading)
  const error = computed(() => authState.value.error)

  const login = async (credentials: LoginCredentials) => {
    authState.value.isLoading = true
    authState.value.error = null

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
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
    } catch (err) {
      authState.value.error = err instanceof Error ? err.message : 'Login failed'
    } finally {
      authState.value.isLoading = false
    }
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
      return
    }

    try {
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
        } else {
          throw new Error('Invalid user data')
        }
      } else {
        throw new Error('Token validation failed')
      }
    } catch (error) {
      console.warn('Auth validation failed:', error)
      // Clear invalid token
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      authState.value.isAuthenticated = false
      authState.value.user = null
    }
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
    clearError
  }
}
