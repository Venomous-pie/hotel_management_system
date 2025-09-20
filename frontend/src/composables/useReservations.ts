import { computed } from 'vue'
import type { Reservation, RoomCategory, ReservationFilters } from '../types/hotel'
import { useDateUtils } from './useDateUtils'
import { useStatusColors } from './useStatusColors'
import hotelDataService from '../services/hotelDataService'

export const useReservations = () => {
  const { formatDate } = useDateUtils()
  const { getReservationTypeColor } = useStatusColors()
  
  // Use centralized data service
  const loading = computed(() => hotelDataService.isLoading)
  const error = computed(() => hotelDataService.hasError)
  const reservations = computed(() => hotelDataService.reservations)

  const getReservation = (roomNumber: string, date: string, reservations?: Reservation[]): Reservation | undefined => {
    return hotelDataService.getReservation(roomNumber, date, reservations)
  }

  const getReservationColor = (reservation: Reservation): string => {
    return getReservationTypeColor(reservation.type as any)
  }

  const getAvailableRooms = (categoryName: string, date: string, categories: RoomCategory[], reservations: Reservation[]): string => {
    const count = hotelDataService.getAvailableRoomsCount(categoryName, date, categories, reservations)
    return count.toString()
  }

  const getAvailabilityColor = (categoryName: string, date: string, categories: RoomCategory[], reservations: Reservation[]): string => {
    const available = hotelDataService.getAvailableRoomsCount(categoryName, date, categories, reservations)
    
    if (available === 0) return 'bg-gray-100 text-gray-700'
    return 'bg-green-200 text-gray-700'
  }

  const createReservation = (roomNumber: string, date: string, categories: RoomCategory[]) => {
    const room = categories
      .flatMap(cat => cat.rooms)
      .find(room => (room.number || room.id) === roomNumber)
    
    console.log('Create reservation for room:', roomNumber, 'on:', date)
    alert(`Add new reservation:\nRoom: ${room ? room.number : roomNumber}\nDate: ${formatDate(date)}\n\nThis would open a reservation form.`)
  }

  // Reservation filtering and management using centralized service
  const filterReservations = (filters: ReservationFilters) => {
    return hotelDataService.filterReservationsForTable(filters)
  }

  const loadReservations = async () => {
    await hotelDataService.reloadReservations()
  }

  return {
    loading,
    error,
    reservations,
    filterReservations,
    loadReservations,
    getReservation,
    getReservationColor,
    getAvailableRooms,
    getAvailabilityColor,
    createReservation
  }
}