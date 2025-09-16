import type { Reservation, RoomCategory } from '../types/hotel'
import { useDateUtils } from './useDateUtils'
import { useHotelStore } from '../stores/hotelStore'

export const useReservations = () => {
  const { formatDate } = useDateUtils()
  const hotelStore = useHotelStore()

  // Get reservation for a specific room and date
  const getReservation = (roomNumber: string, date: string, reservations: Reservation[]): Reservation | undefined => {
    return reservations.find(res => {
      const checkIn = new Date(res.checkIn)
      const checkOut = new Date(res.checkOut)
      const currentDate = new Date(date)
      
      return res.room === roomNumber && 
             currentDate >= checkIn && 
             currentDate <= checkOut
    })
  }

  // Get reservation colors based on type from hotel data
  const getReservationColor = (reservation: Reservation): string => {
    const colors = hotelStore.data.reservationTypeColors
    
    // Ensure we always return a valid color class
    if (colors && colors[reservation.type]) {
      return colors[reservation.type]
    }
    
    // Fallback colors if data is not available
    const fallbackColors = {
      standard: 'bg-blue-100 text-blue-800 border-l-4 border-blue-400',
      vip: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-400',
      group: 'bg-orange-100 text-orange-800 border-l-4 border-orange-400',
      family: 'bg-green-100 text-green-800 border-l-4 border-green-400'
    }
    
    return fallbackColors[reservation.type as keyof typeof fallbackColors] || fallbackColors.standard
  }

  // Get room status colors from hotel data
  const getRoomStatusColor = (status: string): string => {
    const colors = hotelStore.data.roomStatusColors
    return colors[status] || 'bg-gray-400'
  }

  // Get available rooms count for a category on a specific date
  const getAvailableRooms = (categoryName: string, date: string, categories: RoomCategory[], reservations: Reservation[]): string => {
    const category = categories.find(cat => cat.name === categoryName)
    if (!category) return '0'
    
    const available = category.rooms.filter(room => {
      const hasReservation = getReservation(room.number || room.id, date, reservations)
      return !hasReservation && room.status === 'available'
    }).length
    
    return available.toString()
  }

  // Get availability color based on room count
  const getAvailabilityColor = (categoryName: string, date: string, categories: RoomCategory[], reservations: Reservation[]): string => {
    const available = parseInt(getAvailableRooms(categoryName, date, categories, reservations))
    const category = categories.find(cat => cat.name === categoryName)
    const total = category ? category.rooms.length : 0
    
    if (available === 0) return 'bg-red-500 text-white'
    if (available <= total / 3) return 'bg-orange-500 text-white'
    return 'bg-green-500 text-white'
  }

  // Get status badge color from hotel data
  const getStatusBadgeColor = (status: string): string => {
    const colors = hotelStore.data.reservationStatusColors
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Create new reservation
  const createReservation = (roomNumber: string, date: string, categories: RoomCategory[]) => {
    const room = categories
      .flatMap(cat => cat.rooms)
      .find(room => (room.number || room.id) === roomNumber)
    
    console.log('Create reservation for room:', roomNumber, 'on:', date)
    alert(`Add new reservation:\nRoom: ${room ? room.number : roomNumber}\nDate: ${formatDate(date)}\n\nThis would open a reservation form.`)
  }

  return {
    getReservation,
    getReservationColor,
    getRoomStatusColor,
    getAvailableRooms,
    getAvailabilityColor,
    getStatusBadgeColor,
    createReservation
  }
}