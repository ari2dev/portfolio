import { motion } from 'framer-motion'
import { Coffee, Database, Code2, Monitor, Users, Languages } from 'lucide-react'
import Section from './Section'
import { profile, skills } from '../data/content'

const ICONS = { Coffee, Database, Code2, Monitor, Users, Languages }

// Resaltador de sintaxis casero: cada línea es una lista de [texto, clase de color].
const kw = 'text-accent', ty = 'text-ink', st = 'text-accent2', pl = 'text-mute'
const code = [
  [['public class ', kw], ['Ariadna ', ty], ['{', pl]],
  [['  String ', ty], ['role = ', pl], ['"Software developer in training"', st], [';', pl]],
  [['  String ', ty], ['degree = ', pl], ['"Higher Diploma in DAM"', st], [';', pl]],
  [['  String[] ', ty], ['stack = {', pl], ['"Java"', st], [', ', pl], ['"SQL"', st], [', ', pl], ['"HTML5"', st], [', ', pl], ['"CSS3"', st], ['};', pl]],
  [['  boolean ', ty], ['learnsFast = ', pl], ['true', kw], [';', pl]],
  [['}', pl]],
]

export default function About() {
  return (
    <Section id="about" title="About me">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-lg text-ink/80 leading-relaxed max-w-prose">
            {profile.about}
          </motion.p>

          {/* Las líneas del código aparecen una a una (stagger) al entrar en pantalla */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
            className="glass mt-8 overflow-hidden" data-cursor>
            <div className="flex gap-2 px-4 py-3 border-b border-ink/10">
              <span className="w-3 h-3 rounded-full bg-ink/20" /><span className="w-3 h-3 rounded-full bg-ink/20" /><span className="w-3 h-3 rounded-full bg-ink/20" />
              <span className="ml-3 text-xs text-mute">Ariadna.java</span>
            </div>
            <pre className="p-5 text-sm leading-7 font-mono overflow-x-auto">
              {code.map((line, i) => (
                <motion.div key={i} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} className="whitespace-pre">
                  {line.map(([text, color], j) => <span key={j} className={color}>{text}</span>)}
                </motion.div>
              ))}
            </pre>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {skills.map((s, i) => {
            const Icon = ICONS[s.icon]
            return (
              <motion.div key={s.name} data-cursor
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
                className="glass p-5 text-center hover:border-accent/60 transition-colors">
                {/* Icono flotante con retraso distinto por tarjeta para que no vayan sincronizados */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} className="flex justify-center mb-3">
                  <Icon className="text-accent" size={30} />
                </motion.div>
                <span className="text-sm">{s.name}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}