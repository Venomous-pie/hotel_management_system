<template>
    <div class="h-full bg-white overflow-auto">
      <!-- Room Availability Grid -->
      <div class="min-w-full border border-gray-200 rounded-lg overflow-auto">
        <!-- Date Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div class="grid border-collapse" :style="`grid-template-columns: 12rem repeat(${dateRange.length}, 6rem)`">
            <!-- Room Type Column Header -->
            <div class="px-4 py-3 pt-4 bg-gray-50 text-center outline outline-1 outline-gray-50">
              <span class="text-xs font-bold text-gray-700">Rooms</span>
            </div>
            
            <!-- Date Columns -->
            <div v-for="date in dateRange" :key="date.full" 
              class="px-2 py-3 bg-gray-50 text-center outline outline-1 outline-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
              <div class="text-xs font-bold text-gray-700">{{ date.day }}</div>
              <div class="text-xs text-gray-500">{{ date.date }}</div>
            </div>
          </div>
        </div>
  
        <!-- Room Categories -->
        <div v-for="category in roomCategories" :key="category.name" class="outline outline-1 outline-gray-100">
          <!-- Category Header -->
          <div class="grid bg-gray-25 outline outline-1 outline-gray-200" :style="`grid-template-columns: 12rem repeat(${dateRange.length}, 6rem)`">
            <div class="px-4 py-2 flex items-center outline outline-1 outline-gray-50">
              <div @click="toggleCategory(category.name)" 
                class="flex items-center text-xs font-bold text-gray-700 hover:text-gray-900 cursor-pointer">
                <i :class="category.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'" 
                  class="w-3 h-3 mr-2"></i>
                {{ category.name }}
              </div>
            </div>
            
            <!-- Availability Summary -->
            <div v-for="date in dateRange" :key="date.full" 
              class="px-2 py-2 text-center outline outline-1 outline-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <span class="inline-block w-6 h-6 text-xs leading-6 font-medium text-center"
                :class="getAvailabilityColor(category.name, date.full)">
                {{ getAvailableRooms(category.name, date.full) }}
              </span>
            </div>
          </div>
  
          <!-- Individual Rooms -->
          <div v-if="category.expanded">
            <div v-for="room in category.rooms" :key="room.number" 
              class="grid transition-colors outline outline-1 outline-gray-100 last:border-b-0"
              :style="`grid-template-columns: 12rem repeat(${dateRange.length}, 6rem)`">
              
              <!-- Room Info -->
              <div class="px-4 py-3 flex items-center outline outline-1 outline-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-3 flex-shrink-0" :class="getRoomStatusColor(room.status)"></div>
                  <div>
                    <div class="text-xs font-medium text-gray-800">{{ room.number }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ room.type }}</div>
                  </div>
                </div>
                <div class="ml-auto p-1 hover:bg-gray-200 rounded cursor-pointer">
                  <i class="i-lucide-more-horizontal w-3 h-3 text-gray-400"></i>
                </div>
              </div>
              
              <!-- Reservation Blocks -->
              <div v-for="date in dateRange" :key="date.full" 
                class="px-1 py-2 relative flex items-center justify-center outline outline-1 outline-gray-50 hover:bg-gray-50 transition-colors">
                <div v-if="getReservation(room.number, date.full)" 
                  @click="openReservation(getReservation(room.number, date.full))"
                  class="h-6 rounded text-xs px-2 leading-6 cursor-pointer transition-all hover:shadow-md hover:scale-105 overflow-hidden flex items-center justify-center"
                  :class="getReservationColor(getReservation(room.number, date.full))">
                  <span class="truncate text-center">{{ getReservation(room.number, date.full).guest }}</span>
                </div>
                <div v-else class="w-full hover:bg-gray-100 rounded cursor-pointer transition-colors border border-transparent hover:border-gray-300 hover:shadow-sm"
                  @click="createReservation(room.number, date.full)">   
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Reservation Modal -->
      <div v-if="showReservationModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-96 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Reservation Details</h3>
            <button @click="closeReservationModal" 
              class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i class="i-lucide-x w-4 h-4 text-gray-500"></i>
            </button>
          </div>
          
          <div v-if="selectedReservation" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Guest Name</label>
              <div class="text-sm font-medium text-gray-900">{{ selectedReservation.guest }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Room</label>
              <div class="text-sm font-medium text-gray-900">{{ selectedReservation.room }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
              <div class="text-sm text-gray-900">{{ formatDate(selectedReservation.checkIn) }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
              <div class="text-sm text-gray-900">{{ formatDate(selectedReservation.checkOut) }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <span class="inline-block px-3 py-1 text-xs font-medium rounded-full capitalize"
                :class="getStatusBadgeColor(selectedReservation.status)">
                {{ selectedReservation.status }}
              </span>
            </div>
          </div>
          
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button @click="closeReservationModal" 
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Close
            </button>
            <button class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Edit Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, computed } from 'vue'

// Sample data
const roomCategories = ref([
  {
    name: 'Single Rooms',
    expanded: true,
    rooms: [
      { number: '001', type: 'Standard Single', status: 'available' },
      { number: '002', type: 'Standard Single', status: 'occupied' },
      { number: '003', type: 'Standard Single', status: 'maintenance' }
    ]
  },
  {
    name: 'Twin Double Rooms',
    expanded: true,
    rooms: [
      { number: '101', type: 'Twin Double', status: 'available' },
      { number: '102', type: 'Twin Double', status: 'occupied' },
      { number: '103', type: 'Twin Double', status: 'available' }
    ]
  },
  {
    name: 'Family Rooms',
    expanded: true,
    rooms: [
      { number: '201', type: 'Family Suite', status: 'available' },
      { number: '202', type: 'Family Suite', status: 'occupied' },
      { number: '203', type: 'Family Suite', status: 'available' }
    ]
  }
])

// Generate date range (next 14 days)
const dateRange = computed(() => {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    dates.push({
      full: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString().padStart(2, '0')
    })
  }
  
  return dates
})

// Sample reservations
const reservations = ref([
  { room: '002', guest: 'Joy Banma', checkIn: '2025-09-15', checkOut: '2025-09-18', status: 'confirmed', type: 'standard' },
  { room: '002', guest: 'David Smith', checkIn: '2025-09-20', checkOut: '2025-09-23', status: 'confirmed', type: 'standard' },
  { room: '003', guest: 'Frank Gray', checkIn: '2025-09-16', checkOut: '2025-09-16', status: 'checkedIn', type: 'vip' },
  { room: '101', guest: 'Warner', checkIn: '2025-09-15', checkOut: '2025-09-16', status: 'pending', type: 'group' },
  { room: '101', guest: 'Pitter', checkIn: '2025-09-20', checkOut: '2025-09-25', status: 'confirmed', type: 'group' },
  { room: '102', guest: 'Palash', checkIn: '2025-09-18', checkOut: '2025-09-19', status: 'confirmed', type: 'vip' },
  { room: '102', guest: 'Henry Kevil', checkIn: '2025-09-25', checkOut: '2025-09-28', status: 'confirmed', type: 'standard' },
  { room: '103', guest: 'John', checkIn: '2025-09-15', checkOut: '2025-09-17', status: 'confirmed', type: 'standard' },
  { room: '103', guest: 'Cavin Macron', checkIn: '2025-09-20', checkOut: '2025-09-22', status: 'confirmed', type: 'standard' },
  { room: '201', guest: 'Bratlee', checkIn: '2025-09-20', checkOut: '2025-09-23', status: 'confirmed', type: 'family' },
  { room: '202', guest: 'Rohit', checkIn: '2025-09-15', checkOut: '2025-09-19', status: 'confirmed', type: 'family' },
  { room: '202', guest: 'Katter', checkIn: '2025-09-25', checkOut: '2025-09-27', status: 'pending', type: 'family' },
  { room: '203', guest: 'Mesai', checkIn: '2025-09-18', checkOut: '2025-09-19', status: 'confirmed', type: 'family' },
  { room: '203', guest: 'Ronaldo', checkIn: '2025-09-21', checkOut: '2025-09-28', status: 'confirmed', type: 'family' }
])

// Modal state
const showReservationModal = ref(false)
const selectedReservation = ref(null)

// Functions
const toggleCategory = (categoryName) => {
  const category = roomCategories.value.find(cat => cat.name === categoryName)
  if (category) {
    category.expanded = !category.expanded
  }
}

const getReservation = (roomNumber, date) => {
  return reservations.value.find(res => {
    const checkIn = new Date(res.checkIn)
    const checkOut = new Date(res.checkOut)
    const currentDate = new Date(date)
    
    return res.room === roomNumber && 
           currentDate >= checkIn && 
           currentDate <= checkOut
  })
}

const getReservationColor = (reservation) => {
  if (!reservation) return ''
  
  const colors = {
    standard: 'bg-blue-100 text-blue-800 border-l-4 border-blue-400',
    vip: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-400',
    group: 'bg-orange-100 text-orange-800 border-l-4 border-orange-400',
    family: 'bg-green-100 text-green-800 border-l-4 border-green-400'
  }
  
  return colors[reservation.type] || colors.standard
}

const getRoomStatusColor = (status) => {
  const colors = {
    available: 'bg-green-500',
    occupied: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getAvailableRooms = (categoryName, date) => {
  const category = roomCategories.value.find(cat => cat.name === categoryName)
  if (!category) return '0'
  
  const available = category.rooms.filter(room => {
    const hasReservation = getReservation(room.number, date)
    return !hasReservation && room.status === 'available'
  }).length
  
  return available.toString()
}

const getAvailabilityColor = (categoryName, date) => {
  const available = parseInt(getAvailableRooms(categoryName, date))
  const category = roomCategories.value.find(cat => cat.name === categoryName)
  const total = category ? category.rooms.length : 0
  
  if (available === 0) return 'bg-red-500 text-white'
  if (available <= total / 3) return 'bg-orange-500 text-white'
  return 'bg-green-500 text-white'
}

const getStatusBadgeColor = (status) => {
  const colors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    checkedIn: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const openReservation = (reservation) => {
  selectedReservation.value = reservation
  showReservationModal.value = true
}

const closeReservationModal = () => {
  showReservationModal.value = false
  selectedReservation.value = null
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const createReservation = (roomNumber, date) => {
  // Handle new reservation creation
  console.log('Create reservation for room', roomNumber, 'on', date)
}
</script>
