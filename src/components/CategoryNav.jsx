import { useLanguage } from '../context/LanguageContext.jsx'

export default function CategoryNav({ categories, active, onChange }) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter produce by category">
      {categories.map((c) => {
        const isActive = active === c.id
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(c.id)}
            className={
              'flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition ' +
              (isActive
                ? 'border-forest bg-forest text-parchment shadow-soft'
                : 'border-line bg-white text-ink-soft hover:border-forest/50 hover:text-forest')
            }
          >
            <span aria-hidden="true">{c.icon}</span>
            {t(`cat_${c.id}`)}
          </button>
        )
      })}
    </div>
  )
}
