import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../../components/Modal.jsx'
import { CHAT_CONTACTS, MANDI_RATES } from './chatData.js'

const TABS = [
  { id: 'all', label: '🌾 All' },
  { id: 'organic', label: '🥬 Organic' },
  { id: 'dairy', label: '🐄 Dairy' },
  { id: 'wholesale', label: '📦 Wholesale' },
  { id: 'fpo', label: '🌽 FPO' },
]

const AUTO_REPLIES = [
  'Theek hai bhai, dekhta hoon.',
  'Haanji, thodi der mein batata hoon.',
  'Achha, price thoda aur badha sakte ho?',
  'Kal subah tak confirm kar dunga.',
]

function MessageBubble({ m }) {
  const isMe = m.from === 'me'
  const bubbleBase =
    'max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ' +
    (isMe ? 'rounded-br-sm bg-forest text-parchment' : 'rounded-bl-sm border border-line bg-white text-ink')

  return (
    <div className={'flex ' + (isMe ? 'justify-end' : 'justify-start')}>
      <div className={bubbleBase}>
        {m.type === 'payment' && (
          <div
            className={
              'mb-1.5 flex items-center justify-between gap-3 rounded-lg px-3 py-2 ' +
              (isMe ? 'bg-parchment/15' : 'bg-forest/5')
            }
          >
            <span className="font-mono text-sm font-bold">₹{m.amount}</span>
            <span className="text-xs opacity-80">💳 UPI</span>
          </div>
        )}
        {m.type === 'catalog' && (
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {m.items.map((it) => (
              <span
                key={it}
                className={
                  'rounded-full px-2.5 py-1 text-[11px] font-semibold ' +
                  (isMe ? 'bg-parchment/15' : 'bg-forest/10 text-forest')
                }
              >
                {it}
              </span>
            ))}
          </div>
        )}
        {m.text}
      </div>
    </div>
  )
}

export default function ChatModal({ open, onClose }) {
  const [activeId, setActiveId] = useState(CHAT_CONTACTS[0].id)
  const [threads, setThreads] = useState(() =>
    Object.fromEntries(CHAT_CONTACTS.map((c) => [c.id, c.seed]))
  )
  const [unread, setUnread] = useState(() =>
    Object.fromEntries(CHAT_CONTACTS.map((c) => [c.id, c.unread]))
  )
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false)
  const [typing, setTyping] = useState(false)
  const [ratesOpen, setRatesOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [toast, setToast] = useState('')
  const scrollRef = useRef(null)

  const active = CHAT_CONTACTS.find((c) => c.id === activeId)
  const messages = useMemo(() => threads[activeId] || [], [threads, activeId])

  const contacts = CHAT_CONTACTS.filter(
    (c) => (tab === 'all' || c.tag === tab) && c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function appendMessage(msg) {
    setThreads((t) => ({ ...t, [activeId]: [...t[activeId], msg] }))
  }

  function triggerReply() {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
      appendMessage({ from: 'them', type: 'text', text: reply })
    }, 1400)
  }

  function sendMessage(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    appendMessage({ from: 'me', type: 'text', text })
    setDraft('')
    triggerReply()
  }

  function selectContact(id) {
    setActiveId(id)
    setUnread((u) => ({ ...u, [id]: 0 }))
    setShowThreadOnMobile(true)
    setPaymentOpen(false)
    setRatesOpen(false)
  }

  function sendPayment(e) {
    e.preventDefault()
    const amt = Number(paymentAmount)
    if (!amt) return
    appendMessage({ from: 'me', type: 'payment', amount: amt, text: `Payment bheja: ₹${amt}` })
    setPaymentAmount('')
    setPaymentOpen(false)
    triggerReply()
  }

  function sendCatalog() {
    appendMessage({
      from: 'me',
      type: 'catalog',
      items: ['🌾 Gehun 50kg', '🧅 Pyaaz 20kg', '🌿 Dhaniya 5kg'],
      text: 'Hamara catalog dekho:',
    })
    triggerReply()
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Kisaan Chat</h2>
          <p className="mt-1 text-sm text-ink-soft">Message farmers and buyers directly — no middleman in between.</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setRatesOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 font-mono text-[12px] font-semibold text-parchment"
          >
            📈 {MANDI_RATES[0].crop.split(' ')[0]} ₹{MANDI_RATES[0].price}/{MANDI_RATES[0].unit}
          </button>
          {ratesOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-line bg-white p-2 shadow-soft">
              <p className="mb-1.5 px-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                Today&rsquo;s mandi bhav
              </p>
              {MANDI_RATES.map((r) => (
                <div key={r.crop} className="flex items-center justify-between rounded-md px-2 py-1.5 text-[12.5px] hover:bg-parchment-dark">
                  <span className="text-ink">{r.crop}</span>
                  <span className="font-mono font-semibold text-forest">₹{r.price}/{r.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid h-[480px] grid-cols-1 gap-0 overflow-hidden rounded-lg border border-line sm:grid-cols-[240px_1fr]">
        {/* Contact list */}
        <div className={'flex-col overflow-hidden border-r border-line bg-parchment-dark sm:flex ' + (showThreadOnMobile ? 'hidden' : 'flex')}>
          <div className="border-b border-line p-2.5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Farmer, mandi khojo…"
              className="w-full rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] text-ink outline-none focus:border-forest"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={
                    'rounded-full px-2 py-1 text-[10.5px] font-semibold transition ' +
                    (tab === t.id ? 'bg-forest text-parchment' : 'bg-white text-ink-soft hover:bg-forest/10')
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => selectContact(c.id)}
                className={
                  'flex w-full items-center gap-2.5 border-b border-line px-3 py-3 text-left transition ' +
                  (c.id === activeId ? 'bg-forest/10' : 'hover:bg-white')
                }
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-base">
                  {c.emoji}
                  <span
                    className={
                      'absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-parchment-dark ' +
                      (c.online ? 'bg-forest' : 'bg-ink-faint')
                    }
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-1">
                    <span className="truncate text-[13px] font-semibold text-ink">{c.name}</span>
                    {unread[c.id] > 0 && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-turmeric px-1 text-[10px] font-bold text-forest-dark">
                        {unread[c.id]}
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-[11px] text-ink-soft">📍 {c.location}</span>
                </span>
              </button>
            ))}
            {contacts.length === 0 && (
              <p className="p-4 text-center text-[12.5px] text-ink-soft">Koi contact nahi mila</p>
            )}
          </div>

          <div className="border-t border-line bg-turmeric/10 px-3 py-2 text-[11px] font-medium text-turmeric-dark">
            🌧️ Rain alert: heavy rain in 2 hrs — advise farmers to cover crops
          </div>
        </div>

        {/* Thread */}
        <div className={'relative flex-col sm:flex ' + (showThreadOnMobile ? 'flex' : 'hidden')}>
          <div className="flex items-center gap-2.5 border-b border-line bg-white px-4 py-2.5">
            <button onClick={() => setShowThreadOnMobile(false)} className="text-ink-soft sm:hidden" aria-label="Back">
              ←
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-parchment-dark text-sm">
              {active.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">{active.name}</p>
              <p className="truncate text-[11px] text-ink-soft">
                {active.online ? 'Online' : 'Offline'} · {active.location}
              </p>
            </div>
            <button
              onClick={() => showToast(`📞 Calling ${active.name}…`)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-parchment-dark"
              aria-label="Call"
            >
              📞
            </button>
            <button
              onClick={() => showToast(`📹 Starting video call with ${active.name}…`)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-parchment-dark"
              aria-label="Video call"
            >
              📹
            </button>
          </div>

          {toast && (
            <div className="absolute left-1/2 top-14 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-1.5 text-[12px] font-medium text-parchment shadow-soft">
              {toast}
            </div>
          )}

          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-parchment px-4 py-3">
            {messages.map((m, i) => (
              <MessageBubble key={i} m={m} />
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-line bg-white px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" />
                </div>
              </div>
            )}
          </div>

          {paymentOpen && (
            <form onSubmit={sendPayment} className="flex gap-2 border-t border-line bg-parchment-dark p-2.5">
              <input
                type="number"
                min="1"
                autoFocus
                placeholder="Amount (₹)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="flex-1 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] outline-none focus:border-forest"
              />
              <button type="submit" className="rounded-full bg-forest px-3.5 py-1.5 text-[12px] font-semibold text-parchment">
                Send
              </button>
              <button type="button" onClick={() => setPaymentOpen(false)} className="rounded-full border border-line px-2.5 py-1.5 text-[12px] text-ink-soft">
                ✕
              </button>
            </form>
          )}

          <div className="flex gap-1.5 border-t border-line bg-white px-3 pt-2">
            <button onClick={() => showToast('📸 Camera khul raha hai (demo)')} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-ink-soft hover:bg-parchment-dark">
              📷 Photo
            </button>
            <button onClick={() => setPaymentOpen((v) => !v)} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-ink-soft hover:bg-parchment-dark">
              💰 Payment
            </button>
            <button onClick={sendCatalog} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-ink-soft hover:bg-parchment-dark">
              🌾 Catalog
            </button>
            <button onClick={() => setRatesOpen((v) => !v)} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-ink-soft hover:bg-parchment-dark">
              📈 Mandi Bhav
            </button>
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 bg-white p-3 pt-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-line bg-parchment-dark px-4 py-2 text-[13px] text-ink outline-none focus:border-forest"
            />
            <button type="submit" className="rounded-full bg-forest px-4 py-2 text-[13px] font-semibold text-parchment transition hover:bg-forest-dark">
              Send
            </button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
