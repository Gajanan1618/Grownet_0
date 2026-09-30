import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import SideMenu from './SideMenu.jsx'

const NAV = [
  { href: '#listings', label: 'Browse Produce' },
  { href: '#board', label: 'Buyer Board' },
  { href: '#sell', label: 'Sell Produce' },
  { href: '#how', label: 'How It Works' },
]

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ProfileMenu({ user, onViewProfile, onLogout }) {
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
              View profile
            </button>
            <button
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
              className="w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-clay hover:bg-clay/5"
            >
              Log out
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

          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-base">
              🌿
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              GrowNet
            </span>
          </a>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-2 text-[13.5px] font-medium text-ink-soft transition hover:bg-forest/10 hover:text-forest"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <ProfileMenu user={user} onViewProfile={openProfileModal} onLogout={logout} />
          ) : (
            <>
              <button
                onClick={openAuthModal}
                className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-ink-soft transition hover:border-forest hover:text-forest"
              >
                Log In
              </button>
              <button
                onClick={openAuthModal}
                className="rounded-full bg-forest px-5 py-2 text-[13px] font-semibold text-parchment shadow-soft transition hover:bg-forest-dark"
              >
                Join Free
              </button>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle nav"
          aria-expanded={mobileOpen}
        >
          <span className="sr-only">Menu</span>
          <span className="text-base">⋯</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-parchment px-5 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-forest/10 hover:text-forest"
              >
                {n.label}
              </a>
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
                    Log out
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
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal()
                      setMobileOpen(false)
                    }}
                    className="flex-1 rounded-full bg-forest py-2 text-center text-sm font-semibold text-parchment"
                  >
                    Join Free
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
