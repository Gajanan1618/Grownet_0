import { useMemo, useState } from 'react'
import CategoryNav from './CategoryNav.jsx'
import CropCard from './CropCard.jsx'
import { useListings } from '../context/ListingsContext.jsx'

export default function ListingsSection({ categories }) {
  const { listings } = useListings()
  const [active, setActive] = useState('all')

  const filtered = useMemo(
    () => (active === 'all' ? listings : listings.filter((c) => c.cat === active)),
    [active, listings]
  )

  return (
    <section id="listings" className="bg-parchment-dark py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
              Fresh arrivals
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Today&rsquo;s listings, straight from the farm
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            Every listing is tied to a verified farmer. Filter by category, message
            directly, and send an offer — no browsing a middleman&rsquo;s markup.
          </p>
        </div>

        <div className="mb-8">
          <CategoryNav categories={categories} active={active} onChange={setActive} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((crop) => (
            <CropCard crop={crop} key={crop.id} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="rounded-card border border-dashed border-line bg-white px-6 py-10 text-center text-sm text-ink-soft">
            No listings in this category yet — check back soon, or post a requirement and let farmers come to you.
          </p>
        )}
      </div>
    </section>
  )
}
