import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

// Wraps a value into the range [min, max)
const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

export default function Marquee({ items, base = -3 }) {
  const baseX = useMotionValue(0)
  const dir = useRef(1)

  // Scroll velocity (px/s) → smoothed → speed multiplier. Scrolling up gives a negative value = reverse.
  const { scrollY } = useScroll()
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })

  // The track holds two identical halves, so looping from 0% to -50% is seamless.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    let move = dir.current * base * (delta / 1000)
    if (boost.get() < 0) dir.current = -1
    else if (boost.get() > 0) dir.current = 1
    move += dir.current * move * boost.get()
    baseX.set(baseX.get() + move)
  })

  const half = [...items, ...items] // repeated so each half is wider than any screen

  return (
    <div aria-hidden="true" className="relative z-10 overflow-hidden py-10 -my-6">
      {/* Slightly tilted band: breaks the strict horizontal grid on purpose */}
      <div className="-rotate-[1.5deg] bg-cobalt text-bone border-y border-white/20 py-4">
        <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {half.map((t, i) => (
                <span key={i} className="flex items-center">
                  <span className="display text-4xl sm:text-6xl px-6">{t}</span>
                  <span className="text-bone/60 text-2xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}