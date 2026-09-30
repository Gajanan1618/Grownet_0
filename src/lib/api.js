const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const TOKEN_KEY = 'grownet_token'

// NOTE: localStorage is dev-only. Production should use httpOnly cookies.
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection.', 0)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || 'Request failed', res.status, data.details)
  return data
}

export function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export const api = {
  sendOtp: (phone) => request('/auth/send-otp', { method: 'POST', body: { phone } }),
  verifyOtp: (phone, code) => request('/auth/verify-otp', { method: 'POST', body: { phone, code } }),
  completeSignup: (payload) => request('/auth/complete-signup', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
  updateProfile: (partial) => request('/users/me', { method: 'PATCH', body: partial }),
  sendEmail: (email) => request('/users/me/email/send', { method: 'POST', body: { email } }),
  confirmEmail: () => request('/users/me/email/confirm', { method: 'POST' }),
  listListings: () => request('/listings'),
  createListing: (body) => request('/listings', { method: 'POST', body }),
  offerOnListing: (id) => request(`/listings/${id}/offers`, { method: 'POST' }),
  listRequirements: () => request('/requirements'),
  createRequirement: (body) => request('/requirements', { method: 'POST', body }),
  offerOnRequirement: (id) => request(`/requirements/${id}/offers`, { method: 'POST' }),
}
