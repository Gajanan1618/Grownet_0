import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { translations, LANGUAGES } from '../i18n/translations.js'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'grownet_lang'

function getInitialLang() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && translations[saved]) return saved
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const setLang = useCallback((code) => {
    if (!translations[code]) return
    setLangState(code)
    localStorage.setItem(STORAGE_KEY, code)
  }, [])

  // Falls back to English, then to the key itself, so a missing translation
  // never renders blank.
  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t, languages: LANGUAGES }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside a LanguageProvider')
  return ctx
}
