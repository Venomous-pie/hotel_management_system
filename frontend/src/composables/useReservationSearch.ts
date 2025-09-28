/**
 * Reservation search and filtering composable
 * Encapsulates search, filtering, and sorting logic for reservations
 */

import { computed, type Ref } from 'vue'
import type { Reservation } from '@/types/hotel'

export const useReservationSearch = (
  reservations: Ref<Reservation[]>,
  searchQuery: Ref<string>
) => {
  /**
   * Search reservations by guest name, booking ID, or room number
   * @param query - Search query string
   * @returns Array of matching reservations
   */
  const searchReservations = (query: string): Reservation[] => {
    if (!query || !query.trim()) {
      return reservations.value
    }

    const normalizedQuery = query.toLowerCase().trim()

    return reservations.value.filter(reservation => {
      const guestName = (reservation.guest || reservation.guestName || '').toLowerCase()
      const bookingId = (reservation.id || reservation.bookingNumber || '').toString().toLowerCase()
      const roomNumber = (reservation.room || reservation.roomNumber || '').toString().toLowerCase()

      return guestName.includes(normalizedQuery) || 
             bookingId.includes(normalizedQuery) || 
             roomNumber.includes(normalizedQuery)
    })
  }

  /**
   * Sort reservations by priority: current → upcoming → past
   * @param reservationList - Array of reservations to sort
   * @returns Sorted array of reservations
   */
  const sortReservationsByPriority = (reservationList: Reservation[]): Reservation[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return reservationList.sort((a, b) => {
      const aCheckIn = new Date(a.checkIn || a.checkInDate || '')
      const aCheckOut = new Date(a.checkOut || a.checkOutDate || '')
      const bCheckIn = new Date(b.checkIn || b.checkInDate || '')
      const bCheckOut = new Date(b.checkOut || b.checkOutDate || '')

      aCheckIn.setHours(0, 0, 0, 0)
      aCheckOut.setHours(0, 0, 0, 0)
      bCheckIn.setHours(0, 0, 0, 0)
      bCheckOut.setHours(0, 0, 0, 0)

      // Current reservations (today is between check-in and check-out)
      const aIsCurrent = today >= aCheckIn && today < aCheckOut
      const bIsCurrent = today >= bCheckIn && today < bCheckOut

      if (aIsCurrent && !bIsCurrent) return -1
      if (!aIsCurrent && bIsCurrent) return 1

      // If both or neither are current, prefer upcoming reservations
      const aIsUpcoming = aCheckIn >= today
      const bIsUpcoming = bCheckIn >= today

      if (aIsUpcoming && !bIsUpcoming) return -1
      if (!aIsUpcoming && bIsUpcoming) return 1

      // If same category, sort by check-in date (closest first)
      return Math.abs(aCheckIn.getTime() - today.getTime()) - Math.abs(bCheckIn.getTime() - today.getTime())
    })
  }

  /**
   * Find the best matching reservation for search navigation
   * @param query - Search query string
   * @returns Best matching reservation or undefined
   */
  const findBestMatchingReservation = (query: string): Reservation | undefined => {
    const matchingReservations = searchReservations(query)
    
    if (matchingReservations.length === 0) {
      return undefined
    }

    // Sort by priority and return the first (best) match
    const sortedReservations = sortReservationsByPriority(matchingReservations)
    return sortedReservations[0]
  }

  /**
   * Filter reservations by status
   * @param reservationList - Array of reservations to filter
   * @param statusFilter - Status filter string
   * @returns Filtered array of reservations
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
   * @param reservationList - Array of reservations to filter
   * @param sourceFilter - Source filter string
   * @returns Filtered array of reservations
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
   * Reactive computed property for search results
   */
  const searchResults = computed(() => {
    return searchReservations(searchQuery.value)
  })

  return {
    searchReservations,
    sortReservationsByPriority,
    findBestMatchingReservation,
    filterReservationsByStatus,
    filterReservationsBySource,
    searchResults,
  }
}
