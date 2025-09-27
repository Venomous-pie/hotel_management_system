// Centralized API client for backend communication
// - Reads base URL from Vite env (VITE_API_BASE_URL) with fallback to localhost
// - Throws typed ApiClientError on non-2xx responses

export class ApiClientError<T = any> extends Error {
  status: number
  data?: T

  constructor(message: string, status: number, data?: T) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.data = data
  }
}

const API_BASE: string = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3000/api'

function buildUrl(path: string): string {
  // Ensure single slash between base and path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}, retries = 2): Promise<T> {
  const method = (options.method || 'GET').toString().toUpperCase()

  const doFetch = async (attempt: number): Promise<T> => {
    const headers = new Headers(options.headers || {})
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(buildUrl(path), { ...options, headers })

    let payload: any = null
    const contentType = response.headers.get('Content-Type') || ''
    if (contentType.includes('application/json')) {
      try { payload = await response.json() } catch (_) { payload = null }
    } else {
      try { payload = await response.text() } catch (_) { payload = null }
    }

    if (!response.ok) {
      const message: string = (payload && (payload.error || payload.message)) || `API request failed (${response.status})`

      // Retry GETs on transient SQLite busy/locked errors
      const isTransientSqlite = /SQLITE_BUSY|database is locked/i.test(message)
      if (method === 'GET' && isTransientSqlite && attempt < retries) {
        const delayMs = 200 * (attempt + 1)
        await new Promise(res => setTimeout(res, delayMs))
        return doFetch(attempt + 1)
      }

      throw new ApiClientError(message, response.status, payload)
    }

    return payload as T
  }

  return doFetch(0)
}
