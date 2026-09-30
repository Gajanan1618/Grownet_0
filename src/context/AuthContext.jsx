import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, tokenStore } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false) // false until the saved session has been checked
  const [modalOpen, setModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  const openAuthModal = useCallback(() => setModalOpen(true), [])
  const closeAuthModal = useCallback(() => setModalOpen(false), [])
  const openProfileModal = useCallback(() => setProfileModalOpen(true), [])
  const closeProfileModal = useCallback(() => setProfileModalOpen(false), [])

  // restore the session on page load
  useEffect(() => {
    if (!tokenStore.get()) {
      setReady(true)
      return
    }
    api
      .me()
      .then(({ user: u }) => setUser(u))
      .catch(() => tokenStore.clear())
      .finally(() => setReady(true))
  }, [])

  const sendOtp = useCallback((phone) => api.sendOtp(phone), [])

  // Returns { isNewUser }. Existing users are logged in immediately.
  const verifyOtp = useCallback(async (phone, code) => {
    const res = await api.verifyOtp(phone, code)
    if (!res.isNewUser) {
      tokenStore.set(res.token)
      setUser(res.user)
    }
    return res
  }, [])

  const completeSignup = useCallback(async (payload) => {
    const res = await api.completeSignup(payload)
    tokenStore.set(res.token)
    setUser(res.user)
    return res.user
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (partial) => {
    const { user: u } = await api.updateProfile(partial)
    setUser(u)
    return u
  }, [])

  const sendEmailVerification = useCallback((email) => api.sendEmail(email), [])

  const confirmEmail = useCallback(async () => {
    const { user: u } = await api.confirmEmail()
    setUser(u)
  }, [])

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: !!user,
      modalOpen,
      openAuthModal,
      closeAuthModal,
      profileModalOpen,
      openProfileModal,
      closeProfileModal,
      sendOtp,
      verifyOtp,
      completeSignup,
      logout,
      updateProfile,
      sendEmailVerification,
      confirmEmail,
    }),
    [user, ready, modalOpen, openAuthModal, closeAuthModal, profileModalOpen, openProfileModal,
      closeProfileModal, sendOtp, verifyOtp, completeSignup, logout, updateProfile,
      sendEmailVerification, confirmEmail]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
