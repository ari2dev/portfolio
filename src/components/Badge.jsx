import { ArrowDownRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Circular text that spins as you scroll (rotation is driven directly by scrollY).
export default function Badge({ text }) {
  const { scrollY } = useScroll()
  const rotate = useTransform(scrollY, (v) => v * 0.25)
  const label = `${text} / ${text} / `

  return (
    <a href="#about" aria-label="Scroll to About" className="relative block w-28 h-28 text-bone/80 hover:text-bone transition-colors">
      <motion.svg viewBox="0 0 120 120" style={{ rotate }} className="absolute inset-0" aria-hidden="true">
        <defs><path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        {/* textLength = circumference, so the text fills the circle with even spacing */}
        <text fontSize="9.5" fill="currentColor" textLength="286" lengthAdjust="spacing">
          <textPath href="#badge-circle">{label}</textPath>
        </text>
      </motion.svg>
      <ArrowDownRight className="absolute inset-0 m-auto" size={22} />
    </a>
  )
}