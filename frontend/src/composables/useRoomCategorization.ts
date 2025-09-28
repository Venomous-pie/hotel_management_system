/**
 * Room categorization composable
 * Handles room grouping, filtering, and category management
 */

import { computed, ref, type Ref } from 'vue'
import type { Room } from '@/types/hotel'

export const useRoomCategorization = (
  rooms: Ref<Room[]>,
  searchQuery: Ref<string>,
  roomTypeFilter: Ref<string>
) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Track which room type categories are expanded/collapsed
   */
  const expandedCategories = ref<Record<string, boolean>>({})

  // ============================================================================
  // ROOM FILTERING
  // ============================================================================

  /**
   * Filter rooms based on search query and room type filter
   */
  const filteredRooms = computed(() => {
    let filtered = rooms.value

    // Filter by search query (room number)
    if (searchQuery.value && searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(room => {
        const roomNumber = (room.roomNumber || room.number || room.id || '').toString().toLowerCase()
        return roomNumber.includes(query)
      })
    }

    // Filter by room type
    if (roomTypeFilter.value !== 'All Room Types') {
      filtered = filtered.filter(room => {
        const typeName = room.RoomType?.typeName || room.roomType || room.type || 'Standard'

        // Handle partial matches for broader categories
        if (roomTypeFilter.value === 'Standard') {
          return typeName.toLowerCase().includes('standard')
        }
        if (roomTypeFilter.value === 'Deluxe') {
          return typeName.toLowerCase().includes('deluxe')
        }
        if (roomTypeFilter.value === 'Suite') {
          return typeName.toLowerCase().includes('suite')
        }

        // Exact match for specific types
        return typeName === roomTypeFilter.value
      })
    }

    return filtered
  })

  // ============================================================================
  // ROOM CATEGORIZATION
  // ============================================================================

  /**
   * Group filtered rooms by category with hierarchical structure
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
        floor: `Floor ${room.floorNumber || Math.floor(parseInt((room.roomNumber || room.number || room.id || '0').toString()) / 100)}`,
        status: room.status || 'available',
        pricePerNight: room.pricePerNight || 0,
        maxCapacity: room.maxCapacity || 2,
        amenities: room.amenities || [],
        originalRoom: room // Keep reference to original room data
      })

      return acc
    }, {} as Record<string, any>)

    // Convert to array and sort rooms within categories
    const categories = Object.values(grouped).map((category: any) => ({
      ...category,
      rooms: category.rooms.sort((a: any, b: any) => {
        // Sort by room number (natural sort for numbers)
        const aNum = parseInt(a.number) || 0
        const bNum = parseInt(b.number) || 0
        return aNum - bNum
      })
    }))

    // Sort categories by type name
    categories.sort((a, b) => a.type.localeCompare(b.type))

    // Initialize expansion state for new categories
    categories.forEach(category => {
      if (expandedCategories.value[category.type] === undefined) {
        expandedCategories.value[category.type] = true // Default to expanded
      }
    })

    return categories
  })

  // ============================================================================
  // CATEGORY MANAGEMENT
  // ============================================================================

  /**
   * Toggle category expansion state
   */
  const toggleCategory = (categoryType: string): void => {
    expandedCategories.value[categoryType] = !expandedCategories.value[categoryType]
  }

  /**
   * Expand all categories
   */
  const expandAllCategories = (): void => {
    roomCategories.value.forEach(category => {
      expandedCategories.value[category.type] = true
    })
  }

  /**
   * Collapse all categories
   */
  const collapseAllCategories = (): void => {
    roomCategories.value.forEach(category => {
      expandedCategories.value[category.type] = false
    })
  }

  /**
   * Check if a category has any rooms
   */
  const categoryHasRooms = (categoryType: string): boolean => {
    return roomCategories.value.some(category => 
      category.type === categoryType && category.rooms.length > 0
    )
  }

  // ============================================================================
  // ROOM TYPE ANALYSIS
  // ============================================================================

  /**
   * Get all room types from the rooms data
   */
  const roomTypes = computed(() => {
    const types = new Set(rooms.value.map(room => 
      room.RoomType?.typeName || room.roomType || room.type || 'Standard'
    ))
    return Array.from(types).filter(type => type).sort()
  })

  /**
   * Get room count by type
   */
  const getRoomCountByType = (roomType: string): number => {
    return rooms.value.filter(room => {
      const typeName = room.RoomType?.typeName || room.roomType || room.type || 'Standard'
      return typeName === roomType
    }).length
  }

  /**
   * Get room statistics by category
   */
  const categoryStats = computed(() => {
    return roomCategories.value.map(category => ({
      type: category.type,
      name: category.name,
      totalRooms: category.rooms.length,
      availableRooms: category.rooms.filter((room: any) => room.status === 'available').length,
      occupiedRooms: category.rooms.filter((room: any) => room.status === 'occupied').length,
      maintenanceRooms: category.rooms.filter((room: any) => room.status === 'maintenance').length,
      outOfOrderRooms: category.rooms.filter((room: any) => room.status === 'out-of-order').length,
      averagePrice: category.rooms.reduce((sum: number, room: any) => sum + room.pricePerNight, 0) / category.rooms.length,
      maxCapacity: Math.max(...category.rooms.map((room: any) => room.maxCapacity || 2))
    }))
  })

  // ============================================================================
  // SEARCH & FILTERING HELPERS
  // ============================================================================

  /**
   * Find rooms by number or partial match
   */
  const findRoomsByNumber = (searchTerm: string): any[] => {
    const query = searchTerm.toLowerCase().trim()
    return roomCategories.value.flatMap(category => 
      category.rooms.filter((room: any) => 
        room.number.toLowerCase().includes(query)
      )
    )
  }

  /**
   * Find rooms by type
   */
  const findRoomsByType = (roomType: string): any[] => {
    return roomCategories.value
      .filter(category => category.type.toLowerCase().includes(roomType.toLowerCase()))
      .flatMap(category => category.rooms)
  }

  /**
   * Find rooms by status
   */
  const findRoomsByStatus = (status: string): any[] => {
    return roomCategories.value.flatMap(category => 
      category.rooms.filter((room: any) => room.status === status)
    )
  }

  /**
   * Get rooms on a specific floor
   */
  const getRoomsByFloor = (floorNumber: number): any[] => {
    return roomCategories.value.flatMap(category => 
      category.rooms.filter((room: any) => {
        const roomFloor = Math.floor(parseInt(room.number) / 100)
        return roomFloor === floorNumber
      })
    )
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Get all room numbers in a category
   */
  const getRoomNumbersInCategory = (categoryType: string): string[] => {
    const category = roomCategories.value.find(cat => cat.type === categoryType)
    return category ? category.rooms.map((room: any) => room.number) : []
  }

  /**
   * Check if any rooms match the current filters
   */
  const hasMatchingRooms = computed(() => {
    return filteredRooms.value.length > 0
  })

  /**
   * Get total room count across all categories
   */
  const totalRoomCount = computed(() => {
    return roomCategories.value.reduce((total, category) => total + category.rooms.length, 0)
  })

  return {
    // State
    expandedCategories,
    
    // Filtered data
    filteredRooms,
    roomCategories,
    roomTypes,
    
    // Category management
    toggleCategory,
    expandAllCategories,
    collapseAllCategories,
    categoryHasRooms,
    
    // Analysis functions
    getRoomCountByType,
    categoryStats,
    
    // Search functions
    findRoomsByNumber,
    findRoomsByType,
    findRoomsByStatus,
    getRoomsByFloor,
    
    // Bulk operations
    getRoomNumbersInCategory,
    hasMatchingRooms,
    totalRoomCount,
  }
}
