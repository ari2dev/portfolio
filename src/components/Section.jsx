import { motion } from 'framer-motion'

export default function Section({ id, title, children }) {
  return (
    <section id={id} className="max-w-[1280px] mx-auto px-6 py-28">
      <div className="border-t border-white/10 pt-8 mb-14 overflow-hidden">
        <motion.h2
          initial={{ y: '105%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl font-semibold tracking-tight"
        >
          {title}
        </motion.h2>
      </div>
      {children}
    </section>
  )
}