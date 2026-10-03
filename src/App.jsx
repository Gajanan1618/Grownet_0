import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ListingsProvider } from './context/ListingsContext.jsx'
import { RequirementsProvider } from './context/RequirementsContext.jsx'
import { OffersProvider } from './context/OffersContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import AuthModal from './features/auth/AuthModal.jsx'
import ProfileModal from './features/profile/ProfileModal.jsx'
import OffersPanel from './features/offers/OffersPanel.jsx'
import HomePage from './features/home/HomePage.jsx'
import GrowPage from './features/grow/GrowPage.jsx'
import BuyPage from './features/buy/BuyPage.jsx'

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ListingsProvider>
          <RequirementsProvider>
            <OffersProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/grow-it" element={<GrowPage />} />
                <Route path="/buy-it" element={<BuyPage />} />
              </Routes>
              <AuthModal />
              <ProfileModal />
              <OffersPanel />
            </OffersProvider>
          </RequirementsProvider>
        </ListingsProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
