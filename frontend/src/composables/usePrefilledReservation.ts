import type { Ref } from 'vue'
import type { PrefilledReservationData, ReservationFormData, Room } from '@/types/hotel'

export const usePrefilledReservation = (
  prefilledData: Ref<PrefilledReservationData | null | undefined>,
  rooms: Ref<Room[]>,
  formData: Ref<ReservationFormData>,
  validateDates: () => void,
  validateRoomSelection: () => boolean,
  isRoomAvailable: (room: Room) => boolean,
  filterAvailableRooms: () => void,
) => {
  const applyPrefilledData = () => {
    if (!prefilledData.value) return

    formData.value.numGuest = formData.value.numGuest || 1

    if (prefilledData.value.checkInDate) {
      formData.value.checkIn = prefilledData.value.checkInDate
      validateDates()
    }

    filterAvailableRooms()

    if (prefilledData.value.roomNumber) {
      const selectedRoom = rooms.value.find(room => room.number === prefilledData.value?.roomNumber)
      if (selectedRoom && isRoomAvailable(selectedRoom)) {
        formData.value.roomNumber = prefilledData.value.roomNumber
        validateRoomSelection()
      } else {
        formData.value.roomNumber = ''
      }
    }
  }

  return { applyPrefilledData }
}
