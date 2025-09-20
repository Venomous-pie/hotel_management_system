import type { ReservationStatus } from '../types/hotel'

export interface StatusColorConfig {
  badge: string
  background: string
  text: string
  dot: string
}

export interface RoomStatusColors {
  available: string
  occupied: string
  maintenance: string
}

export interface ReservationTypeColors {
  standard: string
  vip: string
  group: string
  family: string
}

export const useStatusColors = () => {
  const statusColorMap: Record<ReservationStatus, StatusColorConfig> = {
    confirmed: {
      badge: 'bg-green-100 text-green-700',
      background: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500'
    },
    pending: {
      badge: 'bg-yellow-100 text-yellow-800',
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
      dot: 'bg-yellow-500'
    },
    checkedIn: {
      badge: 'bg-blue-100 text-blue-700',
      background: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500'
    },
    checkedOut: {
      badge: 'bg-orange-100 text-orange-800',
      background: 'bg-orange-100',
      text: 'text-orange-800',
      dot: 'bg-orange-500'
    },
    cancelled: {
      badge: 'bg-red-100 text-red-800',
      background: 'bg-blue-100',
      text: 'text-red-800',
      dot: 'bg-red-700'
    }
  }

  const roomStatusColors: RoomStatusColors = {
    available: 'bg-green-500',
    occupied: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  }

  const reservationTypeColors: ReservationTypeColors = {
    standard: 'bg-blue-100 text-blue-800 border-l-4 border-blue-400',
    vip: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-400',
    group: 'bg-orange-100 text-orange-800 border-l-4 border-orange-400',
    family: 'bg-green-100 text-green-800 border-l-4 border-green-400'
  }

  const getStatusBadgeClasses = (status: ReservationStatus | string): string => {
    const validStatus = status as ReservationStatus
    return statusColorMap[validStatus]?.badge || 'bg-gray-100 text-gray-800'
  }

  const getStatusBackground = (status: ReservationStatus): string => {
    return statusColorMap[status]?.background || 'bg-gray-100'
  }

  const getStatusTextColor = (status: ReservationStatus): string => {
    return statusColorMap[status]?.text || 'text-gray-800'
  }

  const getStatusDotColor = (status: ReservationStatus): string => {
    return statusColorMap[status]?.dot || 'bg-gray-500'
  }

  const getRoomStatusColor = (status: keyof RoomStatusColors): string => {
    return roomStatusColors[status] || 'bg-gray-500'
  }

  const getReservationTypeColor = (type: keyof ReservationTypeColors): string => {
    return reservationTypeColors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: ReservationStatus | string): string => {
    const textMap: Record<ReservationStatus, string> = {
      confirmed: 'Confirmed',
      pending: 'Due In',
      checkedIn: 'Checked In',
      checkedOut: 'Checked Out',
      cancelled: 'Cancelled'
    }
    const validStatus = status as ReservationStatus
    return textMap[validStatus] || status
  }

  const isValidStatus = (status: string): status is ReservationStatus => {
    return ['confirmed', 'pending', 'checkedIn', 'checkedOut', 'cancelled'].includes(status)
  }

  return {
    getStatusBadgeClasses,
    getStatusBackground,
    getStatusTextColor,
    getStatusDotColor,
    getRoomStatusColor,
    getReservationTypeColor,
    getStatusText,
    isValidStatus,
    statusColorMap,
    roomStatusColors,
    reservationTypeColors
  }
}
