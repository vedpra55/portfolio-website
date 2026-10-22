import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { links, profile } from '../data'
import { copyText, ease, spring, timeIn, useApp, useNow } from '../lib'
import { BrandIcon } from './BrandIcon'

/** Swaps text by rolling the old value up and the new one in from below. */
export function Roll({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={children}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          className="whitespace-nowrap"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// Left pane settles in line by line on first load.
const settle = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export function Profile() {
  const [hover, setHover] = useState(false)
  const { time, awake } = timeIn(useNow(30_000), profile.timeZone)

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="flex flex-col gap-10">
      <div>
        <motion.div variants={settle}>
          <Avatar hover={hover} setHover={setHover} />
        </motion.div>
        <motion.h1 variants={settle} className="mt-5 font-medium">
          {profile.name}
        </motion.h1>
        <motion.p variants={settle} className="text-muted">
          <Roll>{hover ? `${time} in ${profile.place} · probably ${awake ? 'awake' : 'asleep'}` : profile.role}</Roll>
        </motion.p>
        <motion.p variants={settle} className="mt-4 max-w-[34ch] leading-relaxed">
          {profile.bio}
        </motion.p>
        <motion.p variants={settle} className="mt-4 flex items-center gap-2 text-muted">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 rounded-full bg-live [animation:ping-soft_2.4s_ease-out_infinite]" />
            <span className="relative size-1.5 rounded-full bg-live" />
          </span>
          Available for new work
        </motion.p>
      </div>
      <motion.div variants={settle}>
        <Contact />
      </motion.div>
    </motion.div>
  )
}

/**
 * On load a thin green ring draws once around the photo (matching "Available"),
 * then lets go. Hovering draws it again while the role line shows local time.
 */
function Avatar({ hover, setHover }: { hover: boolean; setHover: (h: boolean) => void }) {
  const [intro, setIntro] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setIntro(false), 1500)
    return () => clearTimeout(id)
  }, [])
  const on = hover || intro

  return (
    <button
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={() => setHover(!hover)}
      onBlur={() => setHover(false)}
      aria-label={`Photo of ${profile.name}. Shows my local time.`}
      className="relative block size-14"
    >
      <motion.img
        src={profile.photo}
        alt=""
        draggable={false}
        animate={{ scale: hover ? 0.9 : 1 }}
        transition={spring}
        className="size-full rounded-full object-cover object-[50%_28%] shadow-[0_0_0_1px_var(--line)]"
      />
      <svg viewBox="0 0 64 64" className="pointer-events-none absolute -inset-1 size-[calc(100%+8px)] -rotate-90" aria-hidden>
        <motion.circle
          cx="32"
          cy="32"
          r="30.5"
          fill="none"
          stroke="var(--live)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={
            on
              ? { pathLength: { duration: 0.9, ease, delay: intro ? 0.35 : 0 }, opacity: { duration: 0.15, delay: intro ? 0.35 : 0 } }
              : { opacity: { duration: 0.35 }, pathLength: { duration: 0, delay: 0.35 } }
          }
        />
      </svg>
    </button>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const [tip, setTip] = useState<string | null>(null)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  const items = [
    { id: 'email' as const, label: copied ? 'Copied' : profile.email, href: undefined },
    ...links.map((l) => ({ id: l.id, label: `${l.label} · ${l.handle}`, href: l.href })),
  ]
  const shown = tip === 'email' ? items[0].label : items.find((i) => i.id === tip)?.label

  return (
    <div onPointerLeave={() => setTip(null)}>
      <div className="-ml-2 flex">
        {items.map((it) => {
          const Tag = it.href ? 'a' : 'button'
          return (
            <Tag
              key={it.id}
              {...(it.href
                ? { href: it.href, target: '_blank', rel: 'noreferrer' }
                : { onClick: () => copyText(profile.email).then(() => setCopied(true)) })}
              onPointerEnter={() => setTip(it.id)}
              onFocus={() => setTip(it.id)}
              onBlur={() => setTip(null)}
              aria-label={it.id === 'email' ? `Copy email ${profile.email}` : it.label}
              className={`grid size-9 place-items-center rounded-lg transition-colors hover:bg-sunken hover:text-ink ${tip === it.id ? 'text-ink' : 'text-muted'}`}
            >
              <BrandIcon id={it.id} className="size-[18px]" />
            </Tag>
          )
        })}
      </div>
      <div className="mt-1 h-5 text-sm text-muted">
        {shown ? <Roll>{shown}</Roll> : <span className="text-faint">The envelope copies my email</span>}
      </div>
    </div>
  )
}

export function Meta() {
  const { theme, toggleTheme, openMenu } = useApp()
  const now = useNow()
  const { time } = timeIn(now, profile.timeZone)
  const [h, m] = time.split(':')
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <div className="flex items-center gap-4 text-muted">
      <span className="tabular-nums">
        {h}
        <span className={now.getSeconds() % 2 ? 'opacity-30' : ''}>:</span>
        {m} in {profile.place}
      </span>
      <button onClick={toggleTheme} className="transition-colors hover:text-ink">
        <Roll>{theme === 'dark' ? 'Dark' : 'Light'}</Roll>
      </button>
      <button onClick={openMenu} className="transition-colors hover:text-ink [@media(hover:none)]:hidden">
        {isMac ? '⌘K' : 'Ctrl K'}
      </button>
    </div>
  )
}
