<template>
    <div class="h-full bg-white">
        <!-- Date Navigation -->
        <div class="flex items-center justify-between mb-4 px-2">
            <div class="flex items-center text-sm text-gray-600 font-medium select-none">
                <span @click="navigateDates(-1)" title="Previous 5 days"
                    class="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-gray-100 rounded">
                    <i class="pi pi-chevron-left text-gray-600 w-3 h-3"></i>
                </span>
                <div class="text-center px-4 w-52">
                    <div class="text-sm font-medium">
                        {{ dateRange[0]?.dayName }} {{ dateRange[0]?.dayNumber }} -
                        {{ dateRange[15]?.dayName }} {{ dateRange[15]?.dayNumber }}
                    </div>
                </div>
                <span @click="navigateDates(1)" title="Next 5 days"
                    class="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-gray-100 rounded">
                    <i class="pi pi-chevron-right text-gray-600 w-3 h-3"></i>
                </span>
                
                <!-- Today Button -->
                <button 
                    @click="jumpToToday" 
                    title="Jump to today"
                    class="ml-3 px-3 py-1 text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
                >
                    Today
                </button>
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
        <div class="relative overflow-x-auto overflow-hidden rounded-lg outline outline-1 outline-gray-200 bg-white shadow-sm"
            ref="containerEl">
            <table class="w-full table-fixed border-collapse min-w-1254px">
                <!-- Table Header -->
                <thead>
                    <tr>
                        <!-- Rooms Header -->
                        <th
                            class="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left outline outline-1 outline-gray-100 w-270px min-w-270px max-w-270px overflow-hidden text-ellipsis whitespace-nowrap">
                            <div class="text-sm font-bold text-gray-700">Rooms</div>
                        </th>

                        <!-- Day Headers (16 days) -->
                        <th v-for="day in dateRange" :key="day.date"
                            class="px-1 py-2 text-center outline outline-1 outline-gray-100 transition-colors w-61.5px min-w-61.5px max-w-61.5px overflow-hidden h-48px"
                            :class="{ 'bg-green-50': hoveredColumn === day.date }"
                            @mouseenter="hoveredColumn = day.date" @mouseleave="hoveredColumn = null">
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
                                class="sticky left-0 z-10 px-4 py-2 bg-white border-r border-gray-200 outline outline-1 outline-gray-100 w-270px min-w-270px max-w-270px overflow-hidden text-ellipsis whitespace-nowrap h-48px">
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
                                class="px-0.5 py-2 outline outline-1 outline-gray-100 transition-colors text-center w-61.5px min-w-61.5px max-w-61.5px overflow-hidden h-48px"
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
                            class="border-t border-gray-100" :ref="el => setRowRef(room.number, el)">
                            <!-- Room Number -->
                            <td
                                class="sticky left-0 z-100 bg-white px-6 py-2 border-r border-gray-200 outline outline-1 outline-gray-100 w-270px min-w-270px max-w-270px overflow-hidden text-ellipsis whitespace-nowrap h-48px">
                                <div class="flex items-center py-2">
                                    <div class="text-sm font-medium text-gray-900">{{ room.number }}</div>
                                    <div class="ml-2 text-xs text-gray-500">{{ room.floor }}</div>
                                </div>
                            </td>

                            <!-- Day cells (clickable for creating reservations) -->
                            <td v-for="day in dateRange" :key="`${room.number}-${day.date}`"
                                class="px-0.5 py-2 outline outline-1 outline-gray-100 transition-colors hover:bg-green-100 w-61.5px min-w-61.5px max-w-61.5px overflow-hidden h-48px cursor-pointer"
                                :class="{ 
                                    'bg-green-50': hoveredColumn === day.date,
                                    'hover:bg-blue-50': isRoomAvailable(room.number, day.date),
                                    'hover:bg-red-50 cursor-not-allowed': !isRoomAvailable(room.number, day.date)
                                }"
                                :title="isRoomAvailable(room.number, day.date) ? 
                                    `Click to create reservation for Room ${room.number} on ${day.date}` : 
                                    `Room ${room.number} is not available on ${day.date}`"
                                @mouseenter="hoveredColumn = day.date" 
                                @mouseleave="hoveredColumn = null"
                                @click="handleCellClick(room.number, day.date)">
                                <!-- Empty cell to preserve grid; reservation spans are rendered in overlay layer -->
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <!-- Spanning reservation blocks overlay -->
            <div class="absolute inset-0 pointer-events-none z-30">
                <template v-for="category in roomCategories" :key="category.name">
                    <template v-if="expandedCategories[category.type]">
                        <template v-for="room in category.rooms" :key="room.number">
                            <div v-for="span in getReservationSpans(room.number)" :key="span.key"
                                class="absolute pointer-events-auto cursor-pointer rounded-lg shadow-sm" :class="[
                                    getReservationColor(span.reservation),
                                    {
                                        'ring-2 ring-yellow-400 ring-offset-1 animate-pulse':
                                            highlightedReservation === (span.reservation.id || span.reservation.bookingNumber)
                                    }
                                ]" :style="span.style"
                                :title="`${span.reservation.guest || span.reservation.guestName || 'Guest'} - ${formatDateRange(span.reservation)}`">
                                <div class="h-full flex items-center text-xs font-medium overflow-hidden">
                                    <div :class="getReservationAccentColor(span.reservation)"
                                        class="h-full w-3 rounded-l-lg flex-shrink-0 relative overflow-hidden">
                                        <!-- Half circle cutout -->
                                        <div :class="getReservationColor(span.reservation)"
                                            class="absolute right--4 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-lg -mr-1.5">
                                        </div>
                                    </div>
                                    <span class="px-3 truncate">
                                        {{ (span.reservation.guest || span.reservation.guestName || 'Guest').split(' ')[0] }}
                                    </span>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch, type ComponentPublicInstance } from 'vue'

// ============================================================================
// COMPONENT INTERFACE & PROPS
// ============================================================================

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
    targetDate?: Date | null
}>()

// Emit events to parent
const emit = defineEmits<{
    updateDate: [{ year: number; month: number }]
    openReservationModal: [{ roomNumber: string; checkInDate: string; isAvailable: boolean }]
}>()

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Hover state for column highlighting
 * Tracks which date column is currently being hovered for visual feedback
 */
const hoveredColumn = ref<string | null>(null)

/**
 * Highlighted reservation for search results
 * Stores the ID of a reservation that should be visually highlighted
 */
const highlightedReservation = ref<string | null>(null)

/**
 * Direct view start date management (cleaner than offset calculations)
 * Controls the first date shown in the Gantt chart view
 */
const viewStartDate = ref<Date>(new Date())

/**
 * Track if navigation was triggered internally (to prevent reset)
 * Prevents infinite loops when updating parent component's date state
 */
const isInternalNavigation = ref(false)

// ============================================================================
// WATCHERS & LIFECYCLE
// ============================================================================

// Watch for targetDate changes from parent navigation
watch(() => props.targetDate, (newTargetDate) => {
    if (newTargetDate && !isInternalNavigation.value) {
        console.log(`🎯 Gantt chart received target date: ${newTargetDate.toLocaleDateString()}`)
        
        // Set view to start from the target date (1st of month)
        const targetStart = new Date(newTargetDate)
        targetStart.setHours(0, 0, 0, 0)
        
        viewStartDate.value = targetStart
        
        console.log(`📅 Gantt chart view updated to start from: ${targetStart.toLocaleDateString()}`)
    } else if (newTargetDate && isInternalNavigation.value) {
        console.log(`🔄 Ignoring targetDate during internal navigation: ${newTargetDate.toLocaleDateString()}`)
    }
})

const initializeViewDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to midnight for consistent date comparison
    viewStartDate.value = today
}

/**
 * Generate 16 days starting from viewStartDate
 * Creates the date range displayed in the Gantt chart header
 * Returns array of date objects with formatted display information
 */
const dateRange = computed(() => {
    const days = []
    const startDate = new Date(viewStartDate.value)

    for (let i = 0; i < 16; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        days.push({
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate().toString().padStart(2, '0')
        })
    }

    return days
})

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

/**
 * Simplified navigation - move the view start date by specified direction
 * @param direction - Positive for forward, negative for backward navigation
 * Moves view by 5 days and updates parent component if month/year changes
 */
const navigateDates = (direction: number) => {
    // Move view by 5 days
    const newStartDate = new Date(viewStartDate.value)
    newStartDate.setDate(newStartDate.getDate() + (direction * 5))

    viewStartDate.value = newStartDate
    // Check if we need to update parent's year/month context
    const newYear = newStartDate.getFullYear()
    const newMonth = newStartDate.getMonth()

    // Only emit if year or month changed to avoid unnecessary updates
    if (newYear !== props.selectedYear || newMonth !== props.selectedMonth) {
        console.log(`🔄 Gantt navigation: ${props.selectedYear}-${props.selectedMonth + 1} → ${newYear}-${newMonth + 1}`)
        isInternalNavigation.value = true
        emit('updateDate', { year: newYear, month: newMonth })
        setTimeout(() => {
            isInternalNavigation.value = false
        }, 100)
    }
}

/**
 * Jump to today's date
 * Sets the view to show today and updates parent component's year/month
 */
const jumpToToday = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    console.log(`📅 Jumping to today: ${today.toLocaleDateString()}`)
    
    // Set internal navigation flag to prevent parent from overriding with 1st of month
    isInternalNavigation.value = true
    
    // Set view to start from today (not 1st of month)
    viewStartDate.value = today
    
    // Update parent's year/month context
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    
    // Emit to ensure parent year/month selectors are synced
    emit('updateDate', { year: currentYear, month: currentMonth })
    
    // Keep internal navigation flag active longer to prevent targetDate override
    setTimeout(() => {
        isInternalNavigation.value = false
    }, 500) // Longer delay to ensure parent's targetDate doesn't override
}

/**
 * Navigate to a specific date (for search functionality)
 * @param targetDate - ISO date string to navigate to
 * Centers the view around the target date and updates parent if needed
 */
const navigateToDate = (targetDate: string) => {
    const target = new Date(targetDate)

    // Set view to start a few days before the target date for context
    const newViewStart = new Date(target)
    newViewStart.setDate(target.getDate() - 2) // Show 2 days before target

    viewStartDate.value = newViewStart

    // Update parent's year/month if needed
    const newYear = target.getFullYear()
    const newMonth = target.getMonth()

    if (newYear !== props.selectedYear || newMonth !== props.selectedMonth) {
        isInternalNavigation.value = true
        emit('updateDate', { year: newYear, month: newMonth })

        setTimeout(() => {
            isInternalNavigation.value = false
        }, 100)
    }
}

/**
 * Handle cell click to open reservation modal with pre-filled data
 * @param roomNumber - The room number that was clicked
 * @param date - The date that was clicked (ISO string format)
 */
const handleCellClick = (roomNumber: string, date: string) => {
    // Check if the room is available on this date
    const isAvailable = isRoomAvailable(roomNumber, date)
    
    // Only proceed if the room is available
    if (isAvailable) {
        console.log(`🏨 Opening reservation modal for Room ${roomNumber} on ${date}`)
        
        // Emit event to parent component to open the modal
        emit('openReservationModal', {
            roomNumber: roomNumber,
            checkInDate: date,
            isAvailable: true
        })
    } else {
        // Optional: Show a message or visual feedback for unavailable rooms
        console.log(`❌ Room ${roomNumber} is not available on ${date}`)
        
        // You could emit an event for unavailable rooms too if you want to show a message
        // emit('openReservationModal', {
        //     roomNumber: roomNumber,
        //     checkInDate: date,
        //     isAvailable: false
        // })
    }
}

// ============================================================================
// DEVELOPMENT & DEBUGGING UTILITIES
// ============================================================================

/**
 * Validate layout calculations (development helper)
 * Ensures the Gantt chart dimensions are calculated correctly
 * Logs warnings if there are mismatches in expected vs actual values
 */
const validateLayout = () => {
    const ROOM_COLUMN_WIDTH = 270
    const CELL_WIDTH = 61.5
    const TOTAL_DATE_COLUMNS = 16
    const EXPECTED_MIN_WIDTH = ROOM_COLUMN_WIDTH + (TOTAL_DATE_COLUMNS * CELL_WIDTH)

    console.log('📐 Layout validation:', {
        roomColumnWidth: ROOM_COLUMN_WIDTH,
        cellWidth: CELL_WIDTH,
        totalDateColumns: TOTAL_DATE_COLUMNS,
        expectedMinWidth: EXPECTED_MIN_WIDTH,
        actualDateRange: dateRange.value.length
    })

    if (dateRange.value.length !== TOTAL_DATE_COLUMNS) {
        console.warn('⚠️ Date range length mismatch:', {
            expected: TOTAL_DATE_COLUMNS,
            actual: dateRange.value.length
        })
    }
}

// ============================================================================
// WATCHERS & REACTIVE UPDATES
// ============================================================================

/**
 * Watch for month/year changes and update view accordingly
 * Handles both manual navigation from parent and internal navigation
 */
watch([() => props.selectedYear, () => props.selectedMonth], (newValues, oldValues) => {
    const [newYear, newMonth] = newValues
    const [oldYear, oldMonth] = oldValues || [newYear, newMonth]

    // Only reset view if this is a manual month/year change from parent
    if (oldYear !== undefined && oldMonth !== undefined) {
        if (!isInternalNavigation.value) {
            // Manual date change - reset to beginning of month
            console.log(`📅 Manual date change: ${oldYear}-${oldMonth + 1} → ${newYear}-${newMonth + 1}`)
            initializeViewDate()
        } else {
            // Internal navigation - keep current view position
            console.log(`🔄 Internal navigation: ${oldYear}-${oldMonth + 1} → ${newYear}-${newMonth + 1}`)
        }
    }
})

/**
 * Watch for search query changes and auto-navigate to guest location
 * Automatically finds and highlights matching reservations
 */
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
        // Clear highlight immediately when search is cleared
        highlightedReservation.value = null
    }
})

// ============================================================================
// DATA FILTERING & PROCESSING
// ============================================================================

/**
 * Filtered rooms based on parent filters
 * Applies search query and room type filters to the rooms list
 */
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

/**
 * Filtered reservations based on parent filters
 * Applies status, booking source, and search query filters to reservations
 */
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

// ============================================================================
// ROOM CATEGORIZATION & UI STATE
// ============================================================================

/**
 * Expanded categories state (all expanded by default)
 * Tracks which room type categories are expanded/collapsed in the UI
 */
const expandedCategories = ref<Record<string, boolean>>({})

/**
 * Toggle category expansion
 * @param categoryType - The room type to expand/collapse
 */
const toggleCategory = (categoryType: string) => {
    expandedCategories.value[categoryType] = !expandedCategories.value[categoryType]
}

/**
 * Group rooms by category from filtered data
 * Creates hierarchical structure of room types with their associated rooms
 * Automatically sorts rooms within categories and initializes expansion state
 */
const roomCategories = computed(() => {
    if (!filteredRooms.value.length) {
        return []
    }

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

// ============================================================================
// RESERVATION & AVAILABILITY FUNCTIONS
// ============================================================================

/**
 * Get reservation for specific room and date (using filtered reservations)
 * @param roomNumber - Room number to check
 * @param date - Date to check (ISO string format)
 * @returns Reservation object if found, undefined otherwise
 */
const getReservation = (roomNumber: string, date: string) => {
    return filteredReservations.value.find(reservation => {
        // Use string-based date comparison to avoid timezone issues
        const checkInStr = (reservation.checkIn || reservation.checkInDate || '').split('T')[0]
        const checkOutStr = (reservation.checkOut || reservation.checkOutDate || '').split('T')[0]
        const targetDateStr = date.split('T')[0]

        const resRoomNumber = (reservation.room || reservation.roomNumber || '').toString()
        const isMatch = resRoomNumber === roomNumber.toString() &&
            targetDateStr >= checkInStr &&
            targetDateStr <= checkOutStr  // Inclusive checkout (guest shown until checkout date)

        // Debug logging removed for performance

        return isMatch
    })
}

/**
 * Get reservation display color based on status
 * @param reservation - Reservation object
 * @returns CSS classes for styling the reservation display
 */
const getReservationColor = (reservation: any) => {
    if (!reservation) return ''

    switch (reservation.status) {
        case 'new': return 'bg-yellow-200 border-yellow-400 text-yellow-800'
        case 'confirmed': return 'bg-blue-200 border-blue-300 text-blue-800'
        case 'booked': return 'bg-green-200 border-green-300 text-green-800'
        case 'checkedIn': return 'bg-green-200 border-green-300 text-green-800'
        case 'dueOut': return 'bg-red-200 border-red-300 text-red-800'
        case 'checkedOut': return 'bg-orange-200 border-orange-300 text-orange-800'
        case 'outOfOrder': return 'bg-amber-200 border-amber-300 text-amber-800'
        case 'cancelled': return 'bg-red-200 border-red-300 text-red-800'
        // Legacy status mapping
        case 'pending': return 'bg-yellow-200 border-yellow-400 text-yellow-800'
        default: return 'bg-gray-200 border-gray-300 text-gray-800'
    }
}

/**
 * Get accent bar color based on reservation status
 * @param reservation - Reservation object
 * @returns CSS classes for the left accent bar
 */
const getReservationAccentColor = (reservation: any) => {
    if (!reservation) return 'bg-gray-600'

    switch (reservation.status) {
        case 'new': return 'bg-yellow-500'
        case 'confirmed': return 'bg-blue-500'
        case 'booked': return 'bg-green-500'
        case 'checkedIn': return 'bg-green-500'
        case 'dueOut': return 'bg-red-500'
        case 'checkedOut': return 'bg-orange-500'
        case 'outOfOrder': return 'bg-amber-500'
        case 'cancelled': return 'bg-red-500'
        // Legacy status mapping
        case 'pending': return 'bg-yellow-500'
        default: return 'bg-gray-500'
    }
}

/**
 * Check if room is available on a specific date
 * @param roomNumber - Room number to check
 * @param date - Date to check availability for
 * @returns True if room is available, false if occupied
 */
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

/**
 * Get available room count for a category on a specific date
 * @param category - Room category object
 * @param date - Date to check availability for
 * @returns Number of available rooms in the category
 */
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

// ============================================================================
// DOM MANIPULATION & OVERLAY POSITIONING
// ============================================================================

/**
 * Container element hosting the table and overlay
 * Reference to the main Gantt chart container for positioning calculations
 */
const containerEl = ref<HTMLElement | null>(null)

/**
 * Track DOM refs for each room row to compute exact vertical positions
 * Maps room numbers to their corresponding DOM elements
 */
const rowRefs = ref<Record<string, HTMLElement | null>>({})

/**
 * Set row reference for positioning calculations
 * @param roomNumber - Room number identifier
 * @param el - DOM element or Vue component instance
 */
const setRowRef = (roomNumber: string, el: Element | ComponentPublicInstance | null): void => {
    // Vue may pass a component instance; extract its $el
    const domEl = (el && (el as any).$el) ? (el as any).$el as Element : (el as Element | null)
    rowRefs.value[roomNumber] = (domEl as HTMLElement) || null
}

/**
 * Cache of computed top positions (relative to container) per room
 * Stores calculated vertical positions for overlay positioning
 */
const rowTops = ref<Record<string, number>>({})

/**
 * Compute vertical positions for all room rows
 * Calculates exact pixel positions for overlay anchoring
 */
const computeRowTops = (): void => {
    if (!containerEl.value) return
    const containerRect = containerEl.value.getBoundingClientRect()
    const tops: Record<string, number> = {}

    for (const category of roomCategories.value) {
        if (!expandedCategories.value[category.type]) continue
        for (const room of category.rooms) {
            const tr = rowRefs.value[room.number]
            if (tr) {
                const r = tr.getBoundingClientRect()
                const offset = Math.max(0, (r.height - 24) / 2)
                tops[room.number] = r.top - containerRect.top + offset
            }
        }
    }
    rowTops.value = tops
}

// ============================================================================
// COMPONENT LIFECYCLE & EVENT HANDLERS
// ============================================================================

/**
 * Initialize component and recompute tops on mount
 * Sets up initial state and event listeners
 */
onMounted(async () => {
    // Initialize view date
    initializeViewDate()

    // Validate layout in development
    if (import.meta.env.DEV) {
        validateLayout()
    }

    // Ensure DOM is fully rendered before computing positions
    await nextTick()
    await nextTick() // Double nextTick to ensure all refs are set
    computeRowTops()

    // Add additional computation after a short delay to catch any late-rendered elements
    setTimeout(() => {
        computeRowTops()
    }, 100)

    window.addEventListener('resize', computeRowTops)
})

/**
 * Cleanup event listeners on component unmount
 */
onBeforeUnmount(() => {
    window.removeEventListener('resize', computeRowTops)
})

/**
 * Watch for changes that affect row positioning
 * Recomputes positions when room categories, expansion state, or date range changes
 */
watch([
    roomCategories,
    () => ({ ...expandedCategories.value }),
    dateRange
], async () => {
    await nextTick()
    await nextTick() // Double nextTick for complex DOM updates
    computeRowTops()

    // Additional computation after a short delay for any async rendering
    setTimeout(() => {
        computeRowTops()
    }, 50)
})

// ============================================================================
// RESERVATION SPAN RENDERING & UTILITIES
// ============================================================================

/**
 * Build reservation spans for a given room with precise style anchored to row
 * @param roomNumber - Room number to generate spans for
 * @returns Array of span objects with positioning and styling information
 */
const getReservationSpans = (roomNumber: string) => {
    const spans: Array<{
        key: string | number,
        reservation: any,
        isStart: boolean,
        isEnd: boolean,
        style: Record<string, string>
    }> = []

    // If rowTops is not computed yet, use fallback positioning
    if (rowTops.value[roomNumber] === undefined) {
        // Use fallback positioning based on room order in the category
        // This ensures spans are visible even before precise positioning is computed
        let fallbackTop = 0

        // Find the room's position in its category
        for (const category of roomCategories.value) {
            if (!expandedCategories.value[category.type]) continue

            // Add category header height (48px)
            fallbackTop += 48

            for (const room of category.rooms) {
                if (room.number === roomNumber) {
                    // Found our room, use this position
                    break
                }
                fallbackTop += 48 // Each room row is 48px high
            }

            // If we found the room, break out of category loop
            const roomFound = category.rooms.some((room: any) => room.number === roomNumber)
            if (roomFound) break
        }

        // Store the fallback top for this room (don't trigger recomputation here to avoid loops)
        rowTops.value[roomNumber] = fallbackTop + 12 // Center vertically in the 48px row
    }

    const roomReservations = filteredReservations.value.filter(res => {
        const rn = (res.room || res.roomNumber || '').toString()
        return rn === roomNumber.toString()
    })

    for (const reservation of roomReservations) {
        const checkInStr = (reservation.checkIn || reservation.checkInDate || '').split('T')[0]
        const checkOutStr = (reservation.checkOut || reservation.checkOutDate || '').split('T')[0]

        let startIndex = -1
        let endIndex = -1
        dateRange.value.forEach((d, idx) => {
            const dayStr = d.date.split('T')[0]
            if (dayStr >= checkInStr && dayStr <= checkOutStr) {
                if (startIndex === -1) startIndex = idx
                endIndex = idx
            }
        })

        if (startIndex !== -1 && endIndex !== -1) {
            const firstVisible = dateRange.value[0].date.split('T')[0]
            const lastVisible = dateRange.value[dateRange.value.length - 1].date.split('T')[0]

            const widthCells = endIndex - startIndex + 1
            const top = rowTops.value[roomNumber] ?? 0

            // Fixed pixel positioning (61.5px per cell)
            const ROOM_COLUMN_WIDTH = 270
            const CELL_WIDTH = 61.5
            const HALF_CELL = CELL_WIDTH / 3
            const CELL_PADDING = 2 // Small padding for visual separation

            // Make spans smaller by reducing 1/2 cell from boundaries
            const left = ROOM_COLUMN_WIDTH + (startIndex * CELL_WIDTH) + HALF_CELL + CELL_PADDING
            const width = (widthCells * CELL_WIDTH) - (HALF_CELL * 2) - (CELL_PADDING * 2)

            // Debug logging removed for performance

            spans.push({
                key: reservation.id || reservation.bookingNumber || `${roomNumber}-${startIndex}`,
                reservation,
                isStart: checkInStr >= firstVisible,
                isEnd: checkOutStr <= lastVisible,
                style: {
                    left: `${left}px`,
                    width: `${width}px`,
                    top: `${top}px`,
                    height: '24px'
                }
            })
        }
    }

    return spans
}

/**
 * Format date range for tooltip display
 * @param res - Reservation object
 * @returns Formatted date range string (e.g., "Jan 15 - Jan 18")
 */
const formatDateRange = (res: any): string => {
    const cIn = res.checkIn || res.checkInDate
    const cOut = res.checkOut || res.checkOutDate

    if (!cIn || !cOut) return 'Invalid dates'

    const checkInDate = new Date(cIn)
    const checkOutDate = new Date(cOut)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${fmt(checkInDate)} - ${fmt(checkOutDate)}`
}
</script>