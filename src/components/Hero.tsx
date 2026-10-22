import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { profile } from '../data'
import { ease, spring } from '../lib'
import { CopyEmail } from './CopyEmail'
import { Dock } from './Dock'

const phrases = ['finds the real problem', 'designs the fix', 'ships it end to end']

const rise = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}

export function Hero() {
  return (
    <motion.section
      id="top"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.09, delayChildren: 0.1 }}
      className="pt-32 pb-20 sm:pt-44"
    >
      <motion.div variants={rise}>
        <Status />
      </motion.div>

      <h1 className="mt-7 text-[clamp(2.6rem,7.4vw,5rem)] leading-[1.04] font-medium tracking-[-0.045em]">
        <motion.span variants={rise} className="block">
          Hi, I’m <Avatar /> {profile.first}.
        </motion.span>
        <motion.span variants={rise} className="block text-faint">
          A product engineer who
        </motion.span>
        <motion.span variants={rise} className="block">
          <Rotator />
        </motion.span>
      </h1>

      <motion.p variants={rise} className="mt-7 max-w-md text-[17px] leading-relaxed text-muted">
        Research, design and code, all in one pair of hands. Frontend is where I’m happiest.
      </motion.p>

      <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-8">
        <CopyEmail />
        <Dock />
      </motion.div>
    </motion.section>
  )
}

function Status() {
  return (
    <a
      href="#work"
      className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-3 text-sm shadow-[var(--shadow)]"
    >
      <span className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-live [animation:ping-soft_2s_ease-out_infinite]" />
        <span className="relative size-2 rounded-full bg-live" />
      </span>
      Open to work
      <span className="text-faint transition-transform group-hover:translate-x-0.5">→</span>
    </a>
  )
}

function Avatar() {
  const [waving, setWaving] = useState(false)
  return (
    <motion.span
      className="relative mx-[0.06em] inline-block cursor-grab align-[-0.12em] active:cursor-grabbing"
      onHoverStart={() => setWaving(true)}
      onHoverEnd={() => setWaving(false)}
      onTap={() => setWaving((w) => !w)}
      drag
      dragSnapToOrigin
      dragElastic={0.35}
      initial={{ rotate: -8 }}
      whileHover={{ rotate: 0, scale: 1.12 }}
      whileDrag={{ scale: 1.2, rotate: 6 }}
      transition={spring}
    >
      <img
        src={profile.photo}
        alt={profile.name}
        draggable={false}
        className="h-[0.92em] w-[0.92em] rounded-[0.24em] object-cover object-[50%_30%] shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] ring-[3px] ring-surface"
      />
      <AnimatePresence>
        {waving && (
          <motion.span
            initial={{ opacity: 0, scale: 0.4, y: 6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: [0, 18, -8, 18, 0] }}
            exit={{ opacity: 0, scale: 0.4, y: 6 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none absolute -top-[0.28em] -right-[0.3em] text-[0.36em]"
          >
            👋
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  )
}

function Rotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % phrases.length), 2800)
    return () => clearInterval(id)
  }, [])
  const words = phrases[i].split(' ')

  return (
    <span className="relative inline-flex" aria-live="polite">
      <span className="sr-only">{phrases[i]}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={i} aria-hidden className="inline-flex flex-wrap gap-x-[0.24em] font-serif text-[1.08em] font-normal tracking-[-0.02em] italic">
          {words.map((w, j) => (
            <motion.span
              key={w + j}
              initial={{ opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: '-0.4em', filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease, delay: j * 0.06 }}
            >
              {w}
              {j === words.length - 1 && <span className="text-accent not-italic">.</span>}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
