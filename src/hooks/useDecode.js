import { useEffect, useState } from 'react'

const BITS = '01' // binary digits
const rand = () => BITS[Math.floor(Math.random() * 2)]

// Starts as random 0s and 1s and resolves left to right into the real text.
export default function useDecode(target, duration = 1600) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [out, setOut] = useState(() => (reduce ? target : target.replace(/\S/g, rand)))

  useEffect(() => {
    if (reduce) return
    const start = performance.now()
    const id = setInterval(() => {
      const p = Math.min((performance.now() - start) / duration, 1)
      setOut(target.split('').map((c, i) => (c === ' ' || i / target.length < p ? c : rand())).join(''))
      if (p >= 1) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [target, duration, reduce])

  return out
}