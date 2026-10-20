import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import useTheme from '../hooks/useTheme'
import { profile } from '../data/content'

const links = [['About', 'about'], ['Projects', 'projects'], ['Journey', 'journey'], ['Contact', 'contact']]

export default function Navbar() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [theme, toggleTheme] = useTheme()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    links.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-paper/70 backdrop-blur-xl border-b border-ink/10' : 'border-b border-transparent'}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a href="#hero" className="font-semibold tracking-tight">
          <span className="sm:hidden">{profile.initials}</span>
          <span className="hidden sm:inline">Ariadna Galván</span>
        </a>
        <div className="flex items-center gap-4 sm:gap-8">
          <nav>
            <ul className="flex gap-4 sm:gap-8 text-sm">
              {links.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className={`relative py-1 transition-colors hover:text-ink ${active === id ? 'text-ink' : 'text-mute'}`}>
                    {label}
                    {/* layoutId: Framer anima un único subrayado que viaja de enlace en enlace */}
                    {active === id && <motion.span layoutId="nav-underline" className="absolute -bottom-0.5 inset-x-0 h-px bg-accent" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="grid place-items-center w-9 h-9 shrink-0 rounded-full border border-ink/15 hover:border-accent transition-colors">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.header>
  )
}