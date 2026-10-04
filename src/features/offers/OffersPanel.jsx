import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useOffers } from '../../context/OffersContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function OfferRow({ offer, onRespond }) {
  const { t } = useLanguage()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isListing = offer.targetType === 'listing'

  async function act(status) {
    setBusy(true)
    setError('')
    try {
      await onRespond(offer.id, status)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-lg border border-line bg-white p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-ink">
            {offer.fromUserName}
            <span className="font-normal text-ink-soft"> {isListing ? t('offer_on_listing') : t('offer_on_requirement')}</span>
          </p>
          <p className="truncate text-[13px] text-ink-soft">{offer.targetTitle}</p>
        </div>
        <span className="shrink-0 text-[11px] text-ink-faint">{timeAgo(offer.createdAt)}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-soft">
        {offer.price != null && <span>₹{offer.price}{offer.qty ? ` for ${offer.qty}` : ''}</span>}
        {offer.message && <span className="italic">&ldquo;{offer.message}&rdquo;</span>}
      </div>

      {error && <p className="mt-2 text-[12px] font-medium text-clay">{error}</p>}

      {offer.status === 'pending' ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => act('accepted')}
            disabled={busy}
            className="flex-1 rounded-full bg-forest py-1.5 text-[12.5px] font-semibold text-parchment transition hover:bg-forest-dark disabled:opacity-60"
          >
            {t('offers_accept')}
          </button>
          <button
            onClick={() => act('declined')}
            disabled={busy}
            className="flex-1 rounded-full border border-line py-1.5 text-[12.5px] font-semibold text-ink-soft transition hover:border-clay hover:text-clay disabled:opacity-60"
          >
            {t('offers_decline')}
          </button>
        </div>
      ) : (
        <p
          className={
            'mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ' +
            (offer.status === 'accepted' ? 'bg-forest/10 text-forest' : 'bg-clay/10 text-clay')
          }
        >
          {offer.status === 'accepted' ? t('offers_status_accepted') : t('offers_status_declined')}
        </p>
      )}
    </div>
  )
}

export default function OffersPanel() {
  const { offers, panelOpen, closePanel, respond, refresh } = useOffers()
  const { t } = useLanguage()

  useEffect(() => {
    if (panelOpen) refresh()
    document.body.style.overflow = panelOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [panelOpen, refresh])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') closePanel() }
    if (panelOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [panelOpen, closePanel])

  if (!panelOpen) return null

  const pending = offers.filter((o) => o.status === 'pending')
  const resolved = offers.filter((o) => o.status !== 'pending')

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-ink/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && closePanel()}
    >
      <div className="flex h-full w-full max-w-[420px] flex-col bg-parchment shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">{t('offers_panel_title')}</h2>
          <button
            onClick={closePanel}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition hover:bg-forest/10 hover:text-forest"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {offers.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-ink-soft">
              <span className="mb-2 text-3xl">📭</span>
              <p className="text-[13.5px]">{t('offers_panel_empty_title')}</p>
              <p className="mt-1 text-[12.5px] text-ink-faint">
                {t('offers_panel_empty_sub')}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {pending.length > 0 && (
                <div>
                  <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                    {t('offers_panel_pending')} ({pending.length})
                  </p>
                  <div className="space-y-2.5">
                    {pending.map((o) => (
                      <OfferRow key={o.id} offer={o} onRespond={respond} />
                    ))}
                  </div>
                </div>
              )}
              {resolved.length > 0 && (
                <div>
                  <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                    {t('offers_panel_earlier')}
                  </p>
                  <div className="space-y-2.5">
                    {resolved.map((o) => (
                      <OfferRow key={o.id} offer={o} onRespond={respond} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
