import { useState } from 'react'

const ROLES = [
  {
    id: 'farmer',
    icon: '🌾',
    title: 'I grow produce',
    desc: 'List your harvest and reach verified buyers',
    accent: 'forest',
  },
  {
    id: 'buyer',
    icon: '🛒',
    title: 'I buy produce',
    desc: 'Source directly from verified farmers',
    accent: 'clay',
  },
  {
    id: 'both',
    icon: '🤝',
    title: 'Both',
    desc: 'I sell some crops and buy others',
    accent: 'turmeric',
  },
]

const ACCENT_CLASSES = {
  forest: {
    ring: 'border-forest bg-forest/5',
    icon: 'bg-forest/10 text-forest',
  },
  clay: {
    ring: 'border-clay bg-clay/5',
    icon: 'bg-clay/10 text-clay',
  },
  turmeric: {
    ring: 'border-turmeric-dark bg-turmeric/10',
    icon: 'bg-turmeric/15 text-turmeric-dark',
  },
}

export default function RoleStep({ onComplete }) {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = selected === 'both' ? ['farmer', 'buyer'] : selected ? [selected] : []
  const canContinue = name.trim().length > 1 && selected

  async function handleContinue() {
    if (!canContinue || loading) return
    setLoading(true)
    setError('')
    try {
      await onComplete({ name: name.trim(), roles })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink">Welcome to GrowNet</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Just two things, then you&rsquo;re in.</p>

      <label className="mb-1.5 mt-6 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        Your name
      </label>
      <input
        type="text"
        autoFocus
        placeholder="Gurpreet Singh"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
      />

      <p className="mb-2.5 mt-6 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        What brings you here?
      </p>
      <div className="space-y-2.5">
        {ROLES.map((r) => {
          const isActive = selected === r.id
          const accent = ACCENT_CLASSES[r.accent]
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelected(r.id)}
              className={
                'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ' +
                (isActive ? accent.ring : 'border-line bg-white hover:border-ink-faint')
              }
            >
              <span className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ' + accent.icon}>
                {r.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-ink">{r.title}</span>
                <span className="block text-[12px] text-ink-soft">{r.desc}</span>
              </span>
            </button>
          )
        })}
      </div>

      {error && <p className="mt-4 text-[12.5px] font-medium text-clay">{error}</p>}

      <button
        onClick={handleContinue}
        disabled={!canContinue || loading}
        className={
          'mt-6 w-full rounded-full py-3 text-[13.5px] font-semibold transition ' +
          (canContinue
            ? 'bg-forest text-parchment hover:bg-forest-dark'
            : 'cursor-not-allowed bg-line text-ink-faint')
        }
      >
        {loading ? 'Setting up…' : 'Finish setting up →'}
      </button>
    </div>
  )
}
