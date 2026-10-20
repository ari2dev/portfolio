import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Coffee, Database, Layers, Atom, Server, Code2, Monitor, Users } from 'lucide-react'
import Section from './Section'
import CodeWindow from './CodeWindow'
import useIsTouch from '../hooks/useIsTouch'
import { profile, skills, stats, principles } from '../data/content'

const ICONS = { Coffee, Database, Layers, Atom, Server, Code2, Monitor, Users }

const ease = [0.16, 1, 0.3, 1]

const LEVEL = { 'Advanced / Core': 1, 'Advanced': 0.88, 'Solid': 0.78, 'Intermediate': 0.66 }

function Words({ text }) {
  const reduce = useReducedMotion()
  const touch = useIsTouch()
  if (reduce) return <>{text}</>
  return text.split(' ').map((w, i) => (
    <motion.span key={i} className="inline-block whitespace-pre"
      initial={touch ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(6px)' }}
      whileInView={touch ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.015, ease }}>
      {w + ' '}
    </motion.span>
  ))
}

function Counter({ to, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: reduce ? 0 : 1.4,
      ease,
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return <span ref={ref} className="tabular-nums">{n}{suffix}</span>
}

function TiltCard({ children, className }) {
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
    <div style={{ perspective: 900 }}>
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}
        className={`${className} transition-transform duration-200 ease-out will-change-transform`}
        style={{ transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  )
}

export default function About() {
  const reduce = useReducedMotion()
  const touch = useIsTouch()

  return (
    <Section id="about" title="About me" index="01"
      note="Logic-first thinking, from database schemas to the interfaces on top of them.">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-lg text-ink/80 leading-relaxed max-w-prose">
            <Words text={profile.about} />
          </p>

          <CodeWindow />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((s, i) => {
            const Icon = ICONS[s.icon]
            const fill = LEVEL[s.level]
            return (
              <motion.div key={s.name} data-cursor
                initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                className="group glass relative overflow-hidden p-4 flex items-center gap-3.5 transition-colors duration-300 hover:border-accent/60">
                <span aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 -top-10 h-20 rounded-full bg-accent/25 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <motion.span
                  animate={touch || reduce ? undefined : { y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                  className="relative shrink-0 grid place-items-center w-11 h-11 rounded-lg bg-ink/[0.05] border border-ink/10 group-hover:border-accent/40 transition-colors">
                  <Icon className="text-accent" size={20} />
                </motion.span>
                <div className="relative min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-tight">{s.name}</span>
                  <span className="block mt-0.5 text-[10px] uppercase tracking-[0.14em] text-mute">{s.level}</span>
                  {fill !== undefined && (
                    <div className="mt-2 h-[3px] w-full rounded-full bg-ink/10 overflow-hidden">
                      <motion.div
                        initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: fill }}
                        viewport={{ once: true }} transition={{ duration: 1, delay: 0.25 + i * 0.05, ease }}
                        className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent2" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="mt-16 border-y border-ink/10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="display text-4xl sm:text-5xl text-ink">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.2em] text-mute">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-sm uppercase tracking-[0.3em] text-mute mb-6">How I work</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <motion.div key={p.title}
              initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.12, ease }}
              whileTap={{ scale: 0.98 }}>
              <TiltCard className="glass h-full p-6 transition-colors duration-300 hover:border-accent/50">
                <span className="text-accent font-mono text-sm tabular-nums">0{i + 1}</span>
                <h4 className="mt-3 text-lg font-semibold">{p.title}</h4>
                <p className="mt-2 text-sm text-ink/75 leading-relaxed">{p.text}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
