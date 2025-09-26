<template>
    <div class="h-full bg-white">
        <!-- Date Navigation -->
        <div class="flex items-center justify-between mb-4 px-2">
            <div class="flex items-center text-sm text-gray-600 font-medium select-none">
                <span @click="navigateDates(-1)" title="Previous 16 days"
                    class="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-gray-100 rounded">
                    <i class="pi pi-chevron-left text-gray-600 w-3 h-3"></i>
                </span>
                <div class="text-center px-4 w-52">
                    {{ dateRange[0]?.dayName }} {{ dateRange[0]?.dayNumber }} -
                    {{ dateRange[15]?.dayName }} {{ dateRange[15]?.dayNumber }}
                </div>
                <span @click="navigateDates(1)" title="Next 16 days"
                    class="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-gray-100 rounded">
                    <i class="pi pi-chevron-right text-gray-600 w-3 h-3"></i>
                </span>
            </div>

            <!-- Status Legend -->
            <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-yellow-300 border border-yellow-400"></div>
                    <span class="text-gray-600">New</span>
                </div>
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                    <span class="text-gray-600">Confirmed</span>
                </div>
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                    <span class="text-gray-600">Booked</span>
                </div>
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-green-600 border border-green-700"></div>
                    <span class="text-gray-600">Checked In</span>
                </div>
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-red-600 border border-red-700"></div>
                    <span class="text-gray-600">Due Out</span>
                </div>
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-orange-400 border border-orange-500"></div>
                    <span class="text-gray-600">Checked Out</span>
                </div>
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-amber-700 border border-amber-800"></div>
                    <span class="text-gray-600">Out of Order</span>
                </div>
            </div>
        </div>

        <!-- Gantt Chart Table -->
        <div class="overflow-hidden rounded-lg outline outline-1 outline-gray-200 bg-white shadow-sm">
            <table class="w-full table-fixed border-collapse">
                <!-- Table Header -->
                <thead>
                    <tr>
                        <!-- Rooms Header -->
                        <th
                            class="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left w-64 outline outline-1 outline-gray-100">
                            <div class="text-sm font-bold text-gray-700">Rooms</div>
                        </th>

                        <!-- Day Headers (16 days) -->
                        <th v-for="day in dateRange" :key="day.date"
                            class="px-1 py-2 text-center outline outline-1 outline-gray-100 transition-colors"
                            :class="{ 'bg-green-50': hoveredColumn === day.date }"
                            :style="{ width: `calc((100% - 8rem) / 16)` }" @mouseenter="hoveredColumn = day.date"
                            @mouseleave="hoveredColumn = null">
                            <div class="flex flex-col">
                                <!-- Day Name -->
                                <div class="text-xs font-bold text-gray-600 mb-1">
                                    {{ day.dayName }}
                                </div>
                                <!-- Date -->
                                <div class="text-xs text-gray-500">
                                    {{ day.dayNumber }}
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody>
                    <!-- Loading State -->
                    <tr v-if="props.loading">
                        <td colspan="100%" class="text-center py-8 text-gray-500">
                            Loading rooms and reservations...
                        </td>
                    </tr>

                    <!-- Error State -->
                    <tr v-else-if="props.error">
                        <td colspan="100%" class="text-center py-8 text-red-500">
                            {{ props.error }}
                        </td>
                    </tr>

                    <!-- No Results State -->
                    <tr v-else-if="!roomCategories.length">
                        <td colspan="100%" class="text-center py-8 text-gray-500">
                            No rooms match the current filters
                        </td>
                    </tr>

                    <!-- Room Categories -->
                    <template v-else v-for="category in roomCategories" :key="category.name">
                        <!-- Category Header Row -->
                        <tr class="cursor-pointer" @click="toggleCategory(category.type)">
                            <td
                                class="sticky left-0 z-10 px-4 py-2 border-r border-gray-200 w-64 outline outline-1 outline-gray-100">
                                <div class="flex items-center">
                                    <!-- Expand/Collapse Icon -->
                                    <div class="mr-2 text-gray-500">
                                        <svg v-if="expandedCategories[category.type]" class="w-4 h-4" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </div>
                                    <div class="text-sm font-medium text-gray-800">{{ category.name }}</div>
                                    <div class="ml-2 text-xs text-gray-600">({{ category.rooms.length }})</div>
                                </div>
                            </td>
                            <td v-for="day in dateRange" :key="`${category.name}-${day.date}`"
                                class="px-0.5 py-2 outline outline-1 outline-gray-100 transition-colors text-center"
                                :class="{ 'bg-green-50': hoveredColumn === day.date }"
                                @mouseenter="hoveredColumn = day.date" @mouseleave="hoveredColumn = null">
                                <!-- Category availability summary -->
                                <div class="inline-flex items-center justify-center bg-green-200 h-8 w-8 rounded">
                                    <span class="text-xs font-medium text-green-600">
                                        {{ getAvailableRoomCountForDate(category, day.date) }}
                                    </span>
                                </div>
                            </td>
                        </tr>

                        <!-- Room rows for this category -->
                        <tr v-for="room in category.rooms" :key="room.number" v-show="expandedCategories[category.type]"
                            class="border-t border-gray-100">
                            <!-- Room Number -->
                            <td
                                class="sticky left-0 z-10 bg-white px-6 py-2 border-r border-gray-200 w-64 outline outline-1 outline-gray-100">
                                <div class="flex items-center py-2">
                                    <div class="text-sm font-medium text-gray-900">{{ room.number }}</div>
                                    <div class="ml-2 text-xs text-gray-500">{{ room.floor }}</div>
                                </div>
                            </td>

                            <!-- Day cells -->
                            <td v-for="day in dateRange" :key="`${room.number}-${day.date}`"
                                class="px-0.5 py-2 outline outline-1 outline-gray-100 transition-colors hover:bg-green-100"
                                :class="{ 'bg-green-50': hoveredColumn === day.date }"
                                @mouseenter="hoveredColumn = day.date" @mouseleave="hoveredColumn = null">
                                <!-- Reservation blocks -->
                                <div v-if="getReservation(room.number, day.date)"
                                    :class="[
                                        getReservationColor(getReservation(room.number, day.date)),
                                        {
                                            'ring-2 ring-yellow-400 ring-offset-1 animate-pulse': 
                                                highlightedReservation === (getReservation(room.number, day.date)?.id || getReservation(room.number, day.date)?.bookingNumber)
                                        }
                                    ]"
                                    class="h-6 text-xs flex items-center justify-center font-medium cursor-pointer"
                                    :title="(getReservation(room.number, day.date)?.guest || getReservation(room.number, day.date)?.guestName || 'Guest')">
                                    {{ (getReservation(room.number, day.date)?.guest || getReservation(room.number, day.date)?.guestName || 'Guest').split(' ')[0] }}
                                </div>
                                <div v-else class="h-6 rounded mx-0.5 cursor-pointer"></div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

// Props from parent (Frontdesk.vue)
const props = defineProps<{
    selectedYear: number
    selectedMonth: number
    searchQuery: string
    reservationFilter: string
    roomTypeFilter: string
    bookingFilter: string
    rooms: any[]
    reservations: any[]
    loading: boolean
    error: string | null
}>()

// Emit events to parent
const emit = defineEmits<{
    updateDate: [{ year: number; month: number }]
}>()

// Hover state for column highlighting
const hoveredColumn = ref<string | null>(null)

// Highlighted reservation for search results
const highlightedReservation = ref<string | null>(null)

// Date navigation offset (in days from selected month start)
const dateOffset = ref(0)

// Generate 16 days starting from selected year/month + offset
const dateRange = computed(() => {
    const days = []
    const startDate = new Date(props.selectedYear, props.selectedMonth, 1)
    startDate.setDate(startDate.getDate() + dateOffset.value)

    for (let i = 0; i < 16; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        days.push({
            date: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate().toString().padStart(2, '0')
        })
    }

    return days
})

// Navigation functions
const navigateDates = (direction: number) => {
    dateOffset.value += direction * 16

    // Check if we need to update the parent's year/month
    const newStartDate = new Date(props.selectedYear, props.selectedMonth, 1)
    newStartDate.setDate(newStartDate.getDate() + dateOffset.value)

    const newYear = newStartDate.getFullYear()
    const newMonth = newStartDate.getMonth()

    // If we've crossed into a different month/year, notify parent
    if (newYear !== props.selectedYear || newMonth !== props.selectedMonth) {
        emit('updateDate', { year: newYear, month: newMonth })
    }
}

// Reset date offset when month/year changes
const resetDateOffset = () => {
    dateOffset.value = 0
}

// Navigate to a specific date (for search functionality)
const navigateToDate = (targetDate: string) => {
    const target = new Date(targetDate)
    const currentStart = new Date(props.selectedYear, props.selectedMonth, 1)
    
    // Calculate the difference in days
    const diffTime = target.getTime() - currentStart.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    // Calculate the offset needed (16-day chunks)
    const targetOffset = Math.floor(diffDays / 16) * 16
    
    // Update the offset
    dateOffset.value = targetOffset
    
    // Check if we need to update the parent's year/month
    const newStartDate = new Date(currentStart)
    newStartDate.setDate(newStartDate.getDate() + targetOffset)
    
    const newYear = newStartDate.getFullYear()
    const newMonth = newStartDate.getMonth()
    
    // If we've crossed into a different month/year, notify parent
    if (newYear !== props.selectedYear || newMonth !== props.selectedMonth) {
        emit('updateDate', { year: newYear, month: newMonth })
    }
}

// Watch for month/year changes and reset offset
watch([() => props.selectedYear, () => props.selectedMonth], () => {
    resetDateOffset()
})

// Watch for search query changes and auto-navigate to guest location
watch(() => props.searchQuery, (newQuery, oldQuery) => {
    if (newQuery && newQuery.trim()) {
        const query = newQuery.toLowerCase().trim()
        
        // Find the best matching reservation (prioritize current/upcoming reservations)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const matchingReservations = props.reservations.filter(reservation => {
            const guestName = (reservation.guest || reservation.guestName || '').toLowerCase()
            const bookingId = (reservation.id || reservation.bookingNumber || '').toString().toLowerCase()
            const roomNumber = (reservation.room || reservation.roomNumber || '').toString().toLowerCase()
            
            return guestName.includes(query) || bookingId.includes(query) || roomNumber.includes(query)
        })
        
        // Sort by preference: current reservations first, then upcoming, then past
        const matchingReservation = matchingReservations.sort((a, b) => {
            const aCheckIn = new Date(a.checkIn || a.checkInDate)
            const aCheckOut = new Date(a.checkOut || a.checkOutDate)
            const bCheckIn = new Date(b.checkIn || b.checkInDate)
            const bCheckOut = new Date(b.checkOut || b.checkOutDate)
            
            aCheckIn.setHours(0, 0, 0, 0)
            aCheckOut.setHours(0, 0, 0, 0)
            bCheckIn.setHours(0, 0, 0, 0)
            bCheckOut.setHours(0, 0, 0, 0)
            
            // Current reservations (today is between check-in and check-out)
            const aIsCurrent = today >= aCheckIn && today < aCheckOut
            const bIsCurrent = today >= bCheckIn && today < bCheckOut
            
            if (aIsCurrent && !bIsCurrent) return -1
            if (!aIsCurrent && bIsCurrent) return 1
            
            // If both or neither are current, prefer upcoming reservations
            const aIsUpcoming = aCheckIn >= today
            const bIsUpcoming = bCheckIn >= today
            
            if (aIsUpcoming && !bIsUpcoming) return -1
            if (!aIsUpcoming && bIsUpcoming) return 1
            
            // If same category, sort by check-in date (closest first)
            return Math.abs(aCheckIn.getTime() - today.getTime()) - Math.abs(bCheckIn.getTime() - today.getTime())
        })[0]
        
        // If we found a matching reservation, navigate to its check-in date
        if (matchingReservation) {
            const checkInDate = matchingReservation.checkIn || matchingReservation.checkInDate
            if (checkInDate) {
                // Set the highlighted reservation
                highlightedReservation.value = matchingReservation.id || matchingReservation.bookingNumber
                
                // Add a small delay to ensure the filtering is complete
                setTimeout(() => {
                    navigateToDate(checkInDate)
                }, 100)
                
                // Clear highlight after 3 seconds
                setTimeout(() => {
                    highlightedReservation.value = null
                }, 3000)
            }
        }
    } else {
        // Clear highlight when search is cleared
        highlightedReservation.value = null
    }
})

// Filtered rooms based on parent filters
const filteredRooms = computed(() => {
    let filtered = props.rooms

    // Filter by search query (room number or guest name)
    if (props.searchQuery && props.searchQuery.trim()) {
        const query = props.searchQuery.toLowerCase().trim()
        filtered = filtered.filter(room => {
            const roomNumber = (room.roomNumber || room.number || '').toString().toLowerCase()
            
            // Check if room number matches
            if (roomNumber.includes(query)) {
                return true
            }
            
            // Check if any reservation in this room has a matching guest name
            const roomReservations = props.reservations.filter(reservation => {
                const resRoomNumber = (reservation.room || reservation.roomNumber || '').toString()
                return resRoomNumber === (room.roomNumber || room.number || '').toString()
            })
            
            return roomReservations.some(reservation => {
                const guestName = (reservation.guest || '').toLowerCase()
                const bookingNumber = (reservation.id || reservation.bookingNumber || '').toString().toLowerCase()
                return guestName.includes(query) || bookingNumber.includes(query)
            })
        })
    }

    // Filter by room type
    if (props.roomTypeFilter !== 'All Room Types') {
        filtered = filtered.filter(room => {
            const typeName = room.RoomType?.typeName || room.roomType || room.type || 'Standard'

            // Handle partial matches for broader categories
            if (props.roomTypeFilter === 'Standard') {
                return typeName.toLowerCase().includes('standard')
            }
            if (props.roomTypeFilter === 'Deluxe') {
                return typeName.toLowerCase().includes('deluxe')
            }
            if (props.roomTypeFilter === 'Suite') {
                return typeName.toLowerCase().includes('suite')
            }

            // Exact match for specific types
            return typeName === props.roomTypeFilter
        })
    }

    return filtered
})

// Filtered reservations based on parent filters
const filteredReservations = computed(() => {
    let filtered = props.reservations

    // Filter by reservation status
    if (props.reservationFilter !== 'All Reservations') {
        const statusMap: Record<string, string> = {
            'Confirmed': 'confirmed',
            'Pending': 'pending',
            'Checked In': 'checkedIn',
            'Cancelled': 'cancelled'
        }
        const targetStatus = statusMap[props.reservationFilter]
        if (targetStatus) {
            filtered = filtered.filter(res => res.status === targetStatus)
        }
    }

    // Filter by booking source
    if (props.bookingFilter !== 'All Booking') {
        const sourceMap: Record<string, string> = {
            'Direct': 'direct',
            'Booking.com': 'booking.com',
            'Expedia': 'expedia',
            'Airbnb': 'airbnb'
        }
        const targetSource = sourceMap[props.bookingFilter] || props.bookingFilter.toLowerCase()
        filtered = filtered.filter(res =>
            (res.source || '').toLowerCase().includes(targetSource)
        )
    }

    // Filter by search query
    if (props.searchQuery.trim()) {
        const query = props.searchQuery.toLowerCase()
        filtered = filtered.filter(res =>
            (res.guest || res.guestName || '').toLowerCase().includes(query) ||
            (res.id || res.bookingNumber || '').toString().toLowerCase().includes(query) ||
            (res.room || res.roomNumber || '').toString().toLowerCase().includes(query)
        )
    }

    return filtered
})

// Expanded categories state (all expanded by default)
const expandedCategories = ref<Record<string, boolean>>({})

// Toggle category expansion
const toggleCategory = (categoryType: string) => {
    expandedCategories.value[categoryType] = !expandedCategories.value[categoryType]
}

// Group rooms by category from filtered data
const roomCategories = computed(() => {
    if (!filteredRooms.value.length) {
        console.log('No rooms to display')
        return []
    }

    console.log('Processing filtered rooms:', filteredRooms.value.length)

    // Group rooms by their room type
    const grouped = filteredRooms.value.reduce((acc, room) => {
        const typeName = room.RoomType?.typeName || room.roomType || room.type || 'Standard'
        const categoryName = `${typeName} Rooms`

        if (!acc[typeName]) {
            acc[typeName] = {
                name: categoryName,
                type: typeName,
                rooms: []
            }
        }

        acc[typeName].rooms.push({
            number: room.roomNumber || room.number || room.id,
            type: typeName,
            floor: `Floor ${room.floorNumber || Math.floor(parseInt(room.roomNumber || room.number || '0') / 100)}`,
            status: room.status || 'available',
            pricePerNight: room.pricePerNight || 0,
            originalRoom: room // Keep reference to original room data
        })

        return acc
    }, {} as Record<string, any>)

    // Convert to array and sort rooms within categories
    const categories = Object.values(grouped).map((category: any) => ({
        ...category,
        rooms: category.rooms.sort((a: any, b: any) => (a.number || '').localeCompare(b.number || ''))
    }))

    // Initialize expanded state for new categories
    categories.forEach(category => {
        if (!(category.type in expandedCategories.value)) {
            expandedCategories.value[category.type] = true
        }
    })

    return categories
})

// Get reservation for specific room and date (using filtered reservations)
const getReservation = (roomNumber: string, date: string) => {
    return filteredReservations.value.find(reservation => {
        const checkIn = new Date(reservation.checkIn || reservation.checkInDate)
        const checkOut = new Date(reservation.checkOut || reservation.checkOutDate)
        const targetDate = new Date(date)

        // Normalize times
        checkIn.setHours(0, 0, 0, 0)
        checkOut.setHours(0, 0, 0, 0)
        targetDate.setHours(0, 0, 0, 0)

        const resRoomNumber = (reservation.room || reservation.roomNumber || '').toString()
        return resRoomNumber === roomNumber.toString() &&
            targetDate >= checkIn &&
            targetDate < checkOut
    })
}

// Get reservation display color
const getReservationColor = (reservation: any) => {
    if (!reservation) return ''

    switch (reservation.status) {
        case 'new': return 'bg-yellow-300 border-yellow-400 text-yellow-800'
        case 'confirmed': return 'bg-blue-100 border-blue-300 text-blue-800'
        case 'booked': return 'bg-green-100 border-green-300 text-green-800'
        case 'checkedIn': return 'bg-green-600 border-green-700 text-white'
        case 'dueOut': return 'bg-red-600 border-red-700 text-white'
        case 'checkedOut': return 'bg-orange-400 border-orange-500 text-white'
        case 'outOfOrder': return 'bg-amber-700 border-amber-800 text-white'
        case 'cancelled': return 'bg-red-100 border-red-300 text-red-800'
        // Legacy status mapping
        case 'pending': return 'bg-yellow-300 border-yellow-400 text-yellow-800'
        default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
}

// Check if room is available on a specific date
const isRoomAvailable = (roomNumber: string, date: string) => {
    // Check if room has any active reservations on this date
    const reservation = getReservation(roomNumber, date)

    // Room is available if:
    // 1. No reservation exists
    // 2. Reservation is cancelled
    // 3. Reservation is checked out
    return !reservation ||
        reservation.status === 'cancelled' ||
        reservation.status === 'checkedOut'
}

// Get available room count for a category on a specific date
const getAvailableRoomCountForDate = (category: any, date: string) => {
    return category.rooms.filter((room: any) => {
        // Check room status first
        if (room.status === 'out-of-order' || room.status === 'maintenance') {
            return false
        }

        // Check if room is available on this specific date
        return isRoomAvailable(room.number, date)
    }).length
}
</script>