<template>
  <div class="h-full bg-white">
    <div class="flex items-center justify-between px-6 pt-2 pb-1 bg-white border-b border-gray-200">
      <div class="flex items-center bg-gray-50 rounded-full px-4 py-2 w-80">
        <i class="i-lucide-search text-gray-400 text-xs mr-3"></i>
        <input type="text" placeholder="Search"
          class="bg-transparent border-none outline-none focus:outline-none text-xs text-gray-700 placeholder-gray-400 flex-1 caret-blue-500"
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
          <span class="text-xs font-medium text-gray-700">Grace Hoppers</span>
          <i class="i-lucide-chevron-down text-gray-400 w-4 h-4 inline-block"></i>
        </div>

        <div v-if="showUserDropdown"
          class="absolute top-16 right-6 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
          <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline">Profile</a>
          <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline">Settings</a>
          <hr class="my-1 border-gray-50" />
          <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline">Sign out</a>
        </div>
      </div>
    </div>
    <hr class="my-1 border-gray-50" />
    <div class="flex items-center justify-between px-6">
      <h2 class="font-medium text-gray-700">Front Desk</h2>
      <div class="flex items-center gap-2">
        <div class="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-full transition-colors">
          Add Reservation
        </div>
      </div>
    </div>
    <div class="px-6 py-2">
      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded h-8">
        <div @click="navigateYear(-1)"
          class="w-8 h-8 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-l">
          <i class="i-lucide-chevron-left text-gray-600 w-3 h-3"></i>
        </div>
        <div class="flex flex-1 h-full">
          <div v-for="(year, index) in visibleYears" :key="year" @click="selectedYear = year" :class="[
            'flex-1 text-xs text-center cursor-pointer transition-colors border-r border-gray-300 last:border-r-0 h-full flex items-center justify-center',
            selectedYear === year ? 'bg-green-700 text-white font-medium' : 'text-gray-600 hover:bg-green-100'
          ]">
            {{ year }}
          </div>
        </div>
        <div @click="navigateYear(1)"
          class="w-8 h-8 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-r">
          <i class="i-lucide-chevron-right text-gray-600 w-3 h-3"></i>
        </div>
      </div>

      <div class="flex items-center justify-center bg-green-50 outline outline-1 outline-gray-200 rounded-b h-8">
        <div @click="navigateMonth(-1)"
          class="w-8 h-8 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-bl">
          <i class="i-lucide-chevron-left text-gray-600 w-3 h-3"></i>
        </div>
        <div class="flex flex-1 items-center h-full">
          <div v-for="month in hotelData.months" :key="month" @click="selectedMonth = month" :class="[
            'flex-1 text-xs text-center whitespace-nowrap cursor-pointer transition-colors border-r border-gray-300 last:border-r-0 h-full flex items-center justify-center',
            selectedMonth === month ? 'bg-green-700 text-white font-medium' : 'text-gray-600 hover:bg-green-100'
          ]">
            {{ month }}
          </div>
        </div>
        <div @click="navigateMonth(1)"
          class="w-8 h-8 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors outline outline-1 outline-gray-200 rounded-br">
          <i class="i-lucide-chevron-right text-gray-600 w-3 h-3"></i>
        </div>
      </div>
    </div>

    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div
          class="flex items-center bg-gray-50 rounded px-3 py-2 w-64 rounded-full outline outline-1 outline-gray-200 ">
          <i class="i-lucide-search text-gray-400 text-xs mr-2"></i>
          <input type="text" placeholder="Search by booking number or guest"
            class="bg-transparent border-none outline-none text-xs text-gray-700 placeholder-gray-400 flex-1 caret-blue-500"
            v-model="bookingSearchQuery" />
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <div @click="toggleDropdown('reservationType')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              {{ selectedReservationType }}
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.reservationType }"></i>
            </div>
            <div v-if="dropdownOpen.reservationType"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 z-50">
              <div v-for="type in reservationTypes" :key="type" @click="selectReservationType(type)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ type }}
              </div>
            </div>
          </div>

          <div class="relative">
            <div @click="toggleDropdown('roomType')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              {{ selectedRoomType }}
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.roomType }"></i>
            </div>
            <div v-if="dropdownOpen.roomType"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 z-50">
              <div v-for="type in roomTypes" :key="type" @click="selectRoomType(type)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ type }}
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div @click="toggleDropdown('bookingOption')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              {{ selectedBookingOption }}
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.bookingOption }"></i>
            </div>
            <div v-if="dropdownOpen.bookingOption"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-36 z-50">
              <div v-for="option in bookingOptions" :key="option" @click="selectBookingOption(option)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ option }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full px-6">
      <div class="w-full h-full">
        <Frontdesk_table 
          :search-query="searchQuery"
          :booking-search-query="bookingSearchQuery"
          :selected-year="selectedYear"
          :selected-month="selectedMonth"
          :selected-reservation-type="selectedReservationType"
          :selected-room-type="selectedRoomType"
          :selected-booking-option="selectedBookingOption"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import hotelData from '../../data/hotelData.json'
import Frontdesk_table from './Frontdesk_table.vue'

const searchQuery = ref('')
const bookingSearchQuery = ref('')
const showUserDropdown = ref(false)
const selectedYear = ref(2025)
const selectedMonth = ref('September')

// Dropdown states
const dropdownOpen = ref({
  reservationType: false,
  roomType: false,
  bookingOption: false
})

// Selected values
const selectedReservationType = ref('All Types')
const selectedRoomType = ref('All Rooms')
const selectedBookingOption = ref('All Options')

// Dropdown options
const reservationTypes = ['All Types', 'Standard', 'Premium', 'VIP', 'Group Booking', 'Family']
const roomTypes = ['All Rooms', 'Single', 'Double', 'Family']
const bookingOptions = ['All Options', 'Confirmed', 'Pending', 'Cancelled', 'Checked In']

// Show 9 years at a time, centered around selected year
const visibleYears = computed(() => {
  if (!hotelData.years) return []
  const currentIndex = hotelData.years.indexOf(selectedYear.value)
  const start = Math.max(0, currentIndex - 4)
  const end = Math.min(hotelData.years.length, start + 9)
  return hotelData.years.slice(start, end)
})

// Enhanced navigation functions with safety checks
const navigateYear = (direction) => {
  if (!hotelData.years) return
  const currentIndex = hotelData.years.indexOf(selectedYear.value)
  const newIndex = currentIndex + direction
  if (newIndex >= 0 && newIndex < hotelData.years.length) {
    selectedYear.value = hotelData.years[newIndex]
  }
}

const navigateMonth = (direction) => {
  if (!hotelData.months) return
  const currentIndex = hotelData.months.indexOf(selectedMonth.value)
  const newIndex = currentIndex + direction
  if (newIndex >= 0 && newIndex < hotelData.months.length) {
    selectedMonth.value = hotelData.months[newIndex]
  }
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

// Dropdown functions
const toggleDropdown = (dropdownName) => {
  // Close all other dropdowns
  Object.keys(dropdownOpen.value).forEach(key => {
    if (key !== dropdownName) {
      dropdownOpen.value[key] = false
    }
  })
  // Toggle the selected dropdown
  dropdownOpen.value[dropdownName] = !dropdownOpen.value[dropdownName]
}

const selectReservationType = (type) => {
  selectedReservationType.value = type
  dropdownOpen.value.reservationType = false
}

const selectRoomType = (type) => {
  selectedRoomType.value = type
  dropdownOpen.value.roomType = false
}

const selectBookingOption = (option) => {
  selectedBookingOption.value = option
  dropdownOpen.value.bookingOption = false
}

</script>