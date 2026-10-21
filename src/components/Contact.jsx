import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Copy, Check, Clock, Car, MapPin, Link } from 'lucide-react'
import Section from './Section'
import Magnetic from './Magnetic'
import { profile } from '../data/content'

const ease = [0.16, 1, 0.3, 1]

const SOCIALS = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
].filter((s) => profile[s.key])

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard blocked: the mailto link still works */ }
  }

  const facts = [
    { Icon: Clock, text: 'Flexible schedule' },
    { Icon: Car, text: 'Driving licence B — own car' },
    { Icon: MapPin, text: 'Geographic availability' },
  ]

  return (
    <Section id="contact" title="Get in touch" index="04"
      note="The fastest way to reach me — I usually reply within a day.">
      <div className="flex flex-col items-center text-center gap-8">
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease }}
          className="font-serif italic text-3xl sm:text-5xl text-ink max-w-2xl leading-tight">
          Looking for a junior developer who learns fast and delivers?
        </motion.p>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-mute max-w-md leading-relaxed">
          {profile.availability}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.25, ease }}
          className="flex flex-col sm:flex-row items-center gap-3">
          <Magnetic>
            <a href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-3 rounded-full bg-accent text-paper px-7 py-4 font-semibold transition-colors hover:bg-accent/90 shadow-lg shadow-accent/25">
              <Mail size={18} />
              <span className="break-all">{profile.email}</span>
            </a>
          </Magnetic>

          <button onClick={copy} data-cursor
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/[0.03] px-5 py-4 text-sm font-medium text-mute hover:text-ink hover:border-ink/30 transition-colors">
            {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy email'}
          </button>
        </motion.div>

        {SOCIALS.length > 0 && (
          <div className="flex gap-3">
            {SOCIALS.map(({ key, label }) => (
              <a key={key} href={profile[key]} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink transition-colors">
                <Link size={16} /> {label}
              </a>
            ))}
          </div>
        )}

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-mute">
          {facts.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5"><Icon size={13} /> {text}</li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
