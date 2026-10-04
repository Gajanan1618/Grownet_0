import { useMemo, useState } from 'react'
import CategoryNav from './CategoryNav.jsx'
import RequirementCard from './RequirementCard.jsx'
import Reveal from './Reveal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useRequirements } from '../context/RequirementsContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { CATEGORIES } from '../data/crops.js'
import RequirementForm from '../features/buyer-market/RequirementForm.jsx'
import OfferModal from '../features/buyer-market/OfferModal.jsx'

const URGENCY_RANK = { urgent: 0, soon: 1, normal: 2 }
const SORT_KEYS = ['sort_newest', 'sort_urgent', 'sort_qty', 'sort_price']
const SORT_IDS = ['newest', 'urgent', 'qty', 'price']

export default function RequirementBoardSection() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const { requirements } = useRequirements()
  const { t } = useLanguage()
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [formOpen, setFormOpen] = useState(false)
  const [offerReq, setOfferReq] = useState(null)

  const list = useMemo(() => {
    let l = category === 'all' ? [...requirements] : requirements.filter((r) => r.cat === category)
    if (sort === 'urgent') l.sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency])
    else if (sort === 'qty') l.sort((a, b) => b.qty - a.qty)
    else if (sort === 'price') l.sort((a, b) => b.maxPrice - a.maxPrice)
    else l.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return l
  }, [requirements, category, sort])

  const totalOffers = requirements.reduce((a, r) => a + r.offers, 0)

  function handlePost() {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setFormOpen(true)
  }

  function handleSendOffer(req) {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setOfferReq(req)
  }

  return (
    <section id="board" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
              {t('board_eyebrow')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {t('board_title')}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              {t('board_sub_a')}
              <b className="text-ink"> {list.length}</b> {t('board_sub_b')} <b className="text-ink">{totalOffers}</b> {t('board_sub_c')}
            </p>
          </div>
          <button
            onClick={handlePost}
            className="shrink-0 rounded-full bg-forest px-6 py-3 text-[13.5px] font-semibold text-parchment shadow-soft transition hover:bg-forest-dark"
          >
            {t('board_post_btn')}
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CategoryNav categories={CATEGORIES} active={category} onChange={setCategory} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-soft outline-none focus:border-forest"
          >
            {SORT_IDS.map((id, i) => (
              <option key={id} value={id}>{t(SORT_KEYS[i])}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((req, i) => (
            <Reveal key={req.id} delay={(i % 9) * 70}>
              <RequirementCard req={req} onSendOffer={handleSendOffer} />
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <p className="rounded-card border border-dashed border-line bg-white px-6 py-10 text-center text-sm text-ink-soft">
            {t('board_empty')}
          </p>
        )}
      </div>

      <RequirementForm open={formOpen} onClose={() => setFormOpen(false)} />
      <OfferModal req={offerReq} onClose={() => setOfferReq(null)} />
    </section>
  )
}
