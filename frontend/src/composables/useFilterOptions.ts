import { computed, type Ref } from 'vue'
import type { Room, Reservation } from '@/types/hotel'
import {
  getUniqueRoomTypes,
  getUniqueStatuses,
  getUniqueSources,
  formatStatusLabel,
  formatSourceLabel,
} from '@/utils/frontdesk'

export const useFilterOptions = (
  rooms: Ref<Room[]>,
  reservations: Ref<Reservation[]>
) => {
  const roomTypeOptions = computed<string[]>(() => {
    const types = getUniqueRoomTypes(rooms.value)
    const all = ['All Room Types', ...types.sort()]
    return all
  })

  const reservationStatusOptions = computed<string[]>(() => {
    const statuses = getUniqueStatuses(reservations.value)
    const labeled = statuses.map(formatStatusLabel).filter(Boolean).sort()
    return ['All Reservations', ...labeled]
  })

  const bookingSourceOptions = computed<string[]>(() => {
    const sources = getUniqueSources(reservations.value)
    const labeled = sources.map(formatSourceLabel).filter(Boolean).sort()
    return ['All Booking', ...labeled]
  })

  return {
    roomTypeOptions,
    reservationStatusOptions,
    bookingSourceOptions,
  }
}
