import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal.jsx'
import SectionLabel from '../../components/SectionLabel.jsx'
import { Field, inputClass } from '../../components/FormField.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { compressImage } from '../../lib/image.js'
import { useListings } from '../../context/ListingsContext.jsx'
import { CATEGORIES } from '../../data/crops.js'

const UNITS = ['kg', 'quintal', 'tonne', 'litre']
const GRADES = [
  { id: 'Standard', icon: '🥉' },
  { id: 'Good', icon: '🥈' },
  { id: 'Premium', icon: '🥇' },
  { id: 'Organic', icon: '🌿' },
]
const CERTS = ['FSSAI Certified', 'Organic Certified', 'GI Tag']

const FIELD_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'all')

function emptyForm(user) {
  return {
    category: '',
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    minOrder: '',
    price: '',
    grade: 'Good',
    harvestDate: '',
    village: user?.village || '',
    certs: [],
    description: '',
    videoUrl: '',
  }
}

export default function ListingForm({ open, onClose }) {
  const { user } = useAuth()
  const { addListing } = useListings()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => emptyForm(user))
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function toggleCert(cert) {
    setForm((f) => ({
      ...f,
      certs: f.certs.includes(cert) ? f.certs.filter((c) => c !== cert) : [...f.certs, cert],
    }))
  }

  function handlePhotos(fileList) {
    const files = Array.from(fileList).slice(0, 5 - photos.length)
    files.forEach((file) => {
      compressImage(file)
        .then((dataUrl) => setPhotos((p) => [...p, dataUrl]))
        .catch(() => setError('Could not process one of the photos — try another file'))
    })
  }

  function removePhoto(i) {
    setPhotos((p) => p.filter((_, idx) => idx !== i))
  }

  function handleClose() {
    onClose()
    // reset for next time this is opened, after the close animation would run
    setTimeout(() => {
      setForm(emptyForm(user))
      setPhotos([])
      setError('')
      setSubmitted(false)
    }, 200)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.category || !form.cropName || !form.quantity || !form.price || !form.village) {
      setError('Please fill all required fields marked with *')
      return
    }
    setError('')

    setSaving(true)
    try {
      await addListing({
      category: form.category,
      name: form.variety ? `${form.cropName} — ${form.variety}` : form.cropName,
      village: form.village,
      price: Number(form.price),
      unit: form.unit,
      qty: `${form.quantity} ${form.unit} available` + (form.minOrder ? ` · min order ${form.minOrder} ${form.unit}` : ''),
      grade: form.grade,
      harvested: form.harvestDate
        ? `Harvested ${new Date(form.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
        : 'Freshly listed',
      tags: form.certs,
      photoUrl: photos[0] || '',
      photos,
      videoUrl: form.videoUrl.trim(),
      desc: form.description,
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
          <h2 className="font-display text-2xl font-semibold text-ink">Your listing is live!</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {form.cropName} is now visible to verified buyers in Fresh Arrivals.
            You&rsquo;ll be notified the moment an offer comes in.
          </p>
          <Link
            to="/buy-it"
            onClick={handleClose}
            className="mt-6 block w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
          >
            View it in Fresh Arrivals →
          </Link>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth="max-w-2xl">
      <h2 className="font-display text-2xl font-semibold text-ink">List your harvest</h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Free listing — the same details buyers see in Fresh Arrivals below.
      </p>

      <form onSubmit={handleSubmit}>
        <SectionLabel>🌾 Product details</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category" required>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
              <option value="">Select…</option>
              {FIELD_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Crop name" required>
            <input
              type="text"
              placeholder="Basmati Rice"
              value={form.cropName}
              onChange={(e) => set('cropName', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Variety (optional)">
            <input
              type="text"
              placeholder="1121 Variety"
              value={form.variety}
              onChange={(e) => set('variety', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <SectionLabel>📦 Quantity &amp; price</SectionLabel>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>
          <Field label="Price / unit (₹)" required>
            <input
              type="number"
              min="1"
              placeholder="62"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Min order">
            <input
              type="number"
              min="1"
              placeholder="10"
              value={form.minOrder}
              onChange={(e) => set('minOrder', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            Quality grade
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GRADES.map((g) => (
              <button
                type="button"
                key={g.id}
                onClick={() => set('grade', g.id)}
                className={
                  'rounded-lg border px-3 py-2.5 text-center text-[12.5px] font-semibold transition ' +
                  (form.grade === g.id
                    ? 'border-forest bg-forest/5 text-forest'
                    : 'border-line bg-white text-ink-soft hover:border-ink-faint')
                }
              >
                <span className="mr-1">{g.icon}</span>
                {g.id}
              </button>
            ))}
          </div>
        </div>

        <SectionLabel>🚚 Harvest &amp; location</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Harvest date">
            <input
              type="date"
              value={form.harvestDate}
              onChange={(e) => set('harvestDate', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Village / District" required>
            <input
              type="text"
              placeholder="Ajnala, Amritsar"
              value={form.village}
              onChange={(e) => set('village', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            Certifications
          </label>
          <div className="flex flex-wrap gap-2">
            {CERTS.map((cert) => (
              <button
                type="button"
                key={cert}
                onClick={() => toggleCert(cert)}
                className={
                  'rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition ' +
                  (form.certs.includes(cert)
                    ? 'border-turmeric-dark bg-turmeric/15 text-turmeric-dark'
                    : 'border-line bg-white text-ink-soft hover:border-ink-faint')
                }
              >
                {cert}
              </button>
            ))}
          </div>
        </div>

        <SectionLabel>📸 Photos (optional)</SectionLabel>
        <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-line bg-white px-4 py-6 text-center transition hover:border-forest hover:bg-forest/5">
          <span className="text-2xl">📸</span>
          <span className="text-[13px] font-semibold text-ink">Click to add photos</span>
          <span className="text-[11.5px] text-ink-soft">JPG, PNG · up to 5 photos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handlePhotos(e.target.files)}
          />
        </label>
        {photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {photos.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-parchment"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Field label="Video link (optional)" hint="YouTube or any video URL">
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=…"
              value={form.videoUrl}
              onChange={(e) => set('videoUrl', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <SectionLabel>📝 Description</SectionLabel>
        <textarea
          placeholder="Tell buyers about your produce — variety, how it's grown, any special quality…"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className={inputClass + ' resize-none'}
        />

        {error && <p className="mt-4 text-[12.5px] font-medium text-clay">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
        >
          Submit listing — free →
        </button>
      </form>
    </Modal>
  )
}
