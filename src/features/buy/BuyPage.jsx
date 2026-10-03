import Header from '../../components/Header.jsx'
import ListingsSection from '../../components/ListingsSection.jsx'
import BuyRequirementCTA from '../../components/BuyRequirementCTA.jsx'
import Footer from '../../components/Footer.jsx'
import { CATEGORIES } from '../../data/crops.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function BuyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <Header />

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
            {t('buy_hero_eyebrow')}
          </span>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            {t('buy_hero_title')}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            {t('buy_hero_sub')}
          </p>
        </div>
      </section>

      <ListingsSection categories={CATEGORIES} />
      <BuyRequirementCTA />
      <Footer />
    </div>
  )
}
