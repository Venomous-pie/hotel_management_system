<template>
  <div class="h-full bg-white overflow-auto">
    <!-- Table Container -->
    <div class="overflow-x-auto min-w-full">
      <!-- Table Header -->
      <div class="bg-gray-50 text-xs font-medium text-gray-700 sticky top-0 border-b border-gray-200 z-10">
        <div class="grid gap-0 min-w-max w-full justify-between" style="grid-template-columns: 140px 80px 160px 120px 120px 80px 100px 100px 120px 200px;">
          <div class="px-4 py-3 flex items-center border-r border-gray-200">
            <input type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            <span class="ml-2 font-bold">Booking ID</span>
          </div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Room</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Guest Name</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Check-In</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Check-Out</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Orders</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Amount</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Balance</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Status</div>
          <div class="px-3 py-3 flex items-center justify-center font-bold">Self Check In/Out</div>
        </div>
      </div>

      <!-- Table Body -->
      <!-- Loading State -->
      <div v-if="reservationTable.loading.value" class="flex flex-col items-center justify-center py-12 text-gray-500">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Loading reservations...</h3>
      </div>

      <!-- Error State -->
      <div v-else-if="reservationTable.error.value"
        class="flex flex-col items-center justify-center py-12 text-red-500">
        <i class="i-lucide-alert-circle w-12 h-12 mb-4 text-red-400"></i>
        <h3 class="text-lg font-medium text-red-900 mb-2">Error loading reservations</h3>
        <p class="text-sm text-center max-w-sm mb-4">{{ reservationTable.error.value }}</p>
        <button @click="reservationTable.loadReservations()"
          class="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-full transition-colors">
          Try Again
        </button>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredReservations.length === 0"
        class="flex flex-col items-center justify-center py-12 text-gray-500">
        <i class="i-lucide-search-x w-12 h-12 mb-4 text-gray-400"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
        <p class="text-sm text-center max-w-sm">
          No reservations match your current search criteria. Try adjusting your filters or search terms.
        </p>
      </div>

      <div v-for="(reservation, index) in paginatedReservations" :key="reservation.id"
        class="transition-colors text-xs border-b border-gray-100">
        <div class="grid gap-0 h-16 min-w-max w-full justify-between" style="grid-template-columns: 140px 80px 160px 120px 120px 80px 100px 100px 120px 200px;">
          <!-- Booking -->
          <div class="flex items-center border-r border-gray-200 outline outline-1 outline-gray-50 w-full">
            <input type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded mr-3 focus:ring-green-500"
              @change="handleReservationSelect(reservation.id, ($event.target as HTMLInputElement).checked)" />
            <span class="text-gray-800 font-medium cursor-pointer hover:text-green-600 transition-colors truncate"
              @click="viewReservationDetails(reservation)">{{ reservation.id }}</span>
          </div>

          <!-- Room -->
          <div class="flex items-center justify-center border-r border-gray-200 outline outline-1 outline-gray-50">
            <span class="text-gray-700 font-medium">{{ reservation.room }}</span>
          </div>

          <!-- Guests -->
          <div class="flex items-center justify-center border-r border-gray-200 outline outline-1 outline-gray-50">
            <span class="text-gray-800 truncate">{{ reservation.guest }}</span>
          </div>

          <!-- Check-In -->
          <div class="px-3 flex items-center justify-center border-r border-gray-200 outline outline-1 outline-gray-50">
            <span class="text-gray-600">{{ formatDate(reservation.checkIn) }}</span>
          </div>

          <!-- Check-Out -->
          <div class="flex items-center justify-center border-r border-gray-200 outline outline-1 outline-gray-50">
            <span class="text-gray-600">{{ formatDate(reservation.checkOut) }}</span>
          </div>

          <!-- Orders -->
          <div class="flex items-center justify-center border-r border-gray-200 outline outline-1 outline-gray-50">
            <span class="text-gray-700 font-medium">{{ getOrderCount(reservation) }}</span>
          </div>

          <!-- Amount -->
          <div class="flex items-center justify-center border-r border-gray-200 outline outline-1 outline-gray-50">
            <span class="text-gray-800 font-medium">${{ getAmount(reservation) }}</span>
          </div>

          <!-- Balance -->
          <div class="flex items-center justify-center border-r border-gray-200 outline outline-1 outline-gray-50">
            <span class="font-medium" :class="{
              'text-red-600': getBalance(reservation) < 0,
              'text-green-600': getBalance(reservation) > 0,
              'text-gray-800': getBalance(reservation) === 0
            }">
              {{ getBalance(reservation) >= 0 ? '$' : '-$' }}{{ Math.abs(getBalance(reservation)) }}
            </span>
          </div>

          <!-- Status -->
          <div class="flex items-center border-r border-gray-200 outline outline-1 outline-gray-50 w-full">
            <span class="mx-2 py-1 rounded-full text-xs font-medium whitespace-nowrap" :class="getStatusBadgeClass(reservation.status)">
              {{ getStatusText(reservation.status) }}
            </span>
          </div>

          <!-- Self Check In/Out -->
          <div class="flex items-center justify-between outline outline-1 outline-gray-50 w-full">
            <div class="flex items-center gap-3">
              <i v-if="reservation.status !== 'checkedIn'" 
                @click="handleCheckIn(reservation)"
                class="i-lucide-log-in w-4 h-4 text-green-600 cursor-pointer transition-colors"
                :title="'Check in guest'"></i>
              <i v-else class="i-lucide-check-circle w-4 h-4 text-green-600 cursor-pointer" :title="'Guest checked in'"></i>

              <i v-if="reservation.status !== 'cancelled'" 
                @click="handleCheckOut(reservation)"
                class="i-lucide-log-out w-4 h-4 text-red-600 cursor-pointer transition-colors"
                :title="'Check out guest'"></i>
              <i v-else class="i-lucide-x-circle w-4 h-4 text-red-600 cursor-pointer" :title="'Guest checked out'"></i>
            </div>
            
            <i @click="showReservationMenu(reservation, $event)"
              class="i-lucide-more-horizontal w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              :title="'More options'"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="text-xs text-gray-600">
        Showing {{ paginationStart }} - {{ paginationEnd }} of {{ filteredReservations.length }} reservations
      </div>
      <div class="flex items-center gap-2">
        <i @click="previousPage" 
          class="i-lucide-chevron-left w-4 h-4 text-gray-400 transition-colors" 
          :class="{
            'cursor-pointer hover:text-gray-600': currentPage > 1,
            'opacity-50 cursor-not-allowed': currentPage <= 1
          }"></i>

        <div class="flex items-center gap-1">
          <span v-for="page in visiblePages" :key="page" @click="currentPage = page"
            class="px-3 py-2 text-xs rounded-full cursor-pointer transition-colors" :class="{
              'bg-green-600 text-white': currentPage === page,
              'hover:bg-gray-100 text-gray-700': currentPage !== page
            }">
            {{ page }}
          </span>
        </div>

        <span v-if="totalPages > 6" class="px-2 text-xs text-gray-400">...</span>

        <span v-if="totalPages > 6" @click="currentPage = totalPages"
          class="px-3 py-2 text-xs rounded-full cursor-pointer transition-colors" :class="{
            'bg-green-600 text-white': currentPage === totalPages,
            'hover:bg-gray-100 text-gray-700': currentPage !== totalPages
          }">
          {{ totalPages }}
        </span>

        <i @click="nextPage" 
          class="i-lucide-chevron-right w-4 h-4 text-gray-400 transition-colors"
          :class="{
            'cursor-pointer hover:text-gray-600': currentPage < totalPages,
            'opacity-50 cursor-not-allowed': currentPage >= totalPages
          }"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { Reservation } from '../../types/hotel'
import { useHotelStore } from '../../stores/hotelStore'
import { useDateUtils } from '../../composables/useDateUtils'
import { useReservationTable } from '../../composables/useReservationTable.ts'

interface Props {
  searchQuery: string
  selectedFilters: {
    checkIn: string
    checkOut: string
    booking: string
    guest: string
    status: string
  }
}

const props = defineProps<Props>()

// Store and composables
const hotelStore = useHotelStore()
const { formatDate } = useDateUtils()
const reservationTable = useReservationTable()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 25

// Filtered reservations using composable
const filteredReservations = computed(() => {
  const filters = {
    searchQuery: props.searchQuery,
    ...props.selectedFilters
  }
  return reservationTable.filterReservations(filters)
})

// Watch for filter changes and update reservations
watch(
  () => [props.searchQuery, props.selectedFilters],
  () => {
    // Trigger reactivity update
  },
  { deep: true }
)

// Pagination computeds
const totalPages = computed(() => Math.ceil(filteredReservations.value.length / itemsPerPage))

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredReservations.value.slice(start, end)
})

const paginationStart = computed(() => {
  return filteredReservations.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredReservations.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 6
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Helper functions
const getOrderCount = (reservation: any) => {
  return reservation.orders || 0
}

const getAmount = (reservation: any) => {
  return reservation.amount ? reservation.amount.toFixed(2) : '0.00'
}

const getBalance = (reservation: any) => {
  return reservation.balance || 0
}


// Use composable functions for status handling
const getStatusBadgeClass = (status: string) => {
  return reservationTable.getStatusBadgeClass(status)
}

const getStatusText = (status: string) => {
  return reservationTable.getStatusText(status)
}

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Reservation interaction methods
const selectedReservations = ref(new Set())

const handleReservationSelect = (reservationId: string, selected: boolean) => {
  if (selected) {
    selectedReservations.value.add(reservationId)
  } else {
    selectedReservations.value.delete(reservationId)
  }
}

const viewReservationDetails = (reservation: any) => {
  console.log('View reservation details:', reservation)
  // Here you could open a modal or navigate to a detail page
}

const handleCheckIn = (reservation: any) => {
  console.log('Check in guest:', reservation.guest)
  // Here you would update the reservation status
  // In a real app, this would make an API call
}

const handleCheckOut = (reservation: any) => {
  console.log('Check out guest:', reservation.guest)
  // Here you would update the reservation status
  // In a real app, this would make an API call
}

const showReservationMenu = (reservation: any, event: MouseEvent) => {
  console.log('Show menu for:', reservation.guest)
  // Here you could show a context menu
}

// Initialize
onMounted(() => {
  hotelStore.initialize()
})
</script>
