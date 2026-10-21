import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import useIsTouch from '../hooks/useIsTouch'

export default function TiltCard({ children, className }) {
  const touch = useIsTouch()
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const px = useRef(0)
  const py = useRef(0)

  const onMove = (e) => {
    if (touch || reduce) return
    const r = ref.current.getBoundingClientRect()
    px.current = (e.clientX - r.left) / r.width - 0.5
    py.current = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--rx', `${-py.current * 8}deg`)
    ref.current.style.setProperty('--ry', `${px.current * 8}deg`)
  }
  const onLeave = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}
        className={`${className} transition-transform duration-200 ease-out will-change-transform`}
        style={{ transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  )
}
