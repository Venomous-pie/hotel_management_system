<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <i class="pi pi-chart-line text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
              <p class="text-sm text-gray-600">Hotel Management Overview</p>
            </div>
          </div>
          
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <i class="pi pi-user text-white text-sm"></i>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
                <p class="text-xs text-gray-600 capitalize">{{ currentUser?.role }} • {{ currentUser?.username }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <i class="pi pi-sign-out text-sm"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Welcome Section -->
        <div class="mb-8">
          <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-3xl font-bold mb-2">Welcome back, {{ currentUser?.firstName }}! 👋</h2>
                <p class="text-green-100 text-lg">Here's what's happening at Grand Resort today</p>
              </div>
              <div class="hidden md:block">
                <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <i class="pi pi-chart-bar text-3xl text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Reservations</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalReservations }}</p>
                <p class="text-xs text-green-600 mt-1 font-medium">+12% from last month</p>
              </div>
              <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <i class="pi pi-calendar-plus text-2xl text-blue-600"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Available Rooms</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.availableRooms }}</p>
                <p class="text-xs text-green-600 mt-1 font-medium">Ready for guests</p>
              </div>
              <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <i class="pi pi-home text-2xl text-green-600"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Guests</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalGuests }}</p>
                <p class="text-xs text-orange-600 mt-1 font-medium">Currently checked in</p>
              </div>
              <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                <i class="pi pi-users text-2xl text-orange-600"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Revenue</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">${{ stats.revenue.toLocaleString() }}</p>
                <p class="text-xs text-purple-600 mt-1 font-medium">+8% from last month</p>
              </div>
              <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <i class="pi pi-dollar text-2xl text-purple-600"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <i class="pi pi-bolt text-green-600 text-lg"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p class="text-sm text-gray-600">Frequently used admin functions</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <router-link to="/admin/users" class="group p-6 border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left block">
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                    <i class="pi pi-users text-2xl text-blue-600"></i>
                  </div>
                  <p class="font-bold text-gray-900 mb-2">Manage Users</p>
                  <p class="text-sm text-gray-600 leading-relaxed">Staff accounts, roles & permissions</p>
                </div>
              </router-link>
              
              <button class="group p-6 border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left">
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 bg-green-100 group-hover:bg-green-200 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                    <i class="pi pi-plus text-2xl text-green-600"></i>
                  </div>
                  <p class="font-bold text-gray-900 mb-2">Add Room</p>
                  <p class="text-sm text-gray-600 leading-relaxed">Create new room inventory</p>
                </div>
              </button>

              <button class="group p-6 border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left">
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 bg-orange-100 group-hover:bg-orange-200 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                    <i class="pi pi-chart-bar text-2xl text-orange-600"></i>
                  </div>
                  <p class="font-bold text-gray-900 mb-2">View Reports</p>
                  <p class="text-sm text-gray-600 leading-relaxed">Analytics & business insights</p>
                </div>
              </button>

              <button class="group p-6 border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left">
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 bg-purple-100 group-hover:bg-purple-200 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                    <i class="pi pi-cog text-2xl text-purple-600"></i>
                  </div>
                  <p class="font-bold text-gray-900 mb-2">Settings</p>
                  <p class="text-sm text-gray-600 leading-relaxed">System configuration & preferences</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div class="px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i class="pi pi-clock text-blue-600 text-lg"></i>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <p class="text-sm text-gray-600">Latest system events and updates</p>
                </div>
              </div>
              <button class="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors">
                View All
              </button>
            </div>
          </div>
          <div class="p-8">
            <div class="space-y-4">
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-user-plus text-green-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">New user account created</p>
                  <p class="text-xs text-gray-600">John Doe added as Receptionist • 2 hours ago</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-calendar text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">Reservation system updated</p>
                  <p class="text-xs text-gray-600">New booking policies applied • 4 hours ago</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-shield text-orange-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">Security settings updated</p>
                  <p class="text-xs text-gray-600">Password policy strengthened • 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { logout, currentUser } = useAuth()

const stats = ref({
  totalReservations: 0,
  availableRooms: 0,
  totalGuests: 0,
  revenue: 0
})

const handleLogout = () => {
  logout()
}

// Fetch dashboard stats - this is where the magic happens fr 🔥
const fetchStats = async () => {
  try {
    // Mock data - replace with actual API calls when backend is ready
    stats.value = {
      totalReservations: 156,
      availableRooms: 24,
      totalGuests: 89,
      revenue: 45280
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    // Handle error gracefully - maybe show a toast notification
  }
}

onMounted(() => {
  fetchStats()
})
</script>
