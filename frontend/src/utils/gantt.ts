/**
 * Gantt chart layout and positioning utilities
 * Pure functions for calculating positions and dimensions
 */

// Layout constants
export const GANTT_LAYOUT = {
  ROOM_COLUMN_WIDTH: 270,
  CELL_WIDTH: 61.5,
  TOTAL_DATE_COLUMNS: 16,
  RESERVATION_HEIGHT: 24,
} as const

/**
 * Calculate positioning for reservation spans in Gantt chart
 * @param startIndex - Starting column index
 * @param endIndex - Ending column index  
 * @param rowTop - Top position of the row
 * @returns Style object with positioning
 */
export const calculateReservationSpanStyle = (
  startIndex: number,
  endIndex: number,
  rowTop: number
): { left: string; width: string; top: string; height: string } => {
  const { ROOM_COLUMN_WIDTH, CELL_WIDTH } = GANTT_LAYOUT
  
  const widthCells = endIndex - startIndex + 1
  
  // Cell padding: px-0.5 = 2px on each side (0.125rem * 16px = 2px)
  const CELL_PADDING = 2
  const SPAN_INSET = 1 // Small inset for visual separation
  
  // Calculate left position: room column + (start cell * cell width) + cell padding + inset + start margin
  const START_END_MARGIN = CELL_WIDTH * 0.75 / 4 // 3/4 shorter divided by 4 for start and end margins
  const left = ROOM_COLUMN_WIDTH + (startIndex * CELL_WIDTH) + CELL_PADDING + SPAN_INSET + START_END_MARGIN
  
  // Calculate width: span across multiple cells with reduced width at start and end
  // For multi-cell spans, we need to account for the full cell width including padding between cells
  // Subtract margins from both start and end (2 * START_END_MARGIN)
  const width = (widthCells * CELL_WIDTH) - (2 * CELL_PADDING) - (2 * SPAN_INSET) - (2 * START_END_MARGIN)

  return {
    left: `${left}px`,
    width: `${width}px`,
    top: `${rowTop}px`,
    height: `${GANTT_LAYOUT.RESERVATION_HEIGHT}px`
  }
}

/**
 * Find date range indices within visible date range
 * @param dateRange - Array of visible date objects
 * @param checkInStr - Check-in date string (YYYY-MM-DD)
 * @param checkOutStr - Check-out date string (YYYY-MM-DD)
 * @returns Object with start and end indices, or null if not visible
 */
export const findDateRangeIndices = (
  dateRange: Array<{ date: string }>,
  checkInStr: string,
  checkOutStr: string
): { startIndex: number; endIndex: number } | null => {
  let startIndex = -1
  let endIndex = -1

  // Debug logging for date range finding
  if (import.meta.env.DEV) {
    console.log(`🔍 Finding indices for ${checkInStr} to ${checkOutStr}`)
    console.log('📅 Available dates:', dateRange.map((d, idx) => `${idx}:${d.date.split('T')[0]}`).join(' '))
  }

  dateRange.forEach((d, idx) => {
    const dayStr = d.date.split('T')[0]
    // Include both check-in date and check-out date (inclusive checkout)
    if (dayStr >= checkInStr && dayStr <= checkOutStr) {
      if (startIndex === -1) startIndex = idx
      endIndex = idx
    }
  })

  const result = startIndex !== -1 && endIndex !== -1 
    ? { startIndex, endIndex }
    : null

  if (import.meta.env.DEV) {
    console.log(`📍 Result: ${result ? `${result.startIndex}-${result.endIndex}` : 'null'}`)
  }

  return result
}

/**
 * Validate Gantt chart layout dimensions
 * @returns Layout validation info for debugging
 */
export const validateGanttLayout = () => {
  const { ROOM_COLUMN_WIDTH, CELL_WIDTH, TOTAL_DATE_COLUMNS } = GANTT_LAYOUT
  const EXPECTED_MIN_WIDTH = ROOM_COLUMN_WIDTH + (TOTAL_DATE_COLUMNS * CELL_WIDTH)

  return {
    roomColumnWidth: ROOM_COLUMN_WIDTH,
    cellWidth: CELL_WIDTH,
    totalDateColumns: TOTAL_DATE_COLUMNS,
    expectedMinWidth: EXPECTED_MIN_WIDTH,
  }
}

/**
 * Debug positioning calculations for a reservation span
 * @param startIndex - Starting column index
 * @param endIndex - Ending column index
 * @param checkInStr - Check-in date string
 * @param checkOutStr - Check-out date string
 * @returns Debug information about the positioning
 */
export const debugReservationSpanPositioning = (
  startIndex: number,
  endIndex: number,
  checkInStr: string,
  checkOutStr: string
) => {
  const { ROOM_COLUMN_WIDTH, CELL_WIDTH } = GANTT_LAYOUT
  const widthCells = endIndex - startIndex + 1
  const CELL_PADDING = 2
  const SPAN_INSET = 1
  
  const left = ROOM_COLUMN_WIDTH + (startIndex * CELL_WIDTH) + CELL_PADDING + SPAN_INSET
  const width = (widthCells * CELL_WIDTH) - (2 * CELL_PADDING) - (2 * SPAN_INSET)
  
  return {
    reservation: { checkIn: checkInStr, checkOut: checkOutStr },
    indices: { startIndex, endIndex, widthCells },
    positioning: { left, width },
    calculations: {
      roomColumnWidth: ROOM_COLUMN_WIDTH,
      cellWidth: CELL_WIDTH,
      cellPadding: CELL_PADDING,
      spanInset: SPAN_INSET,
      leftCalculation: `${ROOM_COLUMN_WIDTH} + (${startIndex} * ${CELL_WIDTH}) + ${CELL_PADDING} + ${SPAN_INSET} = ${left}`,
      widthCalculation: `(${widthCells} * ${CELL_WIDTH}) - (2 * ${CELL_PADDING}) - (2 * ${SPAN_INSET}) = ${width}`
    }
  }
}

/**
 * Normalize date string to YYYY-MM-DD format
 * Handles various input formats and timezone issues
 * @param dateInput - Date string or Date object
 * @returns Normalized date string in YYYY-MM-DD format
 */
export const normalizeDateString = (dateInput: string | Date): string => {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    
    // Use local date components to avoid timezone issues
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error normalizing date:', dateInput, error)
    return ''
  }
}

/**
 * Validate that a reservation span should be visible in the current date range
 * @param checkInStr - Check-in date (YYYY-MM-DD)
 * @param checkOutStr - Check-out date (YYYY-MM-DD)
 * @param dateRange - Array of visible dates
 * @returns Validation result with details
 */
export const validateReservationVisibility = (
  checkInStr: string,
  checkOutStr: string,
  dateRange: Array<{ date: string }>
) => {
  const firstVisible = dateRange[0]?.date.split('T')[0]
  const lastVisible = dateRange[dateRange.length - 1]?.date.split('T')[0]
  
  // Check if reservation overlaps with visible range
  const overlaps = checkInStr < lastVisible && checkOutStr > firstVisible
  
  return {
    checkIn: checkInStr,
    checkOut: checkOutStr,
    visibleRange: { first: firstVisible, last: lastVisible },
    overlaps,
    reason: overlaps ? 'visible' : 
            checkOutStr <= firstVisible ? 'before visible range' :
            checkInStr >= lastVisible ? 'after visible range' : 'unknown'
  }
}

/**
 * Generate date range for Gantt chart display
 * @param startDate - Starting date for the range
 * @param numberOfDays - Number of days to generate (default: 16)
 * @returns Array of date objects with formatted display information
 */
export const generateDateRange = (
  startDate: Date, 
  numberOfDays: number = GANTT_LAYOUT.TOTAL_DATE_COLUMNS
): Array<{ date: string; dayName: string; dayNumber: string }> => {
  const days = []
  const baseDate = new Date(startDate)

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(baseDate)
    date.setDate(baseDate.getDate() + i)

    days.push({
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate().toString().padStart(2, '0')
    })
  }

  return days
}
