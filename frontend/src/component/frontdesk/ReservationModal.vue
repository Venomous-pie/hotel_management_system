<template>
  <div v-if="showModal" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close-modal')">
    <div class="bg-white rounded-lg shadow-xl w-96 p-6" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Reservation Details</h3>
        <button @click="$emit('close-modal')" 
          class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <i class="i-lucide-x w-4 h-4 text-gray-500"></i>
        </button>
      </div>
      
      <div v-if="reservation" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Guest Name</label>
          <div class="text-sm font-medium text-gray-900">{{ reservation.guest }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Room</label>
          <div class="text-sm font-medium text-gray-900">{{ reservation.room }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
          <div class="text-sm text-gray-900">{{ formatDate(reservation.checkIn) }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
          <div class="text-sm text-gray-900">{{ formatDate(reservation.checkOut) }}</div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <span class="inline-block px-3 py-1 text-xs font-medium rounded-full capitalize"
            :class="getStatusBadgeClasses(reservation.status)">
            {{ reservation.status }}
          </span>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <span class="inline-block px-3 py-1 text-xs font-medium rounded-full capitalize"
            :class="getReservationColor(reservation)">
            {{ reservation.type }}
          </span>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
        <button @click="$emit('close-modal')" 
          class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          Close
        </button>
        <button class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          Edit Reservation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reservation } from '../../types/hotel'
import { useReservations } from '../../composables/useReservations'
import { useStatusColors } from '../../composables/useStatusColors'
import { useDateUtils } from '../../composables/useDateUtils'

interface Props {
  showModal: boolean
  reservation: Reservation | null
}

defineProps<Props>()
defineEmits<{
  'close-modal': []
}>()

const { getReservationColor } = useReservations()
const { getStatusBadgeClasses } = useStatusColors()
const { formatDate } = useDateUtils()
</script>