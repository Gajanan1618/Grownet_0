export default function SectionLabel({ children }) {
  return (
    <div className="mb-3 mt-6 flex items-center gap-3 first:mt-0">
      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-clay">
        {children}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
