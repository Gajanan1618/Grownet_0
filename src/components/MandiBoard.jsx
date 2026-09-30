const TREND_GLYPH = { up: '▲', down: '▼', flat: '—' }
const TREND_COLOR = { up: 'text-turmeric-light', down: 'text-clay-light', flat: 'text-parchment/50' }

function Row({ item }) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap px-6 font-mono text-sm text-parchment/90">
      <span className="font-semibold">{item.name}</span>
      <span className="text-parchment/50">₹{item.price}/{item.unit}</span>
      <span className={TREND_COLOR[item.trend]}>{TREND_GLYPH[item.trend]}</span>
    </div>
  )
}

export default function MandiBoard({ rates }) {
  const doubled = [...rates, ...rates]
  return (
    <div className="relative overflow-hidden border-y border-forest-dark bg-forest py-3">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-forest to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-forest to-transparent" />
      <div className="mb-1 flex items-center gap-2 px-6">
        <span className="h-1.5 w-1.5 rounded-full bg-turmeric" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-turmeric">
          Today&rsquo;s Mandi Board · live
        </span>
      </div>
      <div className="flex w-max animate-marquee">
        {doubled.map((item, i) => (
          <Row item={item} key={i} />
        ))}
      </div>
    </div>
  )
}
