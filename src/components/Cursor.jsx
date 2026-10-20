import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import useIsTouch from '../hooks/useIsTouch'

export default function Cursor() {
  const touch = useIsTouch()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 300, damping: 28 })
  const sy = useSpring(y, { stiffness: 300, damping: 28 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (touch) return
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    const over = (e) => setHover(!!e.target.closest('a, button, input, textarea, [data-cursor]'))
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [touch, x, y])

  if (touch) return null
  return (
    <>
      <motion.div style={{ x, y }} className="fixed top-0 left-0 z-[100] w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-white pointer-events-none mix-blend-difference" />
      <motion.div style={{ x: sx, y: sy }} animate={{ scale: hover ? 1.8 : 1 }}
        className={`fixed top-0 left-0 z-[100] w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border pointer-events-none transition-colors duration-300 ${hover ? 'border-accent bg-accent/20' : 'border-ink/50'}`} />
    </>
  )
}