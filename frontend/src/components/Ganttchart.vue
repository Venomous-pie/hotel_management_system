<template>
    <div class="h-full bg-white">
        <GanttHeader :date-range="dateRange" @navigate-dates="navigateDates" @jump-to-today="jumpToToday" />

        <GanttTable ref="ganttTableRef" :date-range="dateRange" :room-categories="roomCategories"
            :expanded-categories="expandedCategories" :hovered-column="hoveredColumn"
            :highlighted-reservation="highlightedReservation" :loading="props.loading" :error="props.error"
            :is-room-available="isRoomAvailable" :get-available-room-count-for-date="getAvailableRoomCountForDate"
            :get-reservation-spans="getReservationSpans" :set-row-ref="setRowRef" @column-hover="hoveredColumn = $event"
            @column-leave="hoveredColumn = null" @toggle-category="toggleCategory" @cell-click="handleCellClick" />
    </div>
</template>

<script setup lang="ts">
import { useGanttOrchestrator } from '@/composables/useGanttOrchestrator'
import GanttHeader from './GanttHeader.vue'
import GanttTable from './GanttTable.vue'

const props = defineProps<{
    selectedYear: number
    selectedMonth: number
    searchQuery: string
    reservationFilter: string
    roomTypeFilter: string
    bookingFilter: string
    rooms: any[]
    reservations: any[]
    loading: boolean
    error: string | null
    targetDate?: Date | null
}>()

const emit = defineEmits<{
    updateDate: [{ year: number; month: number }]
    openReservationModal: [{ roomNumber: string; checkInDate: string; isAvailable: boolean }]
}>()

const {
    hoveredColumn,
    ganttTableRef,
    dateRange,
    roomCategories,
    expandedCategories,
    highlightedReservation,
    navigateDates,
    jumpToToday,
    handleCellClick,
    toggleCategory,
    isRoomAvailable,
    getAvailableRoomCountForDate,
    getReservationSpans,
    setRowRef
} = useGanttOrchestrator(props, emit)

</script>