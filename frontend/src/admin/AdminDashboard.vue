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
            <!-- Seeder Buttons (Development Only) -->
            <div class="flex items-center gap-2">
              <button
                @click="seedReservations"
                :disabled="seederLoading"
                class="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <i v-if="seederLoading" class="pi pi-spin pi-spinner mr-1"></i>
                <i v-else class="pi pi-plus mr-1"></i>
                Seed Data
              </button>
              <button
                @click="clearReservations"
                :disabled="seederLoading"
                class="px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <i v-if="seederLoading" class="pi pi-spin pi-spinner mr-1"></i>
                <i v-else class="pi pi-trash mr-1"></i>
                Clear Data
              </button>
              <button
                @click="debugData"
                class="px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
              >
                <i class="pi pi-search mr-1"></i>
                Debug
              </button>
            </div>

            <!-- Date Range Filter -->
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700">Period:</label>
              <select 
                v-model="selectedDateRange" 
                @change="handleDateRangeChange"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option v-for="option in dateRangeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            
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

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span class="text-gray-600">Loading dashboard data...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div class="flex items-center gap-3">
            <i class="pi pi-exclamation-triangle text-red-600 text-xl"></i>
            <div>
              <h3 class="text-red-800 font-semibold">Failed to load dashboard data</h3>
              <p class="text-red-600 text-sm">{{ error }}</p>
              <button 
                @click="fetchStats" 
                class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

        <!-- Analytics Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <!-- Occupancy Rate Chart -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Occupancy Rate</h3>
                <p class="text-sm text-gray-600">Last 30 days performance</p>
              </div>
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <i class="pi pi-chart-line text-blue-600"></i>
              </div>
            </div>
            <apexchart
              type="area"
              height="300"
              :options="occupancyChartOptions"
              :series="occupancyChartSeries"
            />
          </div>

          <!-- Revenue Chart -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                <p class="text-sm text-gray-600">Monthly revenue breakdown</p>
              </div>
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <i class="pi pi-dollar text-green-600"></i>
              </div>
            </div>
            <apexchart
              type="bar"
              height="300"
              :options="revenueChartOptions"
              :series="revenueChartSeries"
            />
          </div>
        </div>

        <!-- Room Distribution & Booking Sources -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <!-- Room Type Distribution -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Room Type Distribution</h3>
                <p class="text-sm text-gray-600">Current occupancy by room type</p>
              </div>
              <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <i class="pi pi-home text-purple-600"></i>
              </div>
            </div>
            <apexchart
              type="donut"
              height="300"
              :options="roomTypeChartOptions"
              :series="roomTypeChartSeries"
            />
          </div>

          <!-- Booking Sources -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Booking Sources</h3>
                <p class="text-sm text-gray-600">Where guests book from</p>
              </div>
              <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <i class="pi pi-globe text-orange-600"></i>
              </div>
            </div>
            <apexchart
              type="pie"
              height="300"
              :options="bookingSourceChartOptions"
              :series="bookingSourceChartSeries"
            />
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
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useDashboardStats } from '../composables/useDashboardStats'

const { logout, currentUser } = useAuth()
const { 
  loading, 
  error, 
  occupancyStats, 
  bookingStats, 
  revenueStats, 
  cancellationStats,
  occupancyTrend,
  revenueTrend,
  bookingSources,
  roomPopularity,
  summaryCards,
  fetchStats: fetchDashboardStats 
} = useDashboardStats()

// Selected date range filter
const selectedDateRange = ref('this_month')
const dateRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' }
]

// Seeder functionality
const seederLoading = ref(false)

const handleLogout = () => {
  logout()
}

// Legacy stats for backward compatibility
const stats = computed(() => ({
  totalReservations: bookingStats.value?.totalBookings || 0,
  availableRooms: occupancyStats.value?.availableRooms || 0,
  totalGuests: occupancyStats.value?.occupiedRooms || 0,
  revenue: revenueStats.value?.totalRevenue || 0
}))

// Fetch dashboard stats with real API data
const fetchStats = async () => {
  await fetchDashboardStats(selectedDateRange.value)
}

// Handle date range change
const handleDateRangeChange = async () => {
  await fetchStats()
}

// Seeder functions - for development only, real fire 🔥
const seedReservations = async () => {
  console.log('🌱 Seed button clicked!')
  seederLoading.value = true
  
  try {
    console.log('📡 Calling seeder API...')
    const response = await fetch('http://localhost:3000/api/admin/seed-reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📡 Seeder API response status:', response.status)
    
    const result = await response.json()
    console.log('📡 Seeder API result:', result)
    console.log('📊 Seeder data details:', result.data)
    
    if (result.success) {
      // Show success message - you can replace with a toast notification
      alert(`✅ Seeding successful!\n\nCreated:\n- ${result.data?.guestsCreated || 0} guests\n- ${result.data?.reservationsCreated || 0} reservations\n\nOccupancy Rate: ${result.data?.occupancyRate || 0}%`)
      
      // Refresh dashboard data
      await fetchStats()
      
      // Also call debug to verify data was created
      console.log('🔍 Verifying seeded data...')
      setTimeout(async () => {
        await debugData()
      }, 1000)
    } else {
      alert(`❌ Seeding failed: ${result.error}`)
    }
  } catch (error) {
    console.error('Seeder error:', error)
    alert(`❌ Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    seederLoading.value = false
  }
}

const clearReservations = async () => {
  if (!confirm('⚠️ Are you sure you want to clear ALL reservations and guests? This cannot be undone!')) {
    return
  }
  
  seederLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/admin/clear-reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      alert('✅ All reservations and guests cleared successfully!')
      
      // Refresh dashboard data
      await fetchStats()
    } else {
      alert(`❌ Clear failed: ${result.error}`)
    }
  } catch (error) {
    console.error('Clear error:', error)
    alert(`❌ Clear failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    seederLoading.value = false
  }
}

// Debug function to check if data exists
const debugData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/debug/reservations')
    const result = await response.json()
    
    console.log('Debug data:', result)
    alert(`Debug Info:\n\nReservations: ${result.counts.totalReservations}\nGuests: ${result.counts.totalGuests}\nRooms: ${result.counts.totalRooms}\n\nSample reservations:\n${result.sampleReservations.map((r: any) => `- ${r.guest}: ${r.status} (₱${r.totalPrice})`).join('\n')}`)
  } catch (error) {
    console.error('Debug error:', error)
    alert(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Chart configurations - these are fire charts ngl 🔥
const occupancyChartOptions = ref({
  chart: {
    type: 'area',
    toolbar: { show: false },
    sparkline: { enabled: false }
  },
  colors: ['#3B82F6'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: occupancyTrend.value.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    labels: { style: { colors: '#6B7280' } }
  },
  yaxis: {
    labels: { 
      style: { colors: '#6B7280' },
      formatter: (val: number) => `${val}%`
    }
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 3
  },
  tooltip: {
    y: { formatter: (val: number) => `${val}%` }
  }
})

const occupancyChartSeries = computed(() => [{
  name: 'Occupancy Rate',
  data: occupancyTrend.value.map(item => item.occupancy_percentage || 0)
}])

const revenueChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  colors: ['#10B981'],
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '60%'
    }
  },
  xaxis: {
    categories: revenueTrend.value.map(item => item.date),
    labels: { style: { colors: '#6B7280' } }
  },
  yaxis: {
    labels: { 
      style: { colors: '#6B7280' },
      formatter: (val: number) => `$${val}k`
    }
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 3
  },
  tooltip: {
    y: { formatter: (val: number) => `$${val}k` }
  }
})

const revenueChartSeries = computed(() => [{
  name: 'Revenue',
  data: revenueTrend.value.map(item => item.revenue || 0)
}])

const roomTypeChartOptions = ref({
  chart: {
    type: 'donut'
  },
  colors: ['#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'],
  labels: roomPopularity.value.map(item => item.room_type),
  legend: {
    position: 'bottom',
    labels: { colors: '#6B7280' }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Rooms',
            color: '#374151'
          }
        }
      }
    }
  },
  tooltip: {
    y: { formatter: (val: number) => `${val} rooms` }
  }
})

const roomTypeChartSeries = computed(() => 
  roomPopularity.value.map(item => item.nights_booked)
)

const bookingSourceChartOptions = ref({
  chart: {
    type: 'pie'
  },
  colors: ['#F97316', '#3B82F6', '#10B981', '#8B5CF6'],
  labels: bookingSources.value.map(item => item.source),
  legend: {
    position: 'bottom',
    labels: { colors: '#6B7280' }
  },
  tooltip: {
    y: { formatter: (val: number) => `${val}%` }
  }
})

const bookingSourceChartSeries = computed(() => 
  bookingSources.value.map(item => item.percentage)
)

onMounted(() => {
  fetchStats()
})
</script>
