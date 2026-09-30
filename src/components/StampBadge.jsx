export default function StampBadge({ className = '' }) {
  return (
    <div
      className={
        'select-none pointer-events-none flex h-14 w-14 shrink-0 -rotate-[9deg] items-center justify-center rounded-full border-2 border-dashed border-forest/60 text-forest/80 ' +
        className
      }
      aria-hidden="true"
    >
      <div className="text-center leading-none">
        <div className="font-mono text-[7.5px] font-semibold tracking-[0.14em]">VERIFIED</div>
        <div className="my-0.5 text-[11px]">✓</div>
        <div className="font-mono text-[7.5px] font-semibold tracking-[0.14em]">FARMER</div>
      </div>
    </div>
  )
}
