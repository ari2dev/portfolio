import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Download, ArrowUpRight } from 'lucide-react'
import useIsTouch from '../hooks/useIsTouch'
import useTypewriter from '../hooks/useTypewriter'
import FlexWord from './FlexWord'
import Magnetic from './Magnetic'
import Badge from './Badge'
import { profile } from '../data/content'
import cutout from '../assets/hero-cutout.png'

const ease = [0.16, 1, 0.3, 1]

const FADE = 'linear-gradient(to bottom, #000 80%, transparent 100%)'

export default function Hero() {
  const touch = useIsTouch()
  const reduce = useReducedMotion()
  const typed = useTypewriter(profile.roles)
  const ref = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4])
  const photoX = useTransform(sx, [-0.5, 0.5], [18, -18])
  const textX = useTransform(sx, [-0.5, 0.5], [6, -6])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const slideL = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const slideR = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  const onMove = (e) => {
    if (touch || reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  useEffect(() => {
    if (touch || reduce) return
    const c = animate(mx, [-0.25, 0.25], { duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    return () => c.stop()
  }, [touch, reduce, mx])

  const reveal = (delay) => reduce
    ? { initial: false }
    : { initial: { y: '105%' }, animate: { y: 0 }, transition: { duration: 1.1, delay, ease } }
  const fadeUp = (delay) => reduce
    ? { initial: false }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } }

  const giant = 'display block text-[12.5vw] xl:text-[11.5rem] tracking-tighter font-extrabold uppercase'

  return (
    <section
      id="hero"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative min-h-[100svh] overflow-hidden text-ink"
      style={{ perspective: 1200 }}
    >
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-accent/10 blur-[120px] pointer-events-none rounded-full" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[32vh] bg-gradient-to-t from-paper via-paper/30 to-transparent pointer-events-none" />

      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="absolute inset-0">

        <motion.div style={{ x: textX, z: -120, scale: 1.1 }}
          className="absolute inset-x-0 top-[15%] md:top-[17%] select-none opacity-90">
          <div className="mx-auto w-fit flex flex-col items-center">
            <motion.h1 {...fadeUp(0.15)}
              className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.35em] text-mute mb-[1vh]">
              <span aria-hidden="true" className="h-px w-8 sm:w-14 bg-ink/20" />
              {profile.name}
              <span aria-hidden="true" className="h-px w-8 sm:w-14 bg-ink/20" />
              <span className="sr-only"> — {profile.headline.join(' ')}</span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)}
              className="max-w-md px-6 text-center text-xs sm:text-sm text-mute/90 leading-relaxed mb-[1.5vh]">
              {profile.intro}
            </motion.p>

            <motion.span aria-hidden="true" {...fadeUp(0.25)} className="block font-serif italic text-[min(7vw,3.5rem)] text-accent2 -mb-[1.2vw] pl-2 self-start">I’m a</motion.span>

            <div aria-hidden="true" className="w-fit">
              <motion.div style={{ x: slideL }} className="overflow-hidden">
                <motion.span {...reveal(0.35)} className={`${giant} text-ink`}>
                  <FlexWord word={profile.headline[0]} />
                </motion.span>
              </motion.div>
              <motion.div style={{ x: slideR }} className="overflow-hidden">
                <motion.span {...reveal(0.5)} className={giant}>
                  <FlexWord word={profile.headline[1]} />
                </motion.span>
              </motion.div>
            </div>

            <motion.p {...fadeUp(0.7)}
              className="mt-[2vh] h-5 sm:h-6 text-[9px] sm:text-xs font-mono uppercase tracking-[0.16em] sm:tracking-[0.28em] text-mute px-4 text-center">
              <span className="text-accent2">&gt;&nbsp;</span>
              {reduce ? profile.roles[0] : typed}
              {!reduce && <span aria-hidden="true" className="ml-1 inline-block h-[0.95em] w-[6px] translate-y-[1px] bg-accent animate-pulse" />}
            </motion.p>
          </div>
        </motion.div>

        <motion.div style={{ x: photoX, z: 40, maskImage: FADE, WebkitMaskImage: FADE }}
          initial={reduce ? false : { opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, delay: 0.7, ease }}
          className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
          <img
            src={cutout}
            alt={`Portrait of ${profile.name}`}
            className="h-[48vh] sm:h-[68vh] max-h-[760px] w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 2px rgb(var(--accent) / 0.4)) drop-shadow(0 24px 40px rgb(0 0 0 / 0.35))' }}
          />
        </motion.div>
      </motion.div>

      <div className="relative z-20 min-h-[100svh] flex items-end justify-center px-6 pb-8 pointer-events-none"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
        <motion.div {...fadeUp(1.2)}
          className="pointer-events-auto flex items-center gap-2 bg-paper/60 backdrop-blur-xl border border-ink/10 rounded-full pl-2 pr-2 py-2">
          <Magnetic strength={0.25}>
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-accent text-paper px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/90 shadow-lg shadow-accent/25">
              <span>Get in touch</span>
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>

          <a href={profile.cv} download className="inline-flex items-center gap-2 text-sm font-medium text-mute hover:text-ink transition-colors px-4 py-2.5 rounded-full hover:bg-ink/[0.04]">
            <Download size={15} className="text-accent2" /> Download CV
          </a>
        </motion.div>
      </div>

      <motion.div {...fadeUp(1.4)} className="absolute right-6 bottom-8 z-20 hidden md:block pointer-events-auto">
        <Badge text={profile.availabilityShort} />
      </motion.div>
    </section>
  )
}
