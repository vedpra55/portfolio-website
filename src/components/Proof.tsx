import { animate, AnimatePresence, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { ArrowUpRight, Star } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { links, profile, proof, stack, steps } from '../data'
import { ease, spring, trackPointer } from '../lib'
import { SectionLabel } from './Work'

export function Proof() {
  return (
    <section id="about" className="scroll-mt-24 py-16">
      <SectionLabel>Track record</SectionLabel>
      <div className="mt-8 grid gap-4 sm:grid-cols-6">
        <Tile className="sm:col-span-3" i={0}><Fiverr /></Tile>
        <Tile className="sm:col-span-3" i={1}><Award /></Tile>
        <Tile className="sm:col-span-4" i={2}><HowIWork /></Tile>
        <Tile className="sm:col-span-2" i={3}><Now /></Tile>
        <Tile className="sm:col-span-6" i={4} flush><Stack /></Tile>
      </div>
    </section>
  )
}

function Tile({ children, className = '', i, flush }: { children: ReactNode; className?: string; i: number; flush?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay: (i % 2) * 0.08 }}
      onPointerMove={trackPointer}
      className={`card spotlight relative overflow-hidden ${flush ? 'py-5' : 'p-6'} ${className}`}
    >
      {children}
    </motion.div>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="inline-flex w-fit rounded-full bg-sunken px-2.5 py-1 text-xs text-muted">{children}</span>
}

function useCountUp(to: number, decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const v = useMotionValue(0)
  const text = useTransform(v, (n) => n.toFixed(decimals))
  useEffect(() => {
    if (!inView) return
    const c = animate(v, to, { duration: 1.6, ease })
    return () => c.stop()
  }, [inView, to, v])
  return { ref, text, inView }
}

function Fiverr() {
  const rating = useCountUp(proof.fiverr.rating, 1)
  const reviews = useCountUp(proof.fiverr.reviews)
  const href = links.find((l) => l.id === 'fiverr')!.href
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group flex h-full flex-col justify-between gap-10">
      <div className="flex items-center justify-between">
        <Pill>Freelance on Fiverr</Pill>
        <ArrowUpRight className="size-4 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>
      <div>
        <div className="flex items-end gap-3">
          <motion.span ref={rating.ref} className="text-6xl font-medium tracking-[-0.05em] tabular-nums">{rating.text}</motion.span>
          <div className="mb-2.5 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -40 }}
                animate={rating.inView ? { scale: 1, rotate: 0 } : {}}
                whileHover={{ scale: 1.35, rotate: 15 }}
                transition={{ ...spring, delay: rating.inView ? 0.3 + i * 0.08 : 0 }}
              >
                <Star className="size-4 fill-[#FFB800] text-[#FFB800]" />
              </motion.span>
            ))}
          </div>
        </div>
        <p className="mt-1 text-sm text-muted">
          <motion.span ref={reviews.ref} className="text-ink tabular-nums">{reviews.text}</motion.span> five-star reviews from clients
        </p>
      </div>
    </a>
  )
}

function Award() {
  const prize = useCountUp(proof.award.prize)
  return (
    <div className="flex h-full flex-col justify-between gap-10">
      <Pill>{proof.award.program}</Pill>
      <div>
        <div className="flex items-end gap-4">
          <span className="text-6xl font-medium tracking-[-0.05em]">
            2<sup className="ml-0.5 align-super text-2xl tracking-normal">nd</sup>
          </span>
          <span className="mb-2 rounded-full bg-accent px-2.5 py-1 text-sm font-medium text-white">
            $<motion.span ref={prize.ref} className="tabular-nums">{prize.text}</motion.span>k prize
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{proof.award.note}. Plus a lot of startup pitches on stage.</p>
      </div>
    </div>
  )
}

function HowIWork() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const running = inView && !paused

  return (
    <div ref={ref} className="flex h-full flex-col justify-between gap-8" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <Pill>How I work</Pill>
      <div className="relative min-h-[3.2em]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="font-mono text-xs text-muted">0{active + 1}</div>
            <div className="mt-1 text-xl font-medium tracking-tight">{steps[active].text}</div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-4 gap-1 rounded-full bg-sunken p-1">
        {steps.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setActive(i)}
            className={`relative h-9 rounded-full text-xs font-medium transition-colors sm:text-sm ${i === active ? 'text-bg' : 'text-muted hover:text-ink'}`}
          >
            {i === active && (
              <motion.span layoutId="step-pill" transition={spring} className="absolute inset-0 overflow-hidden rounded-full bg-ink">
                {running && (
                  <motion.span
                    key={active}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 3.2, ease: 'linear' }}
                    onAnimationComplete={() => setActive((a) => (a + 1) % steps.length)}
                    className="absolute inset-0 origin-left bg-white/15"
                  />
                )}
              </motion.span>
            )}
            <span className="relative">{s.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Now() {
  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sunken px-2.5 py-1 text-xs text-muted">
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 rounded-full bg-accent [animation:ping-soft_2s_ease-out_infinite]" />
          <span className="relative size-1.5 rounded-full bg-accent" />
        </span>
        Now
      </span>
      <p className="font-serif text-2xl leading-tight italic">{profile.now}</p>
    </div>
  )
}

function Stack() {
  const row = [...stack, ...stack]
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max gap-2 [animation:marquee_36s_linear_infinite] group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span
            key={i}
            aria-hidden={i >= stack.length}
            className="rounded-full border border-line bg-bg px-4 py-2 text-sm whitespace-nowrap text-muted transition-colors hover:text-ink"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
