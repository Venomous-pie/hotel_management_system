export interface Room {
  id: string
  number: string
  type: string
  status: 'available' | 'occupied' | 'maintenance'
  statusColor?: string
}

export interface RoomCategory {
  name: string
  expanded: boolean
  rooms: Room[]
}

export interface Reservation {
  id: string
  room: string
  guest: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'checkedIn' | 'cancelled'
  type: 'standard' | 'vip' | 'group' | 'family'
}

export interface DateRange {
  full: string
  day: string
  date: string
}

export interface FrontdeskFilters {
  searchQuery: string
  bookingSearchQuery: string
  selectedYear: number
  selectedMonth: string
  selectedReservationType: string
  selectedRoomType: string
  selectedBookingOption: string
}

export interface WeeklyStats {
  available: number
  occupied: number
  reservations: number
}

export interface ColorSchemes {
  roomStatusColors: Record<string, string>
  reservationTypeColors: Record<string, string>
  reservationStatusColors: Record<string, string>
}

export interface HotelData {
  years: number[]
  months: string[]
  roomCategories: RoomCategory[]
  reservations: Reservation[]
  roomStatusColors: Record<string, string>
  reservationTypeColors: Record<string, string>
  reservationStatusColors: Record<string, string>
}