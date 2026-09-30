import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, timeAgo } from '../lib/api.js'

const RequirementsContext = createContext(null)

const withPosted = (r) => ({ ...r, posted: timeAgo(r.createdAt) })

export function RequirementsProvider({ children }) {
  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listRequirements()
      .then(({ requirements: rows }) => setRequirements(rows.map(withPosted)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const addRequirement = useCallback(async (payload) => {
    const { requirement } = await api.createRequirement(payload)
    setRequirements((prev) => [withPosted(requirement), ...prev])
    return requirement
  }, [])

  const sendOffer = useCallback(async (id) => {
    const { requirement } = await api.offerOnRequirement(id)
    setRequirements((prev) => prev.map((r) => (r.id === id ? withPosted(requirement) : r)))
  }, [])

  const value = useMemo(
    () => ({ requirements, loading, error, addRequirement, sendOffer }),
    [requirements, loading, error, addRequirement, sendOffer]
  )
  return <RequirementsContext.Provider value={value}>{children}</RequirementsContext.Provider>
}

export function useRequirements() {
  const ctx = useContext(RequirementsContext)
  if (!ctx) throw new Error('useRequirements must be used inside a RequirementsProvider')
  return ctx
}
