<template>
  <div class="h-full bg-white overflow-auto">
    <div class="overflow-x-auto rounded-lg outline outline-1 outline-gray-200 outline-offset-[-1px]">
      <div class="table w-full">
        <div class="table-header-group bg-gray-50 text-xs font-medium text-gray-700 border-b border-gray-200">
          <div class="table-row">
            <div class="table-cell px-4 py-3 border-r border-gray-200">
              <input type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
              <span class="ml-2 font-bold">Booking ID</span>
            </div>
            <div class="table-cell px-3 py-3 text-center font-bold">Room</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Guest Name</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Check-In</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Check-Out</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Orders</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Amount</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Balance</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Status</div>
            <div class="table-cell px-3 py-3 text-center font-bold">Self Check In/Out</div>
          </div>
        </div>

        <div v-if="loading" class="table-row-group text-center text-gray-500">
          <div class="table-row">
            <div class="table-cell py-12" colspan="10">
              <div class="flex flex-col items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Loading reservations...</h3>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="table-row-group text-center text-red-500">
          <div class="table-row">
            <div class="table-cell py-12" colspan="10">
              <div class="flex flex-col items-center justify-center">
                <i class="i-lucide-alert-circle w-12 h-12 mb-4 text-red-400"></i>
                <h3 class="text-lg font-medium text-red-900 mb-2">Error loading reservations</h3>
                <p class="text-sm text-center max-w-sm mb-4">{{ error }}</p>
                <button @click="loadReservations()"
                  class="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-full transition-colors">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <tbody v-else-if="filteredReservations.length === 0" class="text-gray-500">
          <tr>
            <td colspan="10" class="py-12 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="i-lucide-search-x w-12 h-12 mb-4 text-gray-400"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                <p class="text-sm text-center max-w-sm">
                  No reservations match your current search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            </td>
          </tr>
        </tbody>

        <div v-else class="table-row-group text-xs">
          <div v-for="reservation in paginatedReservations" :key="reservation.id" class="table-row h-12 cursor-pointer">

            <div
              class="table-cell px-4 py-3 outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <input type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded mr-3 focus:ring-green-500"
                @change="handleReservationSelect(reservation.id, ($event.target as HTMLInputElement).checked)" />
              <span class="text-gray-800 font-medium cursor-pointer hover:text-green-600 transition-colors truncate"
                @click="viewReservationDetails(reservation)">
                {{ reservation.id }}
              </span>
            </div>

            <div
              class="table-cell px-3 py-3 text-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="text-gray-700 font-medium">{{ reservation.room }}</span>
            </div>

            <div
              class="table-cell px-3 py-3 text-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="text-gray-800 truncate">{{ reservation.guest }}</span>
            </div>

            <div
              class="table-cell px-3 py-3 text-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="text-gray-600">{{ formatDate(reservation.checkIn) }}</span>
            </div>

            <div
              class="table-cell px-3 py-3 text-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="text-gray-600">{{ formatDate(reservation.checkOut) }}</span>
            </div>

            <div
              class="table-cell px-3 py-3 text-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="text-gray-700 font-medium">{{ getOrderCount(reservation) }}</span>
            </div>

            <div
              class="table-cell px-3 py-3 text-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="text-gray-800 font-medium">${{ getAmount(reservation) }}</span>
            </div>

            <div
              class="table-cell px-3 py-3 text-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="font-medium" :class="{
                'text-red-600': getBalance(reservation) < 0,
                'text-green-600': getBalance(reservation) > 0,
                'text-gray-800': getBalance(reservation) === 0
              }">
                {{ getBalance(reservation) >= 0 ? '$' : '-$' }}{{ Math.abs(getBalance(reservation)) }}
              </span>
            </div>

            <div
              class="table-cell px-3 py-3 outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <span class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                :class="getStatusBadgeClasses(reservation.status)">
                {{ getStatusText(reservation.status) }}
              </span>
            </div>

            <div
              class="table-cell px-3 py-3 outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors items-center align-middle">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-3">
                  <i v-if="reservation.status !== 'checkedIn'" @click="handleCheckIn(reservation)"
                    class="i-lucide-log-in w-4 h-4 text-green-600 cursor-pointer transition-colors"
                    :title="'Check in guest'"></i>
                  <i v-else class="i-lucide-check-circle w-4 h-4 text-green-600" :title="'Guest checked in'"></i>

                  <i v-if="reservation.status !== 'cancelled'" @click="handleCheckOut(reservation)"
                    class="i-lucide-log-out w-4 h-4 text-red-600 cursor-pointer transition-colors"
                    :title="'Check out guest'"></i>
                  <i v-else class="i-lucide-x-circle w-4 h-4 text-red-600" :title="'Guest checked out'"></i>
                </div>
                <i @click="showReservationMenu(reservation, $event)"
                  class="i-lucide-more-horizontal w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                  :title="'More options'"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--For pagionation lol-->
    <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="text-xs text-gray-600">
        Showing {{ paginationStart }} - {{ paginationEnd }} of {{ filteredReservations.length }} reservations
      </div>
      <div class="flex items-center gap-2">
        <i @click="previousPage" class="i-lucide-chevron-left w-4 h-4 text-gray-400 transition-colors" :class="{
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

        <i @click="nextPage" class="i-lucide-chevron-right w-4 h-4 text-gray-400 transition-colors" :class="{
          'cursor-pointer hover:text-gray-600': currentPage < totalPages,
          'opacity-50 cursor-not-allowed': currentPage >= totalPages
        }"></i>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useHotelStore } from '../../stores/hotelStore'
import { useDateUtils } from '../../composables/useDateUtils'
import { useReservations } from '../../composables/useReservations'
import { useStatusColors } from '../../composables/useStatusColors'
import type { Props } from '../../types/hotel'

const props = defineProps<Props>()

const hotelStore = useHotelStore()
const { formatDate } = useDateUtils()
const { 
  loading, 
  error, 
  filterReservations, 
  loadReservations 
} = useReservations()
const { getStatusBadgeClasses, getStatusText } = useStatusColors()
const currentPage = ref(1)
const itemsPerPage = 25

const filteredReservations = computed(() => {
  const filters = {
    searchQuery: props.searchQuery,
    ...props.selectedFilters
  }
  return filterReservations(filters)
})

watch(
  () => [props.searchQuery, props.selectedFilters],
  () => {
  },
  { deep: true }
)

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

const getOrderCount = (reservation: any) => {
  return reservation.orders || 0
}

const getAmount = (reservation: any) => {
  return reservation.amount ? reservation.amount.toFixed(2) : '0.00'
}

const getBalance = (reservation: any) => {
  return reservation.balance || 0
}


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
}

const handleCheckIn = (reservation: any) => {
  console.log('Check in guest:', reservation.guest)
}

const handleCheckOut = (reservation: any) => {
  console.log('Check out guest:', reservation.guest)
}

const showReservationMenu = (reservation: any, event: MouseEvent) => {
  console.log('Show menu for:', reservation.guest)
}

onMounted(() => {
  hotelStore.initialize()
})
</script>
