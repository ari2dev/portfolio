import { useEffect, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'

// d = distancia al cursor normalizada: 0 = encima, 1 = lejos (≥ 300px).
function Letter({ char }) {
  const ref = useRef(null)
  const d = useMotionValue(1)
  const sd = useSpring(d, { stiffness: 220, damping: 22 })

  // Archivo es variable: ancho (wdth) y peso (wght) se interpolan de forma continua.
  const wdth = useTransform(sd, [0, 1], [125, 108])
  const wght = useTransform(sd, [0, 1], [900, 780])
  const variation = useMotionTemplate`"wdth" ${wdth}, "wght" ${wght}`
  // Color: mezcla coral → ámbar según la cercanía. color-mix permite usar las variables del tema.
  const mix = useTransform(sd, [0, 1], [100, 0])
  const color = useMotionTemplate`color-mix(in srgb, rgb(var(--accent2)) ${mix}%, rgb(var(--accent)))`

  useEffect(() => {
    const move = (e) => {
      const r = ref.current.getBoundingClientRect()
      d.set(Math.min(Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) / 300, 1))
    }
    const leave = () => d.set(1)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave) }
  }, [d])

  return <motion.span ref={ref} style={{ fontVariationSettings: variation, color }} className="inline-block">{char}</motion.span>
}

export default function FlexWord({ word }) {
  return word.split('').map((c, i) => <Letter key={i} char={c} />)
}