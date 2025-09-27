<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between px-6 pt-2 pb-1 bg-white border-b border-gray-200">
      <Searchbar 
        placeholder="Search..." 
        icon="pi pi-search" 
        :outline="false" 
        width="25rem"
        @search="handleHeaderSearch"
      />
      <div class="flex items-center gap-4">
        <!-- Refresh Button -->
        <button 
          @click="handleRefresh"
          :disabled="isRefreshing"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          :class="{ 'animate-spin': isRefreshing }"
          title="Refresh data"
        >
          <i class="pi pi-refresh text-gray-600 w-5 h-5 inline-block"></i>
        </button>

        <!-- Notifications Button -->
        <button 
          @click="handleNotifications"
          class="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          title="Notifications"
        >
          <i class="pi pi-bell text-gray-600 w-5 h-5 inline-block"></i>
          <!-- Notification Badge -->
          <span 
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </button>

        <!-- User Dropdown -->
        <div class="relative user-dropdown-container">
          <button 
            @click="showUserDropdown = !showUserDropdown"
            class="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors cursor-pointer"
            :class="{ 'bg-gray-50': showUserDropdown }"
          >
            <img src="/receptionist.jpg" alt="Profile" class="w-8 h-8 rounded-full object-cover object-top" />
            <span class="text-xs font-medium text-gray-700">Grace Hoppers</span>
            <i 
              class="pi pi-chevron-down text-gray-300 w-4 h-4 inline-block transition-transform"
              :class="{ 'rotate-180': showUserDropdown }"
            ></i>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="showUserDropdown"
            class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div class="py-1">
              <button
                v-for="option in userMenuOptions"
                :key="option.action"
                @click="handleUserMenuAction(option.action)"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                :class="{ 'text-red-600 hover:bg-red-50': option.action === 'signout' }"
              >
                <i :class="option.icon" class="w-4 h-4"></i>
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pt-4">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Searchbar from '@/components/Searchbar.vue'

// State management
const showUserDropdown = ref(false)
const notificationCount = ref(3) // Example notification count
const isRefreshing = ref(false)

// User dropdown options
const userMenuOptions = [
  { label: 'Profile', icon: 'pi pi-user', action: 'profile' },
  { label: 'Settings', icon: 'pi pi-cog', action: 'settings' },
  { label: 'Help', icon: 'pi pi-question-circle', action: 'help' },
  { label: 'Sign Out', icon: 'pi pi-sign-out', action: 'signout' }
]

// Handle search from header
const handleHeaderSearch = (query: string) => {
  console.log('🔍 Header search:', query)
  // You can emit this to parent or handle globally
}

// Handle refresh
const handleRefresh = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  console.log('🔄 Refreshing data...')
  
  try {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically refresh the current page data
    // For now, we'll just reload the current route
    window.location.reload()
  } catch (error) {
    console.error('Failed to refresh:', error)
  } finally {
    isRefreshing.value = false
  }
}

// Handle notifications
const handleNotifications = () => {
  console.log('🔔 Opening notifications')
  // You could open a notifications panel or navigate to notifications page
  alert(`You have ${notificationCount.value} new notifications`)
}

// Handle user menu actions
const handleUserMenuAction = (action: string) => {
  showUserDropdown.value = false
  
  switch (action) {
    case 'profile':
      console.log('👤 Opening profile')
      // Navigate to profile page or open profile modal
      break
    case 'settings':
      console.log('⚙️ Opening settings')
      // Navigate to settings page
      break
    case 'help':
      console.log('❓ Opening help')
      // Open help documentation or support
      break
    case 'signout':
      console.log('🚪 Signing out')
      // Handle sign out logic
      if (confirm('Are you sure you want to sign out?')) {
        // Clear auth tokens, redirect to login, etc.
        alert('Signed out successfully')
      }
      break
    default:
      console.log('Unknown action:', action)
  }
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showUserDropdown.value = false
}

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-dropdown-container')) {
      closeDropdowns()
    }
  })
})
</script>