<template>
  <div v-if="isOpen" class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50" @click="handleBackdropClick">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200" @click.stop>
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-medium text-gray-900">Add New Reservation</h2>
          <!-- Draft saved indicator -->
          <div v-if="draftSaveState.isVisible" 
               class="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs transition-opacity">
            <i class="pi pi-check w-3 h-3"></i>
            <span>{{ draftSaveState.message }}</span>
          </div>
        </div>
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
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.firstName }"
                  placeholder="Enter first name"
                  @input="handleFirstNameInput"
                  @blur="validateFirstName"
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
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.lastName }"
                  placeholder="Enter last name"
                  @input="handleLastNameInput"
                  @blur="validateLastName"
                />
                <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
              </div>

              <!-- Middle Name -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  v-model="formData.middleName"
                  type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.middleName }"
                  placeholder="Enter middle name (optional)"
                  @input="handleMiddleNameInput"
                />
                <p v-if="errors.middleName" class="mt-1 text-xs text-red-600">{{ errors.middleName }}</p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.email }"
                  placeholder="Enter email address"
                  @input="handleEmailInput"
                  @blur="validateEmail"
                  @keydown="handleEmailKeydown"
                />
                <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Phone <span class="text-red-500">*</span>
                </label>
                <div class="flex">
                  <select
                    v-model="formData.countryCode"
                    class="px-3 py-2 text-xs border border-gray-50 rounded-l-lg focus:border-green-500 bg-gray-50 border-r-0"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+64">🇳🇿 +64</option>
                  </select>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-r-lg focus:border-green-500"
                    :class="{ 'border-red-300 bg-red-50': errors.phone }"
                    placeholder="Enter phone number"
                    @input="formatPhoneInput"
                    @blur="validatePhone"
                  />
                </div>
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
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500 uppercase"
                  :class="{ 'border-red-300 bg-red-50': errors.idDocument }"
                  placeholder="Enter ID/Passport number"
                  @input="handleIdDocumentInput"
                  @blur="validateIdDocument"
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
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                :class="{ 'border-red-300 bg-red-50': errors.address }"
                placeholder="Enter full address"
                @input="handleAddressInput"
                @blur="validateAddress"
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
                <div class="flex gap-2">
                  <input
                    v-model="formData.checkIn"
                    type="date"
                    :min="minDate"
                    class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                    :class="{ 'border-red-300 bg-red-50': errors.checkIn }"
                    @change="validateDates"
                  />
                  <button
                    type="button"
                    @click="setTodayAsCheckIn"
                    class="px-3 py-2 text-xs bg-gray-50 text-blue-700 border rounded-lg hover:bg-gray-100 transition-colors"
                    title="Set today as check-in date"
                  >
                    Today
                  </button>
                </div>
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
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
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
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                  :class="{ 'border-red-300 bg-red-50': errors.numGuest }"
                  @change="handleNumGuestChange"
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
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                  :class="{ 'border-red-300 bg-red-50': errors.roomNumber }"
                  :disabled="!formData.checkIn || !formData.checkOut || !formData.numGuest || isCheckingAvailability"
                  @change="validateRoomSelection"
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
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
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
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
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
  prefilledData?: {
    roomNumber?: string
    checkInDate?: string
  } | null
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
  countryCode: '+63', // Default to Philippines
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

// Draft save state
const draftSaveState = ref({
  isVisible: false,
  message: ''
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

// Helper functions for input formatting
const capitalizeInput = (field: string) => {
  const value = (formData.value as any)[field]
  if (typeof value === 'string') {
    // Capitalize first letter of each word
    ;(formData.value as any)[field] = value.replace(/\b\w/g, (char: string) => char.toUpperCase())
  }
}

const uppercaseInput = (field: string) => {
  const value = (formData.value as any)[field]
  if (typeof value === 'string') {
    ;(formData.value as any)[field] = value.toUpperCase()
  }
}

const setTodayAsCheckIn = () => {
  const today = new Date()
  formData.value.checkIn = today.toISOString().split('T')[0]
  validateDates()
}

// Price calculation is now handled by the backend
// Frontend only shows estimate for user reference

// ============================================================================
// FIELD VALIDATION FUNCTIONS
// ============================================================================

const validateFirstName = () => {
  delete errors.value.firstName
  
  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'First name is required'
    return false
  }
  
  if (formData.value.firstName.trim().length < 2) {
    errors.value.firstName = 'First name must be at least 2 characters'
    return false
  }
  
  if (formData.value.firstName.trim().length > 50) {
    errors.value.firstName = 'First name must not exceed 50 characters'
    return false
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(formData.value.firstName.trim())) {
    errors.value.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes'
    return false
  }
  
  return true
}

const validateLastName = () => {
  delete errors.value.lastName
  
  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
    return false
  }
  
  if (formData.value.lastName.trim().length < 2) {
    errors.value.lastName = 'Last name must be at least 2 characters'
    return false
  }
  
  if (formData.value.lastName.trim().length > 50) {
    errors.value.lastName = 'Last name must not exceed 50 characters'
    return false
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(formData.value.lastName.trim())) {
    errors.value.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    return false
  }
  
  return true
}

const validateMiddleName = () => {
  // Middle name is optional, but if provided, validate it
  if (formData.value.middleName && formData.value.middleName.trim()) {
    if (formData.value.middleName.trim().length > 50) {
      errors.value.middleName = 'Middle name must not exceed 50 characters'
      return false
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(formData.value.middleName.trim())) {
      errors.value.middleName = 'Middle name can only contain letters, spaces, hyphens, and apostrophes'
      return false
    }
  }
  
  delete errors.value.middleName
  return true
}

const validateEmail = () => {
  delete errors.value.email
  
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
    return false
  }
  
  // Auto-complete with @gmail.com if user typed just a username
  const email = formData.value.email.trim()
  if (email && !email.includes('@') && !email.includes('.')) {
    formData.value.email = email + '@gmail.com'
    console.log(`📧 Auto-completed email: ${formData.value.email}`)
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email.trim())) {
    errors.value.email = 'Please enter a valid email address'
    return false
  }
  
  if (formData.value.email.trim().length > 100) {
    errors.value.email = 'Email must not exceed 100 characters'
    return false
  }
  
  return true
}

const validateIdDocument = () => {
  delete errors.value.idDocument
  
  if (!formData.value.idDocument.trim()) {
    errors.value.idDocument = 'ID document is required'
    return false
  }
  
  if (formData.value.idDocument.trim().length < 5) {
    errors.value.idDocument = 'ID document must be at least 5 characters'
    return false
  }
  
  if (formData.value.idDocument.trim().length > 20) {
    errors.value.idDocument = 'ID document must not exceed 20 characters'
    return false
  }
  
  // Allow alphanumeric characters, hyphens, and spaces
  if (!/^[A-Z0-9\s-]+$/.test(formData.value.idDocument.trim())) {
    errors.value.idDocument = 'ID document can only contain letters, numbers, spaces, and hyphens'
    return false
  }
  
  return true
}

const validateAddress = () => {
  delete errors.value.address
  
  if (!formData.value.address.trim()) {
    errors.value.address = 'Address is required'
    return false
  }
  
  if (formData.value.address.trim().length < 10) {
    errors.value.address = 'Address must be at least 10 characters'
    return false
  }
  
  if (formData.value.address.trim().length > 200) {
    errors.value.address = 'Address must not exceed 200 characters'
    return false
  }
  
  return true
}

const validateNumGuest = () => {
  delete errors.value.numGuest
  
  if (!formData.value.numGuest || formData.value.numGuest < 1) {
    errors.value.numGuest = 'Number of guests is required'
    return false
  }
  
  if (formData.value.numGuest > 10) {
    errors.value.numGuest = 'Maximum 10 guests allowed'
    return false
  }
  
  return true
}

const validateRoomSelection = () => {
  delete errors.value.roomNumber
  
  if (!formData.value.roomNumber) {
    errors.value.roomNumber = 'Room selection is required'
    return false
  }
  
  // Check if selected room is available
  const selectedRoom = rooms.value.find(room => room.number === formData.value.roomNumber)
  if (selectedRoom && !isRoomAvailable(selectedRoom)) {
    errors.value.roomNumber = 'Selected room is not available for the chosen dates'
    return false
  }
  
  return true
}

// ============================================================================
// INPUT HANDLERS
// ============================================================================

const handleFirstNameInput = () => {
  capitalizeInput('firstName')
  if (errors.value.firstName) {
    validateFirstName()
  }
  autoSaveDraft()
}

const handleLastNameInput = () => {
  capitalizeInput('lastName')
  if (errors.value.lastName) {
    validateLastName()
  }
  autoSaveDraft()
}

const handleMiddleNameInput = () => {
  capitalizeInput('middleName')
  validateMiddleName()
  autoSaveDraft()
}

const handleEmailInput = () => {
  // Clear error when user starts typing
  if (errors.value.email && formData.value.email.trim()) {
    delete errors.value.email
  }
  autoSaveDraft()
}

const handleEmailKeydown = (event: KeyboardEvent) => {
  const email = formData.value.email.trim()
  
  // Auto-complete on Tab, Space, or Enter if user typed just a username
  if ((event.key === 'Tab' || event.key === ' ' || event.key === 'Enter') && 
      email && !email.includes('@') && !email.includes('.')) {
    
    event.preventDefault() // Prevent default behavior
    formData.value.email = email + '@gmail.com'
    console.log(`📧 Auto-completed email with ${event.key}: ${formData.value.email}`)
    
    // If it was Enter, also validate the email
    if (event.key === 'Enter') {
      validateEmail()
    }
  }
}

const handleIdDocumentInput = () => {
  uppercaseInput('idDocument')
  if (errors.value.idDocument) {
    validateIdDocument()
  }
  autoSaveDraft()
}

const handleAddressInput = () => {
  capitalizeInput('address')
  if (errors.value.address) {
    validateAddress()
  }
  autoSaveDraft()
}

const handleNumGuestChange = () => {
  validateNumGuest()
  
  // Check if currently selected room can still accommodate the new guest count
  if (formData.value.roomNumber) {
    const currentRoom = rooms.value.find(room => room.number === formData.value.roomNumber)
    if (currentRoom && !isRoomAvailable(currentRoom)) {
      // Clear room selection if it can no longer accommodate the guests
      formData.value.roomNumber = ''
      console.log(`🔄 Cleared room selection - cannot accommodate ${formData.value.numGuest} guests`)
    }
  }
  
  filterAvailableRooms()
}

const formatPhoneInput = () => {
  // Remove all non-numeric characters
  let phone = formData.value.phone.replace(/\D/g, '')
  
  // Format based on country code
  const countryCode = formData.value.countryCode
  
  // Limit length based on country
  const maxLength = getMaxPhoneLength(countryCode)
  if (phone.length > maxLength) {
    phone = phone.substring(0, maxLength)
  }
  
  // Apply formatting based on country
  formData.value.phone = formatPhoneByCountry(phone, countryCode)
  
  // Clear phone error when user starts typing
  if (errors.value.phone && phone.length > 0) {
    delete errors.value.phone
  }
  
  autoSaveDraft()
}

const getMaxPhoneLength = (countryCode: string): number => {
  const lengths: { [key: string]: number } = {
    '+1': 10,   // US/Canada
    '+63': 10,  // Philippines
    '+44': 11,  // UK
    '+86': 11,  // China
    '+81': 11,  // Japan
    '+82': 11,  // South Korea
    '+65': 8,   // Singapore
    '+60': 10,  // Malaysia
    '+66': 9,   // Thailand
    '+84': 10,  // Vietnam
    '+62': 12,  // Indonesia
    '+91': 10,  // India
    '+61': 9,   // Australia
    '+64': 9    // New Zealand
  }
  return lengths[countryCode] || 10
}

const formatPhoneByCountry = (phone: string, countryCode: string): string => {
  if (!phone) return ''
  
  switch (countryCode) {
    case '+1': // US/Canada: (123) 456-7890
      if (phone.length >= 6) {
        return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`
      } else if (phone.length >= 3) {
        return `(${phone.substring(0, 3)}) ${phone.substring(3)}`
      }
      return phone
    
    case '+63': // Philippines: 0912 345 6789
      if (phone.length >= 7) {
        return `${phone.substring(0, 4)} ${phone.substring(4, 7)} ${phone.substring(7)}`
      } else if (phone.length >= 4) {
        return `${phone.substring(0, 4)} ${phone.substring(4)}`
      }
      return phone
    
    case '+44': // UK: 01234 567890
      if (phone.length >= 6) {
        return `${phone.substring(0, 5)} ${phone.substring(5)}`
      }
      return phone
    
    case '+65': // Singapore: 1234 5678
      if (phone.length >= 4) {
        return `${phone.substring(0, 4)} ${phone.substring(4)}`
      }
      return phone
    
    default: // Default formatting: groups of 3-4 digits
      if (phone.length >= 6) {
        return `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6)}`
      } else if (phone.length >= 3) {
        return `${phone.substring(0, 3)} ${phone.substring(3)}`
      }
      return phone
  }
}

const validatePhone = () => {
  const phone = formData.value.phone.replace(/\D/g, '') // Remove formatting
  const countryCode = formData.value.countryCode
  
  // Clear existing phone error
  delete errors.value.phone
  
  if (!phone) {
    errors.value.phone = 'Phone number is required'
    return false
  }
  
  // Check minimum and maximum length based on country
  const minLength = getMinPhoneLength(countryCode)
  const maxLength = getMaxPhoneLength(countryCode)
  
  if (phone.length < minLength) {
    errors.value.phone = `Phone number must be at least ${minLength} digits for ${getCountryName(countryCode)}`
    return false
  }
  
  if (phone.length > maxLength) {
    errors.value.phone = `Phone number must not exceed ${maxLength} digits for ${getCountryName(countryCode)}`
    return false
  }
  
  // Country-specific validation patterns
  if (!isValidPhoneForCountry(phone, countryCode)) {
    errors.value.phone = `Invalid phone number format for ${getCountryName(countryCode)}`
    return false
  }
  
  return true
}

const getMinPhoneLength = (countryCode: string): number => {
  const lengths: { [key: string]: number } = {
    '+1': 10,   // US/Canada
    '+63': 10,  // Philippines
    '+44': 10,  // UK
    '+86': 11,  // China
    '+81': 10,  // Japan
    '+82': 10,  // South Korea
    '+65': 8,   // Singapore
    '+60': 9,   // Malaysia
    '+66': 8,   // Thailand
    '+84': 9,   // Vietnam
    '+62': 10,  // Indonesia
    '+91': 10,  // India
    '+61': 9,   // Australia
    '+64': 8    // New Zealand
  }
  return lengths[countryCode] || 8
}

const getCountryName = (countryCode: string): string => {
  const names: { [key: string]: string } = {
    '+1': 'US/Canada',
    '+63': 'Philippines',
    '+44': 'UK',
    '+86': 'China',
    '+81': 'Japan',
    '+82': 'South Korea',
    '+65': 'Singapore',
    '+60': 'Malaysia',
    '+66': 'Thailand',
    '+84': 'Vietnam',
    '+62': 'Indonesia',
    '+91': 'India',
    '+61': 'Australia',
    '+64': 'New Zealand'
  }
  return names[countryCode] || 'selected country'
}

const isValidPhoneForCountry = (phone: string, countryCode: string): boolean => {
  switch (countryCode) {
    case '+1': // US/Canada: must not start with 0 or 1
      return !/^[01]/.test(phone)
    
    case '+63': // Philippines: mobile starts with 9, landline varies
      return /^(9|2|3|4|5|6|7|8)/.test(phone)
    
    case '+44': // UK: various patterns
      return /^(1|2|3|7|8)/.test(phone)
    
    case '+65': // Singapore: starts with 6, 8, or 9
      return /^[689]/.test(phone)
    
    case '+86': // China: mobile starts with 1
      return /^1/.test(phone)
    
    case '+81': // Japan: various patterns
      return /^[1-9]/.test(phone)
    
    case '+82': // South Korea: mobile starts with 1
      return /^1/.test(phone)
    
    case '+91': // India: mobile starts with 6, 7, 8, or 9
      return /^[6-9]/.test(phone)
    
    default:
      return true // Allow any format for other countries
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
  
  // Validate all fields using their specific validation functions
  const validations = [
    validateFirstName(),
    validateLastName(),
    validateMiddleName(),
    validateEmail(),
    validatePhone(),
    validateIdDocument(),
    validateAddress(),
    validateNumGuest(),
    validateRoomSelection()
  ]
  
  // Validate dates
  validateDates()
  
  // Check if all validations passed
  const allFieldsValid = validations.every(isValid => isValid)
  const noDateErrors = !errors.value.checkIn && !errors.value.checkOut
  
  return allFieldsValid && noDateErrors && Object.keys(errors.value).length === 0
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
    
    // Clear draft on successful submission
    clearFormDraft()
    
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
    countryCode: '+63', // Default to Philippines
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
  
  // Clear saved draft when form is intentionally reset
  clearFormDraft()
}

// ============================================================================
// FORM DRAFT PERSISTENCE
// ============================================================================

const DRAFT_KEY = 'hotel_reservation_draft'

const saveFormDraft = () => {
  try {
    const draft = {
      ...formData.value,
      timestamp: Date.now()
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    console.log('💾 Form draft saved')
    
    // Show draft saved indicator
    showDraftSavedIndicator('Draft saved')
  } catch (error) {
    console.warn('Failed to save form draft:', error)
  }
}

const showDraftSavedIndicator = (message: string) => {
  draftSaveState.value.message = message
  draftSaveState.value.isVisible = true
  
  // Hide after 2 seconds
  setTimeout(() => {
    draftSaveState.value.isVisible = false
  }, 2000)
}

const loadFormDraft = () => {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      const draft = JSON.parse(saved)
      
      // Check if draft is not too old (24 hours)
      const isRecentDraft = draft.timestamp && (Date.now() - draft.timestamp) < 24 * 60 * 60 * 1000
      
      if (isRecentDraft) {
        // Remove timestamp before applying to form
        delete draft.timestamp
        
        // Only restore if there's meaningful data (not just defaults)
        const hasData = draft.firstName || draft.lastName || draft.email || draft.phone || 
                       draft.address || draft.idDocument || draft.specialRequest
        
        if (hasData) {
          formData.value = { ...formData.value, ...draft }
          console.log('📋 Form draft restored')
          showDraftSavedIndicator('Draft restored')
          return true
        }
      } else {
        // Clear old draft
        clearFormDraft()
      }
    }
  } catch (error) {
    console.warn('Failed to load form draft:', error)
  }
  return false
}

const clearFormDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY)
    console.log('🗑️ Form draft cleared')
  } catch (error) {
    console.warn('Failed to clear form draft:', error)
  }
}

// Auto-save draft with debouncing
let autoSaveTimeout: number | null = null

const autoSaveDraft = () => {
  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
  
  // Set new timeout to save after 2 seconds of inactivity
  autoSaveTimeout = setTimeout(() => {
    // Only auto-save if there's meaningful data
    const hasData = formData.value.firstName || formData.value.lastName || formData.value.email || 
                   formData.value.phone || formData.value.address || formData.value.idDocument || 
                   formData.value.specialRequest
    
    if (hasData) {
      saveFormDraft()
    }
  }, 2000)
}

const closeModal = () => {
  // Save draft before closing (in case it was accidental)
  saveFormDraft()
  resetForm()
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const applyPrefilledData = () => {
  if (!props.prefilledData) return
  
  console.log('🎯 Applying prefilled data:', props.prefilledData)
  
  // Set default number of guests to 1 FIRST (required for room filtering)
  formData.value.numGuest = 1
  
  // Set check-in date if provided
  if (props.prefilledData.checkInDate) {
    formData.value.checkIn = props.prefilledData.checkInDate
    
    // Validate dates after setting them
    validateDates()
  }
  
  // Trigger room availability filtering first to ensure room list is updated
  filterAvailableRooms()
  
  // Set room number if provided (after numGuest and dates are set and rooms are filtered)
  if (props.prefilledData?.roomNumber) {
    // Find the room to verify it's available and can accommodate guests
    const selectedRoom = rooms.value.find(room => room.number === props.prefilledData?.roomNumber)
    
    if (selectedRoom && isRoomAvailable(selectedRoom)) {
      formData.value.roomNumber = props.prefilledData.roomNumber
      console.log(`✅ Pre-filled room ${props.prefilledData.roomNumber} is available`)
      
      // Validate room selection
      validateRoomSelection()
    } else {
      console.log(`❌ Pre-filled room ${props.prefilledData?.roomNumber} is not available or cannot accommodate ${formData.value.numGuest} guest(s)`)
      // Clear the room selection if it's not valid
      formData.value.roomNumber = ''
    }
  }
}

// Watchers
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await loadRooms()
    await loadReservations()
    
    // Try to load saved draft first
    const draftLoaded = loadFormDraft()
    
    // Apply prefilled data if available and no draft was loaded
    if (props.prefilledData && !draftLoaded) {
      setTimeout(() => {
        applyPrefilledData()
      }, 100)
    } else if (draftLoaded) {
      console.log('📋 Draft data takes precedence over prefilled data')
      // Still trigger room filtering for the restored data
      setTimeout(() => {
        filterAvailableRooms()
      }, 100)
    }
  }
})

watch([() => formData.value.checkIn, () => formData.value.checkOut], () => {
  if (formData.value.checkIn && formData.value.checkOut) {
    filterAvailableRooms()
  }
})

// Watch for country code changes to reformat and revalidate phone number
watch(() => formData.value.countryCode, () => {
  if (formData.value.phone) {
    formatPhoneInput()
    validatePhone()
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
