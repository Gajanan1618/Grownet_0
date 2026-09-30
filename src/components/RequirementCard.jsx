import { URGENCY } from '../data/requirements.js'

function ini(name) {
  return name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  'bg-forest', 'bg-clay', 'bg-turmeric-dark', 'bg-forest-light', 'bg-clay-light',
]

export default function RequirementCard({ req, onSendOffer }) {
  const urg = URGENCY[req.urgency]
  const avatarColor = AVATAR_COLORS[[...String(req.id)].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length]

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className={`h-1.5 w-full ${urg.band}`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${avatarColor}`}>
            {ini(req.buyer)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[15.5px] font-semibold leading-snug text-ink">
              {req.product}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-soft">
              {req.buyer} · 📍 {req.loc} · {req.posted}
            </p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-forest/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-forest">
            📦 {req.qty.toLocaleString()} {req.unit}
          </span>
          <span className="rounded-md bg-turmeric/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-turmeric-dark">
            💰 Max ₹{req.maxPrice}/{req.unit === 'litre' ? 'L' : 'kg'}
          </span>
          <span className="rounded-md bg-clay/10 px-2 py-0.5 text-[11px] font-semibold text-clay">
            {req.quality}
          </span>
        </div>

        <p className="mb-3 rounded-lg border border-line bg-parchment-dark px-3 py-2 text-[12.5px] italic leading-relaxed text-ink-soft">
          &ldquo;{req.desc}&rdquo;
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {req.tags.map((t) => (
            <span key={t} className="rounded-md border border-line px-2 py-0.5 text-[11px] font-medium text-ink-soft">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-dashed border-line pt-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${urg.badge}`}>
              {urg.label}
            </span>
            <span className="text-[11.5px] font-medium text-ink-soft">
              <b className="text-ink">{req.offers}</b> offers
            </span>
          </div>
          <button
            onClick={() => onSendOffer(req)}
            className="rounded-full bg-forest px-4 py-1.5 text-[12.5px] font-semibold text-parchment transition hover:bg-forest-dark"
          >
            🌾 Send Offer
          </button>
        </div>
      </div>
    </article>
  )
}
