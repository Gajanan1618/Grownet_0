import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../../context/AuthContext.jsx'

export default function OtpStep({ phone, initialDemoOtp, onBack, onVerified }) {
  const { sendOtp, verifyOtp } = useAuth()
  const [demoOtp, setDemoOtp] = useState(initialDemoOtp)
  const [loading, setLoading] = useState(false)
  const [digits, setDigits] = useState(Array(6).fill(''))
  const [shake, setShake] = useState(false)
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(60)
  const inputsRef = useRef([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [secondsLeft])

  function handleChange(i, val) {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    setError('')
    if (v && i < 5) inputsRef.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
  }

  async function handleVerify() {
    const entered = digits.join('')
    if (entered.length < 6) {
      setError('Enter all 6 digits')
      return
    }
    setLoading(true)
    try {
      const res = await verifyOtp(phone, entered)
      onVerified(res)
    } catch (err) {
      setShake(true)
      setError(err.message)
      setTimeout(() => setShake(false), 400)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      const res = await sendOtp(phone)
      setDemoOtp(res.demoOtp)
      setDigits(Array(6).fill(''))
      setError('')
      setSecondsLeft(60)
      inputsRef.current[0]?.focus()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <button onClick={onBack} className="mb-3 text-[13px] font-medium text-ink-soft hover:text-forest">
        ← Change number
      </button>
      <h2 className="font-display text-2xl font-semibold text-ink">Enter the code</h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        We&rsquo;ve sent a 6-digit OTP to <span className="font-semibold text-ink">+91 {phone}</span>
      </p>

      <div className={'mt-6 flex justify-between gap-2' + (shake ? ' animate-shake' : '')}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className={
              'h-12 w-11 rounded-lg border text-center font-mono text-lg font-semibold text-ink outline-none transition ' +
              (d ? 'border-forest bg-forest/5' : 'border-line') +
              (error ? ' border-clay' : '')
            }
          />
        ))}
      </div>
      {error && <p className="mt-3 text-[12.5px] font-medium text-clay">{error}</p>}

      <div className="mt-4 flex items-center justify-between text-[12.5px]">
        <span className="text-ink-faint">
          {secondsLeft > 0 ? `Expires in 0:${String(secondsLeft).padStart(2, '0')}` : 'Code expired'}
        </span>
        <button
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className={
            'font-semibold ' + (secondsLeft > 0 ? 'cursor-not-allowed text-ink-faint' : 'text-forest hover:underline')
          }
        >
          Resend OTP
        </button>
      </div>

      <button
        onClick={handleVerify}
        disabled={loading}
        className="mt-6 w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
      >
        {loading ? 'Verifying…' : 'Verify & continue'}
      </button>

      {demoOtp && (
        <div className="mt-4 rounded-lg border border-dashed border-line bg-parchment-dark px-3 py-2 text-center font-mono text-[11.5px] text-ink-soft">
          Demo mode — OTP is <span className="font-semibold text-forest">{demoOtp}</span>
        </div>
      )}
    </div>
  )
}
