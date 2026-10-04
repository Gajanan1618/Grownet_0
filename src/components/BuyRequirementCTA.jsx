import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import RequirementForm from '../features/buyer-market/RequirementForm.jsx'

export default function BuyRequirementCTA() {
  const { isAuthenticated, user, openAuthModal } = useAuth()
  const { t } = useLanguage()
  const [formOpen, setFormOpen] = useState(false)

  function handleOpen(e) {
    e.preventDefault()
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setFormOpen(true)
  }

  return (
    <section className="bg-clay py-16 text-parchment md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="max-w-lg">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-turmeric-light">
            {t('buy_hero_eyebrow')}
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {t('buy_board_title')}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-parchment/80">
            {t('buy_board_sub')}
          </p>
        </div>

        <form
          onSubmit={handleOpen}
          className="w-full max-w-md rounded-card border border-parchment/15 bg-parchment/[0.08] p-6 backdrop-blur"
        >
          {isAuthenticated ? (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-parchment/15 bg-parchment/10 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-turmeric text-[11px] font-semibold text-forest-dark">
                {user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
              <div className="text-[13px]">
                <p className="font-semibold">{user.name}</p>
                <p className="text-parchment/70">+91 {user.phone}</p>
              </div>
            </div>
          ) : (
            <p className="mb-5 text-[13.5px] leading-relaxed text-parchment/80">
              {t('buy_cta_guest_msg')}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-turmeric py-3 text-[13.5px] font-semibold text-forest-dark transition hover:bg-turmeric-light"
          >
            {isAuthenticated ? t('buy_cta_submit_authed') : t('buy_cta_submit_guest')}
          </button>
        </form>
      </div>
      <RequirementForm open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  )
}
