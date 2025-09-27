// Core hotel management types
export interface Room {
  id: string
  number: string
  type: string
  status: 'available' | 'occupied' | 'maintenance' | 'out-of-order'
  statusColor: string
  pricePerNight: number
  floorNumber: number
  maxCapacity: number
  amenities: string[]
  notes?: string
}

export interface RoomType {
  id: number
  typeName: string
  description: string
  maxCapacity: number
  basePrice: number
}

export interface Guest {
  id?: number
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone: string
  address: string
  idDocument: string
}

export interface Reservation {
  id?: string
  room: string
  guest: string
  checkIn: string | Date
  checkOut: string | Date
  status: 'confirmed' | 'pending' | 'checkedIn' | 'cancelled'
  type?: 'standard' | 'vip' | 'family' | 'group'
  amount: number
  balance?: number
  source?: 'direct' | 'booking.com' | 'expedia' | 'airbnb' | 'kayak'
  orders?: number
  bookingDate?: string | Date
  notes?: string
  numGuest: number
  specialRequest?: string
  totalPrice: number
  roomNumber: string
  RoomId?: number
  GuestId?: number
}

// Form interfaces for the reservation modal
export interface ReservationFormData {
  // Guest information
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  address: string
  idDocument: string
  
  // Reservation details
  numGuest: number
  checkIn: string
  checkOut: string
  specialRequest?: string
  status: 'confirmed' | 'pending' | 'checkedIn'
  roomNumber: string
  roomId?: string
  // totalPrice is calculated by backend, not sent from frontend
}

export interface ValidationErrors {
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  idDocument?: string
  numGuest?: string
  checkIn?: string
  checkOut?: string
  roomNumber?: string
  general?: string
}

export interface ApiError {
  error: string
  conflictingReservation?: {
    checkIn: string
    checkOut: string
  }
}

// Modal state interfaces
export interface ModalState {
  isOpen: boolean
  isLoading: boolean
  error: string | null
  success: boolean
}

// Room availability interface
export interface RoomAvailability {
  roomNumber: string
  isAvailable: boolean
  conflictingReservations?: Reservation[]
}

// Date range interface
export interface DateRange {
  start: Date
  end: Date
}

// Filter interfaces
export interface ReservationFilters {
  status?: string
  roomType?: string
  bookingSource?: string
  dateRange?: DateRange
  searchQuery?: string
}
