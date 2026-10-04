import { Link } from 'react-router-dom'
import { useListings } from '../context/ListingsContext.jsx'
import { useRequirements } from '../context/RequirementsContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import Reveal from './Reveal.jsx'

// Grades are a fixed set chosen from ListingForm's dropdown (see CropCard.jsx
// for the full-size version of this mapping).

const GRADE_KEY = { Standard: 'grade_standard', Good: 'grade_good', Premium: 'grade_premium', Organic: 'grade_organic' }
const URGENCY_DOT = { normal: 'bg-forest', soon: 'bg-turmeric', urgent: 'bg-clay' }

// Compact train tile for a listing — sized for the horizontal marquee,
// not the full grid card.
function PickTile({ crop }) {
  const { t } = useLanguage()
  return (
    <Link
      to="/buy-it"
      className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative h-28 w-full overflow-hidden bg-[linear-gradient(145deg,theme(colors.turmeric.light),theme(colors.parchment.DEFAULT))]">
        {crop.photoUrl ? (
          <img src={crop.photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-40">🌾</span>
        )}
        {GRADE_KEY[crop.grade] && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-forest-dark">
            {t(GRADE_KEY[crop.grade])}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="truncate font-display text-[14px] font-semibold text-ink">{crop.name}</p>
        <p className="truncate text-[11px] text-ink-soft">{crop.farmer} · {crop.village}</p>
        <p className="mt-auto font-mono text-base font-bold text-clay-dark">
          ₹{crop.price}
          <span className="text-[10px] font-normal text-ink-faint"> /{crop.unit}</span>
        </p>
      </div>
    </Link>
  )
}

function NeedTile({ req, t }) {
  return (
    <Link
      to="/grow-it"
      className="flex w-[240px] shrink-0 flex-col gap-2 rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${URGENCY_DOT[req.urgency] || 'bg-forest'}`} />
        <p className="truncate text-[11px] font-medium text-ink-soft">{req.buyer} · {req.loc}</p>
      </div>
      <p className="truncate font-display text-[14.5px] font-semibold text-ink">{req.product}</p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold text-turmeric-dark">₹{req.maxPrice}</span>
        <span className="text-[11px] font-medium text-ink-soft">
          <b className="text-ink">{req.offers}</b> {t('card_offers')}
        </span>
      </div>
    </Link>
  )
}

function Track({ items, renderItem }) {
  if (items.length === 0) return null
  // Duplicate the list so the marquee loop is seamless — same technique as MandiBoard.
  const doubled = items.length < 4 ? items : [...items, ...items]
  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-parchment to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-parchment to-transparent" />
      <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => renderItem(item, i))}
      </div>
    </div>
  )
}

export default function TrendingShowcase() {
  const { listings } = useListings()
  const { requirements } = useRequirements()
  const { t } = useLanguage()

  const picks = listings.slice(0, 8)
  const needs = requirements.slice(0, 8)

  return (
    <section className="relative overflow-hidden bg-parchment py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
              {t('showcase_eyebrow')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {t('showcase_title')}
            </h2>
          </div>

          {/* Floating stat chip — positioned per the reference's overlapping stat-chip pattern */}
          <div className="relative hidden shrink-0 md:block">
            <div className="animate-float rounded-2xl border border-line bg-white px-5 py-3 shadow-soft">
              <p className="font-mono text-xl font-bold text-forest">₹12.4L+</p>
              <p className="text-[11px] text-ink-soft">{t('showcase_stat')}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-ink">{t('showcase_picks_label')}</p>
            <Link to="/buy-it" className="text-[12.5px] font-semibold text-clay hover:underline">
              {t('showcase_picks_cta')}
            </Link>
          </div>
          {picks.length > 0 ? (
            <Track items={picks} renderItem={(crop, i) => <PickTile key={`${crop.id}-${i}`} crop={crop} />} />
          ) : (
            <p className="rounded-card border border-dashed border-line bg-white px-6 py-8 text-center text-sm text-ink-soft">
              {t('showcase_empty_picks')}
            </p>
          )}
        </Reveal>

        <Reveal delay={160}>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-ink">{t('showcase_needs_label')}</p>
            <Link to="/grow-it" className="text-[12.5px] font-semibold text-forest hover:underline">
              {t('showcase_needs_cta')}
            </Link>
          </div>
          {needs.length > 0 ? (
            <Track items={needs} renderItem={(req, i) => <NeedTile key={`${req.id}-${i}`} req={req} t={t} />} />
          ) : (
            <p className="rounded-card border border-dashed border-line bg-white px-6 py-8 text-center text-sm text-ink-soft">
              {t('showcase_empty_needs')}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
