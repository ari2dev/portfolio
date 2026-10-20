import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Wraps any element: it drifts toward the cursor and springs back on leave.
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 14 })
  const y = useSpring(my, { stiffness: 220, damping: 14 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={onLeave} className="inline-block">
      {children}
    </motion.div>
  )
}