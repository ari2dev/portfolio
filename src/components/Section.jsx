import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

export default function Section({ id, title, index, note, children }) {
  return (
    <section id={id} className="max-w-[1280px] mx-auto px-6 py-28">
      <div className="relative border-t border-ink/10 pt-8 mb-14">
        {index && (
          <span aria-hidden="true"
            className="absolute right-0 -top-4 display text-[5.5rem] leading-none text-accent/[0.07] tabular-nums select-none pointer-events-none">
            {index}
          </span>
        )}
        {/* La regla coral se dibuja de izquierda a derecha al entrar */}
        <motion.span aria-hidden="true"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease }}
          className="absolute top-0 inset-x-0 h-px bg-accent origin-left" />
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: '105%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease }}
            className="flex items-end gap-4"
          >
            {index && <span className="text-accent text-sm font-semibold pb-2 tabular-nums">{index}</span>}
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight">{title}</h2>
          </motion.div>
        </div>
        {note && (
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, delay: 0.2, ease }}
            className="mt-4 max-w-xl text-mute leading-relaxed">
            {note}
          </motion.p>
        )}
      </div>
      {children}
    </section>
  )
}
