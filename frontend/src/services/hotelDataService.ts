import { ref, computed } from 'vue'
import type { 
  HotelData, 
  RoomCategory, 
  Reservation, 
  FrontdeskFilters,
  ReservationFilters,
  WeeklyStats,
  DateRange 
} from '../types/hotel'
import hotelData from '../data/hotelData.json'

/**
 * Centralized Hotel Data Service
 * Handles all data fetching, filtering, and business logic
 */
class HotelDataService {
  private data = ref<HotelData>(hotelData as HotelData)
  private loading = ref(false)
  private error = ref<string | null>(null)

  // Getters for reactive data
  get hotelData() {
    return this.data.value
  }

  get isLoading() {
    return this.loading.value
  }

  get hasError() {
    return this.error.value
  }

  get years() {
    return this.data.value.years
  }

  get months() {
    return this.data.value.months
  }

  get roomCategories() {
    return this.data.value.roomCategories
  }

  get reservations() {
    return this.data.value.reservations
  }

  // Initialize data (simulate API call)
  async initialize(): Promise<void> {
    this.loading.value = true
    this.error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Initialize room categories with expanded state
      this.data.value.roomCategories = this.data.value.roomCategories.map(category => ({
        ...category,
        expanded: category.expanded !== undefined ? category.expanded : true
      }))
      
    } catch (err) {
      this.error.value = 'Failed to initialize hotel data'
      console.error('Hotel data initialization error:', err)
    } finally {
      this.loading.value = false
    }
  }

  // Reload reservations (simulate API refresh)
  async reloadReservations(): Promise<void> {
    this.loading.value = true
    this.error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would fetch from API
      this.data.value.reservations = hotelData.reservations as Reservation[]
    } catch (err) {
      this.error.value = 'Failed to reload reservations'
      console.error('Reservations reload error:', err)
    } finally {
      this.loading.value = false
    }
  }

  // Filter room categories based on frontdesk filters
  getFilteredRoomCategories(filters: FrontdeskFilters): RoomCategory[] {
    return this.roomCategories.map(category => {
      let filteredRooms = category.rooms

      // Filter by room type
      if (filters.selectedRoomType && filters.selectedRoomType !== 'All Rooms') {
        const typeMap: Record<string, string> = {
          'Single': 'Standard Single',
          'Double': 'Twin Double', 
          'Family': 'Family Suite',
          'Suite': 'Suite'
        }
        const filterType = typeMap[filters.selectedRoomType]
        if (filterType) {
          filteredRooms = filteredRooms.filter(room => 
            room.type.toLowerCase().includes(filterType.toLowerCase())
          )
        }
      }

      // Filter by search query
      if (filters.searchQuery) {
        filteredRooms = filteredRooms.filter(room => 
          room.number.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
          room.type.toLowerCase().includes(filters.searchQuery!.toLowerCase())
        )
      }

      return {
        ...category,
        rooms: filteredRooms
      }
    }).filter(category => category.rooms.length > 0)
  }

  // Filter reservations based on frontdesk filters
  getFilteredReservations(filters: FrontdeskFilters): Reservation[] {
    let reservations = this.reservations

    // Filter by reservation type
    if (filters.selectedReservationType && filters.selectedReservationType !== 'All Types') {
      const typeMap: Record<string, string> = {
        'Standard': 'standard',
        'Premium': 'standard',
        'VIP': 'vip',
        'Group Booking': 'group',
        'Family': 'family'
      }
      const filterType = typeMap[filters.selectedReservationType]
      if (filterType) {
        reservations = reservations.filter(res => res.type === filterType)
      }
    }

    // Filter by booking status
    if (filters.selectedBookingOption && filters.selectedBookingOption !== 'All Options') {
      const statusMap: Record<string, string> = {
        'Confirmed': 'confirmed',
        'Pending': 'pending',
        'Cancelled': 'cancelled',
        'Checked In': 'checkedIn',
        'Checked Out': 'checkedOut'
      }
      const filterStatus = statusMap[filters.selectedBookingOption]
      if (filterStatus) {
        reservations = reservations.filter(res => res.status === filterStatus)
      }
    }

    // Filter by booking search query
    if (filters.bookingSearchQuery) {
      reservations = reservations.filter(res => 
        res.guest.toLowerCase().includes(filters.bookingSearchQuery!.toLowerCase()) ||
        res.room.toLowerCase().includes(filters.bookingSearchQuery!.toLowerCase()) ||
        res.id.toLowerCase().includes(filters.bookingSearchQuery!.toLowerCase())
      )
    }

    return reservations
  }

  // Filter reservations for reservation table
  filterReservationsForTable(filters: ReservationFilters): Reservation[] {
    let filtered = this.reservations

    if (filters.searchQuery) {
      filtered = filtered.filter(res => 
        res.guest.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        res.room.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        res.id.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      )
    }

    if (filters.status && filters.status !== 'All') {
      const statusMap: Record<string, string> = {
        'confirmed': 'confirmed',
        'pending': 'pending',
        'checkedIn': 'checkedIn',
        'cancelled': 'cancelled'
      }
      const filterStatus = statusMap[filters.status]
      if (filterStatus) {
        filtered = filtered.filter(res => res.status === filterStatus)
      }
    }

    return filtered
  }

  // Get reservation for specific room and date
  getReservation(roomNumber: string, date: string, reservations?: Reservation[]): Reservation | undefined {
    const reservationList = reservations || this.reservations
    return reservationList.find(res => {
      const checkIn = new Date(res.checkIn)
      const checkOut = new Date(res.checkOut)
      const currentDate = new Date(date)
      
      return res.room === roomNumber && 
             currentDate >= checkIn && 
             currentDate <= checkOut
    })
  }

  // Get available rooms count for category and date
  getAvailableRoomsCount(categoryName: string, date: string, categories: RoomCategory[], reservations: Reservation[]): number {
    const category = categories.find(cat => cat.name === categoryName)
    if (!category) return 0
    
    const available = category.rooms.filter(room => {
      const hasReservation = this.getReservation(room.number || room.id, date, reservations)
      return !hasReservation && room.status === 'available'
    }).length
    
    return available
  }

  // Get weekly statistics
  getWeeklyStats(filteredCategories: RoomCategory[], filteredReservations: Reservation[], dateRange: DateRange[]): WeeklyStats {
    const stats: WeeklyStats = { available: 0, occupied: 0, reservations: 0 }
    
    filteredCategories.forEach(category => {
      category.rooms.forEach(room => {
        if (room.status === 'available') stats.available++
        else if (room.status === 'occupied') stats.occupied++
      })
    })
    
    const rangeStart = new Date(dateRange[0].full)
    const rangeEnd = new Date(dateRange[dateRange.length - 1].full)
    
    stats.reservations = filteredReservations.filter(reservation => {
      const checkIn = new Date(reservation.checkIn)
      const checkOut = new Date(reservation.checkOut)
      return checkIn <= rangeEnd && checkOut >= rangeStart
    }).length
    
    return stats
  }

  // Generate date range for calendar view
  generateDateRange(startDate: Date, days: number = 18): DateRange[] {
    const dates: DateRange[] = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      dates.push({
        full: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString().padStart(2, '0')
      })
    }
    
    return dates
  }

  // Calculate week start from month/year
  calculateWeekStart(year: number, month: string, filteredReservations: Reservation[]): Date {
    const monthIndex = this.months.indexOf(month)
    if (monthIndex < 0) return new Date()
    
    const reservationsInMonth = filteredReservations.filter(res => {
      const checkIn = new Date(res.checkIn)
      const checkOut = new Date(res.checkOut)
      return (checkIn.getFullYear() === year && checkIn.getMonth() === monthIndex) ||
             (checkOut.getFullYear() === year && checkOut.getMonth() === monthIndex)
    })
    
    if (reservationsInMonth.length > 0) {
      const earliestDate = new Date(Math.min(...reservationsInMonth.map(res => new Date(res.checkIn).getTime())))
      const dayOfWeek = earliestDate.getDay() === 0 ? 7 : earliestDate.getDay()
      const monday = new Date(earliestDate)
      monday.setDate(earliestDate.getDate() - dayOfWeek + 1)
      return monday
    } else {
      const targetDate = new Date(year, monthIndex, 1)
      const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay()
      const monday = new Date(targetDate)
      monday.setDate(targetDate.getDate() - dayOfWeek + 1)
      return monday
    }
  }

  // Room category management
  toggleRoomCategory(categoryName: string): void {
    const category = this.data.value.roomCategories.find(cat => cat.name === categoryName)
    if (category) {
      category.expanded = !category.expanded
    }
  }

  // Reservation management methods (for future implementation)
  async createReservation(reservationData: Partial<Reservation>): Promise<Reservation> {
    // This would typically make an API call
    const newReservation: Reservation = {
      id: `${Date.now()}`,
      room: reservationData.room || '',
      guest: reservationData.guest || '',
      checkIn: reservationData.checkIn || '',
      checkOut: reservationData.checkOut || '',
      status: reservationData.status || 'pending',
      type: reservationData.type || 'standard',
      amount: reservationData.amount || 0,
      balance: reservationData.balance || 0,
      orders: reservationData.orders || 0,
      source: reservationData.source || 'direct',
      bookingDate: new Date().toISOString().split('T')[0],
      notes: reservationData.notes || ''
    }

    this.data.value.reservations.push(newReservation)
    return newReservation
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const index = this.data.value.reservations.findIndex(res => res.id === id)
    if (index === -1) return null

    this.data.value.reservations[index] = {
      ...this.data.value.reservations[index],
      ...updates
    }

    return this.data.value.reservations[index]
  }

  async deleteReservation(id: string): Promise<boolean> {
    const index = this.data.value.reservations.findIndex(res => res.id === id)
    if (index === -1) return false

    this.data.value.reservations.splice(index, 1)
    return true
  }
}

// Create singleton instance
export const hotelDataService = new HotelDataService()
export default hotelDataService
