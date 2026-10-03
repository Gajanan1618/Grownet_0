import { useState } from 'react'
import Modal from '../../components/Modal.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useRequirements } from '../../context/RequirementsContext.jsx'

export default function OfferModal({ req, onClose }) {
  const { user } = useAuth()
  const { sendOffer } = useRequirements()
  const [price, setPrice] = useState('')
  const [supply, setSupply] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  if (!req) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!price || !supply || sending) return
    setSending(true)
    setError('')
    try {
      await sendOffer(req.id, { price: Number(price), qty: supply, message: message || undefined })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <Modal open={!!req} onClose={onClose} maxWidth="max-w-[420px]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-2xl">
            🌾
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">Offer sent!</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {req.buyer} has been notified of your offer for {req.product}. They&rsquo;ll reach out
            directly if it&rsquo;s a match.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
          >
            Done
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={!!req} onClose={onClose} maxWidth="max-w-[460px]">
      <h2 className="font-display text-xl font-semibold text-ink">Send your offer</h2>
      <p className="mt-1 text-[13px] text-ink-soft">
        {req.product} · {req.buyer} · 📍 {req.loc}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-line bg-parchment-dark p-3 text-center">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{req.qty}</p>
          <p className="text-[10.5px] uppercase tracking-wide text-ink-soft">{req.unit} needed</p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-turmeric-dark">₹{req.maxPrice}</p>
          <p className="text-[10.5px] uppercase tracking-wide text-ink-soft">max budget</p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-clay">{req.quality}</p>
          <p className="text-[10.5px] uppercase tracking-wide text-ink-soft">grade</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            Your name &amp; farm
          </label>
          <input
            type="text"
            defaultValue={user?.name || ''}
            placeholder="Gurpreet Singh — Ramdass Farms"
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              Offer price (₹) *
            </label>
            <input
              type="number"
              min="1"
              placeholder={req.maxPrice}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              You can supply *
            </label>
            <input
              type="text"
              placeholder={`${req.qty} ${req.unit}`}
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            Message
          </label>
          <textarea
            rows={2}
            placeholder="Tell them about your produce…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
          />
        </div>
        {error && <p className="text-[12.5px] font-medium text-clay">{error}</p>}
        <button
          type="submit"
          disabled={!price || !supply || sending}
          className={
            'w-full rounded-full py-3 text-[13.5px] font-semibold transition ' +
            (price && supply
              ? 'bg-forest text-parchment hover:bg-forest-dark'
              : 'cursor-not-allowed bg-line text-ink-faint')
          }
        >
          🌾 Send offer
        </button>
      </form>
    </Modal>
  )
}
