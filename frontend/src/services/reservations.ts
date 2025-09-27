import type { Reservation, ReservationFormData } from '@/types/hotel'
import { apiFetch } from './apiClient'

export async function getReservations(): Promise<Reservation[]> {
  return apiFetch<Reservation[]>('/reservations')
}

export async function createReservation(payload: ReservationFormData): Promise<any> {
  // Backend calculates totalPrice; frontend passes form data
  return apiFetch<any>('/reserve-room', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
