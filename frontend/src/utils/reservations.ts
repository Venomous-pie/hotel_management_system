/**
 * Reservation utility functions
 * Pure functions for reservation-related business logic
 */

import type { Reservation } from '@/types/hotel'

/**
 * Find reservation for specific room and date
 * @param reservations - Array of reservations to search
 * @param roomNumber - Room number to check
 * @param date - Date to check (ISO string format)
 * @returns Reservation object if found, undefined otherwise
 */
export const findReservationForRoomAndDate = (
  reservations: Reservation[], 
  roomNumber: string, 
  date: string
): Reservation | undefined => {
  return reservations.find(reservation => {
    // Use string-based date comparison to avoid timezone issues
    const checkInStr = (reservation.checkIn || reservation.checkInDate || '').toString().split('T')[0]
    const checkOutStr = (reservation.checkOut || reservation.checkOutDate || '').toString().split('T')[0]
    const targetDateStr = date.split('T')[0]

    const resRoomNumber = (reservation.room || reservation.roomNumber || '').toString()
    return resRoomNumber === roomNumber.toString() &&
           targetDateStr >= checkInStr &&
           targetDateStr <= checkOutStr  // Inclusive checkout (guest shown until checkout date)
  })
}

/**
 * Check if room is available on a specific date
 * @param reservations - Array of reservations to check against
 * @param roomNumber - Room number to check
 * @param date - Date to check availability for
 * @returns True if room is available, false if occupied
 */
export const isRoomAvailableOnDate = (
  reservations: Reservation[], 
  roomNumber: string, 
  date: string
): boolean => {
  // Check if room has any active reservations on this date
  const reservation = findReservationForRoomAndDate(reservations, roomNumber, date)

  // Room is available if:
  // 1. No reservation exists
  // 2. Reservation is cancelled
  // 3. Reservation is checked out
  return !reservation ||
         reservation.status === 'cancelled' ||
         reservation.status === 'checkedOut'
}

/**
 * Get available room count for a category on a specific date
 * @param rooms - Array of rooms in the category
 * @param reservations - Array of reservations to check against
 * @param date - Date to check availability for
 * @returns Number of available rooms in the category
 */
export const getAvailableRoomCount = (
  rooms: any[], 
  reservations: Reservation[], 
  date: string
): number => {
  return rooms.filter((room: any) => {
    // Check room status first
    if (room.status === 'out-of-order' || room.status === 'maintenance') {
      return false
    }

    // Check if room is available on this specific date
    return isRoomAvailableOnDate(reservations, room.number, date)
  }).length
}

/**
 * Format date range for display (e.g., "Jan 15 - Jan 18")
 * @param reservation - Reservation object with check-in/check-out dates
 * @returns Formatted date range string
 */
export const formatReservationDateRange = (reservation: any): string => {
  const checkIn = reservation.checkIn || reservation.checkInDate
  const checkOut = reservation.checkOut || reservation.checkOutDate

  if (!checkIn || !checkOut) return 'Invalid dates'

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
  
  return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`
}
