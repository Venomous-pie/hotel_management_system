<template>
  <div class="h-full bg-white">
    <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div class="flex items-center bg-gray-50 rounded-full px-4 py-2 w-80">
        <i class="i-lucide-search text-gray-400 text-sm mr-3"></i>
        <input type="text" placeholder="Search"
          class="bg-transparent border-none outline-none focus:outline-none text-sm text-gray-700 placeholder-gray-400 flex-1 caret-blue-500"
          v-model="searchQuery" />
      </div>

      <div class="flex items-center gap-4">
        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <i class="i-lucide-refresh-cw text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <i class="i-lucide-bell text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          @click="toggleUserDropdown">
          <img src="/receptionist.png" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
          <span class="text-sm font-medium text-gray-700">Grace Hoppers</span>
          <i class="i-lucide-chevron-down text-gray-400 w-4 h-4 inline-block"></i>
        </div>

        <div v-if="showUserDropdown"
          class="absolute top-16 right-6 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline">Profile</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline">Settings</a>
          <hr class="my-1" />
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline">Sign out</a>
        </div>
      </div>
    </div>
    <hr class="my-1 border-gray-200" />
    <div class="flex items-center justify-between px-6">
      <h2 class="font-medium text-gray-700">Front Desk</h2>
      <div class="flex items-center gap-2">
        <div
          class="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-3 rounded-full transition-colors">
          Add Reservation
        </div>
      </div>
    </div>
    <!-- Year and Month Navigation -->
    <div class="px-6 py-4">
      <!-- Year Navigation -->
      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded h-12">
        <div @click="navigateYear(-1)"
          class="w-12 h-12 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-l">
          <i class="i-lucide-chevron-left text-gray-600 w-4 h-4"></i>
        </div>
        <div class="flex flex-1 h-full">
          <div v-for="(year, index) in visibleYears" :key="year" @click="selectedYear = year" :class="[
            'flex-1 text-sm text-center cursor-pointer transition-colors border-r border-gray-300 last:border-r-0 h-full flex items-center justify-center',
            selectedYear === year ? 'bg-green-700 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
          ]">
            {{ year }}
          </div>
        </div>
        <div @click="navigateYear(1)"
          class="w-12 h-12 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-r">
          <i class="i-lucide-chevron-right text-gray-600 w-4 h-4"></i>
        </div>
      </div>

      <!-- Month Navigation -->
      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded-b h-12">
        <div @click="navigateMonth(-1)"
          class="w-12 h-12 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-bl">
          <i class="i-lucide-chevron-left text-gray-600 w-4 h-4"></i>
        </div>
        <div class="flex flex-1 items-center h-full">
          <div v-for="month in hotelData.months" :key="month" @click="selectedMonth = month" :class="[
            'flex-1 text-sm text-center whitespace-nowrap cursor-pointer transition-colors border-r border-gray-300 last:border-r-0 h-full flex items-center justify-center',
            selectedMonth === month ? 'bg-green-700 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
          ]">
            {{ month }}
          </div>
        </div>
        <div @click="navigateMonth(1)"
          class="w-12 h-12 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-br">
          <i class="i-lucide-chevron-right text-gray-600 w-4 h-4"></i>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center bg-gray-50 rounded px-3 py-2 w-64">
          <i class="i-lucide-search text-gray-400 text-sm mr-2"></i>
          <input type="text" placeholder="Search by booking number or guest"
            class="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
            v-model="bookingSearchQuery" />
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <select class="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm">
              <option>Reservation type</option>
            </select>
            <i
              class="i-lucide-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
          </div>
          <div class="relative">
            <select class="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm">
              <option>Room Types</option>
            </select>
            <i
              class="i-lucide-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
          </div>
          <div class="relative">
            <select class="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm">
              <option>Booking Options</option>
            </select>
            <i
              class="i-lucide-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="flex-1 overflow-auto">
      <div class="min-w-max">
        <!-- Calendar Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div class="flex">
            <div class="w-32 p-3 font-medium text-gray-700 border-r border-gray-200">Rooms</div>
            <div class="flex">
              <div v-for="day in calendarDays" :key="day.date"
                class="w-16 p-2 text-center border-r border-gray-200 last:border-r-0">
                <div class="text-xs font-medium text-gray-600">{{ day.dayName }}</div>
                <div class="text-sm font-semibold text-gray-800 mt-1">{{ day.date }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Room Sections -->
        <div class="bg-white">
          <!-- Single Rooms -->
          <div class="border-b border-gray-200">
            <div class="flex items-center p-3 bg-gray-50 cursor-pointer" @click="toggleSection('single')">
              <i :class="sectionExpanded.single ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="w-4 h-4 text-gray-600 mr-2"></i>
              <span class="font-medium text-gray-700">Single Rooms</span>
            </div>
            <div v-if="sectionExpanded.single">
              <div v-for="room in hotelData.singleRooms" :key="room.id"
                class="flex border-b border-gray-100 last:border-b-0">
                <div class="w-32 p-3 flex items-center border-r border-gray-200">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-gray-700">{{ room.number }}</span>
                  <button class="ml-auto text-gray-400 hover:text-gray-600">
                    <i class="i-lucide-more-horizontal w-4 h-4"></i>
                  </button>
                </div>
                <div class="flex flex-1">
                  <div v-for="(day, dayIndex) in calendarDays" :key="dayIndex"
                    class="w-16 h-12 border-r border-gray-200 last:border-r-0 relative">
                    <div v-if="room.bookings[dayIndex]" :class="getBookingBarClass(room.bookings[dayIndex].status)"
                      class="absolute inset-1 rounded text-xs text-white flex items-center justify-center font-medium">
                      {{ room.bookings[dayIndex].guest.split(' ')[0] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Double Rooms -->
          <div class="border-b border-gray-200">
            <div class="flex items-center p-3 bg-gray-50 cursor-pointer" @click="toggleSection('double')">
              <i :class="sectionExpanded.double ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="w-4 h-4 text-gray-600 mr-2"></i>
              <span class="font-medium text-gray-700">Twin Double Rooms</span>
            </div>
            <div v-if="sectionExpanded.double">
              <div v-for="room in hotelData.doubleRooms" :key="room.id"
                class="flex border-b border-gray-100 last:border-b-0">
                <div class="w-32 p-3 flex items-center border-r border-gray-200">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-gray-700">{{ room.number }}</span>
                  <button class="ml-auto text-gray-400 hover:text-gray-600">
                    <i class="i-lucide-more-horizontal w-4 h-4"></i>
                  </button>
                </div>
                <div class="flex flex-1">
                  <div v-for="(day, dayIndex) in calendarDays" :key="dayIndex"
                    class="w-16 h-12 border-r border-gray-200 last:border-r-0 relative">
                    <div v-if="room.bookings[dayIndex]" :class="getBookingBarClass(room.bookings[dayIndex].status)"
                      class="absolute inset-1 rounded text-xs text-white flex items-center justify-center font-medium">
                      {{ room.bookings[dayIndex].guest.split(' ')[0] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Family Rooms -->
          <div class="border-b border-gray-200">
            <div class="flex items-center p-3 bg-gray-50 cursor-pointer" @click="toggleSection('family')">
              <i :class="sectionExpanded.family ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="w-4 h-4 text-gray-600 mr-2"></i>
              <span class="font-medium text-gray-700">Family Rooms</span>
            </div>
            <div v-if="sectionExpanded.family">
              <div v-for="room in hotelData.familyRooms" :key="room.id"
                class="flex border-b border-gray-100 last:border-b-0">
                <div class="w-32 p-3 flex items-center border-r border-gray-200">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-gray-700">{{ room.number }}</span>
                  <button class="ml-auto text-gray-400 hover:text-gray-600">
                    <i class="i-lucide-more-horizontal w-4 h-4"></i>
                  </button>
                </div>
                <div class="flex flex-1">
                  <div v-for="(day, dayIndex) in calendarDays" :key="dayIndex"
                    class="w-16 h-12 border-r border-gray-200 last:border-r-0 relative">
                    <div v-if="room.bookings[dayIndex]" :class="getBookingBarClass(room.bookings[dayIndex].status)"
                      class="absolute inset-1 rounded text-xs text-white flex items-center justify-center font-medium">
                      {{ room.bookings[dayIndex].guest.split(' ')[0] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div class="flex flex-wrap items-center gap-4 text-xs">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
              <span>New</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Confirmed</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-600 rounded mr-2"></div>
              <span>Book</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-800 rounded mr-2"></div>
              <span>Checked In</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-orange-500 rounded mr-2"></div>
              <span>Due Out</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-orange-600 rounded mr-2"></div>
              <span>Checked Out</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-400 rounded mr-2"></div>
              <span>Booking Offer</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Out of Order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import hotelData from '../data/hotelData.json'

const searchQuery = ref('')
const bookingSearchQuery = ref('')
const showUserDropdown = ref(false)
const selectedYear = ref(2024)
const selectedMonth = ref('September')

// Section expansion state
const sectionExpanded = ref({
  single: true,
  double: true,
  family: true
})

// Show 9 years at a time, centered around selected year
const visibleYears = computed(() => {
  const currentIndex = hotelData.years.indexOf(selectedYear.value)
  const start = Math.max(0, currentIndex - 4)
  const end = Math.min(hotelData.years.length, start + 9)
  return hotelData.years.slice(start, end)
})

// Calendar days computed property
const calendarDays = computed(() => {
  const monthIndex = hotelData.months.indexOf(selectedMonth.value)
  const year = selectedYear.value
  const month = monthIndex + 1 // JavaScript months are 0-based

  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []

  for (let day = 1; day <= Math.min(daysInMonth, 14); day++) {
    const date = new Date(year, monthIndex, day)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    days.push({
      date: day.toString().padStart(2, '0'),
      dayName: dayNames[date.getDay()]
    })
  }

  return days
})

// Navigation functions
const navigateYear = (direction) => {
  const currentIndex = hotelData.years.indexOf(selectedYear.value)
  const newIndex = currentIndex + direction
  if (newIndex >= 0 && newIndex < hotelData.years.length) {
    selectedYear.value = hotelData.years[newIndex]
  }
}

const navigateMonth = (direction) => {
  const currentIndex = hotelData.months.indexOf(selectedMonth.value)
  const newIndex = currentIndex + direction
  if (newIndex >= 0 && newIndex < hotelData.months.length) {
    selectedMonth.value = hotelData.months[newIndex]
  }
}

// Section toggle function
const toggleSection = (section) => {
  sectionExpanded.value[section] = !sectionExpanded.value[section]
}

// Booking bar styling function
const getBookingBarClass = (status) => {
  const statusColors = {
    'new': 'bg-yellow-400',
    'confirmed': 'bg-blue-500',
    'book': 'bg-green-600',
    'checked-in': 'bg-green-800',
    'due-out': 'bg-orange-500',
    'checked-out': 'bg-orange-600',
    'booking-offer': 'bg-blue-400',
    'out-of-order': 'bg-red-500'
  }

  return statusColors[status] || 'bg-gray-300'
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.cursor-pointer')) {
    showUserDropdown.value = false
  }
}

// Add event listener for clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}
</script>