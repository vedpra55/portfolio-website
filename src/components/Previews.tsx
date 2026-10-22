// Animated mini-scenes for each project. They stand in for screenshots and
// only animate while `active` (in view, or open in the sheet).
import { AnimatePresence, motion } from 'motion/react'
import { BellRing, Check, Heart, MoonStar, Salad, Sparkles } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { Project } from '../data'
import { ease, spring } from '../lib'

export const sceneBg: Record<Project['id'], string> = {
  anyash: 'bg-[#F3ECE6] dark:bg-[#211c19]',
  have: 'bg-[#EBEDE6] dark:bg-[#1b1e1a]',
  easily: 'bg-[#ECEAF1] dark:bg-[#1c1b21]',
  learn: 'bg-[#E7ECF0] dark:bg-[#191d20]',
}

export function Preview({ id, active }: { id: Project['id']; active: boolean }) {
  const Scene = { anyash: Anyash, have: Have, easily: Easily, learn: Learn }[id]
  return (
    <div className={`relative size-full overflow-hidden ${sceneBg[id]}`}>
      <Scene active={active} />
    </div>
  )
}

/** Advances 0..n-1 while active, replaying from 0 each time. At rest it shows `rest` (the finished frame). */
function useTick(active: boolean, n: number, ms: number, rest = n - 1) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return
    setT(0)
    const id = setInterval(() => setT((v) => (v + 1) % n), ms)
    return () => clearInterval(id)
  }, [active, n, ms])
  return active ? t : rest
}

const glass = 'bg-white/80 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur dark:bg-white/[0.07] dark:shadow-none ring-1 ring-black/5 dark:ring-white/10'

function Chip({ children, show, delay = 0 }: { children: ReactNode; show: boolean; delay?: number }) {
  return (
    <motion.div
      initial={false}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
      transition={{ ...spring, delay: show ? delay : 0 }}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-ink ${glass}`}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Anyash: an incoming call that logs your health ---------- */

function Anyash({ active }: { active: boolean }) {
  const t = useTick(active, 5, 1400)
  const seconds = useTick(active, 60, 1000, 42)
  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className="flex w-full max-w-[250px] flex-col items-center gap-3">
        <div className={`flex w-full items-center gap-3 rounded-[22px] p-3 ${glass}`}>
          <div className="relative grid size-10 shrink-0 place-items-center rounded-full bg-[#FF5A1F] text-sm font-semibold text-white">
            {active && <span className="absolute inset-0 rounded-full bg-[#FF5A1F] [animation:ping-soft_1.8s_ease-out_infinite]" />}
            <span className="relative">A</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-ink">Anyash</div>
            <div className="text-[10px] text-muted tabular-nums">on call · 0:{String(seconds).padStart(2, '0')}</div>
          </div>
          <div className="flex h-6 items-center gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="h-full w-[3px] origin-center rounded-full bg-[#FF5A1F]"
                style={{
                  animation: active ? `bar ${0.7 + ((i * 37) % 5) / 10}s ease-in-out ${i * -0.13}s infinite` : 'none',
                  transform: 'scaleY(0.3)',
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Chip show={t >= 1}><MoonStar className="size-3.5 text-[#6366F1]" /> Slept 7h 20m</Chip>
          <Chip show={t >= 2}><Salad className="size-3.5 text-[#16A34A]" /> Lunch logged: dal, rice</Chip>
          <Chip show={t >= 3}><BellRing className="size-3.5 text-[#FF5A1F]" /> Follow-up at 9:00 PM</Chip>
        </div>
      </div>
    </div>
  )
}

/* ---------- Have: a phone filling up with good things ---------- */

const gratitude = ['Chai with mom on the balcony', 'Finally fixed that 3-day bug', 'Long walk, no phone']

function Have({ active }: { active: boolean }) {
  const t = useTick(active, 5, 1300)
  return (
    <div className="absolute inset-x-0 top-7 bottom-0 flex justify-center">
      <div className="relative h-[115%] w-[200px] rounded-t-[34px] border-[6px] border-b-0 border-[#1b1b1a] bg-[#FBFAF6] p-4 pt-7 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.4)] dark:border-[#2a2a28] dark:bg-[#121211]">
        <div className="absolute top-2 left-1/2 h-[14px] w-[60px] -translate-x-1/2 rounded-full bg-[#1b1b1a] dark:bg-[#2a2a28]" />
        <div className="text-[10px] text-muted">Today</div>
        <div className="mt-0.5 text-[17px] leading-tight font-medium text-ink">I’m grateful for</div>
        <div className="mt-3 flex flex-col gap-1.5">
          {gratitude.map((g, i) => {
            const on = t > i
            return (
              <motion.div
                key={g}
                initial={false}
                animate={{ opacity: on ? 1 : 0.35 }}
                className="flex items-center gap-2 rounded-xl bg-black/[0.04] px-2.5 py-2 dark:bg-white/[0.06]"
              >
                <motion.span
                  initial={false}
                  animate={on ? { scale: [0.6, 1.3, 1], backgroundColor: '#E8505B' } : { scale: 1, backgroundColor: 'rgba(0,0,0,0)' }}
                  transition={{ duration: 0.45 }}
                  className="grid size-4 shrink-0 place-items-center rounded-full ring-1 ring-black/10 dark:ring-white/15"
                >
                  {on && <Heart className="size-2.5 fill-white text-white" />}
                </motion.span>
                <span className="truncate text-[11px] text-ink">{on ? g : '·  ·  ·'}</span>
              </motion.div>
            )
          })}
        </div>
        <AnimatePresence>
          {t === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center text-[10px] text-muted"
            >
              Done in 9 seconds
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- Easily: a question finds the person who's lived it ---------- */

const asks = [
  { q: 'How do I land my first freelance client?', who: 1, note: 'Did it in 2022' },
  { q: 'Is a gap year worth it before college?', who: 0, note: 'Took one in 2021' },
  { q: 'How do you pitch to a startup jury?', who: 2, note: 'Pitched 6 times' },
]
const people = [
  { n: 'Aarav', c: '#F59E0B' },
  { n: 'Meera', c: '#10B981' },
  { n: 'Kabir', c: '#6366F1' },
]

function Easily({ active }: { active: boolean }) {
  const i = useTick(active, asks.length, 3200, 0)
  const a = asks[i]
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-5 p-6">
      <div className="w-[46%] max-w-[170px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease }}
            className={`rounded-2xl rounded-bl-md p-3 text-[12px] leading-snug font-medium text-ink ${glass}`}
          >
            {a.q}
          </motion.div>
        </AnimatePresence>
      </div>
      <svg className="pointer-events-none h-28 w-8 shrink-0 overflow-visible" viewBox="0 0 32 112" fill="none">
        {[18, 56, 94].map((y, p) => (
          <motion.path
            key={`${i}-${p}`}
            d={`M0 56 C 16 56, 16 ${y}, 32 ${y}`}
            stroke="currentColor"
            strokeWidth={p === a.who ? 2 : 1}
            className={p === a.who ? 'text-[#7C6CF0]' : 'text-black/10 dark:text-white/10'}
            initial={{ pathLength: p === a.who ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          />
        ))}
      </svg>
      <div className="flex flex-col gap-3">
        {people.map((p, j) => {
          const on = j === a.who
          return (
            <motion.div
              key={p.n}
              animate={{ x: on ? 4 : 0, opacity: on ? 1 : 0.5 }}
              transition={{ ...spring, delay: on ? 0.7 : 0 }}
              className={`flex items-center gap-2 rounded-full py-1 pr-3 pl-1 ${on ? glass : ''}`}
            >
              <span className="grid size-6 place-items-center rounded-full text-[10px] font-semibold text-white" style={{ background: p.c }}>
                {p.n[0]}
              </span>
              <span className="text-[11px] leading-tight text-ink">
                {p.n}
                <AnimatePresence>
                  {on && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.8 }}
                      className="block text-[9px] text-muted"
                    >
                      {a.note}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- AI Learning Platform: a tutor that adapts ---------- */

const hint = 'Think of a neuron as a tiny vote: it adds up signals and decides whether to fire.'

function Learn({ active }: { active: boolean }) {
  const [tick, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    setN(0)
    const id = setInterval(() => setN((v) => (v >= hint.length + 30 ? 0 : v + 1)), 38)
    return () => clearInterval(id)
  }, [active])
  const n = active ? tick : hint.length
  const typed = hint.slice(0, n)
  const done = n >= hint.length

  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className={`w-full max-w-[260px] rounded-[22px] p-4 ${glass}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted">Lesson 3 · Neural nets</span>
          <span className="text-[10px] text-muted tabular-nums">{Math.min(100, Math.round((n / hint.length) * 100))}%</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <motion.div className="h-full rounded-full bg-[#2F7DD1]" animate={{ width: `${Math.min(100, (n / hint.length) * 100)}%` }} transition={{ duration: 0.1 }} />
        </div>
        <div className="mt-3 flex gap-2">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#2F7DD1]">
            <Sparkles className="size-3 text-white" />
          </span>
          <p className="min-h-[3.6em] text-[11.5px] leading-snug text-ink">
            {typed}
            {!done && <span className="ml-px inline-block h-3 w-[2px] translate-y-0.5 animate-pulse bg-[#2F7DD1]" />}
          </p>
        </div>
        <div className="mt-3 flex gap-1.5">
          {['Simpler', 'Go deeper', 'Quiz me'].map((c, i) => (
            <motion.span
              key={c}
              initial={false}
              animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ ...spring, delay: done ? i * 0.08 : 0 }}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ${i === 2 ? 'bg-[#2F7DD1] text-white' : 'bg-black/5 text-ink dark:bg-white/10'}`}
            >
              {i === 2 && <Check className="size-2.5" />}
              {c}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}
