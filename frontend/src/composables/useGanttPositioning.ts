import { ref, nextTick, type Ref, type ComponentPublicInstance } from 'vue'

export const useGanttPositioning = (
  roomCategories: Ref<any[]>,
  expandedCategories: Ref<Record<string, boolean>>,
) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Reference to the main container element
   */
  const containerEl = ref<HTMLElement | null>(null)

  /**
   * Track DOM refs for each room row to compute exact vertical positions
   * Maps room numbers to their corresponding DOM elements
   */
  const rowRefs = ref<Record<string, HTMLElement | null>>({})

  /**
   * Cache of computed top positions (relative to container) per room
   * Stores calculated vertical positions for overlay positioning
   */
  const rowTops = ref<Record<string, number>>({})

  // ============================================================================
  // DOM REFERENCE MANAGEMENT
  // ============================================================================

  /**
   * Set row reference for positioning calculations
   * @param roomNumber - Room number identifier
   * @param el - DOM element or Vue component instance
   */
  const setRowRef = (roomNumber: string, el: Element | ComponentPublicInstance | null): void => {
    // Vue may pass a component instance; extract its $el
    const domEl = el && (el as any).$el ? ((el as any).$el as Element) : (el as Element | null)
    rowRefs.value[roomNumber] = (domEl as HTMLElement) || null
  }

  /**
   * Clear all row references (useful for cleanup)
   */
  const clearRowRefs = (): void => {
    rowRefs.value = {}
    rowTops.value = {}
  }

  /**
   * Get row reference for a specific room
   */
  const getRowRef = (roomNumber: string): HTMLElement | null => {
    return rowRefs.value[roomNumber] || null
  }

  // ============================================================================
  // POSITION CALCULATIONS
  // ============================================================================

  /**
   * Compute vertical positions for all room rows
   * Calculates exact pixel positions for overlay anchoring
   */
  const computeRowTops = (): void => {
    const container = containerEl.value
    if (!container) {
      return
    }

    const containerRect = container.getBoundingClientRect()
    const tops: Record<string, number> = {}
    let computedCount = 0

    for (const category of roomCategories.value) {
      if (!expandedCategories.value[category.type]) continue

      for (const room of category.rooms) {
        const tr = rowRefs.value[room.number]
        if (tr) {
          const r = tr.getBoundingClientRect()
          const offset = Math.max(0, (r.height - 24) / 2)
          tops[room.number] = r.top - containerRect.top + offset
          computedCount++
        }
      }
    }

    rowTops.value = tops
  }

  /**
   * Get fallback positioning for a room when DOM refs aren't available yet
   * @param roomNumber - Room number to calculate fallback position for
   * @returns Estimated top position in pixels
   */
  const getFallbackPosition = (roomNumber: string): number => {
    let fallbackTop = 0

    // Find the room's position in its category
    for (const category of roomCategories.value) {
      if (!expandedCategories.value[category.type]) {
        continue // Skip collapsed categories
      }

      // Add category header height (48px)
      fallbackTop += 48

      for (const room of category.rooms) {
        if (room.number === roomNumber) {
          // Found our room, center vertically in the 48px row
          const roomCenterTop = fallbackTop + 12 // Center of the 48px row
          return roomCenterTop
        }
        fallbackTop += 48 // Each room row is 48px high
      }

      // If we found the room, break out of category loop
      const roomFound = category.rooms.some((room: any) => room.number === roomNumber)
      if (roomFound) break
    }

    return fallbackTop + 12
  }

  /**
   * Get top position for a room (with fallback if not computed)
   */
  const getRoomTopPosition = (roomNumber: string): number => {
    // Return cached position if available
    if (rowTops.value[roomNumber] !== undefined) {
      const cachedPosition = rowTops.value[roomNumber]
      return cachedPosition
    }

    // Calculate and cache fallback position
    const fallbackTop = getFallbackPosition(roomNumber)
    rowTops.value[roomNumber] = fallbackTop
    return fallbackTop
  }

  // ============================================================================
  // CONTAINER MANAGEMENT
  // ============================================================================

  /**
   * Set the container element reference
   */
  const setContainerRef = (el: HTMLElement | null): void => {
    containerEl.value = el
    if (el) {
      nextTick(() => {
        computeRowTops()
      })
    }
  }

  /**
   * Get container dimensions
   */
  const getContainerDimensions = () => {
    if (!containerEl.value) return null

    const rect = containerEl.value.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
    }
  }

  /**
   * Check if container is available
   */
  const hasContainer = (): boolean => {
    return containerEl.value !== null
  }

  // ============================================================================
  // POSITIONING UTILITIES
  // ============================================================================

  /**
   * Force recomputation of all positions
   * Useful after layout changes, category expansions, etc.
   */
  const recomputePositions = async (): Promise<void> => {
    // Wait for DOM updates
    await nextTick()

    // Clear existing positions
    rowTops.value = {}

    // Recompute positions
    computeRowTops()
  }

  /**
   * Update positions for specific rooms only
   * More efficient than full recomputation
   */
  const updateRoomPositions = async (roomNumbers: string[]): Promise<void> => {
    await nextTick()

    const container = containerEl.value
    if (!container) return

    const containerRect = container.getBoundingClientRect()

    for (const roomNumber of roomNumbers) {
      const tr = rowRefs.value[roomNumber]
      if (tr) {
        const r = tr.getBoundingClientRect()
        const offset = Math.max(0, (r.height - 24) / 2)
        rowTops.value[roomNumber] = r.top - containerRect.top + offset
      }
    }
  }

  /**
   * Get all computed positions
   */
  const getAllPositions = (): Record<string, number> => {
    return { ...rowTops.value }
  }

  /**
   * Check if positions are computed for all visible rooms
   */
  const arePositionsComputed = (): boolean => {
    for (const category of roomCategories.value) {
      if (!expandedCategories.value[category.type]) continue

      for (const room of category.rooms) {
        if (rowTops.value[room.number] === undefined) {
          return false
        }
      }
    }
    return true
  }

  // ============================================================================
  // SCROLL & VIEWPORT UTILITIES
  // ============================================================================

  /**
   * Scroll to a specific room
   */
  const scrollToRoom = (roomNumber: string): void => {
    const roomEl = rowRefs.value[roomNumber]
    if (roomEl && containerEl.value) {
      roomEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }

  /**
   * Check if a room is currently visible in the viewport
   */
  const isRoomVisible = (roomNumber: string): boolean => {
    const roomEl = rowRefs.value[roomNumber]
    const container = containerEl.value

    if (!roomEl || !container) return false

    const roomRect = roomEl.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    return (
      roomRect.top >= containerRect.top &&
      roomRect.bottom <= containerRect.bottom &&
      roomRect.left >= containerRect.left &&
      roomRect.right <= containerRect.right
    )
  }

  /**
   * Get visible room numbers in current viewport
   */
  const getVisibleRooms = (): string[] => {
    const visibleRooms: string[] = []

    for (const category of roomCategories.value) {
      if (!expandedCategories.value[category.type]) continue

      for (const room of category.rooms) {
        if (isRoomVisible(room.number)) {
          visibleRooms.push(room.number)
        }
      }
    }

    return visibleRooms
  }

  // ============================================================================
  // PERFORMANCE OPTIMIZATION
  // ============================================================================

  /**
   * Debounced position recomputation
   */
  let recomputeTimeout: ReturnType<typeof setTimeout> | null = null

  const debouncedRecompute = (delay: number = 100): void => {
    if (recomputeTimeout) {
      clearTimeout(recomputeTimeout)
    }

    recomputeTimeout = setTimeout(() => {
      recomputePositions()
      recomputeTimeout = null
    }, delay)
  }

  /**
   * Validate positioning system for debugging
   */
  const validatePositioning = (): void => {
    if (!import.meta.env.DEV) return

    // Check for rooms with missing positions
    const missingPositions: string[] = []
    for (const category of roomCategories.value) {
      if (!expandedCategories.value[category.type]) continue

      for (const room of category.rooms) {
        if (!rowTops.value[room.number] && !rowRefs.value[room.number]) {
          missingPositions.push(room.number)
        }
      }
    }
  }

  /**
   * Cleanup function for component unmount
   */
  const cleanup = (): void => {
    if (recomputeTimeout) {
      clearTimeout(recomputeTimeout)
      recomputeTimeout = null
    }
    clearRowRefs()
    containerEl.value = null
  }

  return {
    // State
    containerEl,
    rowRefs,
    rowTops,

    // DOM reference management
    setRowRef,
    clearRowRefs,
    getRowRef,

    // Container management
    setContainerRef,
    getContainerDimensions,
    hasContainer,

    // Position calculations
    computeRowTops,
    getFallbackPosition,
    getRoomTopPosition,
    recomputePositions,
    updateRoomPositions,
    getAllPositions,
    arePositionsComputed,

    // Scroll & viewport
    scrollToRoom,
    isRoomVisible,
    getVisibleRooms,

    // Performance
    debouncedRecompute,
    cleanup,

    // Debugging
    validatePositioning,
  }
}
