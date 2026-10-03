import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
        <div className="mb-5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
          <span className="h-1.5 w-1.5 rounded-full bg-turmeric" />
          {t('hero_pill')}
        </div>

        <h1 className="max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
          {t('hero_title_a')} <span className="italic text-clay">{t('hero_title_em')} {t('hero_title_b')}</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
          {t('hero_sub')}
        </p>

        {/* Two doors — the core navigation decision for two very different audiences */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            to="/grow-it"
            className="group relative overflow-hidden rounded-card bg-forest p-7 text-parchment shadow-soft transition hover:bg-forest-dark sm:p-8"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-turmeric">
              For Farmers
            </span>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold leading-tight md:text-[1.7rem]">
                  {t('grow_card_title')}
                </h2>
                <p className="mt-2 text-sm text-parchment/75">
                  Free listing · payout within 48 hours of delivery
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-parchment/15 text-lg transition group-hover:translate-x-1 group-hover:bg-parchment/25">
                →
              </span>
            </div>
          </Link>

          <Link
            to="/buy-it"
            className="group relative overflow-hidden rounded-card border-2 border-clay/30 bg-parchment-dark p-7 text-ink shadow-soft transition hover:border-clay/60 sm:p-8"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
              For Buyers
            </span>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold leading-tight text-ink md:text-[1.7rem]">
                  {t('buy_card_title')}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">
                  Browse today&rsquo;s arrivals · deal direct, no queue
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay/10 text-lg text-clay transition group-hover:translate-x-1 group-hover:bg-clay/20">
                →
              </span>
            </div>
          </Link>
        </div>

        <Link
          to="/buy-it"
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-clay hover:underline"
        >
          Looking for something specific? Post a requirement instead →
        </Link>
      </div>
    </section>
  )
}
