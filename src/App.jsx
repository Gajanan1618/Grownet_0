import { AuthProvider } from './context/AuthContext.jsx'
import { ListingsProvider } from './context/ListingsContext.jsx'
import { RequirementsProvider } from './context/RequirementsContext.jsx'
import AuthModal from './features/auth/AuthModal.jsx'
import ProfileModal from './features/profile/ProfileModal.jsx'
import LandingPage from './features/landing/LandingPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <RequirementsProvider>
          <LandingPage />
          <AuthModal />
          <ProfileModal />
        </RequirementsProvider>
      </ListingsProvider>
    </AuthProvider>
  )
}
