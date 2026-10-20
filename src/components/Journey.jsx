import { motion } from 'framer-motion'
import { Briefcase, Code2, Users, Microscope } from 'lucide-react'
import Section from './Section'
import { journey } from '../data/content'

const ease = [0.16, 1, 0.3, 1]

const ICONS = { Briefcase, Code2, Users, Microscope }

export default function Journey() {
  return (
    <Section id="journey" title="Journey" index="03"
      note="From science to software — a short history of solving problems for a living.">
      <div className="relative">
        <span aria-hidden="true" className="absolute left-5 top-3 bottom-3 w-px bg-ink/10" />
        <ul className="space-y-6">
          {journey.map((j, i) => {
            const Icon = ICONS[j.icon]
            return (
              <motion.li key={j.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.1, ease }}
                className="group relative pl-16">
                <span className="absolute left-0 top-2 grid place-items-center w-10 h-10 rounded-full bg-paper border border-ink/10 text-mute group-hover:text-accent group-hover:border-accent/50 transition-colors">
                  {Icon && <Icon size={18} />}
                </span>
                <motion.div whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="glass p-5 group-hover:border-accent/40 transition-colors">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-semibold leading-snug">{j.title}</h3>
                    <span className="text-xs font-mono text-accent tabular-nums">{j.period}</span>
                  </div>
                  <p className="text-sm text-mute mt-0.5">{j.place}</p>
                  <p className="text-sm text-ink/75 mt-2 leading-relaxed">{j.desc}</p>
                </motion.div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
