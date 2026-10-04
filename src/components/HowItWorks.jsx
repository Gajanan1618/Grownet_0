import Reveal from './Reveal.jsx'

const STEPS = [
  {
    n: '01',
    title: 'Post',
    farmer: 'List your harvest — photo, quantity, price.',
    buyer: 'Post what you need — or browse live listings.',
  },
  {
    n: '02',
    title: 'Match',
    farmer: 'Verified buyers see your listing within minutes.',
    buyer: 'Filter by crop, grade, and district — message direct.',
  },
  {
    n: '03',
    title: 'Deal',
    farmer: 'Accept an offer, price and quantity are locked in.',
    buyer: 'Negotiate in-app or by call, then confirm the deal.',
  },
  {
    n: '04',
    title: 'Delivered & Paid',
    farmer: 'Payout hits your account within 48 hours of delivery.',
    buyer: 'Funds stay in escrow until you confirm delivery.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
          How it works
        </span>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Four steps, same for both sides of the deal
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="flex flex-col gap-3 bg-white p-6">
              <span className="font-mono text-xs font-semibold text-turmeric-dark">{s.n}</span>
              <h3 className="font-display text-xl font-semibold text-ink">{s.title}</h3>
              <div className="mt-1 space-y-2 text-[13px] leading-relaxed">
                <p className="text-ink-soft">
                  <span className="font-semibold text-forest">Farmer — </span>
                  {s.farmer}
                </p>
                <p className="text-ink-soft">
                  <span className="font-semibold text-clay">Buyer — </span>
                  {s.buyer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
