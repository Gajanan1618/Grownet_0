import { useEffect, useRef, useState } from 'react'
import Modal from '../../components/Modal.jsx'
import SectionLabel from '../../components/SectionLabel.jsx'
import { Field, inputClass } from '../../components/FormField.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { compressImage } from '../../lib/image.js'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function EmailVerify({ user }) {
  const { sendEmailVerification, confirmEmail } = useAuth()
  const [email, setEmail] = useState(user.email || '')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function run(fn) {
    setError('')
    try {
      await fn()
    } catch (err) {
      setError(err.message)
    }
  }
  const isValidEmail = /\S+@\S+\.\S+/.test(email)
  const errEl = error && <p className="mt-2 text-[12.5px] font-medium text-clay">{error}</p>

  if (user.emailVerified) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-forest/30 bg-forest/5 px-3.5 py-2.5 text-[13px]">
        <span className="text-forest">✓</span>
        <span className="text-ink-soft">
          Verified — <span className="font-medium text-ink">{user.email}</span>
        </span>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-parchment-dark px-3.5 py-3 text-[12.5px] text-ink-soft">
        Verification link sent to <span className="font-semibold text-ink">{email}</span> (demo — no
        real email is sent).
        <button
          type="button"
          onClick={() => run(confirmEmail)}
          className="mt-2 block w-full rounded-full bg-forest py-2 text-[12.5px] font-semibold text-parchment transition hover:bg-forest-dark"
        >
          Simulate clicking the link →
        </button>
        {errEl}
      </div>
    )
  }

  return (
    <div>
    <div className="flex gap-2">
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-forest"
      />
      <button
        type="button"
        disabled={!isValidEmail}
        onClick={() => run(async () => { await sendEmailVerification(email); setSent(true) })}
        className={
          'shrink-0 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition ' +
          (isValidEmail ? 'bg-forest text-parchment hover:bg-forest-dark' : 'cursor-not-allowed bg-line text-ink-faint')
        }
      >
        Verify
      </button>
    </div>
    {errEl}
    </div>
  )
}

export default function ProfileModal() {
  const { user, profileModalOpen, closeProfileModal, updateProfile } = useAuth()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // (re)initialise the editable copy whenever the modal opens for the current user,
  // and clear it on close so the next open re-syncs from the latest user data
  useEffect(() => {
    if (profileModalOpen && user) {
      setForm({
        name: user.name || '',
        village: user.village || '',
        businessName: user.businessName || '',
        aadhaarLast4: user.aadhaarLast4 || '',
        upiId: user.upiId || '',
        gstin: user.gstin || '',
      })
    } else {
      setForm(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileModalOpen])

  if (!user || !form) return null

  const isFarmer = user.roles.includes('farmer')

  const steps = [
    { done: !!user.name, label: 'Add your name' },
    { done: !!user.photoUrl, label: 'Add a profile photo' },
    { done: user.emailVerified, label: 'Verify your email' },
    { done: !!user.village, label: 'Add your village / district' },
    { done: (user.aadhaarLast4 || '').length === 4, label: 'Add Aadhaar for verification' },
    { done: !!user.upiId, label: 'Add UPI ID for payouts' },
  ]
  const doneCount = steps.filter((s) => s.done).length
  const pct = Math.round((doneCount / steps.length) * 100)

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    compressImage(file, { maxDim: 480, quality: 0.8 })
      .then((dataUrl) => updateProfile({ photoUrl: dataUrl }))
      .catch((err) => setError(err.message))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (form.aadhaarLast4 && !/^\d{4}$/.test(form.aadhaarLast4)) {
      setError('Aadhaar field should be exactly 4 digits')
      return
    }
    if (form.upiId && !/^[\w.-]+@[\w.-]+$/.test(form.upiId)) {
      setError('Enter a valid UPI ID, e.g. name@bank')
      return
    }
    setError('')
    try {
      await updateProfile({ ...form })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal open={profileModalOpen} onClose={closeProfileModal} maxWidth="max-w-xl">
      {/* Identity header */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {user.photoUrl ? (
            <img src={user.photoUrl} alt="" className="h-16 w-16 rounded-full border border-line object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-lg font-semibold text-parchment">
              {initials(user.name)}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change photo"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-parchment bg-turmeric text-[11px]"
          >
            📷
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-semibold text-ink">{user.name}</h2>
          <p className="text-[12.5px] text-ink-soft">+91 {user.phone}</p>
          <div className="mt-1 flex gap-1.5">
            {user.roles.map((r) => (
              <span key={r} className="rounded-full bg-forest/10 px-2 py-0.5 text-[10.5px] font-semibold capitalize text-forest">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Completion checklist */}
      <div className="mt-5 rounded-lg border border-line bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">Complete your profile</span>
          <span className="font-mono text-[12px] font-semibold text-turmeric-dark">{pct}%</span>
        </div>
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-turmeric transition-all" style={{ width: `${pct}%` }} />
        </div>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-[12px]">
              <span className={s.done ? 'text-forest' : 'text-ink-faint'}>{s.done ? '✓' : '○'}</span>
              <span className={s.done ? 'text-ink-soft line-through' : 'text-ink'}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSave}>
        <SectionLabel>📧 Contact &amp; verification</SectionLabel>
        <EmailVerify user={user} />

        <SectionLabel>🧾 Identity &amp; payouts</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Aadhaar" hint="last 4 digits only">
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              value={form.aadhaarLast4}
              onChange={(e) => set('aadhaarLast4', e.target.value.replace(/\D/g, ''))}
              className={inputClass}
            />
          </Field>
          <Field label="UPI ID" required={isFarmer} hint="for receiving payouts">
            <input
              type="text"
              placeholder="yourname@upi"
              value={form.upiId}
              onChange={(e) => set('upiId', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <SectionLabel>🏢 Business details</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Business / farm name" hint="optional">
            <input
              type="text"
              placeholder="Ramdass Farms"
              value={form.businessName}
              onChange={(e) => set('businessName', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="GSTIN" hint="optional, for business buyers">
            <input
              type="text"
              placeholder="22AAAAA0000A1Z5"
              value={form.gstin}
              onChange={(e) => set('gstin', e.target.value.toUpperCase())}
              className={inputClass}
            />
          </Field>
        </div>

        <SectionLabel>✏️ Basic info</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Village / district" required>
            <input
              type="text"
              placeholder="Ajnala, Amritsar"
              value={form.village}
              onChange={(e) => set('village', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        {error && <p className="mt-4 text-[12.5px] font-medium text-clay">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-forest py-2.5 text-[13px] font-semibold text-parchment transition hover:bg-forest-dark"
        >
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </form>
    </Modal>
  )
}
