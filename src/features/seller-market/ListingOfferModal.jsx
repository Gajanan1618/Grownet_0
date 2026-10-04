import { useState } from 'react'
import Modal from '../../components/Modal.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useListings } from '../../context/ListingsContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function ListingOfferModal({ crop, onClose }) {
  const { user } = useAuth()
  const { sendOffer } = useListings()
  const { t } = useLanguage()
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  if (!crop) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!price || !qty || sending) return
    setSending(true)
    setError('')
    try {
      await sendOffer(crop.id, { price: Number(price), qty, message: message || undefined })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <Modal open={!!crop} onClose={onClose} maxWidth="max-w-[420px]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-2xl">
            ✓
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">{t('offer_sent_title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {crop.farmer} {t('offer_sent_body')} {crop.name}. {t('offer_sent_body_tail')}
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
          >
            {t('offer_modal_done')}
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={!!crop} onClose={onClose} maxWidth="max-w-[440px]">
      <h2 className="font-display text-xl font-semibold text-ink">{t('offer_modal_title')}</h2>
      <p className="mt-1 text-[13px] text-ink-soft">
        {crop.name} · {crop.farmer} · ₹{crop.price}/{crop.unit} listed
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            {t('offer_modal_your_name')}
          </label>
          <input
            type="text"
            defaultValue={user?.name || ''}
            className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              {t('offer_modal_offer_price')}
            </label>
            <input
              type="number"
              min="1"
              placeholder={crop.price}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              {t('offer_modal_qty_wanted')}
            </label>
            <input
              type="text"
              placeholder={`e.g. 50 ${crop.unit}`}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            {t('offer_modal_message_label')}
          </label>
          <textarea
            rows={2}
            placeholder={t('offer_modal_msg_placeholder1')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
          />
        </div>
        {error && <p className="text-[12.5px] font-medium text-clay">{error}</p>}
        <button
          type="submit"
          disabled={!price || !qty || sending}
          className={
            'w-full rounded-full py-3 text-[13.5px] font-semibold transition ' +
            (price && qty
              ? 'bg-forest text-parchment hover:bg-forest-dark'
              : 'cursor-not-allowed bg-line text-ink-faint')
          }
        >
          {t('offer_modal_submit')} →
        </button>
      </form>
    </Modal>
  )
}
