// Re-export all hotel-related types
export * from './hotel'

// Additional utility types for the application
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  total?: number
}

export interface FilterParams {
  searchQuery?: string
  status?: string
  type?: string
  dateRange?: {
    start: string
    end: string
  }
}