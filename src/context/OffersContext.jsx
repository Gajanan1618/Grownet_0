import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

const OffersContext = createContext(null)

const POLL_MS = 30000 // no websockets yet — a light poll is enough at this scale

export function OffersProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [offers, setOffers] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)

  const refresh = useCallback(() => {
    if (!isAuthenticated) return
    api
      .listReceivedOffers()
      .then(({ offers: rows }) => setOffers(rows))
      .catch(() => {}) // a failed background poll shouldn't surface an error to the user
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setOffers([])
      return
    }
    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [isAuthenticated, refresh])

  const respond = useCallback(async (id, status) => {
    const { offer } = await api.respondToOffer(id, status)
    setOffers((prev) => prev.map((o) => (o.id === id ? offer : o)))
  }, [])

  const pendingCount = offers.filter((o) => o.status === 'pending').length

  const value = useMemo(
    () => ({ offers, pendingCount, panelOpen, openPanel: () => setPanelOpen(true), closePanel: () => setPanelOpen(false), respond, refresh }),
    [offers, pendingCount, panelOpen, respond, refresh]
  )

  return <OffersContext.Provider value={value}>{children}</OffersContext.Provider>
}

export function useOffers() {
  const ctx = useContext(OffersContext)
  if (!ctx) throw new Error('useOffers must be used inside an OffersProvider')
  return ctx
}
