export type ReservationStatus = 'confirmed' | 'pending' | 'checkedIn' | 'checkedOut' | 'cancelled'

export interface Room {
  id: string
  number: string
  type: string
  status: 'available' | 'occupied' | 'maintenance'
  statusColor: string
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
  status: ReservationStatus
  type: 'standard' | 'vip' | 'group' | 'family'
  amount: number
  balance: number
  source: string
  orders?: number
  bookingDate?: string
  notes?: string
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

export interface HotelData {
  years: number[]
  months: string[]
  roomCategories: RoomCategory[]
  reservations: Reservation[]
}

export interface Props {
  searchQuery: string
  selectedFilters: {
    checkIn: string
    cancelled: string
    booking: string
    guest: string
    status: string
  }
}

export interface ReservationFilters {
  searchQuery?: string
  checkIn?: string
  cancelled?: string
  booking?: string
  guest?: string
  status?: string
}
