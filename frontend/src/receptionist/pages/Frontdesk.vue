<template>
  <div class="h-full bg-white">
    <div class="flex items-center justify-between px-6 pb-2">
      <h2 class="font-medium text-gray-700">Front Desk</h2>
      <div class="flex items-center gap-2">
        <Custombutton label="Add Reservation" :hover="true" @click="handleAddReservation"/>
      </div>  
    </div>
    <div class="px-6 py-2">
      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded h-8">
        <div
          @click="navigateYear(-1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-l cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-left text-gray-400 w-3 h-3"></i>
        </div>
        <div class="flex flex-1 h-full">
          <div
            v-for="(year, index) in years"
            :key="year"
            @click="selectYear(year)"
            class="flex-1 text-xs text-center transition-colors border-r border-gray-300 h-full flex items-center justify-center cursor-pointer"
            :class="{
              'bg-green-700 text-white font-medium': selectedYear === year,
              'text-gray-600 hover:bg-green-100': selectedYear !== year,
              'border-r-0': index === years.length - 1
            }">
            {{ year }}
          </div>
        </div>
        <div
          @click="navigateYear(1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-r cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-right text-gray-400 w-3 h-3"></i>
        </div>
      </div>

      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded-b h-8">
        <div
          @click="navigateMonth(-1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-bl cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-left text-gray-400 w-3 h-3"></i>
        </div>
        <div class="flex flex-1 items-center h-full">
          <div
            v-for="(month, index) in months"
            :key="month"
            @click="selectMonth(index)"
            class="flex-1 text-xs text-center whitespace-nowrap transition-colors border-r border-gray-300 h-full flex items-center justify-center cursor-pointer"
            :class="{
              'bg-green-700 text-white font-medium': selectedMonth === index,
              'text-gray-600 hover:bg-green-100': selectedMonth !== index,
              'border-r-0': index === months.length - 1
            }">
            {{ month }}
          </div>
        </div>
        <div
          @click="navigateMonth(1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-br cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-right text-gray-400 w-3 h-3"></i>
        </div>
      </div>
    </div>

    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <Searchbar 
          placeholder="Search by booking number or guest" 
          icon="pi pi-search"
          @search="handleSearch"
          width="30rem"
        />
        <div class="flex items-center gap-4">
          <!-- Reservation Status Filter -->
          <div class="relative">
            <div
              @click="showReservationDropdown = !showReservationDropdown"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 transition-colors cursor-pointer hover:bg-gray-100">
              {{ selectedReservationFilter }}
              <i class="pi pi-chevron-down absolute right-2 text-gray-300 w-4 h-4"></i>
            </div>
            <div v-if="showReservationDropdown" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
              <div 
                v-for="option in reservationStatusOptions" 
                :key="option"
                @click="selectedReservationFilter = option; showReservationDropdown = false"
                class="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                :class="{ 'bg-green-50 text-green-700': selectedReservationFilter === option }"
              >
                {{ option }}
              </div>
            </div>
          </div>

          <!-- Room Type Filter -->
          <div class="relative">
            <div
              @click="showRoomTypeDropdown = !showRoomTypeDropdown"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 transition-colors cursor-pointer hover:bg-gray-100">
              {{ selectedRoomTypeFilter }}
              <i class="pi pi-chevron-down absolute right-2 text-gray-300 w-4 h-4"></i>
            </div>
            <div v-if="showRoomTypeDropdown" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
              <div 
                v-for="option in roomTypeOptions" 
                :key="option"
                @click="selectedRoomTypeFilter = option; showRoomTypeDropdown = false"
                class="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                :class="{ 'bg-green-50 text-green-700': selectedRoomTypeFilter === option }"
              >
                {{ option }}
              </div>
            </div>
          </div>

          <!-- Booking Source Filter -->
          <div class="relative">
            <div
              @click="showBookingDropdown = !showBookingDropdown"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 transition-colors cursor-pointer hover:bg-gray-100">
              {{ selectedBookingFilter }}
              <i class="pi pi-chevron-down absolute right-2 text-gray-300 w-4 h-4"></i>
            </div>
            <div v-if="showBookingDropdown" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
              <div 
                v-for="option in bookingSourceOptions" 
                :key="option"
                @click="selectedBookingFilter = option; showBookingDropdown = false"
                class="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                :class="{ 'bg-green-50 text-green-700': selectedBookingFilter === option }"
              >
                {{ option }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-6 py-2">
      <Ganttchart 
        :selected-year="selectedYear"
        :selected-month="selectedMonth"
        :search-query="searchQuery"
        :reservation-filter="selectedReservationFilter"
        :room-type-filter="selectedRoomTypeFilter"
        :booking-filter="selectedBookingFilter"
        :rooms="rooms"
        :reservations="reservations"
        :loading="loading"
        :error="error"
        @update-date="handleDateUpdate"
      />
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccessNotification" 
         class="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <i class="pi pi-check-circle text-green-600 w-5 h-5"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button @click="showSuccessNotification = false" 
                  class="text-green-400 hover:text-green-600 transition-colors">
            <i class="pi pi-times w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Reservation Modal -->
    <AddReservationModal
      :is-open="showAddReservationModal"
      @close="handleModalClose"
      @success="handleReservationSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Searchbar from '@/components/Searchbar.vue';
import Ganttchart from '@/components/Ganttchart.vue';
import Custombutton from '@/components/Custombutton.vue';
import AddReservationModal from '@/components/AddReservationModal.vue';

// Current date state
const currentDate = new Date()
const selectedYear = ref(currentDate.getFullYear())
const selectedMonth = ref(currentDate.getMonth())

// Backend data
const rooms = ref<any[]>([])
const reservations = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Search and filters
const searchQuery = ref('')
const selectedReservationFilter = ref('All Reservations')
const selectedRoomTypeFilter = ref('All Room Types')
const selectedBookingFilter = ref('All Booking')

// Dropdown states
const showReservationDropdown = ref(false)
const showRoomTypeDropdown = ref(false)
const showBookingDropdown = ref(false)

// Modal state
const showAddReservationModal = ref(false)

// Success notification state
const showSuccessNotification = ref(false)
const successMessage = ref('')

// Years for navigation (16 years: current year ± 7)
const years = computed(() => {
  const current = new Date().getFullYear()
  const yearList = []
  for (let i = -7; i <= 8; i++) {
    yearList.push(current + i)
  }
  return yearList
})

// Months
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

// Load data from backend
const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const [roomsResponse, reservationsResponse] = await Promise.all([
      fetch('http://localhost:3000/api/rooms'),
      fetch('http://localhost:3000/api/reservations')
    ])
    
    if (!roomsResponse.ok || !reservationsResponse.ok) {
      throw new Error('Failed to load data')
    }
    
    rooms.value = await roomsResponse.json()
    reservations.value = await reservationsResponse.json()
    
    console.log('Loaded data:', { rooms: rooms.value.length, reservations: reservations.value.length })
  } catch (err) {
    error.value = 'Failed to load hotel data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Navigation functions
const navigateYear = (direction: number) => {
  const newYear = selectedYear.value + direction
  if (years.value.includes(newYear)) {
    selectedYear.value = newYear
  }
}

const navigateMonth = (direction: number) => {
  const newMonth = selectedMonth.value + direction
  if (newMonth >= 0 && newMonth <= 11) {
    selectedMonth.value = newMonth
  }
}

const selectYear = (year: number) => {
  selectedYear.value = year
}

const selectMonth = (monthIndex: number) => {
  selectedMonth.value = monthIndex
}

// Filter options from backend data
const roomTypeOptions = computed(() => {
  const types = new Set(rooms.value.map(room => room.RoomType?.typeName || 'Standard'))
  const allTypes = Array.from(types)
  
  // Add broader category filters
  const categoryFilters = ['All Room Types']
  
  // Add broad categories if specific types exist
  if (allTypes.some(type => type.toLowerCase().includes('standard'))) {
    categoryFilters.push('Standard')
  }
  if (allTypes.some(type => type.toLowerCase().includes('deluxe'))) {
    categoryFilters.push('Deluxe')
  }
  if (allTypes.some(type => type.toLowerCase().includes('suite'))) {
    categoryFilters.push('Suite')
  }
  
  // Add all specific room types
  categoryFilters.push(...allTypes.sort())
  
  return categoryFilters
})

const reservationStatusOptions = [
  'All Reservations',
  'Confirmed',
  'Pending', 
  'Checked In',
  'Cancelled'
]

const bookingSourceOptions = [
  'All Booking',
  'Direct',
  'Booking.com',
  'Expedia',
  'Airbnb'
]

// Handle search
const handleSearch = (query: string) => {
  searchQuery.value = query
  // The Gantt chart will handle the filtering
}

// Handle Add Reservation
const handleAddReservation = () => {
  showAddReservationModal.value = true
}

// Handle modal events
const handleModalClose = () => {
  showAddReservationModal.value = false
}

const handleReservationSuccess = async (reservation: any) => {
  console.log('Reservation created successfully:', reservation)
  
  // Show success notification
  successMessage.value = `Reservation created successfully for ${reservation.Guest?.firstName || 'guest'} in room ${reservation.roomNumber}`
  showSuccessNotification.value = true
  
  // Show loading state while refreshing data
  loading.value = true
  
  try {
    // Refresh data to show the new reservation
    await loadData()
    console.log('Frontdesk data refreshed after new reservation')
  } catch (error) {
    console.error('Failed to refresh data after reservation:', error)
    // Still close modal even if refresh fails
  } finally {
    loading.value = false
  }
  
  // Close modal after successful refresh
  showAddReservationModal.value = false
  
  // Hide success notification after 3 seconds
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 3000)
}

// Handle date update from Gantt chart
const handleDateUpdate = ({ year, month }: { year: number; month: number }) => {
  selectedYear.value = year
  selectedMonth.value = month
  console.log(`Date updated to: ${year}-${month + 1}`)
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showReservationDropdown.value = false
  showRoomTypeDropdown.value = false
  showBookingDropdown.value = false
}

// Load data on mount
onMounted(() => {
  loadData()
  
  // Add click outside listener
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      closeDropdowns()
    }
  })
})
</script>