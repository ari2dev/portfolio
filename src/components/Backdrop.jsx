import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import useIsTouch from '../hooks/useIsTouch'

// Three.js pesa bastante: se carga aparte para que el texto aparezca antes.
const WaveField = lazy(() => import('./WaveField'))

// Manchas de luz: cada una deriva con su propio ritmo.
const blobs = [
  { color: 'bg-accent',  pos: 'w-[55vw] h-[55vw] -top-[18%] -left-[12%]',   path: { x: [0, 90, -40, 0],  y: [0, 60, 20, 0] },  d: 26 },
  { color: 'bg-accent2', pos: 'w-[42vw] h-[42vw] top-[30%] -right-[12%]',   path: { x: [0, -70, 30, 0],  y: [0, 80, -30, 0] }, d: 32 },
  { color: 'bg-accent',  pos: 'w-[38vw] h-[38vw] -bottom-[12%] left-[28%]', path: { x: [0, 60, -60, 0],  y: [0, -50, 20, 0] }, d: 38 },
]

export default function Backdrop() {
  const touch = useIsTouch()
  const still = useReducedMotion()
  const spot = useRef(null)

  // Foco de luz que sigue al cursor: solo actualiza variables CSS, sin re-render.
  useEffect(() => {
    if (touch) return
    let raf
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        spot.current?.style.setProperty('--mx', `${e.clientX}px`)
        spot.current?.style.setProperty('--my', `${e.clientY}px`)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [touch])

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div key={i}
          animate={still || touch ? undefined : b.path}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute rounded-full blur-[120px] ${b.color} ${b.pos}`}
          style={{ opacity: 'var(--blob)' }} />
      ))}

      {/* Campo de puntos 3D: ola con ondas que nacen del cursor */}
      <Suspense fallback={null}><WaveField /></Suspense>

      <div ref={spot} className="absolute inset-0"
        style={{ background: 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgb(var(--accent) / .10), transparent 70%)' }} />
    </div>
  )
}