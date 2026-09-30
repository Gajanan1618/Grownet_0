import Header from '../../components/Header.jsx'
import Hero from '../../components/Hero.jsx'
import MandiBoard from '../../components/MandiBoard.jsx'
import ListingsSection from '../../components/ListingsSection.jsx'
import RequirementBoardSection from '../../components/RequirementBoardSection.jsx'
import HowItWorks from '../../components/HowItWorks.jsx'
import SellPanel from '../../components/SellPanel.jsx'
import Footer from '../../components/Footer.jsx'
import { CATEGORIES, MANDI_RATES } from '../../data/crops.js'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <MandiBoard rates={MANDI_RATES} />
      <ListingsSection categories={CATEGORIES} />
      <RequirementBoardSection />
      <HowItWorks />
      <SellPanel />
      <Footer />
    </div>
  )
}
