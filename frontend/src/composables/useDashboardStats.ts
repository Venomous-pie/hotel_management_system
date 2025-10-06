import { ref, computed } from 'vue'

const API_BASE_URL = 'http://localhost:3000/api'

interface OccupancyStats {
  occupancyRate: number
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
}

interface BookingStats {
  totalBookings: number
  confirmedBookings: number
  pendingBookings: number
}

interface RevenueStats {
  totalRevenue: number
  averageBookingValue: number
  totalReservations: number
}

interface CancellationStats {
  totalCancellations: number
  cancellationRate: number
  totalBookings: number
}

interface TrendData {
  date: string
  occupancy_percentage?: number
  revenue?: number
}

interface BookingSourceData {
  source: string
  count: number
  percentage: number
}

interface RoomPopularityData {
  room_type: string
  bookings_count: number
  nights_booked: number
}

export function useDashboardStats() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Stats data
  const occupancyStats = ref<OccupancyStats | null>(null)
  const bookingStats = ref<BookingStats | null>(null)
  const revenueStats = ref<RevenueStats | null>(null)
  const cancellationStats = ref<CancellationStats | null>(null)
  
  // Chart data
  const occupancyTrend = ref<TrendData[]>([])
  const revenueTrend = ref<TrendData[]>([])
  const bookingSources = ref<BookingSourceData[]>([])
  const roomPopularity = ref<RoomPopularityData[]>([])

  const fetchStats = async (dateRange: string = 'this_month') => {
    loading.value = true
    error.value = null
    
    try {
      console.log('🔄 Fetching dashboard stats...')
      
      // Add cache busting and logging
      const timestamp = Date.now()
      
      // Fetch all stats in parallel - this is where the magic happens fr 🔥
      const [
        occupancyRes,
        bookingsRes,
        revenueRes,
        cancellationsRes,
        occupancyTrendRes,
        revenueTrendRes,
        bookingSourcesRes,
        roomPopularityRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/stats/occupancy?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' }),
        fetch(`${API_BASE_URL}/stats/bookings?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' }),
        fetch(`${API_BASE_URL}/stats/revenue?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' }),
        fetch(`${API_BASE_URL}/stats/cancellations?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' }),
        fetch(`${API_BASE_URL}/stats/occupancy/trend?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' }),
        fetch(`${API_BASE_URL}/stats/revenue/trend?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' }),
        fetch(`${API_BASE_URL}/stats/bookings/source?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' }),
        fetch(`${API_BASE_URL}/stats/rooms/popularity?dateRange=${dateRange}&_t=${timestamp}`, { cache: 'no-cache' })
      ])

      // Check if all requests were successful
      if (!occupancyRes.ok || !bookingsRes.ok || !revenueRes.ok || !cancellationsRes.ok ||
          !occupancyTrendRes.ok || !revenueTrendRes.ok || !bookingSourcesRes.ok || !roomPopularityRes.ok) {
        throw new Error('Failed to fetch dashboard statistics')
      }

      // Parse all responses
      const [
        occupancyData,
        bookingsData,
        revenueData,
        cancellationsData,
        occupancyTrendData,
        revenueTrendData,
        bookingSourcesData,
        roomPopularityData
      ] = await Promise.all([
        occupancyRes.json(),
        bookingsRes.json(),
        revenueRes.json(),
        cancellationsRes.json(),
        occupancyTrendRes.json(),
        revenueTrendRes.json(),
        bookingSourcesRes.json(),
        roomPopularityRes.json()
      ])

      // Log the received data
      console.log('📊 Received occupancy data:', occupancyData)
      console.log('📊 Received booking data:', bookingsData)
      console.log('📊 Received revenue data:', revenueData)
      
      // Update reactive data
      occupancyStats.value = occupancyData
      bookingStats.value = bookingsData
      revenueStats.value = revenueData
      cancellationStats.value = cancellationsData
      occupancyTrend.value = occupancyTrendData
      revenueTrend.value = revenueTrendData
      bookingSources.value = bookingSourcesData
      roomPopularity.value = roomPopularityData
      
      console.log('✅ Dashboard stats updated successfully')

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch dashboard statistics'
      console.error('Dashboard stats error:', err)
    } finally {
      loading.value = false
    }
  }

  // Computed values for easy access
  const summaryCards = computed(() => [
    {
      id: 'occupancy_rate',
      title: 'Occupancy Rate',
      icon: 'pi-home',
      value: occupancyStats.value?.occupancyRate || 0,
      suffix: '%',
      description: 'Percentage of rooms currently occupied',
      trend: '+5%',
      trendColor: 'text-green-600'
    },
    {
      id: 'total_bookings',
      title: 'Total Bookings',
      icon: 'pi-calendar',
      value: bookingStats.value?.totalBookings || 0,
      suffix: '',
      description: 'Number of reservations made',
      trend: '+12%',
      trendColor: 'text-green-600'
    },
    {
      id: 'revenue',
      title: 'Revenue',
      icon: 'pi-dollar',
      value: revenueStats.value?.totalRevenue || 0,
      prefix: '₱',
      suffix: '',
      description: 'Total revenue generated',
      trend: '+8%',
      trendColor: 'text-green-600'
    },
    {
      id: 'cancellations',
      title: 'Cancellations',
      icon: 'pi-times-circle',
      value: cancellationStats.value?.totalCancellations || 0,
      suffix: '',
      description: 'Total number of canceled bookings',
      trend: '-3%',
      trendColor: 'text-red-600'
    },
    {
      id: 'available_rooms',
      title: 'Available Rooms',
      icon: 'pi-check-circle',
      value: occupancyStats.value?.availableRooms || 0,
      suffix: '',
      description: 'Rooms ready for guests',
      trend: 'Ready',
      trendColor: 'text-blue-600'
    }
  ])

  return {
    // State
    loading,
    error,
    occupancyStats,
    bookingStats,
    revenueStats,
    cancellationStats,
    occupancyTrend,
    revenueTrend,
    bookingSources,
    roomPopularity,
    summaryCards,
    
    // Methods
    fetchStats
  }
}
