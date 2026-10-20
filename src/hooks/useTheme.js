import { useEffect, useState } from 'react'

// El script de index.html ya puso data-theme antes de pintar; aquí solo lo leemos y lo cambiamos.
export default function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* modo privado: no pasa nada */ }
  }, [theme])

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}