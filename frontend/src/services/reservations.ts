import type { Reservation, ReservationFormData } from '@/types/hotel'
import { apiFetch } from './apiClient'

export async function getReservations(): Promise<Reservation[]> {
  return apiFetch<Reservation[]>('/reservations')
}

export async function createReservation(payload: ReservationFormData): Promise<any> {
  return apiFetch<any>('/reserve-room', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
