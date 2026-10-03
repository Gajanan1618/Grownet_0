import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useOffers } from '../context/OffersContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import SideMenu from './SideMenu.jsx'

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function NotificationBell({ className = '' }) {
  const { pendingCount, openPanel } = useOffers()
  return (
    <button
      onClick={openPanel}
      aria-label="View offers"
      className={
        'relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-forest hover:text-forest ' +
        className
      }
    >
      <span className="text-base">🔔</span>
      {pendingCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold leading-none text-white">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </button>
  )
}

function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const current = languages.find((l) => l.code === lang)

  return (
    <div className={'relative ' + className}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[12.5px] font-semibold text-ink-soft transition hover:border-forest hover:text-forest"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-line bg-white p-1.5 shadow-soft">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
                className={
                  'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] font-medium transition ' +
                  (l.code === lang ? 'bg-forest/10 text-forest' : 'text-ink-soft hover:bg-forest/5')
                }
              >
                <span>{l.flag}</span> {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ProfileMenu({ user, onViewProfile, onLogout, t }) {
  const [open, setOpen] = useState(false)
  const roleLabel = user.roles.includes('farmer') && user.roles.includes('buyer')
    ? 'Farmer & Buyer'
    : user.roles.includes('farmer')
    ? 'Farmer'
    : 'Buyer'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 transition hover:border-forest"
      >
        {user.photoUrl ? (
          <img src={user.photoUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[11px] font-semibold text-parchment">
            {initials(user.name)}
          </span>
        )}
        <span className="text-[13px] font-medium text-ink">{user.name.split(' ')[0]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-line bg-white p-1.5 shadow-soft">
            <div className="px-3 py-2">
              <p className="text-[13px] font-semibold text-ink">{user.name}</p>
              <p className="text-[12px] text-ink-soft">+91 {user.phone} · {roleLabel}</p>
            </div>
            <div className="my-1 h-px bg-line" />
            <button
              onClick={() => {
                setOpen(false)
                onViewProfile()
              }}
              className="w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-ink-soft hover:bg-forest/5 hover:text-forest"
            >
              {t('view_profile')}
            </button>
            <button
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
              className="w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-clay hover:bg-clay/5"
            >
              {t('log_out')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const { isAuthenticated, user, openAuthModal, openProfileModal, logout } = useAuth()
  const { t } = useLanguage()

  const NAV = [
    { to: '/', label: t('nav_home') },
    { to: '/grow-it', label: t('nav_grow') },
    { to: '/buy-it', label: t('nav_buy') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSideMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-soft transition hover:border-forest hover:text-forest"
          >
            <div className="space-y-[3.5px]">
              <span className="block h-[2px] w-4 bg-current" />
              <span className="block h-[2px] w-4 bg-current" />
              <span className="block h-[2px] w-4 bg-current" />
            </div>
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-base">
              🌿
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              GrowNet
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-[13.5px] font-medium text-ink-soft transition hover:bg-forest/10 hover:text-forest"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <ProfileMenu user={user} onViewProfile={openProfileModal} onLogout={logout} t={t} />
            </>
          ) : (
            <>
              <button
                onClick={openAuthModal}
                className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-ink-soft transition hover:border-forest hover:text-forest"
              >
                {t('log_in')}
              </button>
              <button
                onClick={openAuthModal}
                className="rounded-full bg-forest px-5 py-2 text-[13px] font-semibold text-parchment shadow-soft transition hover:bg-forest-dark"
              >
                {t('join_free')}
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          {isAuthenticated && <NotificationBell />}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle nav"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Menu</span>
            <span className="text-base">⋯</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-parchment px-5 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-forest/10 hover:text-forest"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-line pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between rounded-lg bg-forest/5 px-3 py-2.5">
                  <button
                    onClick={() => {
                      openProfileModal()
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-2"
                  >
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[11px] font-semibold text-parchment">
                        {initials(user.name)}
                      </span>
                    )}
                    <span className="text-[13px] font-medium text-ink">{user.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="text-[12.5px] font-semibold text-clay"
                  >
                    {t('log_out')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      openAuthModal()
                      setMobileOpen(false)
                    }}
                    className="flex-1 rounded-full border border-line py-2 text-sm font-semibold text-ink-soft"
                  >
                    {t('log_in')}
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal()
                      setMobileOpen(false)
                    }}
                    className="flex-1 rounded-full bg-forest py-2 text-center text-sm font-semibold text-parchment"
                  >
                    {t('join_free')}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      <SideMenu open={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
    </header>
  )
}
