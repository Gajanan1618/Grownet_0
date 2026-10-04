import Header from '../../components/Header.jsx'
import Hero from '../../components/Hero.jsx'
import MandiBoard from '../../components/MandiBoard.jsx'
import TrendingShowcase from '../../components/TrendingShowcase.jsx'
import HowItWorks from '../../components/HowItWorks.jsx'
import Footer from '../../components/Footer.jsx'
import { MANDI_RATES } from '../../data/crops.js'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <MandiBoard rates={MANDI_RATES} />
      <TrendingShowcase />
      <HowItWorks />
      <Footer />
    </div>
  )
}
