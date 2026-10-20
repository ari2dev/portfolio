import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import useActiveSection from '../hooks/useActiveSection'
import { sectionIds } from '../data/sections'

// Raíl de progreso fijo en el margen izquierdo: la barra coral crece con el
// scroll y cada punto marca la posición real de su sección en la página.
// El punto activo sale del mismo hook que el subrayado del navbar.
// Decorativo: solo aparece cuando hay margen suficiente y no intercepta ratón.
export default function ProgressRail() {
  const { scrollYProgress } = useScroll()
  const active = useActiveSection(sectionIds)
  const [marks, setMarks] = useState([])
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setMarks(sectionIds.map((id) => {
        const el = document.getElementById(id)
        if (!el || max <= 0) return null
        // Fracción de scroll en la que la sección queda en el centro
        const frac = (el.offsetTop - window.innerHeight / 2) / max
        return { id, frac: Math.min(Math.max(frac, 0), 1) }
      }).filter(Boolean))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div aria-hidden="true"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden min-[1360px]:block pointer-events-none">
      <div className="relative h-56 w-px bg-ink/10">
        <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-accent" />
        {marks.map((m) => (
          <span key={m.id} style={{ top: `${m.frac * 100}%` }}
            className={`absolute -left-[3px] w-[7px] h-[7px] -translate-y-1/2 rounded-full transition-all duration-300
              ${active === m.id ? 'bg-accent scale-150' : 'bg-ink/25'}`} />
        ))}
      </div>
    </div>
  )
}
