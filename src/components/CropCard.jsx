import { useState } from 'react'
import StampBadge from './StampBadge.jsx'
import ProductDetailModal from './ProductDetailModal.jsx'
import ListingOfferModal from '../features/seller-market/ListingOfferModal.jsx'

const GRADE_STYLE = {
  Premium: 'bg-turmeric/15 text-turmeric-dark',
  Good: 'bg-forest/10 text-forest',
  Organic: 'bg-clay/10 text-clay-dark',
}

export default function CropCard({ crop }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)

  return (
    <>
      <article
        onClick={() => setDetailOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setDetailOpen(true)}
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-b-card border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
      >
        {/* perforation strip — reads as a torn weighment-slip edge */}
        <div
          aria-hidden="true"
          className="h-3 w-full bg-[radial-gradient(circle_at_6px_6px,_#F5EFE0_3px,_transparent_3.5px)] bg-[length:16px_12px] bg-top"
        />
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-line px-5 pb-4 pt-1">
          <div className="flex min-w-0 items-start gap-3">
            {crop.photoUrl && (
              <img
                src={crop.photoUrl}
                alt=""
                className="mt-0.5 h-11 w-11 shrink-0 rounded-lg border border-line object-cover"
              />
            )}
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-semibold leading-snug text-ink">
                {crop.name}
              </h3>
              <p className="mt-0.5 text-[12.5px] text-ink-soft">
                {crop.farmer} · 📍 {crop.village}
              </p>
            </div>
          </div>
          {crop.verified && <StampBadge className="mt-0.5" />}
        </div>

        <div className="flex flex-1 flex-col gap-3 px-5 py-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-semibold text-ink">₹{crop.price}</span>
            <span className="font-mono text-xs text-ink-faint">/ {crop.unit}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${GRADE_STYLE[crop.grade] || 'bg-forest/10 text-forest'}`}>
              {crop.grade}
            </span>
            {crop.tags.map((t) => (
              <span key={t} className="rounded-md border border-line px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                {t}
              </span>
            ))}
          </div>

          <p className="font-mono text-[11.5px] text-ink-faint">{crop.qty} · {crop.harvested}</p>

          <div className="mt-auto flex gap-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOfferOpen(true)
              }}
              className="flex-1 rounded-full bg-forest py-2 text-[13px] font-semibold text-parchment transition hover:bg-forest-dark"
            >
              Send Offer
            </button>
            <span className="flex items-center rounded-full border border-line px-3 text-[12px] font-medium text-ink-faint">
              View details →
            </span>
          </div>
        </div>
      </article>

      <ProductDetailModal
        crop={detailOpen ? crop : null}
        onClose={() => setDetailOpen(false)}
        onSendOffer={() => {
          setDetailOpen(false)
          setOfferOpen(true)
        }}
      />
      <ListingOfferModal crop={offerOpen ? crop : null} onClose={() => setOfferOpen(false)} />
    </>
  )
}
