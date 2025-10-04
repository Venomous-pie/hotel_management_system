export interface Room {
  id: string
  number: string
  roomNumber?: string
  type: string  
  roomType?: string
  status: 'available' | 'occupied' | 'maintenance' | 'out-of-order'
  statusColor: string
  pricePerNight: number
  floorNumber: number 
  maxCapacity: number
  amenities: string[]
  notes?: string
  RoomType?: RoomType
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
  checkInDate?: string | Date
  checkOutDate?: string | Date
  guestName?: string 
  bookingNumber?: string 
  status: 'confirmed' | 'pending' | 'checkedIn' | 'cancelled' | 'checkedOut' | 'new' | 'booked' | 'dueOut' | 'outOfOrder'
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
  Guest?: Guest
}

export interface ReservationFormData {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  address: string
  idDocument: string
  
  numGuest: number
  checkIn: string
  checkOut: string
  specialRequest?: string
  status: 'confirmed' | 'pending' | 'checkedIn'
  roomNumber: string
  roomId?: string
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

export interface ModalState {
  isOpen: boolean
  isLoading: boolean
  error: string | null
  success: boolean
}

export interface RoomAvailability {
  roomNumber: string
  isAvailable: boolean
  conflictingReservations?: Reservation[]
}

export interface DateRange {
  start: Date
  end: Date
}

export interface ReservationFilters {
  status?: string
  roomType?: string
  bookingSource?: string
  dateRange?: DateRange
  searchQuery?: string
}

export interface PrefilledReservationData {
  // Presence of reservationId indicates edit mode
  reservationId?: string

  // Guest fields
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  phone?: string
  countryCode?: string
  address?: string
  idDocument?: string

  // Reservation fields
  numGuest?: number
  checkInDate?: string
  checkOutDate?: string
  specialRequest?: string
  status?: 'confirmed' | 'pending' | 'checkedIn'
  roomNumber?: string
}
