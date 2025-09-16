<template>
  <div class="grid bg-gray-25" :style="`grid-template-columns: 12rem repeat(${dateRange.length}, 6rem)`">
    <div class="px-4 py-2 flex items-center">
      <div @click="$emit('toggle-category', category.name)" 
        class="flex items-center text-xs font-bold text-gray-700 hover:text-gray-900 cursor-pointer">
        <i :class="category.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'" 
          class="w-3 h-3 mr-2"></i>
        {{ category.name }}
      </div>
    </div>
    
    <div v-for="date in dateRange" :key="date.full" 
      class="px-2 py-2 text-center hover:bg-gray-100 transition-colors cursor-pointer outline outline-1 outline-gray-50">
      <span class="inline-block w-6 h-6 text-xs leading-6 font-medium text-center"
        :class="getAvailabilityColor(category.name, date.full, filteredCategories, filteredReservations)">
        {{ getAvailableRooms(category.name, date.full, filteredCategories, filteredReservations) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoomCategory, DateRange, Reservation } from '../../types/hotel'
import { useReservations } from '../../composables/useReservations'

interface Props {
  category: RoomCategory
  dateRange: DateRange[]
  filteredCategories: RoomCategory[]
  filteredReservations: Reservation[]
}

defineProps<Props>()
defineEmits<{
  'toggle-category': [categoryName: string]
}>()

const { getAvailableRooms, getAvailabilityColor } = useReservations()
</script>