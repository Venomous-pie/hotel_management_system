/**
 * Gantt chart orchestrator composable
 * Coordinates all Gantt chart composables and provides a unified interface
 */

import { computed, ref } from 'vue'
import { useGanttNavigation } from './useGanttNavigation'
import { useReservationManagement } from './useReservationManagement'
import { useRoomCategorization } from './useRoomCategorization'
import { useGanttPositioning } from './useGanttPositioning'
import { useGanttEventHandlers } from './useGanttEventHandlers'
import { useGanttLifecycle } from './useGanttLifecycle'
import { useGanttWatchers } from './useGanttWatchers'
import {
  calculateReservationSpanStyle,
  findDateRangeIndices
} from '@/utils/gantt'

export const useGanttOrchestrator = (props: any, emit: any) => {
  const hoveredColumn = ref<string | null>(null)
  
  // Convert props to refs for composables
  const roomsRef = computed(() => props.rooms)
  const reservationsRef = computed(() => props.reservations)
  const searchQueryRef = computed(() => props.searchQuery)
  const roomTypeFilterRef = computed(() => props.roomTypeFilter)
  const reservationFilterRef = computed(() => props.reservationFilter)
  const bookingFilterRef = computed(() => props.bookingFilter)
  const selectedYearRef = computed(() => props.selectedYear)
  const selectedMonthRef = computed(() => props.selectedMonth)
  const targetDateRef = computed(() => props.targetDate || null)

  // Initialize core composables
  const navigation = useGanttNavigation(
    selectedYearRef,
    selectedMonthRef,
    searchQueryRef,
    reservationsRef,
    targetDateRef
  )

  const reservationMgmt = useReservationManagement(
    reservationsRef,
    searchQueryRef,
    reservationFilterRef,
    bookingFilterRef
  )

  const roomCategorization = useRoomCategorization(
    roomsRef,
    searchQueryRef,
    roomTypeFilterRef
  )

  const positioning = useGanttPositioning(
    roomCategorization.roomCategories,
    roomCategorization.expandedCategories
  )

  // Extract core functionality
  const {
    dateRange,
    highlightedReservation,
    navigateDates: navDates,
    jumpToToday: navJumpToToday,
    initializeViewDate,
    isInternalNavigation
  } = navigation

  const {
    isRoomAvailable,
    getAvailableRoomCountForDate,
    getReservationSpans: getSpans
  } = reservationMgmt

  const {
    roomCategories,
    expandedCategories,
    toggleCategory
  } = roomCategorization

  const {
    setRowRef,
    getRoomTopPosition,
    recomputePositions,
    setContainerRef,
    validatePositioning
  } = positioning

  // Initialize event handlers
  const eventHandlers = useGanttEventHandlers(isRoomAvailable, emit)
  const { handleCellClick, createNavigationHandler, createTodayHandler } = eventHandlers

  // Create navigation handlers
  const navigateDates = createNavigationHandler(navDates, navigation, emit)
  const jumpToToday = createTodayHandler(navJumpToToday, navigation, emit)

  // Container management
  const ganttTableRef = ref<any>(null)
  const containerEl = computed(() => ganttTableRef.value?.containerEl || null)

  // Initialize lifecycle management
  useGanttLifecycle(initializeViewDate, navigation, recomputePositions, validatePositioning)

  // Initialize watchers
  const watchers = useGanttWatchers(
    props,
    navigation,
    isInternalNavigation,
    initializeViewDate,
    highlightedReservation,
    containerEl,
    setContainerRef,
    recomputePositions,
    roomCategories,
    expandedCategories,
    dateRange
  )
  watchers.setupAllWatchers()

  // Span generation wrapper
  const getReservationSpans = (roomNumber: string) => {
    return getSpans(
      roomNumber,
      dateRange.value,
      getRoomTopPosition,
      findDateRangeIndices,
      calculateReservationSpanStyle
    )
  }

  return {
    // UI State
    hoveredColumn,
    ganttTableRef,
    
    // Core Data
    dateRange,
    roomCategories,
    expandedCategories,
    highlightedReservation,
    
    // Event Handlers
    navigateDates,
    jumpToToday,
    handleCellClick,
    toggleCategory,
    
    // Functions
    isRoomAvailable,
    getAvailableRoomCountForDate,
    getReservationSpans,
    setRowRef
  }
}
