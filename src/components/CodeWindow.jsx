import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { javaDemo } from '../data/content'

const ease = [0.16, 1, 0.3, 1]

const TOKEN = { kw: 'text-accent', ty: 'text-ink', st: 'text-accent2', pl: 'text-mute' }

const plain = javaDemo.map((line) => line.map(([text]) => text).join('')).join('\n')

export default function CodeWindow() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard blocked: the code is still selectable */ }
  }

  return (
    <div data-cursor className="glass overflow-hidden mt-8">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink/10">
        <span aria-hidden="true" className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-accent/80" />
          <span className="w-3 h-3 rounded-full bg-accent2/80" />
          <span className="w-3 h-3 rounded-full bg-ink/20" />
        </span>
        <span className="ml-2 text-xs font-mono text-mute">Ariadna.java</span>
        <button onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-mute hover:text-ink transition-colors px-2 py-1 rounded-md hover:bg-ink/[0.06]">
          {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="relative">
        <pre className="p-4 sm:p-5 text-[11px] sm:text-sm leading-6 sm:leading-7 font-mono overflow-x-auto">
          {javaDemo.map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.15, duration: 0.5, ease }}
              className="flex whitespace-pre-wrap break-words sm:whitespace-pre sm:break-normal">
              <span aria-hidden="true" className="select-none w-6 sm:w-7 shrink-0 text-right mr-3 sm:mr-4 text-ink/25 tabular-nums">{i + 1}</span>
              <span>{line.map(([text, token], j) => <span key={j} className={TOKEN[token]}>{text}</span>)}</span>
            </motion.div>
          ))}
        </pre>
        <div aria-hidden="true" className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink/[0.08] to-transparent" />
      </div>
    </div>
  )
}
