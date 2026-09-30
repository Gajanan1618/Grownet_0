import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function PhoneStep({ onSubmit }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { sendOtp } = useAuth()

  const digitsOnly = phone.replace(/\D/g, '')
  const isValid = digitsOnly.length === 10

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await sendOtp(digitsOnly)
      onSubmit(digitsOnly, res.demoOtp)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-display text-2xl font-semibold text-ink">Log in or sign up</h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Same login for every farmer and buyer — we&rsquo;ll ask what brings you here right after.
      </p>

      <label className="mb-1.5 mt-6 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        Mobile number
      </label>
      <div className="flex overflow-hidden rounded-lg border border-line focus-within:border-forest">
        <span className="flex items-center bg-parchment-dark px-3 font-mono text-sm text-ink-soft">
          +91
        </span>
        <input
          type="tel"
          inputMode="numeric"
          autoFocus
          maxLength={10}
          placeholder="98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2.5 text-sm text-ink outline-none"
        />
      </div>
      {error && <p className="mt-2 text-[12.5px] font-medium text-clay">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
      >
        {loading ? 'Sending…' : 'Send OTP →'}
      </button>

      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-faint">
        By continuing you agree to GrowNet&rsquo;s Terms and Privacy Policy.
      </p>
    </form>
  )
}
