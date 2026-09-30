export const inputClass =
  'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-forest'

export function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          {label} {required && <span className="text-clay">*</span>}
        </span>
        {hint && <span className="text-[10.5px] font-normal normal-case text-ink-faint">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
