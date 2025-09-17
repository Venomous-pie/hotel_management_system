<template>
  <div class="h-full bg-white">
    <!-- Page Title -->
    <div class="flex items-center justify-between px-6">
      <h2 class="font-medium text-gray-700">Reservations</h2>
      <div class="flex items-center gap-2">
        <div
          class="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-full transition-colors cursor-pointer">
          Add Reservation
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="px-6 py-4 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between">
        <!-- Search -->
        <div
          class="flex items-center bg-gray-50 rounded px-3 py-2 w-64 rounded-full outline outline-1 outline-gray-200">
          <i class="i-lucide-search text-gray-400 text-xs mr-2"></i>
          <input type="text" placeholder="Search by booking number or guest"
            class="bg-transparent border-none outline-none text-xs text-gray-700 placeholder-gray-400 flex-1 caret-blue-500"
            v-model="searchQuery" />
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex items-center gap-4">
          <div class="relative">
            <div @click="toggleDropdown('checkIn')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              Check In
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.checkIn }"></i>
            </div>
            <div v-if="dropdownOpen.checkIn"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 z-50">
              <div v-for="option in checkInOptions" :key="option" @click="selectCheckIn(option)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ option }}
              </div>
            </div>
          </div>

          <div class="relative">
            <div @click="toggleDropdown('checkOut')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              Check Out
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.checkOut }"></i>
            </div>
            <div v-if="dropdownOpen.checkOut"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 z-50">
              <div v-for="option in checkOutOptions" :key="option" @click="selectCheckOut(option)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ option }}
              </div>
            </div>
          </div>

          <div class="relative">
            <div @click="toggleDropdown('booking')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              Booking
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.booking }"></i>
            </div>
            <div v-if="dropdownOpen.booking"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 z-50">
              <div v-for="option in bookingOptions" :key="option" @click="selectBooking(option)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ option }}
              </div>
            </div>
          </div>

          <div class="relative">
            <div @click="toggleDropdown('guest')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              Guest
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.guest }"></i>
            </div>
            <div v-if="dropdownOpen.guest"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 z-50">
              <div v-for="option in guestOptions" :key="option" @click="selectGuest(option)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ option }}
              </div>
            </div>
          </div>

          <div class="relative">
            <div @click="toggleDropdown('status')"
              class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 pr-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              Status
              <i class="i-lucide-chevron-down absolute right-2 text-gray-400 w-4 h-4"
                :class="{ 'rotate-180': dropdownOpen.status }"></i>
            </div>
            <div v-if="dropdownOpen.status"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 z-50">
              <div v-for="status in statusOptions" :key="status" @click="selectStatus(status)"
                class="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                {{ status }}
              </div>
            </div>
          </div>

          <div
            class="flex items-center bg-gray-50 outline outline-1 outline-gray-200 rounded-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            <span class="mr-2">More</span>
            <i class="i-lucide-chevron-down text-gray-400 w-4 h-4"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 py-4">
      <ReservationsTable :search-query="searchQuery" :selected-filters="selectedFilters" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ReservationsTable from './reservations/ReservationsTable.vue'

const searchQuery = ref('')

// Dropdown states
const dropdownOpen = ref({
  checkIn: false,
  checkOut: false,
  booking: false,
  guest: false,
  status: false
})

// Selected values
const selectedCheckIn = ref('All')
const selectedCheckOut = ref('All')
const selectedBooking = ref('All')
const selectedGuest = ref('All')
const selectedStatus = ref('All')

// Dropdown options
const checkInOptions = ['All', 'Today', 'Tomorrow', 'This Week']
const checkOutOptions = ['All', 'Today', 'Tomorrow', 'This Week']
const bookingOptions = ['All', 'Standard', 'Premium', 'VIP']
const guestOptions = ['All', 'Regular', 'VIP', 'Corporate']
const statusOptions = ['All', 'Confirmed', 'Pending', 'Checked In', 'Cancelled']

// Computed selected filters
const selectedFilters = computed(() => ({
  checkIn: selectedCheckIn.value,
  checkOut: selectedCheckOut.value,
  booking: selectedBooking.value,
  guest: selectedGuest.value,
  status: selectedStatus.value
}))

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

const selectCheckIn = (option) => {
  selectedCheckIn.value = option
  dropdownOpen.value.checkIn = false
}

const selectCheckOut = (option) => {
  selectedCheckOut.value = option
  dropdownOpen.value.checkOut = false
}

const selectBooking = (option) => {
  selectedBooking.value = option
  dropdownOpen.value.booking = false
}

const selectGuest = (option) => {
  selectedGuest.value = option
  dropdownOpen.value.guest = false
}

const selectStatus = (status) => {
  selectedStatus.value = status
  dropdownOpen.value.status = false
}
</script>
