import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { 
  HotelData, 
  RoomCategory, 
  Reservation, 
  FrontdeskFilters,
  WeeklyStats,
  DateRange 
} from '../types/hotel'
import hotelData from '../data/hotelData.json'

export const useHotelStore = defineStore('hotel', () => {
  // State
  const data = ref<HotelData>(hotelData as HotelData)
  const roomCategories = ref<RoomCategory[]>([])
  const currentWeekStart = ref(new Date())
  const showReservationModal = ref(false)
  const selectedReservation = ref<Reservation | null>(null)

  const initializeRoomCategories = () => {
    roomCategories.value = data.value.roomCategories.map(category => ({
      ...category,
      expanded: category.expanded !== undefined ? category.expanded : true
    }))
  }

  const dateRange = computed((): DateRange[] => {
    const dates: DateRange[] = []
    const startDate = new Date(currentWeekStart.value)
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      dates.push({
        full: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString().padStart(2, '0')
      })
    }
    
    return dates
  })

  const getFilteredRoomCategories = (filters: FrontdeskFilters) => {
    return computed(() => {
      return roomCategories.value.map(category => {
        let filteredRooms = category.rooms

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

        if (filters.searchQuery) {
          filteredRooms = filteredRooms.filter(room => 
            room.number.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            room.type.toLowerCase().includes(filters.searchQuery.toLowerCase())
          )
        }

        return {
          ...category,
          rooms: filteredRooms
        }
      }).filter(category => category.rooms.length > 0)
    })
  }

  const getFilteredReservations = (filters: FrontdeskFilters) => {
    return computed(() => {
      let reservations = data.value.reservations

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

      if (filters.selectedBookingOption && filters.selectedBookingOption !== 'All Options') {
        const statusMap: Record<string, string> = {
          'Confirmed': 'confirmed',
          'Pending': 'pending',
          'Cancelled': 'cancelled',
          'Checked In': 'checkedIn'
        }
        const filterStatus = statusMap[filters.selectedBookingOption]
        if (filterStatus) {
          reservations = reservations.filter(res => res.status === filterStatus)
        }
      }

      if (filters.bookingSearchQuery) {
        reservations = reservations.filter(res => 
          res.guest.toLowerCase().includes(filters.bookingSearchQuery.toLowerCase()) ||
          res.room.toLowerCase().includes(filters.bookingSearchQuery.toLowerCase()) ||
          res.id.toLowerCase().includes(filters.bookingSearchQuery.toLowerCase())
        )
      }

      return reservations
    })
  }

  const getWeeklyStats = (filteredCategories: RoomCategory[], filteredReservations: Reservation[]) => {
    return computed((): WeeklyStats => {
      const stats: WeeklyStats = { available: 0, occupied: 0, reservations: 0 }
      
      filteredCategories.forEach(category => {
        category.rooms.forEach(room => {
          if (room.status === 'available') stats.available++
          else if (room.status === 'occupied') stats.occupied++
        })
      })
      
      const rangeStart = new Date(dateRange.value[0].full)
      const rangeEnd = new Date(dateRange.value[dateRange.value.length - 1].full)
      
      stats.reservations = filteredReservations.filter(reservation => {
        const checkIn = new Date(reservation.checkIn)
        const checkOut = new Date(reservation.checkOut)
        return checkIn <= rangeEnd && checkOut >= rangeStart
      }).length
      
      return stats
    })
  }

  const setWeekFromMonthYear = (year: number, month: string, filteredReservations: Reservation[]) => {
    const monthIndex = data.value.months.indexOf(month)
    if (monthIndex >= 0) {
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
        currentWeekStart.value = monday
      } else {
        const targetDate = new Date(year, monthIndex, 1)
        const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay()
        const monday = new Date(targetDate)
        monday.setDate(targetDate.getDate() - dayOfWeek + 1)
        currentWeekStart.value = monday
      }
    }
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() + (direction * 7))
    currentWeekStart.value = newDate
  }

  const toggleCategory = (categoryName: string) => {
    const category = roomCategories.value.find(cat => cat.name === categoryName)
    if (category) {
      category.expanded = !category.expanded
    }
  }

  const openReservationModal = (reservation: Reservation) => {
    selectedReservation.value = reservation
    showReservationModal.value = true
  }

  const closeReservationModal = () => {
    showReservationModal.value = false
    selectedReservation.value = null
  }

  // Actions
  const initialize = () => {
    initializeRoomCategories()
  }

  return {
    data,
    roomCategories,
    currentWeekStart,
    showReservationModal,
    selectedReservation,
    dateRange,

    getFilteredRoomCategories,
    getFilteredReservations,
    getWeeklyStats,

    initialize,
    setWeekFromMonthYear,
    navigateWeek,
    toggleCategory,
    openReservationModal,
    closeReservationModal
  }
})