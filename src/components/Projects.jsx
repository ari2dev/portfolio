import { motion, useReducedMotion } from 'framer-motion'
import { Coffee, Layers, Atom, ArrowUpRight } from 'lucide-react'
import Section from './Section'
import { projects } from '../data/content'

const ease = [0.16, 1, 0.3, 1]

const ICONS = { Coffee, Layers, Atom }

function Wireframe() {
  return (
    <div aria-hidden="true" className="mb-5 rounded-lg border border-ink/10 overflow-hidden bg-ink/[0.02]">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-ink/10">
        <span className="w-2 h-2 rounded-full bg-ink/20" />
        <span className="w-2 h-2 rounded-full bg-ink/20" />
        <span className="w-2 h-2 rounded-full bg-ink/20" />
      </div>
      <div className="p-4 space-y-2.5">
        <div className="shimmer h-3 rounded-full w-3/4" />
        <div className="shimmer h-3 rounded-full w-full" />
        <div className="shimmer h-3 rounded-full w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="shimmer h-8 w-20 rounded-full" />
          <div className="shimmer h-8 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const reduce = useReducedMotion()

  return (
    <Section id="projects" title="Projects" index="02"
      note="Selected work — from backend logic and data models to the interfaces on top of them.">
      <div className="grid md:grid-cols-3 gap-6 mt-2">
        {projects.map((p, i) => {
          const Icon = ICONS[p.icon]
          return (
            <motion.article key={p.title} data-cursor
              initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.12, ease }}
              whileHover={reduce ? undefined : { y: -8 }} whileTap={{ scale: 0.98 }}
              className="group glass p-6 flex flex-col transition-colors duration-300 hover:border-accent/60 hover:shadow-[0_0_32px_rgb(var(--accent)/0.14)]">
              <Wireframe />
              <div className="flex items-center gap-3 mb-2">
                {Icon && <Icon size={20} className="text-accent shrink-0" />}
                <h3 className="font-semibold leading-snug">{p.title}</h3>
              </div>
              <p className="text-sm text-ink/75 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="text-xs font-mono px-2.5 py-1 rounded-full border border-ink/10 text-mute">{t}</span>
                ))}
              </div>
              <div className="mt-auto pt-5">
                <div className="border-t border-ink/10 pt-4">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">Highlight</span>
                  <p className="mt-1 font-serif italic text-mute leading-snug">{p.status}</p>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      <p className="mt-10 text-center text-sm text-mute">
        Curious about the implementation details?{' '}
        <a href="#contact" className="text-accent hover:underline underline-offset-4 inline-flex items-center gap-1 align-middle">
          Ask me about the code <ArrowUpRight size={14} />
        </a>
      </p>
    </Section>
  )
}
