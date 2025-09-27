import { ref } from 'vue'
import type { Room, Reservation } from '@/types/hotel'
import { getRooms } from '@/services/rooms'
import { getReservations as fetchReservationsService } from '@/services/reservations'

// Shared reactive state (singleton across app)
const rooms = ref<Room[]>([])
const reservations = ref<Reservation[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchRooms = async () => {
  rooms.value = await getRooms()
}

const fetchReservations = async () => {
  reservations.value = await fetchReservationsService()
}

const refreshAll = async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([fetchRooms(), fetchReservations()])
    // Optional: console.log('✅ Hotel data refreshed')
  } catch (e) {
    console.error('Error refreshing hotel data:', e)
    error.value = 'Failed to load hotel data'
  } finally {
    loading.value = false
  }
}

export const useHotelData = () => {
  return {
    rooms,
    reservations,
    loading,
    error,
    refreshAll,
    fetchRooms,
    fetchReservations,
  }
}
