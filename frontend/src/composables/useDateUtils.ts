export const useDateUtils = () => {
  // Utility functions
  const isToday = (dateString: string): boolean => {
    const today = new Date().toISOString().split('T')[0]
    return dateString === today
  }

  const isWeekend = (dateString: string): boolean => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    return `${startFormatted} - ${endFormatted}`
  }

  return {
    isToday,
    isWeekend,
    formatDate,
    formatDateRange
  }
}