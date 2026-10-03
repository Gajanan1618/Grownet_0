import Header from '../../components/Header.jsx'
import SellPanel from '../../components/SellPanel.jsx'
import RequirementBoardSection from '../../components/RequirementBoardSection.jsx'
import Footer from '../../components/Footer.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function GrowPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <Header />

      <section className="bg-parchment-dark py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
            {t('grow_hero_eyebrow')}
          </span>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            {t('grow_hero_title')}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            {t('grow_hero_sub')}
          </p>
        </div>
      </section>

      <SellPanel />

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-16">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
            {t('grow_requirements_title')}
          </span>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            {t('grow_requirements_sub')}
          </p>
        </div>
        <RequirementBoardSection />
      </div>

      <Footer />
    </div>
  )
}
