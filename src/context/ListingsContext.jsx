import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'

const ListingsContext = createContext(null)

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listListings()
      .then(({ listings: rows }) => setListings(rows))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Both throw an ApiError on failure — callers show the message.
  const addListing = useCallback(async (payload) => {
    const { listing } = await api.createListing(payload)
    setListings((prev) => [listing, ...prev])
    return listing
  }, [])

  const sendOffer = useCallback(async (id) => {
    const { listing } = await api.offerOnListing(id)
    setListings((prev) => prev.map((l) => (l.id === id ? listing : l)))
  }, [])

  const value = useMemo(
    () => ({ listings, loading, error, addListing, sendOffer }),
    [listings, loading, error, addListing, sendOffer]
  )
  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) throw new Error('useListings must be used inside a ListingsProvider')
  return ctx
}
