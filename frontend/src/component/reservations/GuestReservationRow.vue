<template>
  <div class="relative transition-colors">
    <div class="grid" :style="`grid-template-columns: 14rem repeat(${dateRange.length}, 6rem)`">
      
      <div class="px-4 py-3 flex items-center hover:bg-gray-100 transition-colors cursor-pointer outline outline-1 outline-gray-50">
        <div class="flex items-center w-full">
          <div class="w-2 h-2 rounded-full mr-3 flex-shrink-0" :class="getStatusColor(reservation.status)"></div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-medium text-gray-800 truncate">{{ reservation.guest }}</div>
            <div class="text-xs text-gray-500 truncate">Room {{ reservation.room }}</div>
            <div class="text-xs text-gray-400">{{ reservation.id }}</div>
          </div>
        </div>
        <div class="ml-auto p-1 hover:bg-gray-200 rounded cursor-pointer flex-shrink-0">
          <i class="i-lucide-more-horizontal w-3 h-3 text-gray-400"></i>
        </div>
      </div>
      
      <!-- Date cells - empty for spacing -->
      <div v-for="date in dateRange" :key="date.full" 
        class="px-1 py-2 relative flex items-center justify-center hover:bg-gray-50 transition-colors min-h-[2.5rem] outline outline-1 outline-gray-50">
      </div>
    </div>
    
    <!-- Reservation span overlay -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none grid" 
         :style="`grid-template-columns: 14rem repeat(${dateRange.length}, 6rem)`">
      <div></div>
      
      <div class="pointer-events-auto flex items-center px-1 py-2" 
        :style="{
          gridColumn: `${reservationSpan.startCol} / ${reservationSpan.endCol + 1}`,
          gridRow: '1',
          zIndex: 20
        }">
        <div 
          @click="handleReservationClick"
          class="h-7 rounded text-xs px-3 leading-7 cursor-pointer transition-all hover:shadow-md hover:scale-105 overflow-hidden flex items-center justify-between w-full"
          :class="getReservationColor(reservation)"
          :title="getReservationTooltip()">
          <div class="flex items-center min-w-0 flex-1">
            <span class="truncate font-medium">{{ reservation.guest }}</span>
            <span class="ml-2 text-xs opacity-80">Room {{ reservation.room }}</span>
          </div>
          <div class="flex items-center gap-1 ml-2 flex-shrink-0">
            <i class="i-lucide-calendar w-3 h-3 opacity-70"></i>
            <span class="text-xs opacity-80">{{ getDurationText() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Reservation, DateRange } from '../../types/hotel'
import { useDateUtils } from '../../composables/useDateUtils'

interface Props {
  reservation: Reservation
  dateRange: DateRange[]
}

interface ReservationSpan {
  startCol: number
  endCol: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'open-reservation': [reservation: Reservation]
}>()

const { formatDate } = useDateUtils()

// Calculate reservation span for this guest
const reservationSpan = computed((): ReservationSpan => {
  const checkIn = new Date(props.reservation.checkIn)
  const checkOut = new Date(props.reservation.checkOut)
  
  let startCol = -1
  let endCol = -1
  
  props.dateRange.forEach((date, index) => {
    const currentDate = new Date(date.full)
    
    if (currentDate >= checkIn && currentDate <= checkOut) {
      if (startCol === -1) {
        startCol = index + 2 // +2 because grid columns are 1-indexed and we skip guest info column
      }
      endCol = index + 2
    }
  })
  
  // Ensure we have valid column ranges
  if (startCol === -1) startCol = 2
  if (endCol === -1) endCol = startCol
  
  return { startCol, endCol }
})

// Get status color indicator
const getStatusColor = (status: string) => {
  const colors = {
    'confirmed': 'bg-blue-500',
    'pending': 'bg-orange-500', 
    'checkedIn': 'bg-green-500',
    'cancelled': 'bg-red-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}

// Get reservation bar color based on status and type
const getReservationColor = (reservation: Reservation) => {
  const baseClasses = 'text-white font-medium'
  
  // Status-based colors
  const statusColors = {
    'confirmed': 'bg-blue-500 hover:bg-blue-600',
    'pending': 'bg-orange-500 hover:bg-orange-600',
    'checkedIn': 'bg-green-500 hover:bg-green-600', 
    'cancelled': 'bg-red-500 hover:bg-red-600'
  }
  
  // Type-based color variations (slightly different shades)
  const typeModifiers = {
    'vip': 'ring-2 ring-yellow-300',
    'group': 'opacity-90',
    'family': 'bg-gradient-to-r'
  }
  
  let colorClass = statusColors[reservation.status as keyof typeof statusColors] || 'bg-gray-500 hover:bg-gray-600'
  
  // Add type modifiers
  if (reservation.type === 'vip') {
    colorClass += ' ring-2 ring-yellow-300'
  }
  
  return `${baseClasses} ${colorClass}`
}

// Get tooltip text for reservation
const getReservationTooltip = () => {
  const checkInDate = formatDate(props.reservation.checkIn)
  const checkOutDate = formatDate(props.reservation.checkOut)
  
  return `${props.reservation.guest} - Room ${props.reservation.room}
Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Status: ${props.reservation.status.charAt(0).toUpperCase() + props.reservation.status.slice(1)}
Type: ${props.reservation.type.toUpperCase()}`
}

// Get duration text
const getDurationText = () => {
  const checkIn = new Date(props.reservation.checkIn)
  const checkOut = new Date(props.reservation.checkOut)
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays === 1 ? '1 day' : `${diffDays} days`
}

const handleReservationClick = () => {
  emit('open-reservation', props.reservation)
}
</script>