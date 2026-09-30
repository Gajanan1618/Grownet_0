import { useState } from 'react'
import Modal from '../../components/Modal.jsx'
import SectionLabel from '../../components/SectionLabel.jsx'
import { Field, inputClass } from '../../components/FormField.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useRequirements } from '../../context/RequirementsContext.jsx'
import { CATEGORIES } from '../../data/crops.js'

const UNITS = ['kg', 'quintal', 'tonne', 'litre']
const QUALITIES = ['Standard', 'Good', 'Premium', 'Organic']
const URGENCIES = [
  { id: 'normal', label: '🟢 Normal', sub: 'Flexible' },
  { id: 'soon', label: '🟡 Soon', sub: '3–5 days' },
  { id: 'urgent', label: '🔴 Urgent', sub: '48 hours' },
]
const FIELD_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'all')

function emptyForm(user) {
  return {
    category: '',
    product: '',
    quantity: '',
    unit: 'kg',
    quality: 'Good',
    maxPrice: '',
    needBy: '',
    loc: user?.village || '',
    urgency: 'normal',
    desc: '',
  }
}

export default function RequirementForm({ open, onClose }) {
  const { user } = useAuth()
  const { addRequirement } = useRequirements()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => emptyForm(user))
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setForm(emptyForm(user))
      setError('')
      setSubmitted(false)
    }, 200)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.category || !form.product || !form.quantity || !form.maxPrice || !form.loc) {
      setError('Please fill all required fields marked with *')
      return
    }
    setError('')
    setSaving(true)
    try {
      await addRequirement({
      category: form.category,
      product: form.product,
      loc: form.loc,
      qty: Number(form.quantity),
      unit: form.unit,
      quality: form.quality,
      maxPrice: Number(form.maxPrice),
      needBy: form.needBy,
      urgency: form.urgency,
      desc: form.desc || 'No additional details provided.',
      tags: [form.quality + ' quality'],
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return (
      <Modal open={open} onClose={handleClose} maxWidth="max-w-[440px]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-2xl">
            ✓
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">Requirement posted!</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            12,000+ farmers can now see what you need. You&rsquo;ll be notified as offers come in —
            average response time is 4 hours.
          </p>
          <a
            href="#board"
            onClick={handleClose}
            className="mt-6 block w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
          >
            View the buyer board →
          </a>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth="max-w-2xl">
      <h2 className="font-display text-2xl font-semibold text-ink">Post your requirement</h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Free to post — verified farmers will send you offers directly.
      </p>

      <form onSubmit={handleSubmit}>
        <SectionLabel>🌾 What do you need?</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category" required>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
              <option value="">Select…</option>
              {FIELD_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Product name" required>
            <input
              type="text"
              placeholder="Basmati Rice"
              value={form.product}
              onChange={(e) => set('product', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Quantity" required>
            <input
              type="number"
              min="1"
              placeholder="500"
              value={form.quantity}
              onChange={(e) => set('quantity', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Unit">
            <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className={inputClass}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </Field>
          <Field label="Max budget (₹)" required>
            <input
              type="number"
              min="1"
              placeholder="68"
              value={form.maxPrice}
              onChange={(e) => set('maxPrice', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Quality">
            <select value={form.quality} onChange={(e) => set('quality', e.target.value)} className={inputClass}>
              {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </Field>
        </div>

        <SectionLabel>🚚 Delivery</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Need it by">
            <input
              type="date"
              value={form.needBy}
              onChange={(e) => set('needBy', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Delivery location" required>
            <input
              type="text"
              placeholder="Jalandhar, Punjab"
              value={form.loc}
              onChange={(e) => set('loc', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            How urgent?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {URGENCIES.map((u) => (
              <button
                type="button"
                key={u.id}
                onClick={() => set('urgency', u.id)}
                className={
                  'rounded-lg border px-3 py-2.5 text-center text-[12.5px] font-semibold transition ' +
                  (form.urgency === u.id
                    ? 'border-forest bg-forest/5 text-forest'
                    : 'border-line bg-white text-ink-soft hover:border-ink-faint')
                }
              >
                <span className="block">{u.label}</span>
                <span className="block text-[10.5px] font-normal text-ink-faint">{u.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <SectionLabel>📝 Additional details</SectionLabel>
        <textarea
          placeholder="Certifications needed, packaging, repeat order details…"
          value={form.desc}
          onChange={(e) => set('desc', e.target.value)}
          rows={3}
          className={inputClass + ' resize-none'}
        />

        {error && <p className="mt-4 text-[12.5px] font-medium text-clay">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
        >
          Post requirement — free →
        </button>
      </form>
    </Modal>
  )
}
