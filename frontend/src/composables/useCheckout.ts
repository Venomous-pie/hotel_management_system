import { ref, computed } from 'vue'
import type { Reservation, Guest } from '@/types/hotel'

export interface CheckoutBill {
  reservationId: string
  guestName: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  nights: number
  roomRate: number
  subtotal: number
  extraCharges: ExtraCharge[]
  taxes: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
}

export interface ExtraCharge {
  id: string
  description: string
  amount: number
  date: string
  category: 'minibar' | 'room_service' | 'laundry' | 'phone' | 'damage' | 'late_checkout' | 'other'
}

export interface CheckoutFormData {
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer'
  paymentAmount: number
  extraCharges: ExtraCharge[]
  notes: string
  damageAssessment: boolean
  damageDescription?: string
  damageAmount?: number
}

export const useCheckout = () => {
  const isCheckoutModalOpen = ref(false)
  const selectedReservation = ref<Reservation | null>(null)
  const checkoutBill = ref<CheckoutBill | null>(null)
  const isProcessing = ref(false)
  const error = ref<string | null>(null)
  
  // Form data for checkout process
  const checkoutForm = ref<CheckoutFormData>({
    paymentMethod: 'cash',
    paymentAmount: 0,
    extraCharges: [],
    notes: '',
    damageAssessment: false,
  })

  // Calculate nights between dates - no cap, fr fr
  const calculateNights = (checkIn: string, checkOut: string): number => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Generate bill for the reservation - this is where the magic happens bestie
  const generateBill = async (reservation: Reservation): Promise<CheckoutBill> => {
    const nights = calculateNights(
      reservation.checkIn.toString(),
      reservation.checkOut.toString()
    )
    
    // Base room charges
    const roomRate = reservation.totalPrice / nights
    const subtotal = reservation.totalPrice
    
    // Calculate extra charges total
    const extraChargesTotal = checkoutForm.value.extraCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0
    )
    
    // Tax calculation (assuming 12% tax rate - adjust as needed)
    const taxRate = 0.12
    const taxes = (subtotal + extraChargesTotal) * taxRate
    
    const totalAmount = subtotal + extraChargesTotal + taxes
    const paidAmount = 0 // Will be updated from payment records
    const balanceAmount = totalAmount - paidAmount

    return {
      reservationId: reservation.id?.toString() || '',
      guestName: reservation.guestName || reservation.guest || '',
      roomNumber: reservation.roomNumber || reservation.room,
      checkInDate: reservation.checkIn.toString(),
      checkOutDate: reservation.checkOut.toString(),
      nights,
      roomRate,
      subtotal,
      extraCharges: checkoutForm.value.extraCharges,
      taxes,
      totalAmount,
      paidAmount,
      balanceAmount,
    }
  }

  // Add extra charge - for those unexpected expenses lol
  const addExtraCharge = (charge: Omit<ExtraCharge, 'id'>) => {
    const newCharge: ExtraCharge = {
      ...charge,
      id: `charge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    checkoutForm.value.extraCharges.push(newCharge)
    
    // Recalculate bill if we have a reservation
    if (selectedReservation.value) {
      generateBill(selectedReservation.value).then(bill => {
        checkoutBill.value = bill
        checkoutForm.value.paymentAmount = bill.balanceAmount
      })
    }
  }

  // Remove extra charge
  const removeExtraCharge = (chargeId: string) => {
    checkoutForm.value.extraCharges = checkoutForm.value.extraCharges.filter(
      charge => charge.id !== chargeId
    )
    
    // Recalculate bill
    if (selectedReservation.value) {
      generateBill(selectedReservation.value).then(bill => {
        checkoutBill.value = bill
        checkoutForm.value.paymentAmount = bill.balanceAmount
      })
    }
  }

  // Open checkout modal - time to settle the bill bestie
  const openCheckoutModal = async (reservation: Reservation) => {
    try {
      selectedReservation.value = reservation
      
      // Reset form
      checkoutForm.value = {
        paymentMethod: 'cash',
        paymentAmount: 0,
        extraCharges: [],
        notes: '',
        damageAssessment: false,
      }
      
      // Generate initial bill
      const bill = await generateBill(reservation)
      checkoutBill.value = bill
      checkoutForm.value.paymentAmount = bill.balanceAmount
      
      isCheckoutModalOpen.value = true
      error.value = null
    } catch (err) {
      error.value = 'Failed to generate checkout bill. Pakyu naman!'
      console.error('Checkout error:', err)
    }
  }

  // Close checkout modal
  const closeCheckoutModal = () => {
    isCheckoutModalOpen.value = false
    selectedReservation.value = null
    checkoutBill.value = null
    error.value = null
  }

  // Process checkout - the final boss battle
  const processCheckout = async (): Promise<boolean> => {
    if (!selectedReservation.value || !checkoutBill.value) {
      error.value = 'No reservation selected for checkout'
      return false
    }

    isProcessing.value = true
    error.value = null

    try {
      // 1. Create invoice record
      const invoiceData = {
        reservationId: selectedReservation.value.id,
        subtotal: checkoutBill.value.subtotal + checkoutBill.value.extraCharges.reduce((sum, c) => sum + c.amount, 0),
        taxAmount: checkoutBill.value.taxes,
        totalAmount: checkoutBill.value.totalAmount,
        status: 'sent',
        notes: checkoutForm.value.notes,
      }

      // 2. Process payment if amount > 0
      if (checkoutForm.value.paymentAmount > 0) {
        const paymentData = {
          amount: checkoutForm.value.paymentAmount,
          paymentMethod: checkoutForm.value.paymentMethod,
          status: 'completed',
          notes: checkoutForm.value.notes,
        }
        
        // TODO: Call payment API
        console.log('Processing payment:', paymentData)
      }

      // 3. Update reservation status to checked out
      const updateData = {
        status: 'checkedOut',
        notes: checkoutForm.value.notes,
      }

      // TODO: Call reservation update API
      console.log('Updating reservation:', updateData)

      // 4. Update room status to needs housekeeping
      // TODO: Call room status update API

      // Success! Time to celebrate 🎉
      closeCheckoutModal()
      return true

    } catch (err) {
      error.value = 'Checkout failed. Gago naman ang system!'
      console.error('Checkout processing error:', err)
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // Computed properties for validation
  const canProcessCheckout = computed(() => {
    return (
      selectedReservation.value &&
      checkoutBill.value &&
      checkoutForm.value.paymentAmount >= 0 &&
      (!checkoutForm.value.damageAssessment || 
       (checkoutForm.value.damageDescription && checkoutForm.value.damageAmount))
    )
  })

  const isLateCheckout = computed(() => {
    if (!selectedReservation.value) return false
    
    const checkoutTime = new Date()
    const scheduledCheckout = new Date(selectedReservation.value.checkOut)
    scheduledCheckout.setHours(11, 0, 0, 0) // Default checkout time 11:00 AM
    
    return checkoutTime > scheduledCheckout
  })

  return {
    // State
    isCheckoutModalOpen,
    selectedReservation,
    checkoutBill,
    checkoutForm,
    isProcessing,
    error,
    
    // Computed
    canProcessCheckout,
    isLateCheckout,
    
    // Methods
    openCheckoutModal,
    closeCheckoutModal,
    processCheckout,
    addExtraCharge,
    removeExtraCharge,
    generateBill,
  }
}
