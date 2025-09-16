<template>
  <div class="relative transition-colors">
    <div class="grid" :style="`grid-template-columns: 12rem repeat(${dateRange.length}, 6rem)`">
      
      <div class="px-4 py-3 flex items-center hover:bg-gray-100 transition-colors cursor-pointer outline outline-1 outline-gray-50">
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
      </div>
      
      <div v-for="date in dateRange" :key="date.full" 
        class="px-1 py-2 relative flex items-center justify-center hover:bg-gray-50 transition-colors min-h-[2.5rem] outline outline-1 outline-gray-50">
        <div v-if="!getReservation(room.number || room.id, date.full, reservations)"
          class="w-full h-full rounded cursor-pointer transition-colors opacity-0 hover:opacity-60 flex items-center justify-center text-green-400"
          @click="emit('create-reservation', room.number || room.id, date.full)">
          <i class="i-lucide-plus w-6 h-6 transition-opacity">AAA</i>
        </div>
      </div>
    </div>
    
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none grid" 
         :style="`grid-template-columns: 12rem repeat(${dateRange.length}, 6rem)`">
      <div></div>
      
      <div v-for="span in reservationSpans" :key="span.reservation.id" 
        class="pointer-events-auto flex items-center px-1 py-2" 
        :style="{
          gridColumn: `${span.startCol} / ${span.endCol + 1}`,
          gridRow: '1',
          zIndex: 20
        }">
        <div 
          @click="handleReservationClick(room.number || room.id, span.reservation.checkIn)"
          class="h-6 rounded text-xs px-2 leading-6 cursor-pointer transition-all hover:shadow-md hover:scale-105 overflow-hidden flex items-center justify-start w-full"
          :class="getReservationColor(span.reservation)"
          :title="getReservationTooltip(room.number || room.id, span.reservation.checkIn)">
          <span class="truncate">{{ span.reservation.guest }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Room, DateRange, Reservation } from '../../types/hotel'
import { useReservations } from '../../composables/useReservations'
import { useDateUtils } from '../../composables/useDateUtils'

interface Props {
  room: Room
  dateRange: DateRange[]
  reservations: Reservation[]
}

interface ReservationSpan {
  reservation: Reservation
  startCol: number
  endCol: number
  startDate: string
  endDate: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'open-reservation': [reservation: Reservation]
  'create-reservation': [roomNumber: string, date: string]
}>()

const { getReservation, getReservationColor, getRoomStatusColor } = useReservations()
const { formatDate } = useDateUtils()

// Calculate reservation spans for this room
const reservationSpans = computed((): ReservationSpan[] => {
  const spans: ReservationSpan[] = []
  const roomNumber = props.room.number || props.room.id
  
  // Get reservations for this room
  const roomReservations = props.reservations.filter(res => res.room === roomNumber)
  
  roomReservations.forEach(reservation => {
    const checkIn = new Date(reservation.checkIn)
    const checkOut = new Date(reservation.checkOut)
    
    // Find the start and end column indices within the visible date range
    let startCol = -1
    let endCol = -1
    
    props.dateRange.forEach((date, index) => {
      const currentDate = new Date(date.full)
      
      if (currentDate >= checkIn && currentDate <= checkOut) {
        if (startCol === -1) {
          startCol = index + 2 // +2 because grid columns are 1-indexed and we skip room info column
        }
        endCol = index + 2
      }
    })
    
    // Only add span if it's visible in the current date range
    if (startCol !== -1 && endCol !== -1) {
      spans.push({
        reservation,
        startCol,
        endCol,
        startDate: reservation.checkIn,
        endDate: reservation.checkOut
      })
    }
  })
  
  return spans
})

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
