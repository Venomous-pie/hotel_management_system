import { ref, computed } from 'vue'
import type { Reservation, Room } from '@/types/hotel'
import { useHotelData } from './useHotelData'

export const useReservationDetails = () => {
  const { rooms } = useHotelData()

  const isModalOpen = ref(false)
  const selectedReservation = ref<Reservation | null>(null)

  const selectedRoomDetails = computed(() => {
    if (!selectedReservation.value) return null

    const roomNumber = selectedReservation.value.roomNumber || selectedReservation.value.room
    return (
      rooms.value.find((room) => room.number === roomNumber || room.roomNumber === roomNumber) ||
      null
    )
  })

  const openModal = (reservation: Reservation) => {
    selectedReservation.value = reservation
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    setTimeout(() => {
      selectedReservation.value = null
    }, 300)
  }

  return {
    isModalOpen,
    selectedReservation,
    selectedRoomDetails,
    openModal,
    closeModal,
  }
}
