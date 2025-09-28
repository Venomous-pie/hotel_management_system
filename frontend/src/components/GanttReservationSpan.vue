<template>
  <div 
    class="absolute pointer-events-auto cursor-pointer rounded-lg shadow-sm" 
    :class="[
      reservationColor,
      {
        'ring-2 ring-yellow-400 ring-offset-1 animate-pulse': isHighlighted
      }
    ]" 
    :style="style"
    :title="tooltipText"
  >
    <div class="h-full flex items-center text-xs font-medium overflow-hidden">
      <div 
        :class="accentColor"
        class="h-full w-3 rounded-l-lg flex-shrink-0 relative overflow-hidden"
      >
        <!-- Half circle cutout -->
        <div 
          :class="reservationColor"
          class="absolute right--4 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-lg -mr-1.5"
        >
        </div>
      </div>
      <span class="px-3 truncate">
        {{ guestDisplayName }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getReservationStatusColor, getReservationAccentColor } from '@/utils/colors'
import { formatReservationDateRange } from '@/utils/reservations'
import type { Reservation } from '@/types/hotel'

interface Props {
  reservation: Reservation
  style: {
    left: string
    width: string
    top: string
    height: string
  }
  isHighlighted?: boolean
}

const props = defineProps<Props>()

// Computed properties for styling
const reservationColor = computed(() => getReservationStatusColor(props.reservation))
const accentColor = computed(() => getReservationAccentColor(props.reservation))

// Guest display name (first name only)
const guestDisplayName = computed(() => {
  const fullName = props.reservation.guest || props.reservation.guestName || 'Guest'
  return fullName.split(' ')[0]
})

// Tooltip text with guest name and date range
const tooltipText = computed(() => {
  const guestName = props.reservation.guest || props.reservation.guestName || 'Guest'
  const dateRange = formatReservationDateRange(props.reservation)
  return `${guestName} - ${dateRange}`
})
</script>
