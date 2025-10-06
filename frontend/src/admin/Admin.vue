<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Side - Branding/Visual -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
      <!-- Background Pattern - more subtle and modern -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-32 h-32 bg-white/8 rounded-2xl transform rotate-12"></div>
        <div class="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full"></div>
        <div class="absolute bottom-32 left-40 w-20 h-20 bg-white/8 rounded-2xl transform -rotate-12"></div>
        <div class="absolute bottom-20 right-20 w-28 h-28 bg-white/5 rounded-full"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/3 rounded-full"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-center text-white p-12 h-full w-full">
        <div class="text-center flex flex-col items-center justify-center">
          <div
            class="w-24 h-24 bg-white/15 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm shadow-lg">
            <img src="/logo.png" alt="Hotel Logo" class="w-16 h-16 object-contain filter brightness-0 invert">
          </div>
          <h1 class="text-5xl font-bold mb-4 tracking-tight">Grand Resort</h1>
          <p class="text-xl text-green-100 mb-2 font-medium">Administrative Portal</p>
          <p class="text-sm text-green-200/80 max-w-md leading-relaxed">Secure access for hotel staff and management. Monitor operations, manage reservations, and oversee daily activities.</p>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-10">
          <div class="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i class="pi pi-shield text-3xl text-white"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Admin Access</h2>
          <p class="text-gray-600 text-base leading-relaxed">Sign in to your administrator account to manage hotel operations</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="pi pi-exclamation-triangle text-red-600 text-sm"></i>
            </div>
            <div>
              <p class="text-red-800 text-sm font-medium">Authentication Failed</p>
              <p class="text-red-700 text-xs mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-7">
          <!-- Username Field -->
          <div>
            <label for="username" class="block text-sm font-semibold text-gray-700 mb-3">
              <div class="flex items-center gap-2">
                <i class="pi pi-user text-green-600 text-sm"></i>
                Username
              </div>
            </label>
            <input id="username" v-model="credentials.username" type="text" required
              class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm bg-white shadow-sm"
              :class="{
                'border-gray-300': !error,
                'border-red-300 focus:ring-red-500 focus:border-red-500': error
              }" placeholder="Enter your username" :disabled="isLoading" />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-3">
              <div class="flex items-center gap-2">
                <i class="pi pi-lock text-green-600 text-sm"></i>
                Password
              </div>
            </label>
            <div class="relative">
              <input id="password" v-model="credentials.password" :type="showPassword ? 'text' : 'password'" required
                class="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm bg-white shadow-sm"
                :class="{
                  'border-gray-300': !error,
                  'border-red-300 focus:ring-red-500 focus:border-red-500': error
                }" placeholder="Enter your password" :disabled="isLoading" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors p-1"
                :disabled="isLoading">
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between pt-2">
            <label class="flex items-center cursor-pointer">
              <input v-model="rememberMe" type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-offset-0" :disabled="isLoading" />
              <span class="ml-3 text-sm text-gray-700 font-medium">Remember me for 30 days</span>
            </label>
            <button type="button" class="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors underline decoration-transparent hover:decoration-current"
              :disabled="isLoading">
              Need help?
            </button>
          </div>

          <!-- Login Button -->
          <div class="pt-4">
            <Custombutton :label="isLoading ? 'Signing in...' : 'Sign In'" bg-color="bg-gradient-to-r from-green-600 to-green-700"
              hover-bg-color="hover:from-green-700 hover:to-green-800" text-color="white" font-size="1rem" padding="1rem 2rem"
              width="100%" height="3.5rem" :rounded="false" text-class="font-semibold tracking-wide"
              :disabled="isLoading || !credentials.username || !credentials.password" :hover="true" @click="handleLogin"
              class="rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <div class="flex items-center justify-center gap-3">
                <i v-if="isLoading" class="pi pi-spin pi-spinner text-lg"></i>
                <i v-else class="pi pi-sign-in text-lg"></i>
                <span class="text-base">{{ isLoading ? 'Signing in...' : 'Sign In to Dashboard' }}</span>
              </div>
            </Custombutton>
          </div>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-10 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-sm">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i class="pi pi-info-circle text-green-600 text-lg"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-green-800 mb-2">Demo Access Available</p>
              <div class="space-y-1">
                <p class="text-xs text-green-700 font-mono bg-white/50 px-2 py-1 rounded">
                  <span class="font-semibold">Username:</span> admin
                </p>
                <p class="text-xs text-green-700 font-mono bg-white/50 px-2 py-1 rounded">
                  <span class="font-semibold">Password:</span> Admin@123
                </p>
              </div>
              <p class="text-xs text-green-600 mt-2 italic">Use these credentials to explore the admin panel</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-12 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="w-2 h-2 bg-green-600 rounded-full"></div>
            <p class="text-xs text-gray-600 font-medium">Secure Admin Portal</p>
            <div class="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
          <p class="text-xs text-gray-500">
            © 2024 Grand Resort Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import Custombutton from '../components/Custombutton.vue'

const { login, isLoading, error, clearError, checkAuthStatus } = useAuth()

const credentials = ref({
  username: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  clearError()
  await login(credentials.value)
}

onMounted(async () => {
  // checkAuthStatus now handles redirects gracefully
  await checkAuthStatus()
})
</script>