<template>
  <div class="h-full bg-white overflow-auto">
    <div class="sticky top-0 bg-white border-b border-gray-200 z-20">
      <div class="flex items-center justify-between px-4 py-2">
        <div class="flex items-center gap-4">
          <i class="i-lucide-chevron-left text-gray-300 w-3 h-3 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            @click="hotelStore.navigateWeek(-1)"></i>

          <div class="text-sm font-medium text-gray-700">
            {{ formatDateRange(hotelStore.dateRange[0].full, hotelStore.dateRange[hotelStore.dateRange.length - 1].full)
            }}
          </div>

          <i class="i-lucide-chevron-right text-gray-300 w-3 h-3 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            @click="hotelStore.navigateWeek(1)"></i>

        </div>
        <div class="flex items-center gap-4">
          <div class="text-xs text-gray-500">
            Showing: {{ props.selectedYear }} {{ props.selectedMonth }}
          </div>
          <div class="text-xs text-gray-500">
            Today: {{ formatDate(new Date().toISOString().split('T')[0]) }}
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{{ weeklyStats.available }} Available</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{{ weeklyStats.occupied }} Occupied</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{{ weeklyStats.reservations }} Reservations</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="min-w-full bg-white outline outline-1 outline-gray-200 outline-offset-[-1px] rounded-lg">
      <div v-if="filteredRoomCategories.length === 0"
        class="flex flex-col items-center justify-center py-12 text-gray-500">
        <i class="i-lucide-search-x w-12 h-12 mb-4 text-gray-400"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
        <p class="text-sm text-center max-w-sm">
          No rooms match your current search criteria. Try adjusting your filters or search terms.
        </p>
      </div>

      <table v-else class="min-w-full bg-white border-collapse">
        <thead class="sticky top-0 z-10">
          <tr>
            <th class="outline outline-1 outline-gray-200 outline-offset-[-1px] bg-gray-50 px-4 py-3 text-left text-sm font-bold text-gray-700 w-40 rounded-tl-lg">
              Rooms
            </th>
            <th v-for="date in hotelStore.dateRange" :key="date.full"
              class="outline outline-1 outline-gray-50 px-2 py-3 text-center text-xs font-bold w-24 hover:bg-gray-100 transition-colors cursor-pointer">
              <div class="text-xs font-bold text-gray-700">{{ date.day }}</div>
              <div class="text-xs text-gray-500">{{ date.date }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="category in filteredRoomCategories" :key="category.name">
            <RoomCategoryHeader :category="category" :dateRange="hotelStore.dateRange"
              :filteredCategories="filteredRoomCategories" :filteredReservations="filteredReservations"
              @toggle-category="hotelStore.toggleCategory" />

            <template v-if="category.expanded">
              <RoomRow v-for="room in category.rooms" :key="room.number || room.id" :room="room"
                :dateRange="hotelStore.dateRange" :reservations="filteredReservations"
                @open-reservation="hotelStore.openReservationModal" @create-reservation="handleCreateReservation" />
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <ReservationModal :showModal="hotelStore.showReservationModal" :reservation="hotelStore.selectedReservation"
      @close-modal="hotelStore.closeReservationModal" />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import type { FrontdeskFilters } from '../../types/hotel'
import { useHotelStore } from '../../stores/hotelStore'
import { useDateUtils } from '../../composables/useDateUtils'
import { useReservations } from '../../composables/useReservations'
import RoomCategoryHeader from './RoomCategoryHeader.vue'
import RoomRow from './RoomRow.vue'
import ReservationModal from './ReservationModal.vue'

const props = defineProps<FrontdeskFilters>()

const hotelStore = useHotelStore()
const { isToday, isWeekend, formatDate, formatDateRange } = useDateUtils()
const { createReservation } = useReservations()

const filters = computed((): FrontdeskFilters => ({
  searchQuery: props.searchQuery,
  bookingSearchQuery: props.bookingSearchQuery,
  selectedYear: props.selectedYear,
  selectedMonth: props.selectedMonth,
  selectedReservationType: props.selectedReservationType,
  selectedRoomType: props.selectedRoomType,
  selectedBookingOption: props.selectedBookingOption
}))

const filteredRoomCategories = computed(() => hotelStore.getFilteredRoomCategories(filters.value).value)
const filteredReservations = computed(() => hotelStore.getFilteredReservations(filters.value).value)

const weeklyStats = computed(() => hotelStore.getWeeklyStats(filteredRoomCategories.value, filteredReservations.value).value)

onMounted(() => {
  hotelStore.initialize()
  hotelStore.setWeekFromMonthYear(
    props.selectedYear,
    props.selectedMonth,
    filteredReservations.value
  )
})

watch([() => props.selectedYear, () => props.selectedMonth], () => {
  hotelStore.setWeekFromMonthYear(
    props.selectedYear,
    props.selectedMonth,
    filteredReservations.value
  )
})

watch(
  () => filters.value,
  () => { },
  { deep: true }
)

const handleCreateReservation = (roomNumber: string, date: string) => {
  createReservation(roomNumber, date, filteredRoomCategories.value)
}
</script>
