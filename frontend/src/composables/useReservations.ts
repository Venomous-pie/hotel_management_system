import { ref } from 'vue'
import type { Reservation, RoomCategory, ReservationFilters } from '../types/hotel'
import { useDateUtils } from './useDateUtils'
import { useStatusColors } from './useStatusColors'
import hotelData from '../data/hotelData.json'

export const useReservations = () => {
  const { formatDate } = useDateUtils()
  const { getReservationTypeColor } = useStatusColors()
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const reservations = ref<Reservation[]>(hotelData.reservations as Reservation[] || [])

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

  const getReservationColor = (reservation: Reservation): string => {
    return getReservationTypeColor(reservation.type as any)
  }

  const getAvailableRooms = (categoryName: string, date: string, categories: RoomCategory[], reservations: Reservation[]): string => {
    const category = categories.find(cat => cat.name === categoryName)
    if (!category) return '0'
    
    const available = category.rooms.filter(room => {
      const hasReservation = getReservation(room.number || room.id, date, reservations)
      return !hasReservation && room.status === 'available'
    }).length
    
    return available.toString()
  }

  const getAvailabilityColor = (categoryName: string, date: string, categories: RoomCategory[], reservations: Reservation[]): string => {
    const available = parseInt(getAvailableRooms(categoryName, date, categories, reservations))
    
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

  // Reservation filtering and management
  const filterReservations = (filters: ReservationFilters) => {
    let filtered = reservations.value

    if (filters.searchQuery) {
      filtered = filtered.filter(res => 
        res.guest.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        res.room.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        res.id.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      )
    }

    if (filters.status && filters.status !== 'All') {
      const statusMap: Record<string, string> = {
        'confirmed': 'confirmed',
        'pending': 'pending',
        'checkedIn': 'checkedIn',
        'cancelled': 'cancelled'
      }
      const filterStatus = statusMap[filters.status]
      if (filterStatus) {
        filtered = filtered.filter(res => res.status === filterStatus)
      }
    }

    return filtered
  }


  const loadReservations = async () => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      reservations.value = hotelData.reservations as Reservation[] || []
    } catch (err) {
      error.value = 'Failed to load reservations'
    } finally {
      loading.value = false
    }
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