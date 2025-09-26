<template>
  <div v-if="isOpen" class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50" @click="handleBackdropClick">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200" @click.stop>
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Add New Reservation</h2>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="pi pi-times w-5 h-5"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <!-- Error Display -->
        <div v-if="modalState.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ modalState.error }}</p>
        </div>

        <!-- Success Display -->
        <div v-if="modalState.success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-700">Reservation created successfully!</p>
        </div>

        <form @submit.prevent="submitReservation" class="space-y-6">
          <!-- Guest Information Section -->
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-4">Guest Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- First Name -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.firstName }"
                  placeholder="Enter first name"
                />
                <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.lastName }"
                  placeholder="Enter last name"
                />
                <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
              </div>

              <!-- Middle Name -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  v-model="formData.middleName"
                  type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter middle name (optional)"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.email }"
                  placeholder="Enter email address"
                  @blur="validateEmail"
                />
                <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Phone <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.phone }"
                  placeholder="Enter phone number"
                />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
              </div>

              <!-- ID Document -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  ID Document <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.idDocument"
                  type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.idDocument }"
                  placeholder="Enter ID/Passport number"
                />
                <p v-if="errors.idDocument" class="mt-1 text-xs text-red-600">{{ errors.idDocument }}</p>
              </div>
            </div>

            <!-- Address -->
            <div class="mt-4">
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Address <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.address"
                rows="2"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="{ 'border-red-300 bg-red-50': errors.address }"
                placeholder="Enter full address"
              ></textarea>
              <p v-if="errors.address" class="mt-1 text-xs text-red-600">{{ errors.address }}</p>
            </div>
          </div>

          <!-- Reservation Details Section -->
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-4">Reservation Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Check-in Date -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Check-in Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.checkIn"
                  type="date"
                  :min="minDate"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.checkIn }"
                  @change="validateDates"
                />
                <p v-if="errors.checkIn" class="mt-1 text-xs text-red-600">{{ errors.checkIn }}</p>
              </div>

              <!-- Check-out Date -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Check-out Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.checkOut"
                  type="date"
                  :min="minCheckOutDate"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.checkOut }"
                  @change="validateDates"
                />
                <p v-if="errors.checkOut" class="mt-1 text-xs text-red-600">{{ errors.checkOut }}</p>
              </div>

              <!-- Number of Guests -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Number of Guests <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.numGuest"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.numGuest }"
                  @change="filterAvailableRooms"
                >
                  <option value="">Select guests</option>
                  <option v-for="num in 10" :key="num" :value="num">{{ num }} {{ num === 1 ? 'Guest' : 'Guests' }}</option>
                </select>
                <p v-if="errors.numGuest" class="mt-1 text-xs text-red-600">{{ errors.numGuest }}</p>
              </div>

              <!-- Room Selection -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Room <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.roomNumber"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{ 'border-red-300 bg-red-50': errors.roomNumber }"
                  :disabled="!formData.checkIn || !formData.checkOut || !formData.numGuest || isCheckingAvailability"
                >
                  <option value="">
                    {{ isCheckingAvailability ? 'Checking availability...' : 'Select room' }}
                  </option>
                  <optgroup v-for="category in roomsByCategory" :key="category.type" :label="category.type">
                    <option 
                      v-for="room in category.rooms" 
                      :key="room.number" 
                      :value="room.number"
                      :disabled="!isRoomAvailable(room)"
                    >
                      Room {{ room.number }} - ${{ room.pricePerNight }}/night ({{ room.maxCapacity }} guests max)
                      {{ !isRoomAvailable(room) ? ' - Unavailable' : '' }}
                    </option>
                  </optgroup>
                </select>
                <p v-if="errors.roomNumber" class="mt-1 text-xs text-red-600">{{ errors.roomNumber }}</p>
              </div>

              <!-- Reservation Status -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="checkedIn">Checked In</option>
                </select>
              </div>

              <!-- Total Price Estimate -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Estimated Total Price
                  <span class="text-xs font-normal text-gray-500">(system)</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs text-gray-500">$</span>
                  <input
                    v-model="calculatedPrice"
                    type="text"
                    class="w-full pl-6 pr-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-green-600"
                    readonly
                    placeholder="Select room and dates"
                    disabled
                  />
                </div>
                <p v-if="nights > 0 && selectedRoomPrice > 0" class="mt-1 text-xs text-gray-500">
                  {{ nights }} {{ nights === 1 ? 'night' : 'nights' }} × ${{ selectedRoomPrice }}/night (estimate)
                </p>
                <p v-else-if="!formData.checkIn || !formData.checkOut" class="mt-1 text-xs text-gray-400">
                  Select check-in and check-out dates to see price estimate
                </p>
                <p v-else-if="!formData.roomNumber" class="mt-1 text-xs text-gray-400">
                  Select a room to see price estimate
                </p>
              </div>
            </div>

            <!-- Special Requests -->
            <div class="mt-4">
              <label class="block text-xs font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea
                v-model="formData.specialRequest"
                rows="3"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any special requests or notes..."
              ></textarea>
            </div>

            <!-- Selected Room Details -->
            <div v-if="selectedRoom" class="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 class="text-xs font-medium text-gray-900 mb-2">Selected Room Details</h4>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>Room Number: {{ selectedRoom.number }}</div>
                <div>Room Type: {{ selectedRoom.type }}</div>
                <div>Floor: {{ selectedRoom.floorNumber }}</div>
                <div>Max Capacity: {{ selectedRoom.maxCapacity }} guests</div>
                <div class="col-span-2">
                  <span class="font-medium">Amenities:</span> 
                  {{ selectedRoom.amenities?.join(', ') || 'Standard amenities' }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <Custombutton
          label="Cancel"
          bg-color="bg-gray-100"
          hover-bg-color="hover:bg-gray-200"
          text-color="text-gray-700"
          :hover="true"
          @click="closeModal"
        />
        <Custombutton
          label="Create Reservation"
          bg-color="bg-green-600"
          hover-bg-color="hover:bg-green-700"
          text-color="white"
          :disabled="modalState.isLoading || !isFormValid"
          :hover="true"
          @click="submitReservation"
        >
          <span v-if="modalState.isLoading" class="flex items-center gap-2">
            <i class="pi pi-spinner pi-spin"></i>
            Creating...
          </span>
          <span v-else>Create Reservation</span>
        </Custombutton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Custombutton from './Custombutton.vue'
import type { 
  ReservationFormData, 
  ValidationErrors, 
  ModalState, 
  Room, 
  ApiError 
} from '../types/hotel'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success', reservation: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const formData = ref<ReservationFormData>({
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  idDocument: '',
  numGuest: 0,
  checkIn: '',
  checkOut: '',
  specialRequest: '',
  status: 'confirmed',
  roomNumber: ''
})

// Modal state
const modalState = ref<ModalState>({
  isOpen: false,
  isLoading: false,
  error: null,
  success: false
})

// Validation errors
const errors = ref<ValidationErrors>({})

// Room data
const rooms = ref<Room[]>([])
const reservations = ref<any[]>([])
const isCheckingAvailability = ref(false)

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minCheckOutDate = computed(() => {
  if (!formData.value.checkIn) return minDate.value
  const checkIn = new Date(formData.value.checkIn)
  checkIn.setDate(checkIn.getDate() + 1)
  return checkIn.toISOString().split('T')[0]
})

const nights = computed(() => {
  if (!formData.value.checkIn || !formData.value.checkOut) return 0
  const checkIn = new Date(formData.value.checkIn)
  const checkOut = new Date(formData.value.checkOut)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const roomsByCategory = computed(() => {
  const categories: { [key: string]: Room[] } = {}
  
  rooms.value.forEach(room => {
    if (!categories[room.type]) {
      categories[room.type] = []
    }
    categories[room.type].push(room)
  })
  
  return Object.entries(categories).map(([type, rooms]) => ({
    type,
    rooms: rooms.sort((a, b) => a.number.localeCompare(b.number))
  }))
})

const selectedRoom = computed(() => {
  return rooms.value.find(room => room.number === formData.value.roomNumber)
})

const selectedRoomPrice = computed(() => {
  return selectedRoom.value?.pricePerNight || 0
})

const calculatedPrice = computed(() => {
  if (nights.value > 0 && selectedRoomPrice.value > 0) {
    return (nights.value * selectedRoomPrice.value).toFixed(2)
  }
  return '0.00'
})

const isFormValid = computed(() => {
  // Check if all required fields are filled
  const hasRequiredFields = formData.value.firstName &&
         formData.value.lastName &&
         formData.value.email &&
         formData.value.phone &&
         formData.value.address &&
         formData.value.idDocument &&
         formData.value.numGuest > 0 &&
         formData.value.checkIn &&
         formData.value.checkOut &&
         formData.value.roomNumber
  
  // Check if there are any actual error messages (not empty strings)
  const hasNoErrors = Object.values(errors.value).every(error => !error || error.trim() === '')
  
  // Debug logging for development (can be removed in production)
  // console.log('Form validation:', { hasRequiredFields, hasNoErrors, errors: errors.value })
  
  return hasRequiredFields && hasNoErrors
})

// Methods
const loadRooms = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/rooms')
    if (!response.ok) throw new Error('Failed to load rooms')
    rooms.value = await response.json()
  } catch (error) {
    console.error('Error loading rooms:', error)
    modalState.value.error = 'Failed to load room data'
  }
}

const loadReservations = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/reservations')
    if (!response.ok) throw new Error('Failed to load reservations')
    reservations.value = await response.json()
  } catch (error) {
    console.error('Error loading reservations:', error)
  }
}

const isRoomAvailable = (room: Room): boolean => {
  if (!formData.value.checkIn || !formData.value.checkOut) return true
  if (formData.value.numGuest > room.maxCapacity) return false
  
  const checkIn = new Date(formData.value.checkIn)
  const checkOut = new Date(formData.value.checkOut)
  
  // Check for conflicting reservations
  const conflicts = reservations.value.filter(reservation => {
    if (reservation.room !== room.number) return false
    if (reservation.status === 'cancelled') return false
    
    const resCheckIn = new Date(reservation.checkIn)
    const resCheckOut = new Date(reservation.checkOut)
    
    // Check for overlap (exclusive checkout logic)
    return checkIn < resCheckOut && checkOut > resCheckIn
  })
  
  return conflicts.length === 0
}

const filterAvailableRooms = () => {
  if (formData.value.checkIn && formData.value.checkOut && formData.value.numGuest) {
    isCheckingAvailability.value = true
    setTimeout(() => {
      isCheckingAvailability.value = false
    }, 500)
  }
}

// Price calculation is now handled by the backend
// Frontend only shows estimate for user reference

const validateEmail = () => {
  if (formData.value.email && !formData.value.email.includes('@')) {
    formData.value.email += '@gmail.com'
  }
}

const validateDates = () => {
  // Clear existing date errors
  delete errors.value.checkIn
  delete errors.value.checkOut
  
  if (formData.value.checkIn) {
    const checkIn = new Date(formData.value.checkIn)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (checkIn < today) {
      errors.value.checkIn = 'Check-in date cannot be in the past'
    }
  }
  
  if (formData.value.checkIn && formData.value.checkOut) {
    const checkIn = new Date(formData.value.checkIn)
    const checkOut = new Date(formData.value.checkOut)
    
    if (checkOut <= checkIn) {
      errors.value.checkOut = 'Check-out date must be after check-in date'
    }
  }
  
  filterAvailableRooms()
}

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!formData.value.firstName) errors.value.firstName = 'First name is required'
  if (!formData.value.lastName) errors.value.lastName = 'Last name is required'
  if (!formData.value.email) errors.value.email = 'Email is required'
  if (!formData.value.phone) errors.value.phone = 'Phone is required'
  if (!formData.value.address) errors.value.address = 'Address is required'
  if (!formData.value.idDocument) errors.value.idDocument = 'ID document is required'
  if (!formData.value.numGuest || formData.value.numGuest < 1) errors.value.numGuest = 'Number of guests is required'
  if (!formData.value.checkIn) errors.value.checkIn = 'Check-in date is required'
  if (!formData.value.checkOut) errors.value.checkOut = 'Check-out date is required'
  if (!formData.value.roomNumber) errors.value.roomNumber = 'Room selection is required'
  
  validateDates()
  
  return Object.keys(errors.value).length === 0
}

const submitReservation = async () => {
  if (!validateForm()) return
  
  modalState.value.isLoading = true
  modalState.value.error = null
  
  try {
    // Debug logging to check date formats
    console.log('📅 Submitting reservation with dates:', {
      checkIn: formData.value.checkIn,
      checkOut: formData.value.checkOut,
      checkInParsed: new Date(formData.value.checkIn).toISOString(),
      checkOutParsed: new Date(formData.value.checkOut).toISOString(),
      formData: formData.value
    })
    
    const response = await fetch('http://localhost:3000/api/reserve-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData.value
        // totalPrice will be calculated by the backend
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      const apiError = data as ApiError
      if (response.status === 409) {
        modalState.value.error = `Room conflict: ${apiError.error}`
      } else {
        modalState.value.error = apiError.error || 'Failed to create reservation'
      }
      return
    }
    
    modalState.value.success = true
    
    // Emit success event immediately to trigger data refresh
    emit('success', data.reservation)
    
    // Show success message briefly, then close
    setTimeout(() => {
      closeModal()
    }, 1500)
    
  } catch (error) {
    modalState.value.error = 'Network error. Please try again.'
    console.error('Reservation error:', error)
  } finally {
    modalState.value.isLoading = false
  }
}

const resetForm = () => {
  formData.value = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    idDocument: '',
    numGuest: 0,
    checkIn: '',
    checkOut: '',
    specialRequest: '',
    status: 'confirmed',
    roomNumber: ''
  }
  errors.value = {}
  modalState.value.error = null
  modalState.value.success = false
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadRooms()
    loadReservations()
  }
})

watch([() => formData.value.checkIn, () => formData.value.checkOut], () => {
  if (formData.value.checkIn && formData.value.checkOut) {
    filterAvailableRooms()
  }
})

// Load initial data
onMounted(() => {
  if (props.isOpen) {
    loadRooms()
    loadReservations()
  }
})
</script>
