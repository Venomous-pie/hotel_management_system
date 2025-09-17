import { ref, computed, onMounted } from 'vue'
import hotelData from '../data/hotelData.json'

export function useReservationTable() {
  const reservations = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Initialize reservations data
  const loadReservations = async () => {
    try {
      loading.value = true
      error.value = null
      
      // In a real app, this would be an API call
      // For now, we'll use the JSON data
      reservations.value = hotelData.reservations || []
      
    } catch (err) {
      error.value = 'Failed to load reservations'
      console.error('Error loading reservations:', err)
    } finally {
      loading.value = false
    }
  }

  // Filter reservations based on criteria
  const filterReservations = (filters) => {
    let filtered = reservations.value

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(res => 
        res.guest.toLowerCase().includes(query) ||
        res.room.toLowerCase().includes(query) ||
        res.id.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (filters.status && filters.status !== 'All') {
      const statusMap = {
        'Confirmed': 'confirmed',
        'Pending': 'pending',
        'Checked In': 'checkedIn',
        'Cancelled': 'cancelled'
      }
      const filterStatus = statusMap[filters.status]
      if (filterStatus) {
        filtered = filtered.filter(res => res.status === filterStatus)
      }
    }

    // Filter by guest type
    if (filters.guest && filters.guest !== 'All') {
      const guestMap = {
        'Regular': 'standard',
        'VIP': 'vip',
        'Corporate': 'group'
      }
      const filterType = guestMap[filters.guest]
      if (filterType) {
        filtered = filtered.filter(res => res.type === filterType)
      }
    }

    // Filter by booking type
    if (filters.booking && filters.booking !== 'All') {
      const bookingMap = {
        'Standard': 'standard',
        'Premium': 'vip',
        'VIP': 'vip'
      }
      const filterType = bookingMap[filters.booking]
      if (filterType) {
        filtered = filtered.filter(res => res.type === filterType)
      }
    }

    // Filter by check-in date
    if (filters.checkIn && filters.checkIn !== 'All') {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      switch (filters.checkIn) {
        case 'Today':
          filtered = filtered.filter(res => res.checkIn === todayStr)
          break
        case 'Tomorrow':
          filtered = filtered.filter(res => res.checkIn === tomorrowStr)
          break
        case 'This Week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          
          filtered = filtered.filter(res => {
            const checkIn = new Date(res.checkIn)
            return checkIn >= weekStart && checkIn <= weekEnd
          })
          break
      }
    }

    // Filter by check-out date
    if (filters.checkOut && filters.checkOut !== 'All') {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      switch (filters.checkOut) {
        case 'Today':
          filtered = filtered.filter(res => res.checkOut === todayStr)
          break
        case 'Tomorrow':
          filtered = filtered.filter(res => res.checkOut === tomorrowStr)
          break
        case 'This Week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          
          filtered = filtered.filter(res => {
            const checkOut = new Date(res.checkOut)
            return checkOut >= weekStart && checkOut <= weekEnd
          })
          break
      }
    }

    return filtered
  }

  // Get reservation statistics
  const getReservationStats = (reservationsList) => {
    const stats = {
      confirmed: 0,
      pending: 0,
      checkedIn: 0,
      cancelled: 0,
      total: reservationsList.length
    }

    reservationsList.forEach(reservation => {
      switch (reservation.status) {
        case 'confirmed':
          stats.confirmed++
          break
        case 'pending':
          stats.pending++
          break
        case 'checkedIn':
          stats.checkedIn++
          break
        case 'cancelled':
          stats.cancelled++
          break
      }
    })

    return stats
  }

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    const classes = {
      'confirmed': 'bg-blue-100 text-blue-700',
      'pending': 'bg-orange-100 text-orange-700',
      'checkedIn': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
  }

  // Status text display
  const getStatusText = (status) => {
    const texts = {
      'confirmed': 'Confirmed',
      'pending': 'Due In',
      'checkedIn': 'Checked In',
      'cancelled': 'Checked Out'
    }
    return texts[status] || status
  }

  // Initialize on mount
  onMounted(() => {
    loadReservations()
  })

  return {
    reservations,
    loading,
    error,
    loadReservations,
    filterReservations,
    getReservationStats,
    getStatusBadgeClass,
    getStatusText
  }
}