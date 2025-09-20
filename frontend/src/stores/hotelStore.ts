import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { 
  RoomCategory, 
  Reservation, 
  FrontdeskFilters,
  WeeklyStats,
  DateRange 
} from '../types/hotel'
import hotelDataService from '../services/hotelDataService'

export const useHotelStore = defineStore('hotel', () => {
  // State
  const currentWeekStart = ref(new Date())
  const showReservationModal = ref(false)
  const selectedReservation = ref<Reservation | null>(null)

  // Computed properties using centralized data service
  const dateRange = computed((): DateRange[] => {
    return hotelDataService.generateDateRange(currentWeekStart.value)
  })

  const getFilteredRoomCategories = (filters: FrontdeskFilters) => {
    return computed(() => {
      return hotelDataService.getFilteredRoomCategories(filters)
    })
  }

  const getFilteredReservations = (filters: FrontdeskFilters) => {
    return computed(() => {
      return hotelDataService.getFilteredReservations(filters)
    })
  }

  const getWeeklyStats = (filteredCategories: RoomCategory[], filteredReservations: Reservation[]) => {
    return computed((): WeeklyStats => {
      return hotelDataService.getWeeklyStats(filteredCategories, filteredReservations, dateRange.value)
    })
  }

  // Actions
  const setWeekFromMonthYear = (year: number, month: string, filteredReservations: Reservation[]) => {
    currentWeekStart.value = hotelDataService.calculateWeekStart(year, month, filteredReservations)
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() + (direction * 7))
    currentWeekStart.value = newDate
  }

  const toggleCategory = (categoryName: string) => {
    hotelDataService.toggleRoomCategory(categoryName)
  }

  const openReservationModal = (reservation: Reservation) => {
    selectedReservation.value = reservation
    showReservationModal.value = true
  }

  const closeReservationModal = () => {
    showReservationModal.value = false
    selectedReservation.value = null
  }

  const initialize = async () => {
    await hotelDataService.initialize()
  }

  // Expose data service properties
  const isLoading = computed(() => hotelDataService.isLoading)
  const hasError = computed(() => hotelDataService.hasError)
  const roomCategories = computed(() => hotelDataService.roomCategories)
  const reservations = computed(() => hotelDataService.reservations)

  return {
    // State
    currentWeekStart,
    showReservationModal,
    selectedReservation,
    
    // Computed
    dateRange,
    isLoading,
    hasError,
    roomCategories,
    reservations,

    // Methods
    getFilteredRoomCategories,
    getFilteredReservations,
    getWeeklyStats,

    // Actions
    initialize,
    setWeekFromMonthYear,
    navigateWeek,
    toggleCategory,
    openReservationModal,
    closeReservationModal
  }
})