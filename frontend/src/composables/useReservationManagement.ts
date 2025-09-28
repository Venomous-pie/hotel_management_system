/**
 * Reservation management composable
 * Handles reservation data, filtering, availability logic, and reservation spans
 */

import { computed, type Ref } from 'vue'
import type { Reservation } from '@/types/hotel'
import { 
  findReservationForRoomAndDate, 
  isRoomAvailableOnDate, 
  getAvailableRoomCount 
} from '@/utils/reservations'
import { debugReservationSpanPositioning, normalizeDateString, validateReservationVisibility } from '@/utils/gantt'

export const useReservationManagement = (
  reservations: Ref<Reservation[]>,
  searchQuery: Ref<string>,
  reservationFilter: Ref<string>,
  bookingFilter: Ref<string>
) => {
  // ============================================================================
  // FILTERING LOGIC
  // ============================================================================

  /**
   * Filter reservations by status
   */
  const filterReservationsByStatus = (
    reservationList: Reservation[], 
    statusFilter: string
  ): Reservation[] => {
    if (statusFilter === 'All Reservations') {
      return reservationList
    }

    const statusMap: Record<string, string> = {
      'Confirmed': 'confirmed',
      'Pending': 'pending',
      'Checked In': 'checkedIn',
      'Cancelled': 'cancelled'
    }

    const targetStatus = statusMap[statusFilter]
    if (!targetStatus) {
      return reservationList
    }

    return reservationList.filter(res => res.status === targetStatus)
  }

  /**
   * Filter reservations by booking source
   */
  const filterReservationsBySource = (
    reservationList: Reservation[], 
    sourceFilter: string
  ): Reservation[] => {
    if (sourceFilter === 'All Booking') {
      return reservationList
    }

    const sourceMap: Record<string, string> = {
      'Direct': 'direct',
      'Booking.com': 'booking.com',
      'Expedia': 'expedia',
      'Airbnb': 'airbnb'
    }

    const targetSource = sourceMap[sourceFilter] || sourceFilter.toLowerCase()
    
    return reservationList.filter(res =>
      (res.source || '').toLowerCase().includes(targetSource)
    )
  }

  /**
   * Search reservations by guest name, booking ID, or room number
   */
  const searchReservations = (
    reservationList: Reservation[], 
    query: string
  ): Reservation[] => {
    if (!query || !query.trim()) {
      return reservationList
    }

    const normalizedQuery = query.toLowerCase().trim()

    return reservationList.filter(reservation => {
      const guestName = (reservation.guest || reservation.guestName || '').toLowerCase()
      const bookingId = (reservation.id || reservation.bookingNumber || '').toString().toLowerCase()
      const roomNumber = (reservation.room || reservation.roomNumber || '').toString().toLowerCase()

      return guestName.includes(normalizedQuery) || 
             bookingId.includes(normalizedQuery) || 
             roomNumber.includes(normalizedQuery)
    })
  }

  /**
   * Apply all filters to reservations
   */
  const filteredReservations = computed(() => {
    let filtered = reservations.value

    // Filter by reservation status
    if (reservationFilter.value !== 'All Reservations') {
      filtered = filterReservationsByStatus(filtered, reservationFilter.value)
    }

    // Filter by booking source
    if (bookingFilter.value !== 'All Booking') {
      filtered = filterReservationsBySource(filtered, bookingFilter.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      filtered = searchReservations(filtered, searchQuery.value)
    }

    return filtered
  })

  // ============================================================================
  // AVAILABILITY LOGIC
  // ============================================================================

  /**
   * Get reservation for specific room and date
   */
  const getReservation = (roomNumber: string, date: string): Reservation | undefined => {
    return findReservationForRoomAndDate(filteredReservations.value, roomNumber, date)
  }

  /**
   * Check if room is available on a specific date
   */
  const isRoomAvailable = (roomNumber: string, date: string): boolean => {
    return isRoomAvailableOnDate(filteredReservations.value, roomNumber, date)
  }

  /**
   * Get available room count for a category on a specific date
   */
  const getAvailableRoomCountForDate = (category: any, date: string): number => {
    return getAvailableRoomCount(category.rooms, filteredReservations.value, date)
  }

  /**
   * Get all reservations for a specific room
   */
  const getRoomReservations = (roomNumber: string): Reservation[] => {
    return filteredReservations.value.filter(res => {
      const resRoomNumber = (res.room || res.roomNumber || '').toString()
      return resRoomNumber === roomNumber.toString()
    })
  }

  /**
   * Check if a reservation overlaps with a date range
   */
  const reservationOverlapsDateRange = (
    reservation: Reservation, 
    startDate: string, 
    endDate: string
  ): boolean => {
    const checkInRaw = reservation.checkIn || reservation.checkInDate || ''
    const checkOutRaw = reservation.checkOut || reservation.checkOutDate || ''
    const checkInStr = (typeof checkInRaw === 'string' ? checkInRaw : checkInRaw.toISOString()).split('T')[0]
    const checkOutStr = (typeof checkOutRaw === 'string' ? checkOutRaw : checkOutRaw.toISOString()).split('T')[0]
    
    // Check for overlap using string comparison
    return checkInStr <= endDate && checkOutStr >= startDate
  }

  // ============================================================================
  // RESERVATION SPANS LOGIC
  // ============================================================================

  /**
   * Generate reservation spans for a specific room
   * @param roomNumber - Room number to generate spans for
   * @param dateRange - Array of visible dates
   * @param getRoomTopPosition - Function to get room's vertical position
   * @param findDateRangeIndices - Utility function to find date indices
   * @param calculateReservationSpanStyle - Utility function for positioning
   * @returns Array of span objects with positioning and styling information
   */
  const getReservationSpans = (
    roomNumber: string,
    dateRange: Array<{ date: string }>,
    getRoomTopPosition: (roomNumber: string) => number,
    findDateRangeIndices: (dateRange: any[], checkIn: string, checkOut: string) => { startIndex: number; endIndex: number } | null,
    calculateReservationSpanStyle: (startIndex: number, endIndex: number, top: number) => any
  ) => {
    const spans: Array<{
      key: string | number,
      reservation: Reservation,
      isStart: boolean,
      isEnd: boolean,
      style: any
    }> = []

    // Note: Room positioning is now handled by the getRoomTopPosition function
    // No need for fallback logic here as it's handled in the positioning composable

    const roomReservations = getRoomReservations(roomNumber)

    for (const reservation of roomReservations) {
      const checkInRaw = reservation.checkIn || reservation.checkInDate || ''
      const checkOutRaw = reservation.checkOut || reservation.checkOutDate || ''
      
      // Handle date conversion using the robust normalization function
      const checkInStr = normalizeDateString(checkInRaw)
      const checkOutStr = normalizeDateString(checkOutRaw)
      
      // Skip if date normalization failed
      if (!checkInStr || !checkOutStr) {
        console.error('Failed to normalize reservation dates:', { checkInRaw, checkOutRaw })
        continue
      }
      
      // Validate that this reservation should be visible
      const visibility = validateReservationVisibility(checkInStr, checkOutStr, dateRange)
      if (!visibility.overlaps) {
        if (import.meta.env.DEV) {
          console.log(`⏭️ Skipping reservation (${visibility.reason}):`, visibility)
        }
        continue
      }

      // Find date range indices using utility function
      const dateIndices = findDateRangeIndices(dateRange, checkInStr, checkOutStr)

      if (dateIndices) {
        const { startIndex, endIndex } = dateIndices
        const firstVisible = dateRange[0].date.split('T')[0]
        const lastVisible = dateRange[dateRange.length - 1].date.split('T')[0]
        const top = getRoomTopPosition(roomNumber)

        // Calculate positioning using utility function
        const style = calculateReservationSpanStyle(startIndex, endIndex, top)

        // Debug positioning in development
        if (import.meta.env.DEV) {
          const guest = reservation.guest || reservation.guestName || 'Unknown Guest'
          console.log(`✅ Span created: ${guest} (Room ${roomNumber}) ${checkInStr} to ${checkOutStr} → indices ${startIndex}-${endIndex}, top: ${top}px`)
        }

        spans.push({
          key: reservation.id || reservation.bookingNumber || `${roomNumber}-${startIndex}`,
          reservation,
          isStart: checkInStr >= firstVisible,
          isEnd: checkOutStr <= lastVisible,
          style
        })
      }
    }

    return spans
  }

  // ============================================================================
  // STATISTICS & ANALYTICS
  // ============================================================================

  /**
   * Get reservation statistics
   */
  const reservationStats = computed(() => {
    const total = filteredReservations.value.length
    const byStatus = filteredReservations.value.reduce((acc, res) => {
      acc[res.status] = (acc[res.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      byStatus,
      confirmed: byStatus.confirmed || 0,
      pending: byStatus.pending || 0,
      checkedIn: byStatus.checkedIn || 0,
      cancelled: byStatus.cancelled || 0
    }
  })

  /**
   * Get reservations for a specific date range
   */
  const getReservationsInDateRange = (startDate: string, endDate: string): Reservation[] => {
    return filteredReservations.value.filter(reservation => 
      reservationOverlapsDateRange(reservation, startDate, endDate)
    )
  }

  return {
    // Filtered data
    filteredReservations,
    
    // Filtering functions
    filterReservationsByStatus,
    filterReservationsBySource,
    searchReservations,
    
    // Availability functions
    getReservation,
    isRoomAvailable,
    getAvailableRoomCountForDate,
    getRoomReservations,
    reservationOverlapsDateRange,
    
    // Span generation
    getReservationSpans,
    
    // Statistics
    reservationStats,
    getReservationsInDateRange,
  }
}
