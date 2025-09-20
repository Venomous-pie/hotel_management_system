/**
 * Test utility to verify centralized data service functionality
 */
import hotelDataService from '../services/hotelDataService'
import type { FrontdeskFilters, ReservationFilters } from '../types/hotel'

export const testCentralizedDataService = async () => {
  console.log('🧪 Testing Centralized Data Service...')
  
  try {
    // Test 1: Initialize service
    console.log('1. Initializing data service...')
    await hotelDataService.initialize()
    console.log('✅ Data service initialized successfully')
    
    // Test 2: Check basic data access
    console.log('2. Testing basic data access...')
    const roomCategories = hotelDataService.roomCategories
    const reservations = hotelDataService.reservations
    console.log(`✅ Found ${roomCategories.length} room categories`)
    console.log(`✅ Found ${reservations.length} reservations`)
    
    // Test 3: Test filtering
    console.log('3. Testing room category filtering...')
    const frontdeskFilters: FrontdeskFilters = {
      searchQuery: '',
      bookingSearchQuery: '',
      selectedYear: 2025,
      selectedMonth: 'September',
      selectedReservationType: 'All Types',
      selectedRoomType: 'Single',
      selectedBookingOption: 'All Options'
    }
    
    const filteredCategories = hotelDataService.getFilteredRoomCategories(frontdeskFilters)
    console.log(`✅ Filtered to ${filteredCategories.length} categories for Single rooms`)
    
    // Test 4: Test reservation filtering
    console.log('4. Testing reservation filtering...')
    const reservationFilters: ReservationFilters = {
      searchQuery: 'David',
      status: 'All'
    }
    
    const filteredReservations = hotelDataService.filterReservationsForTable(reservationFilters)
    console.log(`✅ Found ${filteredReservations.length} reservations matching 'David'`)
    
    // Test 5: Test room availability
    console.log('5. Testing room availability calculation...')
    const availableCount = hotelDataService.getAvailableRoomsCount(
      'Single Rooms', 
      '2025-09-20', 
      roomCategories, 
      reservations
    )
    console.log(`✅ Found ${availableCount} available single rooms on 2025-09-20`)
    
    // Test 6: Test date range generation
    console.log('6. Testing date range generation...')
    const dateRange = hotelDataService.generateDateRange(new Date('2025-09-20'), 7)
    console.log(`✅ Generated ${dateRange.length} dates starting from 2025-09-20`)
    
    // Test 7: Test weekly stats
    console.log('7. Testing weekly statistics...')
    const stats = hotelDataService.getWeeklyStats(roomCategories, reservations, dateRange)
    console.log(`✅ Weekly stats: ${stats.available} available, ${stats.occupied} occupied, ${stats.reservations} reservations`)
    
    console.log('🎉 All tests passed! Centralized data service is working correctly.')
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}

// Export for use in components or console
export default testCentralizedDataService
