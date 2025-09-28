/**
 * Gantt chart event handling composable
 * Handles cell clicks, navigation events, and modal interactions
 */

import type { Ref } from 'vue'

export const useGanttEventHandlers = (
  isRoomAvailable: (roomNumber: string, date: string) => boolean,
  emit: (event: 'openReservationModal', data: { roomNumber: string; checkInDate: string; isAvailable: boolean }) => void
) => {
  const handleCellClick = (data: { roomNumber: string; date: string }) => {
    const { roomNumber, date } = data

    const isAvailable = isRoomAvailable(roomNumber, date)

    if (isAvailable) {
      console.log(`🏨 Opening reservation modal for Room ${roomNumber} on ${date}`)

      emit('openReservationModal', {
        roomNumber: roomNumber,
        checkInDate: date,
        isAvailable: true
      })
    } else {
      console.log(`❌ Room ${roomNumber} is not available on ${date}`)
    }
  }

  const createNavigationHandler = (
    navFunction: (direction: number) => any,
    navigation: any,
    emit: (event: 'updateDate', data: { year: number; month: number }) => void
  ) => {
    return (direction: number) => {
      const result = navFunction(direction)
      if (result) {
        emit('updateDate', result)
        navigation.resetInternalNavigation()
      }
    }
  }

  const createTodayHandler = (
    jumpFunction: () => any,
    navigation: any,
    emit: (event: 'updateDate', data: { year: number; month: number }) => void
  ) => {
    return () => {
      const result = jumpFunction()
      if (result) {
        emit('updateDate', result)
        navigation.resetInternalNavigation(500)
      }
    }
  }

  return {
    handleCellClick,
    createNavigationHandler,
    createTodayHandler
  }
}
