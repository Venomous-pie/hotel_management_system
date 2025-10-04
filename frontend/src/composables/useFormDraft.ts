import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { ReservationFormData, ReservationDraft } from '@/types/hotel'
 import { saveDraft, loadDraft, clearDraft as clearDraftService } from '@/services/drafts'
export const useFormDraft = (formData: Ref<ReservationFormData>, resetForm: () => void, draftKey = 'hotel_reservation_draft') => {
  const draftSaveState = ref({ isVisible: false, message: '' })

  const hasDraftData = computed(() => {
    const f = formData.value
    return !!(f.firstName || f.lastName || f.email || f.phone || f.address || f.idDocument || f.specialRequest || f.checkIn || f.checkOut || f.roomNumber || f.numGuest > 0)
  })

  const showDraftSavedIndicator = (message: string) => {
    draftSaveState.value.message = message
    draftSaveState.value.isVisible = true
    setTimeout(() => { draftSaveState.value.isVisible = false }, 2000)
  }

  const saveFormDraft = () => {
    try {
      const draft: ReservationDraft = { ...formData.value, timestamp: Date.now() }
      const saved = saveDraft(draftKey, draft)
      if (saved) {
        showDraftSavedIndicator('Draft saved')
      }
    } catch (e) {
      console.warn('Failed to save form draft:', e)
    }
  }

  const loadFormDraft = (): boolean => {
    try {
      const draft = loadDraft<ReservationDraft>(draftKey)
      if (draft) {
        const isRecent = draft.timestamp && (Date.now() - draft.timestamp) < 24 * 60 * 60 * 1000
        if (isRecent) {
          delete (draft as any).timestamp
          const hasData = !!(draft.firstName || draft.lastName || draft.email || draft.phone || draft.address || draft.idDocument || draft.specialRequest)
          if (hasData) {
            formData.value = { ...formData.value, ...draft }
            showDraftSavedIndicator('Draft restored')
            return true
          }
        } else {
          clearFormDraft()
        }
      }
    } catch (e) {
      console.warn('Failed to load form draft:', e)
    }
    return false
  }

  const clearFormDraft = () => {
    try {
      clearDraftService(draftKey)
    } catch (e) {
      console.warn('Failed to clear form draft:', e)
    }
  }

  const clearDraftAndReset = () => {
    clearFormDraft()
    resetForm()
    showDraftSavedIndicator('Draft cleared')
  }

  let autoSaveTimeout: number | null = null
  const autoSaveDraft = () => {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout)
    autoSaveTimeout = window.setTimeout(() => {
      const f = formData.value
      const hasData = !!(f.firstName || f.lastName || f.email || f.phone || f.address || f.idDocument || f.specialRequest)
      if (hasData) saveFormDraft()
    }, 1000)
  }

  return {
    draftSaveState,
    hasDraftData,
    saveFormDraft,
    loadFormDraft,
    clearFormDraft,
    clearDraftAndReset,
    autoSaveDraft,
  }
}
