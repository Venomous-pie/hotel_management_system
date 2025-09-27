/**
 * Date utility module for consistent date handling across components
 * Pure functions only (no Vue imports). Prefer using this over composables for date helpers.
 */

/**
 * Get today's date with time reset to midnight for consistent comparisons
 * @returns Date object with time set to 00:00:00.000
 */
export const getTodayAtMidnight = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to midnight for consistent date handling
  return today
}

/**
 * Format a Date object as YYYY-MM-DD string for HTML date inputs
 * @param date - Date object to format
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Get today's date formatted as YYYY-MM-DD string
 * @returns Today's date as YYYY-MM-DD string
 */
export const getTodayAsString = (): string => {
  return formatDateForInput(getTodayAtMidnight())
}

/**
 * Create a Date object from YYYY-MM-DD string with time set to midnight
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object with time set to midnight
 */
export const createDateFromString = (dateString: string): Date => {
  const date = new Date(dateString)
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Compare two date strings (YYYY-MM-DD format) 
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDateStrings = (date1: string, date2: string): number => {
  if (date1 < date2) return -1
  if (date1 > date2) return 1
  return 0
}

/**
 * Check if a date string is in the past compared to today
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if the date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  const todayString = getTodayAsString()
  return compareDateStrings(dateString, todayString) < 0
}

/**
 * Check if a date string is today
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if the date is today
 */
export const isDateToday = (dateString: string): boolean => {
  const todayString = getTodayAsString()
  return compareDateStrings(dateString, todayString) === 0
}

/**
 * Check if a date string is in the future compared to today
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if the date is in the future
 */
export const isDateInFuture = (dateString: string): boolean => {
  const todayString = getTodayAsString()
  return compareDateStrings(dateString, todayString) > 0
}

/**
 * Add days to a date string
 * @param dateString - Date string in YYYY-MM-DD format
 * @param days - Number of days to add (can be negative)
 * @returns New date string with days added
 */
export const addDaysToDateString = (dateString: string, days: number): string => {
  const date = createDateFromString(dateString)
  date.setDate(date.getDate() + days)
  return formatDateForInput(date)
}

/**
 * Calculate the number of days between two date strings
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @returns Number of days between the dates
 */
export const daysBetweenDates = (startDate: string, endDate: string): number => {
  const start = createDateFromString(startDate)
  const end = createDateFromString(endDate)
  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
