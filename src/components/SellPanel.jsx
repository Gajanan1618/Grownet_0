import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import ListingForm from '../features/seller-market/ListingForm.jsx'

export default function SellPanel() {
  const { isAuthenticated, user, openAuthModal } = useAuth()
  const isFarmer = isAuthenticated && user.roles.includes('farmer')
  const [formOpen, setFormOpen] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setFormOpen(true)
  }

  return (
    <section id="sell" className="bg-forest py-16 text-parchment md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="max-w-lg">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-turmeric">
            For farmers
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            List your harvest in under five minutes
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-parchment/75">
            No commission for your first six months. Add a photo, set your price,
            and verified buyers start reaching out the same day.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-card border border-parchment/15 bg-parchment/[0.06] p-6 backdrop-blur"
        >
          {isAuthenticated ? (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-parchment/15 bg-parchment/10 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-turmeric text-[11px] font-semibold text-forest-dark">
                {user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
              <div className="text-[13px]">
                <p className="font-semibold">{user.name}</p>
                <p className="text-parchment/60">+91 {user.phone}</p>
              </div>
              {!isFarmer && (
                <span className="ml-auto rounded-full bg-turmeric/20 px-2.5 py-1 text-[10.5px] font-semibold text-turmeric-light">
                  + adds farmer role
                </span>
              )}
            </div>
          ) : (
            <>
              <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-parchment/60">
                Your name
              </label>
              <input
                type="text"
                placeholder="Gurpreet Singh"
                className="mb-4 w-full rounded-lg border border-parchment/20 bg-parchment/10 px-4 py-2.5 text-sm text-parchment placeholder:text-parchment/40 focus:border-turmeric focus:outline-none"
              />
              <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-parchment/60">
                WhatsApp number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="mb-5 w-full rounded-lg border border-parchment/20 bg-parchment/10 px-4 py-2.5 text-sm text-parchment placeholder:text-parchment/40 focus:border-turmeric focus:outline-none"
              />
            </>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-turmeric py-3 text-[13.5px] font-semibold text-forest-dark transition hover:bg-turmeric-light"
          >
            {isAuthenticated ? 'Continue to listing details →' : 'Start my free listing →'}
          </button>
        </form>
      </div>
      <ListingForm open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  )
}
