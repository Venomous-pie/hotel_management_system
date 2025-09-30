import { ref, computed } from 'vue'

export const useFrontdeskFilters = () => {
  // Filters
  const searchQuery = ref('')
  const selectedReservationFilter = ref('All Reservations')
  const selectedRoomTypeFilter = ref('All Room Types')
  const selectedBookingFilter = ref('All Booking')

  // Dropdown states
  const showReservationDropdown = ref(false)
  const showRoomTypeDropdown = ref(false)
  const showBookingDropdown = ref(false)

  const hasActiveFilters = computed(() => {
    return searchQuery.value !== '' ||
      selectedReservationFilter.value !== 'All Reservations' ||
      selectedRoomTypeFilter.value !== 'All Room Types' ||
      selectedBookingFilter.value !== 'All Booking'
  })

  const clearAllFilters = () => {
    searchQuery.value = ''
    selectedReservationFilter.value = 'All Reservations'
    selectedRoomTypeFilter.value = 'All Room Types'
    selectedBookingFilter.value = 'All Booking'
    closeDropdowns()
  }

  const toggleReservationDropdown = () => {
    showReservationDropdown.value = !showReservationDropdown.value
  }

  const toggleRoomTypeDropdown = () => {
    showRoomTypeDropdown.value = !showRoomTypeDropdown.value
  }

  const toggleBookingDropdown = () => {
    showBookingDropdown.value = !showBookingDropdown.value
  }

  const closeDropdowns = () => {
    showReservationDropdown.value = false
    showRoomTypeDropdown.value = false
    showBookingDropdown.value = false
  }

  return {
    // state
    searchQuery,
    selectedReservationFilter,
    selectedRoomTypeFilter,
    selectedBookingFilter,
    showReservationDropdown,
    showRoomTypeDropdown,
    showBookingDropdown,
    hasActiveFilters,
    // actions
    clearAllFilters,
    toggleReservationDropdown,
    toggleRoomTypeDropdown,
    toggleBookingDropdown,
    closeDropdowns,
  }
}
