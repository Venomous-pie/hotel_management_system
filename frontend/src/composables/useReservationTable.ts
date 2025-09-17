import { ref, computed } from 'vue'

interface Reservation {
  id: string
  room: string
  guest: string
  checkIn: string
  checkOut: string
  status: string
  type: string
  amount: number
  balance: number
  source: string
  orders?: number
}

interface ReservationFilters {
  searchQuery?: string
  checkIn?: string
  checkOut?: string
  booking?: string
  guest?: string
  status?: string
}

export function useReservationTable() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Mock data for demonstration
  const mockReservations: Reservation[] = [
    {
      id: '2319',
      room: '118',
      guest: 'David Smith',
      checkIn: '2023-10-01',
      checkOut: '2023-10-02',
      status: 'confirmed',
      type: 'standard',
      amount: 70.00,
      balance: 70.00,
      source: 'booking.com',
      orders: 1
    },
    {
      id: '2318',
      room: '117',
      guest: 'Dianne Rusel',
      checkIn: '2023-10-01',
      checkOut: '2023-10-05',
      status: 'checkedIn',
      type: 'standard',
      amount: 200.00,
      balance: -200.00,
      source: 'expedia',
      orders: 2
    },
    {
      id: '2317',
      room: '116',
      guest: 'Marvin McKinney',
      checkIn: '2023-10-02',
      checkOut: '2023-10-04',
      status: 'pending',
      type: 'standard',
      amount: 110.00,
      balance: 110.00,
      source: 'airbnb',
      orders: 0
    },
    {
      id: '2316',
      room: '115',
      guest: 'Brooklyn Simons',
      checkIn: '2023-10-03',
      checkOut: '2023-10-06',
      status: 'cancelled',
      type: 'standard',
      amount: 130.00,
      balance: 130.00,
      source: 'kayak',
      orders: 1
    },
    {
      id: '2315',
      room: '114',
      guest: 'Jerome Bell',
      checkIn: '2023-10-04',
      checkOut: '2023-10-05',
      status: 'confirmed',
      type: 'standard',
      amount: 90.00,
      balance: -90.00,
      source: 'expedia',
      orders: 3
    },
    {
      id: '2314',
      room: '113',
      guest: 'Marvin McKinney',
      checkIn: '2023-10-05',
      checkOut: '2023-10-09',
      status: 'checkedIn',
      type: 'standard',
      amount: 220.00,
      balance: -220.00,
      source: 'booking.com',
      orders: 1
    },
    {
      id: '2312',
      room: '112',
      guest: 'Robertson',
      checkIn: '2023-10-07',
      checkOut: '2023-10-12',
      status: 'cancelled',
      type: 'standard',
      amount: 250.00,
      balance: 250.00,
      source: 'kayak',
      orders: 0
    },
    {
      id: '2311',
      room: '111',
      guest: 'Floyd Miles',
      checkIn: '2023-10-06',
      checkOut: '2023-10-08',
      status: 'pending',
      type: 'standard',
      amount: 80.00,
      balance: -80.00,
      source: 'expedia',
      orders: 2
    },
    {
      id: '2310',
      room: '110',
      guest: 'Ronald Richard',
      checkIn: '2023-10-09',
      checkOut: '2023-10-11',
      status: 'confirmed',
      type: 'standard',
      amount: 70.00,
      balance: -70.00,
      source: 'airbnb',
      orders: 1
    },
    {
      id: '2309',
      room: '109',
      guest: 'Alfred Reid',
      checkIn: '2023-10-10',
      checkOut: '2023-10-15',
      status: 'cancelled',
      type: 'standard',
      amount: 250.00,
      balance: 250.00,
      source: 'kayak',
      orders: 0
    },
    {
      id: '2308',
      room: '108',
      guest: 'Roger Parks',
      checkIn: '2023-10-12',
      checkOut: '2023-10-14',
      status: 'confirmed',
      type: 'standard',
      amount: 180.00,
      balance: -180.00,
      source: 'booking.com',
      orders: 2
    },
    {
      id: '2307',
      room: '107',
      guest: 'Frank Gray',
      checkIn: '2023-10-13',
      checkOut: '2023-10-18',
      status: 'checkedIn',
      type: 'standard',
      amount: 230.00,
      balance: -230.00,
      source: 'expedia',
      orders: 1
    },
    {
      id: '2306',
      room: '106',
      guest: 'Roger Parks',
      checkIn: '2023-10-12',
      checkOut: '2023-10-16',
      status: 'confirmed',
      type: 'standard',
      amount: 300.00,
      balance: 300.00,
      source: 'kayak',
      orders: 3
    },
    {
      id: '2305',
      room: '105',
      guest: 'Joy Borma',
      checkIn: '2023-10-14',
      checkOut: '2023-10-17',
      status: 'pending',
      type: 'standard',
      amount: 320.00,
      balance: -320.00,
      source: 'booking.com',
      orders: 1
    },
    {
      id: '2304',
      room: '104',
      guest: 'Mical Jordan',
      checkIn: '2023-10-15',
      checkOut: '2023-10-19',
      status: 'cancelled',
      type: 'standard',
      amount: 200.00,
      balance: 200.00,
      source: 'booking.com',
      orders: 0
    },
    {
      id: '2303',
      room: '103',
      guest: 'John Wick',
      checkIn: '2023-10-15',
      checkOut: '2023-10-17',
      status: 'pending',
      type: 'standard',
      amount: 120.00,
      balance: -120.00,
      source: 'booking.com',
      orders: 2
    }
  ]

  const reservations = ref<Reservation[]>(mockReservations)

  const filterReservations = (filters: ReservationFilters) => {
    let filtered = reservations.value

    // Filter by search query
    if (filters.searchQuery) {
      filtered = filtered.filter(res => 
        res.guest.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        res.room.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        res.id.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      )
    }

    // Filter by status
    if (filters.status && filters.status !== 'All') {
      const statusMap: Record<string, string> = {
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

    return filtered
  }

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      'confirmed': 'bg-blue-100 text-blue-700',
      'pending': 'bg-orange-100 text-orange-700',
      'checkedIn': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700'
  }

  const getStatusText = (status: string) => {
    const texts = {
      'confirmed': 'Confirmed',
      'pending': 'Due In',
      'checkedIn': 'Checked In',
      'cancelled': 'Checked Out'
    }
    return texts[status as keyof typeof texts] || status
  }

  const loadReservations = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would fetch from an API
      reservations.value = mockReservations
    } catch (err) {
      error.value = 'Failed to load reservations'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    reservations,
    filterReservations,
    getStatusBadgeClass,
    getStatusText,
    loadReservations
  }
}
