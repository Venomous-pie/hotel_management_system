<template>
  <div class="h-full bg-white">
    <div class="flex items-center justify-between px-6 pb-2">
      <h2 class="font-medium text-gray-700">Front Desk</h2>
      <div class="flex items-center gap-2">
        <Custombutton label="Add Reservation" :hover="true" @click="handleAddReservation" />
      </div>
    </div>
    <div class="px-6 py-2">
      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded h-8">
        <div @click="navigateYear(-1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-l cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-left text-gray-400" style="font-size: 12px; line-height: 1;"></i>
        </div>
        <div class="flex flex-1 h-full">
          <div v-for="(year, index) in years" :key="year" @click="selectYear(year)"
            class="flex-1 text-xs text-center transition-colors border-r border-gray-300 h-full flex items-center justify-center cursor-pointer"
            :class="{
              'bg-green-700 text-white font-medium': selectedYear === year,
              'text-gray-600 hover:bg-green-100': selectedYear !== year,
              'border-r-0': index === years.length - 1
            }">
            {{ year }}
          </div>
        </div>
        <div @click="navigateYear(1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-r cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-right text-gray-400" style="font-size: 12px; line-height: 1;"></i>
        </div>
      </div>

      <!-- Month Selector -->
      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded-b h-8">
        <div @click="navigateMonth(-1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-bl cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-left text-gray-400" style="font-size: 12px; line-height: 1;"></i>
        </div>
        <div class="flex flex-1 items-center h-full">
          <div v-for="(month, index) in months" :key="month" @click="selectMonth(index)"
            class="flex-1 text-xs text-center whitespace-nowrap transition-colors border-r border-gray-300 h-full flex items-center justify-center cursor-pointer"
            :class="{
              'bg-green-700 text-white font-medium': selectedMonth === index,
              'text-gray-600 hover:bg-green-100': selectedMonth !== index,
              'border-r-0': index === months.length - 1
            }">
            {{ month }}
          </div>
        </div>
        <div @click="navigateMonth(1)"
          class="w-8 h-8 flex items-center justify-center transition-colors outline outline-1 outline-gray-200 rounded-br cursor-pointer hover:bg-gray-100">
          <i class="pi pi-chevron-right text-gray-400" style="font-size: 12px; line-height: 1;"></i>
        </div>
      </div>
    </div>

    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <Searchbar placeholder="Search by booking number or guest" icon="pi pi-search" @search="handleSearch"
          width="20rem" />
        <div class="flex items-center gap-4">
          <!-- Clear Filters Button -->
          <button @click="clearAllFilters"
            class="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 bg-gray-50 outline outline-1 outline-gray-200 rounded-full transition-colors hover:bg-gray-100 hover:text-gray-800"
            :class="{ 'opacity-50 cursor-not-allowed': !hasActiveFilters }" :disabled="!hasActiveFilters">
            <i class="pi pi-filter-slash w-3 h-3"></i>
            Clear Filters
          </button>

          <!-- Reservation Status Filter -->
          <div class="relative">
            <div @click="showReservationDropdown = !showReservationDropdown"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 transition-colors cursor-pointer hover:bg-gray-100">
              {{ selectedReservationFilter }}
              <i class="pi pi-chevron-down absolute right-2 text-gray-300 w-4 h-4"></i>
            </div>
            <div v-if="showReservationDropdown"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
              <div v-for="option in reservationStatusOptions" :key="option"
                @click="selectedReservationFilter = option; showReservationDropdown = false"
                class="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                :class="{ 'bg-green-50 text-green-700': selectedReservationFilter === option }">
                {{ option }}
              </div>
            </div>
          </div>

          <!-- Room Type Filter -->
          <div class="relative">
            <div @click="showRoomTypeDropdown = !showRoomTypeDropdown"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 transition-colors cursor-pointer hover:bg-gray-100">
              {{ selectedRoomTypeFilter }}
              <i class="pi pi-chevron-down absolute right-2 text-gray-300 w-4 h-4"></i>
            </div>
            <div v-if="showRoomTypeDropdown"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
              <div v-for="option in roomTypeOptions" :key="option"
                @click="selectedRoomTypeFilter = option; showRoomTypeDropdown = false"
                class="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                :class="{ 'bg-green-50 text-green-700': selectedRoomTypeFilter === option }">
                {{ option }}
              </div>
            </div>
          </div>

          <!-- Booking Source Filter -->
          <div class="relative">
            <div @click="showBookingDropdown = !showBookingDropdown"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 transition-colors cursor-pointer hover:bg-gray-100">
              {{ selectedBookingFilter }}
              <i class="pi pi-chevron-down absolute right-2 text-gray-300 w-4 h-4"></i>
            </div>
            <div v-if="showBookingDropdown"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
              <div v-for="option in bookingSourceOptions" :key="option"
                @click="selectedBookingFilter = option; showBookingDropdown = false"
                class="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                :class="{ 'bg-green-50 text-green-700': selectedBookingFilter === option }">
                {{ option }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-6 py-2">
      <Ganttchart :selected-year="selectedYear" :selected-month="selectedMonth" :search-query="searchQuery"
        :reservation-filter="selectedReservationFilter" :room-type-filter="selectedRoomTypeFilter"
        :booking-filter="selectedBookingFilter" :rooms="rooms" :reservations="reservations" :loading="loading"
        :error="error" :target-date="targetDate" @update-date="handleDateUpdate" @open-reservation-modal="handleOpenReservationModal" />
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
    <AddReservationModal :is-open="showAddReservationModal" :prefilled-data="prefilledReservationData"
      @close="handleModalClose" @success="handleReservationSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Searchbar from '@/components/Searchbar.vue';
import Ganttchart from '@/components/GanttChart.vue';
import Custombutton from '@/components/Custombutton.vue';
import AddReservationModal from '@/components/AddReservationModal.vue';
import { getTodayAtMidnight } from '@/utils/date'
import { useHotelData } from '@/composables/useHotelData'

// Current date state
const currentDate = getTodayAtMidnight()
const selectedYear = ref(currentDate.getFullYear())
const selectedMonth = ref(currentDate.getMonth())
const targetDate = ref<Date | null>(null)

// Shared hotel data (composable)
const { rooms, reservations, loading, error, refreshAll } = useHotelData()

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
const prefilledReservationData = ref<{
  roomNumber?: string
  checkInDate?: string
} | null>(null)

// Success notification state
const showSuccessNotification = ref(false)
const successMessage = ref('')

// Years for navigation (16 years: current year ± 7)
const years = computed(() => {
  const current = getTodayAtMidnight().getFullYear()
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

// Data loading handled by useHotelData.refreshAll

// Navigation functions
const navigateYear = (direction: number) => {
  const currentIndex = years.value.indexOf(selectedYear.value)
  const newIndex = currentIndex + direction

  if (newIndex >= 0 && newIndex < years.value.length) {
    selectedYear.value = years.value[newIndex]
    emitDateChangeToChart()
  }
}

const navigateMonth = (direction: number) => {
  let newMonth = selectedMonth.value + direction
  let newYear = selectedYear.value

  // Handle month overflow/underflow
  if (newMonth > 11) {
    newMonth = 0
    newYear += 1
  } else if (newMonth < 0) {
    newMonth = 11
    newYear -= 1
  }

  // Check if the new year is within allowed range
  if (years.value.includes(newYear)) {
    selectedYear.value = newYear
    selectedMonth.value = newMonth
    emitDateChangeToChart()
  }
}

const selectYear = (year: number) => {
  selectedYear.value = year
  emitDateChangeToChart()
}

const selectMonth = (monthIndex: number) => {
  selectedMonth.value = monthIndex
  emitDateChangeToChart()
}

// Filter options from backend data
const roomTypeOptions = computed(() => {
  // Extract unique room types from the actual backend data
  const types = new Set(rooms.value.map(room => room.type || room.RoomType?.typeName || 'Standard'))
  const allTypes = Array.from(types).filter(type => type) // Include all types, including 'Standard'

  // Start with "All Room Types"
  const categoryFilters = ['All Room Types']

  // Add all actual room types from backend, sorted alphabetically
  categoryFilters.push(...allTypes.sort())

  return categoryFilters
})

// Dynamic reservation status options from backend data
const reservationStatusOptions = computed(() => {
  // Extract unique statuses from actual reservations
  const statuses = new Set(reservations.value.map(reservation => reservation.status))
  const allStatuses = Array.from(statuses).filter(status => status)

  // Standard reservation statuses (fallback if backend data is limited)
  const standardStatuses = ['confirmed', 'pending', 'checkedIn', 'cancelled']

  // Combine actual statuses with standard ones to ensure all options are available
  const combinedStatuses = new Set([...allStatuses, ...standardStatuses])
  const allStatusesArray = Array.from(combinedStatuses)

  // Start with "All Reservations"
  const statusOptions = ['All Reservations']

  // Add all statuses with proper capitalization
  const capitalizedStatuses = allStatusesArray.map(status => {
    // Convert backend status to display format
    switch (status.toLowerCase()) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'checkedin': return 'Checked In'
      case 'cancelled': return 'Cancelled'
      default: return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }).sort()

  statusOptions.push(...capitalizedStatuses)

  return statusOptions
})

  // Dynamic booking source options from backend data
  const bookingSourceOptions = computed(() => {
    // Extract unique sources from actual reservations
    const rawSources: string[] = reservations.value.reduce<string[]>((acc, r) => {
      const s = r.source
      if (typeof s === 'string' && s.trim().length > 0) acc.push(s)
      return acc
    }, [])

    const uniqueSources = Array.from(new Set<string>(rawSources))

    // Standard booking sources (fallback if backend data is limited)
    const standardSources = ['direct', 'booking.com', 'expedia', 'airbnb', 'kayak']

    // Combine actual sources with standard ones to ensure all options are available
    const combinedSources = new Set<string>([...uniqueSources, ...standardSources])
    const allSourcesArray: string[] = Array.from(combinedSources)

  // Start with "All Booking"
  const sourceOptions = ['All Booking']

  // Add all sources with proper capitalization
  const capitalizedSources = allSourcesArray.map((source: string): string => {
    // Convert backend source to display format
    switch (source.toLowerCase()) {
      case 'direct': return 'Direct'
      case 'booking.com': return 'Booking.com'
      case 'expedia': return 'Expedia'
      case 'airbnb': return 'Airbnb'
      case 'kayak': return 'Kayak'
      default: return source.charAt(0).toUpperCase() + source.slice(1)
    }
  }).sort()

  sourceOptions.push(...capitalizedSources)

  return sourceOptions
})

// Handle search
const handleSearch = (query: string) => {
  searchQuery.value = query
  // The Gantt chart will handle the filtering
}

// Check if any filters are active (not default values)
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' ||
    selectedReservationFilter.value !== 'All Reservations' ||
    selectedRoomTypeFilter.value !== 'All Room Types' ||
    selectedBookingFilter.value !== 'All Booking'
})

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = ''
  selectedReservationFilter.value = 'All Reservations'
  selectedRoomTypeFilter.value = 'All Room Types'
  selectedBookingFilter.value = 'All Booking'

  // Close any open dropdowns
  closeDropdowns()

  console.log('🧹 All filters cleared')
}

// Handle Add Reservation
const handleAddReservation = () => {
  prefilledReservationData.value = null // Clear any prefilled data
  showAddReservationModal.value = true
}

// Handle opening reservation modal from Gantt chart cell click
const handleOpenReservationModal = ({ roomNumber, checkInDate, isAvailable }: {
  roomNumber: string;
  checkInDate: string;
  isAvailable: boolean
}) => {
  if (isAvailable) {
    console.log(`🎯 Opening modal with prefilled data: Room ${roomNumber}, Date ${checkInDate}`)

    // Set prefilled data
    prefilledReservationData.value = {
      roomNumber,
      checkInDate
    }

    // Open the modal
    showAddReservationModal.value = true
  } else {
    console.log(`❌ Cannot open modal: Room ${roomNumber} is not available on ${checkInDate}`)
    // Optionally show a notification that the room is not available
  }
}

// Handle modal events
const handleModalClose = () => {
  showAddReservationModal.value = false
  prefilledReservationData.value = null // Clear prefilled data when modal closes
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
    await refreshAll()
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

// Handle date updates from Gantt chart
const handleDateUpdate = ({ year, month }: { year: number; month: number }) => {
  selectedYear.value = year
  selectedMonth.value = month
  emitDateChangeToChart()
}

// Emit date change to Gantt chart to reset view to 1st of month
const emitDateChangeToChart = () => {
  // Create a date object for the 1st of the selected month/year
  const firstDayOfMonth = new Date(selectedYear.value, selectedMonth.value, 1)
  
  // Set the target date to trigger Gantt chart update
  targetDate.value = firstDayOfMonth
  
  console.log(`📅 Navigating to: ${firstDayOfMonth.toLocaleDateString()}`)
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showReservationDropdown.value = false
  showRoomTypeDropdown.value = false
  showBookingDropdown.value = false
}

// Load data on mount
onMounted(() => {
  refreshAll()

  // Add click outside listener
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      closeDropdowns()
    }
  })
})
</script>