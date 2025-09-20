<template>
  <tr class="relative transition-colors border-b border-gray-100">
    <td class="px-4 py-3 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer flex outline outline-1 outline-gray-50">
      <div class="flex items-center">
        <div class="w-2 h-2 rounded-full mr-3 flex-shrink-0" :class="getRoomStatusColor(room.status)"></div>
        <div>
          <div class="text-xs font-medium text-gray-800">{{ room.number }}</div>
          <div class="text-xs text-gray-500 truncate">{{ room.type }}</div>
        </div>
      </div>
      <div class="ml-auto p-1 hover:bg-gray-200 rounded cursor-pointer">
        <i class="i-lucide-more-horizontal w-3 h-3 text-gray-400">Aa</i>
      </div>
    </td>
    
    <td v-for="date in dateRange" :key="date.full" 
      class="px-1 py-2 relative outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors min-h-[2.5rem] text-center">
      
      <div v-if="!getReservation(room.number || room.id, date.full, reservations)"
        class="w-full h-full rounded cursor-pointer transition-colors opacity-0 hover:opacity-60 flex items-center justify-center text-green-400"
        @click="emit('create-reservation', room.number || room.id, date.full)">
        <i class="i-lucide-plus w-4 h-4 transition-opacity"></i>
      </div>
      
      <div v-else-if="isReservationStart(room.number || room.id, date.full)"
        @click="handleReservationClick(room.number || room.id, date.full)"
        class="absolute inset-0 flex items-center px-1 py-2 z-10"
        :style="{ width: `${getReservationWidth(room.number || room.id, date.full)}%` }">
        <div 
          class="h-6 rounded text-xs px-2 leading-6 cursor-pointer transition-all hover:shadow-md hover:scale-105 overflow-hidden flex items-center justify-start w-full"
          :class="getReservationColor(getReservation(room.number || room.id, date.full, reservations)!)"
          :title="getReservationTooltip(room.number || room.id, date.full)">
          <span class="truncate">{{ getReservation(room.number || room.id, date.full, reservations)!.guest }}</span>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Reservation, DateRange, Room } from '../../types/hotel'
import { useReservations } from '../../composables/useReservations'
import { useStatusColors } from '../../composables/useStatusColors'
import { useDateUtils } from '../../composables/useDateUtils'

interface Props {
  room: Room
  dateRange: DateRange[]
  reservations: Reservation[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'open-reservation': [reservation: Reservation]
  'create-reservation': [roomNumber: string, date: string]
}>()

const { getReservation, getReservationColor } = useReservations()
const { getRoomStatusColor } = useStatusColors()
const { formatDate } = useDateUtils()

const isReservationStart = (roomId: string, date: string): boolean => {
  const reservation = getReservation(roomId, date, props.reservations)
  if (!reservation) return false
  
  const dateIndex = props.dateRange.findIndex(d => d.full === date)
  if (dateIndex === 0) return true
  
  const previousDate = props.dateRange[dateIndex - 1]
  const previousReservation = getReservation(roomId, previousDate.full, props.reservations)
  
  return !previousReservation || previousReservation.id !== reservation.id
}

const getReservationWidth = (roomId: string, date: string): number => {
  const reservation = getReservation(roomId, date, props.reservations)
  if (!reservation) return 100
  
  const startIndex = props.dateRange.findIndex(d => d.full === date)
  if (startIndex === -1) return 100
  
  let endIndex = startIndex
  const checkOut = new Date(reservation.checkOut)
  
  for (let i = startIndex; i < props.dateRange.length; i++) {
    const currentDate = new Date(props.dateRange[i].full)
    if (currentDate <= checkOut) {
      endIndex = i
    } else {
      break
    }
  }
  
  const spanLength = endIndex - startIndex + 1
  return spanLength * 100
}

const getReservationTooltip = (roomId: string, date: string) => {
  const reservation = getReservation(roomId, date, props.reservations)
  if (!reservation) return ''
  
  return `${reservation.guest} - ${formatDate(reservation.checkIn)} to ${formatDate(reservation.checkOut)} - ${reservation.status}`
}

const handleReservationClick = (roomId: string, date: string) => {
  const reservation = getReservation(roomId, date, props.reservations)
  if (reservation) {
    emit('open-reservation', reservation)
  }
}
</script>
