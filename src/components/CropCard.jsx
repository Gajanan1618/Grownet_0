import { useState } from 'react'
import StampBadge from './StampBadge.jsx'
import ProductDetailModal from './ProductDetailModal.jsx'
import ListingOfferModal from '../features/seller-market/ListingOfferModal.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const GRADE_STYLE = {
  Premium: 'bg-turmeric/15 text-turmeric-dark',
  Good: 'bg-forest/10 text-forest',
  Organic: 'bg-clay/10 text-clay-dark',
}

// Grades are a fixed, known set chosen from ListingForm's dropdown (not free
// text), so they can be translated by value. Anything unexpected falls back
// to showing the raw stored string rather than disappearing.
const GRADE_KEY = { Standard: 'grade_standard', Good: 'grade_good', Premium: 'grade_premium', Organic: 'grade_organic' }

// A gradient stand-in for listings without a photo — mirrors the warm
// photo-header treatment even when there's nothing to show yet.
const PLACEHOLDER_GRADIENT =
  'bg-[linear-gradient(145deg,theme(colors.turmeric.light),theme(colors.parchment.DEFAULT))]'

export default function CropCard({ crop }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <article
        onClick={() => setDetailOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setDetailOpen(true)}
        className="group flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
      >
        {/* Photo header */}
        <div className={`relative h-44 w-full overflow-hidden ${PLACEHOLDER_GRADIENT}`}>
          {crop.photoUrl ? (
            <img
              src={crop.photoUrl}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">🌾</span>
          )}
          <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-forest-dark shadow-sm backdrop-blur">
            {t('card_fresh')}
          </span>
          {crop.verified && <StampBadge className="absolute right-3.5 top-3.5" />}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-display text-xl font-semibold leading-snug text-ink">
                {crop.name}
              </h3>
              <p className="mt-0.5 truncate text-[12.5px] text-ink-soft">
                {crop.farmer} · 📍 {crop.village}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-2xl font-bold leading-none text-clay-dark">₹{crop.price}</p>
              <p className="mt-1 font-mono text-[10.5px] text-ink-faint">/ {crop.unit}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${GRADE_STYLE[crop.grade] || 'bg-forest/10 text-forest'}`}>
              {GRADE_KEY[crop.grade] ? t(GRADE_KEY[crop.grade]) : crop.grade}
            </span>
            {crop.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-line px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1 text-[12.5px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="w-4 text-center text-turmeric-dark">📦</span> {crop.qty}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 text-center text-turmeric-dark">📅</span> {t('card_harvested')}: {crop.harvested}
            </span>
          </div>

          <div className="mt-auto flex gap-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOfferOpen(true)
              }}
              className="flex-1 rounded-full bg-forest py-2.5 text-[13px] font-semibold text-parchment transition hover:bg-forest-dark"
            >
              {t('card_send_offer')}
            </button>
            <span className="flex items-center rounded-full border border-line px-3 text-[12px] font-medium text-ink-faint">
              {t('card_view_details')}
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
