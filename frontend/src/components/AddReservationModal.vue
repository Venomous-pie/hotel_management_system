<template>
  <div v-if="isOpen" class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50"
    @click="handleBackdropClick">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200"
      @click.stop>

      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-medium text-gray-900">Add New Reservation</h2>

          <div v-if="draftSaveState.isVisible"
            class="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs transition-opacity">
            <i class="pi pi-check w-3 h-3"></i>
            <span>{{ draftSaveState.message }}</span>
          </div>

          <button v-if="hasDraftData" @click="clearDraftAndReset"
            class="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-md text-xs hover:bg-orange-100 transition-colors"
            title="Clear saved draft and start fresh">
            <i class="pi pi-trash w-3 h-3"></i>
            <span>Clear Draft</span>
          </button>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <i class="pi pi-times w-5 h-5"></i>
        </button>
      </div>

      <div class="p-6">

        <div v-if="modalState.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ modalState.error }}</p>
        </div>

        <div v-if="modalState.success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-700">Reservation created successfully!</p>
        </div>

        <form @submit.prevent="submitReservation" class="space-y-6">

          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-4">Guest Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.firstName" type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.firstName }" placeholder="Enter first name"
                  @input="handleFirstNameInput" @blur="validateFirstName" />
                <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.lastName" type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.lastName }" placeholder="Enter last name"
                  @input="handleLastNameInput" @blur="validateLastName" />
                <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                <input v-model="formData.middleName" type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.middleName }" placeholder="Enter middle name (optional)"
                  @input="handleMiddleNameInput" />
                <p v-if="errors.middleName" class="mt-1 text-xs text-red-600">{{ errors.middleName }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.email" type="email"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.email }" placeholder="Enter email address"
                  @input="handleEmailInput" @blur="validateEmail" @keydown="handleEmailKeydown" />
                <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Phone <span class="text-red-500">*</span>
                </label>
                <div class="flex">
                  <select v-model="formData.countryCode"
                    class="px-3 py-2 text-xs border border-gray-50 rounded-l-lg focus:border-green-500 bg-gray-50 border-r-0">
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
                  <input v-model="formData.phone" type="tel"
                    class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-r-lg focus:border-green-500"
                    :class="{ 'border-red-300 bg-red-50': errors.phone }" placeholder="Enter phone number"
                    @input="formatPhoneInput" @blur="validatePhone" />
                </div>
                <p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  ID Document <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.idDocument" type="text"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500 uppercase"
                  :class="{ 'border-red-300 bg-red-50': errors.idDocument }" placeholder="Enter ID/Passport number"
                  @input="handleIdDocumentInput" @blur="validateIdDocument" />
                <p v-if="errors.idDocument" class="mt-1 text-xs text-red-600">{{ errors.idDocument }}</p>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Address <span class="text-red-500">*</span>
              </label>
              <textarea v-model="formData.address" rows="2"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                :class="{ 'border-red-300 bg-red-50': errors.address }" placeholder="Enter full address"
                @input="handleAddressInput" @blur="validateAddress"></textarea>
              <p v-if="errors.address" class="mt-1 text-xs text-red-600">{{ errors.address }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-4">Reservation Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Check-in Date <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <input v-model="formData.checkIn" type="date" :min="minDate"
                    class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                    :class="{ 'border-red-300 bg-red-50': errors.checkIn }" @change="validateDates" />
                  <button type="button" @click="setTodayAsCheckIn"
                    class="px-3 py-2 text-xs bg-gray-50 text-blue-700 border rounded-lg hover:bg-gray-100 transition-colors"
                    title="Set today as check-in date">
                    Today
                  </button>
                </div>
                <p v-if="errors.checkIn" class="mt-1 text-xs text-red-600">{{ errors.checkIn }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Check-out Date <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.checkOut" type="date" :min="minCheckOutDate"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                  :class="{ 'border-red-300 bg-red-50': errors.checkOut }" @change="validateDates" />
                <p v-if="errors.checkOut" class="mt-1 text-xs text-red-600">{{ errors.checkOut }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Number of Guests <span class="text-red-500">*</span>
                </label>
                <select v-model="formData.numGuest"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                  :class="{ 'border-red-300 bg-red-50': errors.numGuest }" @change="handleNumGuestChange">
                  <option value="">Select guests</option>
                  <option v-for="num in 10" :key="num" :value="num">{{ num }} {{ num === 1 ? 'Guest' : 'Guests' }}
                  </option>
                </select>
                <p v-if="errors.numGuest" class="mt-1 text-xs text-red-600">{{ errors.numGuest }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Room <span class="text-red-500">*</span>
                </label>
                <select v-model="formData.roomNumber"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                  :class="{ 'border-red-300 bg-red-50': errors.roomNumber }"
                  :disabled="!formData.checkIn || !formData.checkOut || !formData.numGuest || isCheckingAvailability"
                  @change="validateRoomSelectionLocal">
                  <option value="">
                    {{ isCheckingAvailability ? 'Checking availability...' : 'Select room' }}
                  </option>
                  <optgroup v-for="category in roomsByCategory" :key="category.type" :label="category.type">
                    <option v-for="room in category.rooms" :key="room.number" :value="room.number"
                      :disabled="!isRoomAvailable(room)">
                      Room {{ room.number }} - ${{ room.pricePerNight }}/night ({{ room.maxCapacity }} guests max)
                      {{ !isRoomAvailable(room) ? ' - Unavailable' : '' }}
                    </option>
                  </optgroup>
                </select>
                <p v-if="errors.roomNumber" class="mt-1 text-xs text-red-600">{{ errors.roomNumber }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select v-model="formData.status"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800">
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="checkedIn">Checked In</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Estimated Total Price
                  <span class="text-xs font-normal text-gray-500">(system)</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-xs text-gray-500">$</span>
                  <input v-model="calculatedPrice" type="text"
                    class="w-full pl-6 pr-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-green-600"
                    readonly placeholder="Select room and dates" disabled />
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

            <div class="mt-4">
              <label class="block text-xs font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea v-model="formData.specialRequest" rows="3"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-green-500"
                placeholder="Any special requests or notes..."></textarea>
            </div>

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

      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <Custombutton label="Cancel" bg-color="bg-gray-100" hover-bg-color="hover:bg-gray-200"
          text-color="text-gray-700" :hover="true" @click="closeModal" />
        <Custombutton label="Create Reservation" bg-color="bg-green-600" hover-bg-color="hover:bg-green-700"
          text-color="white" :disabled="modalState.isLoading || !isFormValid" :hover="true" @click="submitReservation">
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
import { getTodayAsString } from '@/utils'
import { useHotelData } from '@/composables/useHotelData'
import { useReservationForm } from '@/composables/useReservationForm'
import { useRoomAvailability } from '@/composables/useRoomAvailability'
import { useFormDraft } from '@/composables/useFormDraft'
import { useReservationSubmission } from '@/composables/useReservationSubmission'
import { usePrefilledReservation } from '@/composables/usePrefilledReservation'

interface Props {
  isOpen: boolean
  prefilledData?: {
    roomNumber?: string
    checkInDate?: string
  } | null
}

interface Emits {
  (e: 'close'): void
  (e: 'success', payload: { reservation: any; roomNumber: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { rooms, reservations, loading: _hotelLoading, error: _hotelError, refreshAll } = useHotelData()

const {
  formData,
  errors,
  isFormValid,
  validateFirstName,
  validateLastName,
  validateMiddleName,
  validateEmail,
  validateIdDocument,
  validateAddress,
  validateNumGuest,
  validateRoomSelection,
  validatePhone,
  validateDates,
  validateForm,
  handleFirstNameInput,
  handleLastNameInput,
  handleMiddleNameInput,
  handleEmailInput,
  handleEmailKeydown,
  handleIdDocumentInput,
  handleAddressInput,
  formatPhoneInput,
  resetForm,
} = useReservationForm()

const {
  isCheckingAvailability,
  minDate,
  minCheckOutDate,
  nights,
  roomsByCategory,
  selectedRoom,
  selectedRoomPrice,
  calculatedPrice,
  isRoomAvailable,
  filterAvailableRooms,
} = useRoomAvailability(rooms, reservations, formData)

const {
  draftSaveState,
  hasDraftData,
  saveFormDraft,
  loadFormDraft,
  clearFormDraft,
  clearDraftAndReset,
  autoSaveDraft,
} = useFormDraft(formData, resetForm)

const prefilledRef = computed(() => props.prefilledData)
const validateRoomSelectionLocal = () => {
  return validateRoomSelection((roomNumber: string) => {
    const room = rooms.value.find(r => r.number === roomNumber)
    return room ? isRoomAvailable(room) : false
  })
}
const { applyPrefilledData } = usePrefilledReservation(prefilledRef, rooms, formData, validateDates, () => validateRoomSelectionLocal(), isRoomAvailable, filterAvailableRooms)

const validateFormWithDates = () => {
  const base = validateForm()
  validateDates()
  const noDateErrors = !(errors.value.checkIn || errors.value.checkOut)
  return base && noDateErrors && Object.keys(errors.value).length === 0
}
const { modalState, submitReservation } = useReservationSubmission(
  formData,
  validateFormWithDates,
  clearFormDraft,
  (reservation) => { emit('success', { reservation, roomNumber: formData.value.roomNumber }) },
  () => { resetForm(); closeModal() }
)

const setTodayAsCheckIn = () => {
  formData.value.checkIn = getTodayAsString()
  validateDates()
}

const handleNumGuestChange = () => {
  validateNumGuest()
  if (formData.value.roomNumber) {
    const currentRoom = rooms.value.find(room => room.number === formData.value.roomNumber)
    if (currentRoom && !isRoomAvailable(currentRoom)) {
      formData.value.roomNumber = ''
    }
  }
  filterAvailableRooms()
}

const closeModal = () => {
  saveFormDraft()
  modalState.value.error = null
  modalState.value.success = false
  modalState.value.isLoading = false

  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await refreshAll()
    const draftLoaded = loadFormDraft()
    if (props.prefilledData && !draftLoaded) {
      setTimeout(() => {
        applyPrefilledData()
      }, 100)
    } else if (draftLoaded) {
      setTimeout(() => {
        filterAvailableRooms()
      }, 100)
    }
  }
})

watch(formData, () => {
  autoSaveDraft()
}, { deep: true })

watch([() => formData.value.checkIn, () => formData.value.checkOut], () => {
  if (formData.value.checkIn && formData.value.checkOut) {
    filterAvailableRooms()
  }
})

watch(() => formData.value.countryCode, () => {
  if (formData.value.phone) {
    formatPhoneInput()
    validatePhone()
  }
})

onMounted(() => {
  if (props.isOpen) {
    refreshAll()
  }
})
</script>
