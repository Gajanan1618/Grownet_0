import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'

const SOCIALS = [
  { label: 'Facebook', glyph: 'f' },
  { label: 'Instagram', glyph: '◎' },
  { label: 'YouTube', glyph: '▶' },
  { label: 'X', glyph: '✕' },
]

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'I Buy It — Browse Produce', to: '/buy-it' },
      { label: 'I Grow It — Sell Produce', to: '/grow-it' },
      { label: "Today's Mandi Prices", to: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Report an Issue', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Refund & Escrow Policy', href: '#' },
    ],
  },
]

function SocialIcon({ label, glyph }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-parchment/[0.07] text-sm text-parchment/80 transition hover:bg-turmeric hover:text-forest-dark"
    >
      {glyph}
    </a>
  )
}

function AppBadge({ platform, label, sub }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg border border-parchment/15 bg-parchment/[0.05] px-4 py-2.5 text-left transition hover:border-parchment/30">
      <span className="text-lg">{platform === 'ios' ? '🍎' : '▶️'}</span>
      <span>
        <span className="block text-[10.5px] text-parchment/55">{sub}</span>
        <span className="block text-[13px] font-semibold text-parchment">{label}</span>
      </span>
    </button>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-forest-dark text-parchment/75">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-turmeric text-sm">
                🌿
              </span>
              <span className="font-display text-xl font-semibold text-parchment">GrowNet</span>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-parchment/60">
              {t('footer_tagline')}
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-turmeric">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[13.5px] text-parchment/65 transition hover:text-parchment"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download app column */}
          <div>
            <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-turmeric">
              Get the app
            </h4>
            <div className="mt-4 space-y-2.5">
              <AppBadge platform="ios" sub="Coming soon on" label="App Store" />
              <AppBadge platform="android" sub="Coming soon on" label="Google Play" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-parchment/10 pt-6 text-[12.5px] text-parchment/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GrowNet · Farm to buyer, direct 🇮🇳</p>
          <p>FSSAI Reg. 10025043000123</p>
        </div>
      </div>
    </footer>
  )
}
