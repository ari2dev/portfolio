import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { Download } from 'lucide-react'
import useIsTouch from '../hooks/useIsTouch'
import FlexWord from './FlexWord'
import Magnetic from './Magnetic'
import Badge from './Badge'
import { profile } from '../data/content'
import cutout from '../assets/hero-cutout.webp'

const ease = [0.16, 1, 0.3, 1]
const reveal = (delay) => ({ initial: { y: '105%' }, animate: { y: 0 }, transition: { duration: 1.1, delay, ease } })
// La foto se desvanece por abajo: funciona sobre cualquier fondo, claro u oscuro.
const FADE = 'linear-gradient(to bottom, #000 78%, transparent 100%)'

export default function Hero() {
  const touch = useIsTouch()
  const ref = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8])
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5])
  const photoX = useTransform(sx, [-0.5, 0.5], [24, -24]) // capa cercana: se mueve más
  const textX = useTransform(sx, [-0.5, 0.5], [8, -8])    // capa lejana: se mueve menos = profundidad

  // Al hacer scroll, las dos líneas del titular se separan.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const slideL = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const slideR = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const onMove = (e) => {
    if (touch) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  useEffect(() => {
    if (!touch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = animate(mx, [-0.25, 0.25], { duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    return () => c.stop()
  }, [touch, mx])

  const giant = 'display block text-[12.5vw] xl:text-[11.5rem]'

  return (
    <section id="hero" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}
      className="relative min-h-[100svh] overflow-hidden" style={{ perspective: 1200 }}>

      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="absolute inset-0">

        {/* z = -120 (lejos): titular. Cada letra reacciona al cursor (FlexWord). */}
        <motion.div aria-hidden="true" style={{ x: textX, z: -120, scale: 1.1 }}
          className="absolute inset-x-0 top-[17%] md:top-[20%] select-none">
          <div className="mx-auto w-fit">
            <span className="block font-serif italic text-[min(7vw,3.5rem)] text-ink/90 -mb-[1.2vw]">I’m a</span>
            <motion.div style={{ x: slideL }} className="overflow-hidden">
              <motion.span {...reveal(0.3)} className={giant}><FlexWord word={profile.headline[0]} /></motion.span>
            </motion.div>
            <motion.div style={{ x: slideR }} className="overflow-hidden">
              <motion.span {...reveal(0.45)} className={giant}><FlexWord word={profile.headline[1]} /></motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* z = +40 (cerca): recorte. El drop-shadow sigue el borde del alfa = luz de contorno. */}
        <motion.div style={{ x: photoX, z: 40, maskImage: FADE, WebkitMaskImage: FADE }}
          initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, delay: 0.7, ease }}
          className="absolute inset-x-0 bottom-0 flex justify-center">
          <img src={cutout} alt={`Portrait of ${profile.name}`}
            className="h-[52vh] sm:h-[76vh] max-h-[860px] w-auto"
            style={{ filter: 'drop-shadow(0 0 1px rgb(var(--rim) / .9)) drop-shadow(0 24px 60px rgb(var(--accent) / .3))' }} />
        </motion.div>
      </motion.div>

      {/* Capa de interfaz plana: sin transformaciones 3D, el texto se ve nítido */}
      <div className="relative z-20 min-h-[100svh] max-w-[1280px] mx-auto px-6 pb-10 flex items-end pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.2, ease }}
          className="w-full flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

          <div className="max-w-sm pointer-events-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1]">
              {profile.name}<span className="sr-only"> — {profile.headline.join(' ')}</span>
            </h1>
            <p className="mt-4 text-mute leading-relaxed">{profile.intro}</p>
            <div className="mt-7 flex items-center gap-6 flex-wrap">
              <Magnetic>
                {/* bg-ink / text-paper se invierten solos con el tema */}
                <a href="#contact" className="group relative block overflow-hidden rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper">
                  <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-500 ease-out group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-500 group-hover:text-white">Get in touch</span>
                </a>
              </Magnetic>
              <a href={profile.cv} download className="inline-flex items-center gap-2 text-sm text-ink/80 underline-offset-4 hover:text-ink hover:underline">
                <Download size={16} /> Download CV
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6 pointer-events-auto">
            <div className="hidden md:block"><Badge text={profile.availability} /></div>
            <p className="text-sm text-mute leading-relaxed md:text-right">{profile.focus}<br />{profile.stack}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}