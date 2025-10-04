export function saveDraft(key: string, data: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (e) {
    console.warn('Failed to save draft to storage:', e)
    return false
  }
}

export function loadDraft<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch (e) {
    console.warn('Failed to load draft from storage:', e)
    return null
  }
}

export function clearDraft(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.warn('Failed to clear draft from storage:', e)
    return false
  }
}
