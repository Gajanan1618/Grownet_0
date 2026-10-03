import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import ChatModal from '../features/chat/ChatModal.jsx'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function SideMenu({ open, onClose }) {
  const { isAuthenticated, user, openAuthModal, openProfileModal } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)

  const LINKS = [
    { to: '/', icon: '🏠', label: t('nav_home') },
    { to: '/grow-it', icon: '🌿', label: t('nav_grow') },
    { to: '/buy-it', icon: '🛒', label: t('nav_buy') },
  ]

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function goTo(to) {
    onClose()
    navigate(to)
  }

  function handleProfileClick() {
    onClose()
    if (isAuthenticated) openProfileModal()
    else openAuthModal()
  }

  return createPortal(
    <>
      <div
        className={
          'fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm transition-opacity ' +
          (open ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
        onClick={onClose}
      />
      <aside
        className={
          'fixed left-0 top-0 z-[95] flex h-full w-[300px] max-w-[85vw] flex-col border-r border-line bg-parchment shadow-soft transition-transform duration-300 ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-sm">🌿</span>
            <span className="font-display text-lg font-semibold text-ink">GrowNet</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* Profile entry point */}
        <button
          onClick={handleProfileClick}
          className="mx-4 mt-4 flex items-center gap-3 rounded-lg border border-line bg-white px-3.5 py-3 text-left transition hover:border-forest"
        >
          {isAuthenticated ? (
            <>
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-[13px] font-semibold text-parchment">
                  {initials(user.name)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-semibold text-ink">{user.name}</span>
                <span className="block text-[11.5px] text-ink-soft">View &amp; complete your profile →</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-parchment-dark text-lg">
                👤
              </span>
              <span className="text-[13.5px] font-semibold text-ink">Log in to see your profile</span>
            </>
          )}
        </button>

        <nav className="mt-5 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3">
          {LINKS.map((l) => (
            <button
              key={l.to}
              onClick={() => goTo(l.to)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium text-ink-soft transition hover:bg-forest/10 hover:text-forest"
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </button>
          ))}

          <button
            onClick={() => {
              if (!isAuthenticated) {
                onClose()
                openAuthModal()
                return
              }
              onClose()
              setChatOpen(true)
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium text-ink-soft transition hover:bg-forest/10 hover:text-forest"
          >
            <span className="text-base">💬</span>
            Kisaan Chat
          </button>

          <div className="my-2 h-px bg-line" />

          <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-ink-faint">
            <span className="text-base">📅</span>
            Seasonal Prices
            <span className="ml-auto rounded-full bg-line px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
              soon
            </span>
          </span>
          <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-ink-faint">
            <span className="text-base">❓</span>
            Help &amp; Support
            <span className="ml-auto rounded-full bg-line px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
              soon
            </span>
          </span>
        </nav>

        <div className="border-t border-line px-5 py-4 text-[11.5px] text-ink-faint">
          GrowNet · Farm to buyer, direct 🇮🇳
        </div>
      </aside>

      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </>,
    document.body
  )
}
