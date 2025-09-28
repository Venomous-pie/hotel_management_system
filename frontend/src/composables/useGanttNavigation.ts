/**
 * Gantt chart navigation composable
 * Handles all date navigation logic, view management, and search navigation
 */

import { computed, ref, watch, type Ref } from 'vue'
import { getTodayAtMidnight } from '@/utils/date'
import { generateDateRange, validateGanttLayout, GANTT_LAYOUT } from '@/utils/gantt'
import type { Reservation } from '@/types/hotel'

export const useGanttNavigation = (
  selectedYear: Ref<number>,
  selectedMonth: Ref<number>,
  searchQuery: Ref<string>,
  reservations: Ref<Reservation[]>,
  targetDate?: Ref<Date | null>
) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Direct view start date management (cleaner than offset calculations)
   * Controls the first date shown in the Gantt chart view
   */
  const viewStartDate = ref<Date>(new Date())

  /**
   * Track if navigation was triggered internally (to prevent reset)
   * Prevents infinite loops when updating parent component's date state
   */
  const isInternalNavigation = ref(false)

  /**
   * Highlighted reservation for search results
   * Stores the ID of a reservation that should be visually highlighted
   */
  const highlightedReservation = ref<string | null>(null)

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Generate 16 days starting from viewStartDate
   * Creates the date range displayed in the Gantt chart header
   */
  const dateRange = computed(() => {
    return generateDateRange(viewStartDate.value)
  })

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize view date to today
   */
  const initializeViewDate = () => {
    const today = getTodayAtMidnight()
    viewStartDate.value = today
  }

  // ============================================================================
  // NAVIGATION FUNCTIONS
  // ============================================================================

  /**
   * Navigate dates by specified direction
   * @param direction - Positive for forward, negative for backward navigation
   * Moves view by 5 days and updates parent component if month/year changes
   */
  const navigateDates = (direction: number) => {
    // Move view by 5 days
    const newStartDate = new Date(viewStartDate.value)
    newStartDate.setDate(newStartDate.getDate() + (direction * 5))

    viewStartDate.value = newStartDate
    
    // Check if we need to update parent's year/month context
    const newYear = newStartDate.getFullYear()
    const newMonth = newStartDate.getMonth()

    // Only emit if year or month changed to avoid unnecessary updates
    if (newYear !== selectedYear.value || newMonth !== selectedMonth.value) {
      console.log(`🔄 Gantt navigation: ${selectedYear.value}-${selectedMonth.value + 1} → ${newYear}-${newMonth + 1}`)
      isInternalNavigation.value = true
      
      // Return the new date for parent to handle
      return { year: newYear, month: newMonth }
    }
    
    return null
  }

  /**
   * Jump to today's date
   * Sets the view to show today and updates parent component's year/month
   */
  const jumpToToday = () => {
    const today = getTodayAtMidnight()
    
    console.log(`📅 Jumping to today: ${today.toLocaleDateString()}`)
    
    // Set internal navigation flag to prevent parent from overriding with 1st of month
    isInternalNavigation.value = true
    
    // Set view to start from today (not 1st of month)
    viewStartDate.value = today
    
    // Update parent's year/month context
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    
    // Return the new date for parent to handle
    return { year: currentYear, month: currentMonth }
  }

  /**
   * Navigate to a specific date (for search functionality)
   * @param targetDateStr - ISO date string to navigate to
   * Centers the view around the target date and updates parent if needed
   */
  const navigateToDate = (targetDateStr: string) => {
    const target = new Date(targetDateStr)

    // Set view to start a few days before the target date for context
    const newViewStart = new Date(target)
    newViewStart.setDate(target.getDate() - 2) // Show 2 days before target

    viewStartDate.value = newViewStart

    // Update parent's year/month if needed
    const newYear = target.getFullYear()
    const newMonth = target.getMonth()

    if (newYear !== selectedYear.value || newMonth !== selectedMonth.value) {
      isInternalNavigation.value = true
      return { year: newYear, month: newMonth }
    }
    
    return null
  }

  // ============================================================================
  // SEARCH NAVIGATION
  // ============================================================================

  /**
   * Find and navigate to the best matching reservation
   * @param query - Search query string
   * @returns The best matching reservation or null
   */
  const findAndNavigateToReservation = (query: string): Reservation | null => {
    if (!query || !query.trim()) {
      highlightedReservation.value = null
      return null
    }

    const normalizedQuery = query.toLowerCase().trim()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find matching reservations
    const matchingReservations = reservations.value.filter(reservation => {
      const guestName = (reservation.guest || reservation.guestName || '').toLowerCase()
      const bookingId = (reservation.id || reservation.bookingNumber || '').toString().toLowerCase()
      const roomNumber = (reservation.room || reservation.roomNumber || '').toString().toLowerCase()

      return guestName.includes(normalizedQuery) || 
             bookingId.includes(normalizedQuery) || 
             roomNumber.includes(normalizedQuery)
    })

    if (matchingReservations.length === 0) {
      return null
    }

    // Sort by preference: current reservations first, then upcoming, then past
    const sortedReservations = matchingReservations.sort((a, b) => {
      const aCheckIn = new Date(a.checkIn || a.checkInDate || '')
      const aCheckOut = new Date(a.checkOut || a.checkOutDate || '')
      const bCheckIn = new Date(b.checkIn || b.checkInDate || '')
      const bCheckOut = new Date(b.checkOut || b.checkOutDate || '')

      aCheckIn.setHours(0, 0, 0, 0)
      aCheckOut.setHours(0, 0, 0, 0)
      bCheckIn.setHours(0, 0, 0, 0)
      bCheckOut.setHours(0, 0, 0, 0)

      // Current reservations (today is between check-in and check-out)
      const aIsCurrent = today >= aCheckIn && today < aCheckOut
      const bIsCurrent = today >= bCheckIn && today < bCheckOut

      if (aIsCurrent && !bIsCurrent) return -1
      if (!aIsCurrent && bIsCurrent) return 1

      // If both or neither are current, prefer upcoming reservations
      const aIsUpcoming = aCheckIn >= today
      const bIsUpcoming = bCheckIn >= today

      if (aIsUpcoming && !bIsUpcoming) return -1
      if (!aIsUpcoming && bIsUpcoming) return 1

      // If same category, sort by check-in date (closest first)
      return Math.abs(aCheckIn.getTime() - today.getTime()) - Math.abs(bCheckIn.getTime() - today.getTime())
    })

    const bestMatch = sortedReservations[0]
    
    // Set highlighted reservation
    highlightedReservation.value = bestMatch.id || bestMatch.bookingNumber || null

    // Navigate to the reservation's check-in date
    const checkInDate = bestMatch.checkIn || bestMatch.checkInDate
    if (checkInDate) {
      const dateStr = typeof checkInDate === 'string' ? checkInDate : checkInDate.toISOString().split('T')[0]
      navigateToDate(dateStr)
    }

    return bestMatch
  }

  // ============================================================================
  // WATCHERS
  // ============================================================================

  // Watch for targetDate changes from parent navigation
  if (targetDate) {
    watch(targetDate, (newTargetDate) => {
      if (newTargetDate && !isInternalNavigation.value) {
        console.log(`🎯 Gantt chart received target date: ${newTargetDate.toLocaleDateString()}`)
        
        // Set view to start from the target date (1st of month)
        const targetStart = new Date(newTargetDate)
        targetStart.setHours(0, 0, 0, 0)
        
        viewStartDate.value = targetStart
        
        console.log(`📅 Gantt chart view updated to start from: ${targetStart.toLocaleDateString()}`)
      }
    })
  }

  // Watch for month/year changes and update view accordingly
  watch([selectedYear, selectedMonth], (newValues, oldValues) => {
    const [newYear, newMonth] = newValues
    const [oldYear, oldMonth] = oldValues || [newYear, newMonth]

    // Only reset view if this is a manual month/year change from parent
    if (oldYear !== undefined && oldMonth !== undefined) {
      if (!isInternalNavigation.value) {
        // Manual date change - reset to beginning of month
        console.log(`📅 Manual date change: ${oldYear}-${oldMonth + 1} → ${newYear}-${newMonth + 1}`)
        initializeViewDate()
      } else {
        // Internal navigation - keep current view position
        console.log(`🔄 Internal navigation: ${oldYear}-${oldMonth + 1} → ${newYear}-${newMonth + 1}`)
      }
    }
  })

  // Watch for search query changes and auto-navigate to guest location
  watch(searchQuery, (newQuery) => {
    if (newQuery && newQuery.trim()) {
      const matchingReservation = findAndNavigateToReservation(newQuery)
      
      if (matchingReservation) {
        // Clear highlight after 3 seconds
        setTimeout(() => {
          highlightedReservation.value = null
        }, 3000)
      }
    } else {
      // Clear highlight immediately when search is cleared
      highlightedReservation.value = null
    }
  })

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Validate layout calculations (development helper)
   */
  const validateLayout = () => {
    const layoutInfo = validateGanttLayout()
    
    console.log('📐 Layout validation:', {
      ...layoutInfo,
      actualDateRange: dateRange.value.length
    })

    if (dateRange.value.length !== GANTT_LAYOUT.TOTAL_DATE_COLUMNS) {
      console.warn('⚠️ Date range length mismatch:', {
        expected: GANTT_LAYOUT.TOTAL_DATE_COLUMNS,
        actual: dateRange.value.length
      })
    }
  }

  /**
   * Reset internal navigation flag after a delay
   */
  const resetInternalNavigation = (delay: number = 100) => {
    setTimeout(() => {
      isInternalNavigation.value = false
    }, delay)
  }

  // Initialize on creation
  initializeViewDate()

  return {
    // State
    viewStartDate,
    isInternalNavigation,
    highlightedReservation,
    
    // Computed
    dateRange,
    
    // Navigation functions
    navigateDates,
    jumpToToday,
    navigateToDate,
    initializeViewDate,
    
    // Search navigation
    findAndNavigateToReservation,
    
    // Utilities
    validateLayout,
    resetInternalNavigation,
  }
}
