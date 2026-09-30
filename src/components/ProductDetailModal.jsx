import { useState } from 'react'
import Modal from './Modal.jsx'
import StampBadge from './StampBadge.jsx'

const GRADE_STYLE = {
  Premium: 'bg-turmeric/15 text-turmeric-dark',
  Good: 'bg-forest/10 text-forest',
  Organic: 'bg-clay/10 text-clay-dark',
}

const CATEGORY_EMOJI = {
  grains: '🌾', vegetables: '🥦', fruits: '🍊', pulses: '🫘', spices: '🌶️', dairy: '🥛', organic: '🌿',
}

function getEmbedUrl(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  if (yt) return { kind: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` }

  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { kind: 'video', src: url }

  return null // unrecognised host — fall back to a plain link-out rather than a broken embed
}

function VideoBlock({ url }) {
  const embed = getEmbedUrl(url)

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 flex items-center gap-2.5 rounded-lg border border-line bg-parchment-dark px-4 py-3 text-[13px] font-semibold text-forest transition hover:border-forest"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-parchment">▶</span>
        Watch product video ↗
      </a>
    )
  }

  return (
    <div className="mt-5 aspect-video overflow-hidden rounded-lg border border-line bg-black">
      {embed.kind === 'iframe' ? (
        <iframe
          src={embed.src}
          title="Product video"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={embed.src} controls className="h-full w-full" />
      )}
    </div>
  )
}

export default function ProductDetailModal({ crop, onClose, onSendOffer }) {
  const [activeImg, setActiveImg] = useState(0)

  if (!crop) return null
  const photos = crop.photos || []
  const hasPhotos = photos.length > 0

  return (
    <Modal open={!!crop} onClose={onClose} maxWidth="max-w-2xl">
      {/* Photo carousel */}
      <div className="-mx-7 -mt-7 sm:-mx-8 sm:-mt-8">
        <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-t-card bg-parchment-dark">
          {hasPhotos ? (
            <img src={photos[activeImg]} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl opacity-40">{CATEGORY_EMOJI[crop.cat] || '🌿'}</span>
          )}
        </div>
        {photos.length > 1 && (
          <div className="flex gap-2 border-b border-line bg-parchment-dark px-5 py-3">
            {photos.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={
                  'h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ' +
                  (i === activeImg ? 'border-forest' : 'border-transparent opacity-70 hover:opacity-100')
                }
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {crop.videoUrl && <VideoBlock url={crop.videoUrl} />}

      {/* Header info */}
      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold text-ink">{crop.name}</h2>
          <p className="mt-1 text-[13px] text-ink-soft">
            {crop.farmer} · 📍 {crop.village}
          </p>
        </div>
        {crop.verified && <StampBadge className="mt-0.5 shrink-0" />}
      </div>

      {/* Price + stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-line bg-parchment-dark p-3 text-center">
        <div>
          <p className="font-mono text-lg font-semibold text-ink">₹{crop.price}</p>
          <p className="text-[10.5px] uppercase tracking-wide text-ink-soft">per {crop.unit}</p>
        </div>
        <div>
          <p className={`inline-block rounded-md px-2 py-0.5 text-[13px] font-semibold ${GRADE_STYLE[crop.grade] || 'bg-forest/10 text-forest'}`}>
            {crop.grade}
          </p>
          <p className="mt-1 text-[10.5px] uppercase tracking-wide text-ink-soft">grade</p>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-ink">{crop.harvested}</p>
          <p className="text-[10.5px] uppercase tracking-wide text-ink-soft">status</p>
        </div>
      </div>

      <p className="mt-4 font-mono text-[12px] text-ink-soft">{crop.qty}</p>

      {crop.desc && (
        <p className="mt-3 rounded-lg border border-line bg-white px-4 py-3 text-[13px] leading-relaxed text-ink-soft">
          {crop.desc}
        </p>
      )}

      {crop.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {crop.tags.map((t) => (
            <span key={t} className="rounded-md border border-line px-2.5 py-1 text-[11.5px] font-medium text-ink-soft">
              {t}
            </span>
          ))}
        </div>
      )}

      {crop.offers > 0 && (
        <p className="mt-3 text-[12.5px] font-medium text-ink-soft">
          <b className="text-forest">{crop.offers}</b> {crop.offers === 1 ? 'buyer has' : 'buyers have'} already made an offer
        </p>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <button
          onClick={onSendOffer}
          className="w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
        >
          🌾 Send Offer
        </button>
      </div>
    </Modal>
  )
}
