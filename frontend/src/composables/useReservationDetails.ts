import { ref, computed } from 'vue'
import type { Reservation, Room } from '@/types/hotel'
import { useHotelData } from './useHotelData'

// Composable for managing reservation details modal state
export const useReservationDetails = () => {
  const { rooms } = useHotelData()
  
  // Modal state
  const isModalOpen = ref(false)
  const selectedReservation = ref<Reservation | null>(null)
  
  // Get room details for the selected reservation
  const selectedRoomDetails = computed(() => {
    if (!selectedReservation.value) return null
    
    const roomNumber = selectedReservation.value.roomNumber || selectedReservation.value.room
    return rooms.value.find(room => 
      room.number === roomNumber || room.roomNumber === roomNumber
    ) || null
  })
  
  // Actions
  const openModal = (reservation: Reservation) => {
    selectedReservation.value = reservation
    isModalOpen.value = true
  }
  
  const closeModal = () => {
    isModalOpen.value = false
    // Small delay before clearing to allow for smooth modal transition
    setTimeout(() => {
      selectedReservation.value = null
    }, 300)
  }
  
  return {
    // State
    isModalOpen,
    selectedReservation,
    selectedRoomDetails,
    
    // Actions
    openModal,
    closeModal
  }
}
