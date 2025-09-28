/**
 * Composables index - centralized exports for Vue composables
 * Encapsulates reusable Vue logic, never UI components
 */

// Hotel data management
export { useHotelData } from './useHotelData'

// New domain-focused composables
export { useGanttNavigation } from './useGanttNavigation'
export { useReservationManagement } from './useReservationManagement'
export { useRoomCategorization } from './useRoomCategorization'
export { useGanttPositioning } from './useGanttPositioning'

// Legacy composables (deprecated - use new domain-focused ones above)
export { useReservationLogic } from './useReservationLogic'
export { useReservationSearch } from './useReservationSearch'
export { useRoomCategories } from './useRoomCategories'
