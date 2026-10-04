import { useMemo, useState } from 'react'
import CategoryNav from './CategoryNav.jsx'
import CropCard from './CropCard.jsx'
import Reveal from './Reveal.jsx'
import { useListings } from '../context/ListingsContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ListingsSection({ categories }) {
  const { listings } = useListings()
  const { t } = useLanguage()
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
              {t('listings_eyebrow')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {t('listings_title')}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            {t('listings_sub')}
          </p>
        </div>

        <div className="mb-8">
          <CategoryNav categories={categories} active={active} onChange={setActive} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((crop, i) => (
            <Reveal key={crop.id} delay={(i % 8) * 70}>
              <CropCard crop={crop} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="rounded-card border border-dashed border-line bg-white px-6 py-10 text-center text-sm text-ink-soft">
            {t('listings_empty')}
          </p>
        )}
      </div>
    </section>
  )
}
