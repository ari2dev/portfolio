import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react'
import useTheme from '../hooks/useTheme'
import useActiveSection from '../hooks/useActiveSection'
import { profile } from '../data/content'
import { links, sectionIds } from '../data/sections'

const ease = [0.16, 1, 0.3, 1]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, toggleTheme] = useTheme()
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 640 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'bg-paper/70 backdrop-blur-xl border-b border-ink/10' : 'border-b border-transparent'}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <a href="#hero" onClick={() => setOpen(false)} className="font-semibold tracking-tight">
          <span className="sm:hidden">{profile.initials}</span>
          <span className="hidden sm:inline">Ariadna Galván</span>
        </a>

        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="hidden sm:block">
            <ul className="flex gap-4 sm:gap-8 text-sm">
              {links.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className={`relative py-1 transition-colors hover:text-ink ${active === id ? 'text-ink' : 'text-mute'}`}>
                    {label}
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

          <button onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
            className="sm:hidden grid place-items-center w-9 h-9 shrink-0 rounded-full border border-ink/15 active:border-accent transition-colors">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={open ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {open ? <X size={16} /> : <Menu size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="sm:hidden overflow-hidden border-t border-ink/10 bg-paper/90 backdrop-blur-xl"
          >
            <ul className="px-6 py-4" onClick={() => setOpen(false)}>
              {links.map(([label, id], i) => (
                <motion.li key={id}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease }}
                  className="border-b border-ink/[0.07] last:border-b-0">
                  <a href={`#${id}`}
                    className={`flex items-baseline gap-3 py-4 text-2xl font-semibold tracking-tight transition-colors ${active === id ? 'text-accent' : 'text-ink'}`}>
                    <span className="font-mono text-xs text-mute tabular-nums">0{i + 1}</span>
                    <span>{label}</span>
                    {active === id && <ArrowUpRight size={18} className="text-accent self-center" />}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32, ease }}
                className="pt-4">
                <a href={`mailto:${profile.email}`}
                  className="flex items-center justify-center gap-2 rounded-full bg-accent text-paper px-5 py-3 text-sm font-semibold">
                  {profile.email}
                </a>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
