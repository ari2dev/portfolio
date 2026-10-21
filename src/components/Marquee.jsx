import { useMemo, useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import TechIcon from './TechIcon'
import { techKey } from '../data/tech'

const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

export default function Marquee({ items, base = -1.4 }) {
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const speed = still ? 0 : base
  const baseX = useMotionValue(0)
  const dir = useRef(1)

  const { scrollY } = useScroll()
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (speed === 0) return
    let move = dir.current * speed * (delta / 1000)
    if (boost.get() < 0) dir.current = -1
    else if (boost.get() > 0) dir.current = 1
    move += dir.current * move * boost.get()
    baseX.set(baseX.get() + move)
  })

  const half = [...items, ...items]

  return (
    <div aria-hidden="true" className="relative z-10 overflow-hidden py-10 -my-6">
      <div className="-rotate-[1.5deg] bg-accent text-paper border-y border-ink/10 py-4">
        <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {half.map((t, i) => {
                const key = techKey(t)
                return (
                  <span key={i} className="flex items-center">
                    {key && <TechIcon name={key} size={26} className="mr-3 opacity-90" />}
                    <span className="display text-4xl sm:text-6xl px-6">{t}</span>
                    <span className="text-paper/60 text-2xl">✦</span>
                  </span>
                )
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
