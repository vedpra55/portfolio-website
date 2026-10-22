import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { links, profile } from '../data'
import { copyText, ease, spring, timeIn, useApp, useNow } from '../lib'

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

export function Profile() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Avatar />
        <h1 className="mt-5 font-medium">{profile.name}</h1>
        <p className="text-muted">{profile.role}</p>
        <p className="mt-4 max-w-[34ch] leading-relaxed">{profile.bio}</p>
        <p className="mt-4 flex items-center gap-2 text-muted">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 rounded-full bg-live [animation:ping-soft_2.4s_ease-out_infinite]" />
            <span className="relative size-1.5 rounded-full bg-live" />
          </span>
          Available for new work
        </p>
      </div>
      <Contact />
    </div>
  )
}

function Avatar() {
  const { time, awake } = timeIn(useNow(30_000), profile.timeZone)
  const [peek, setPeek] = useState(false)
  return (
    <div className="relative z-20 size-14">
      <motion.button
        onHoverStart={() => setPeek(true)}
        onHoverEnd={() => setPeek(false)}
        onTap={() => setPeek((p) => !p)}
        animate={
          peek
            ? { width: 148, height: 148, borderRadius: 20, boxShadow: '0 0 0 1px var(--line), 0 24px 48px -16px rgb(0 0 0 / 0.35)' }
            : { width: 56, height: 56, borderRadius: 28, boxShadow: '0 0 0 1px var(--line), 0 0 0 0 rgb(0 0 0 / 0)' }
        }
        transition={spring}
        className="absolute top-0 left-0 overflow-hidden bg-sunken"
        aria-label={`Photo of ${profile.name}`}
      >
        <img src={profile.photo} alt="" className="size-full object-cover object-[50%_28%]" draggable={false} />
        <AnimatePresence>
          {peek && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="absolute inset-x-1.5 bottom-1.5 rounded-lg bg-black/45 px-2 py-1 text-left text-[11px] leading-tight text-white backdrop-blur-md"
            >
              {time} in {profile.place}
              <span className="block opacity-70">{awake ? 'Probably at the desk' : 'Probably asleep'}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  const row = 'group grid grid-cols-[76px_1fr_auto] items-baseline py-[3px]'
  return (
    <div>
      <button onClick={() => copyText(profile.email).then(() => setCopied(true))} className={`${row} w-full text-left`}>
        <span className="text-muted">Email</span>
        <span>
          <Roll>{copied ? 'Copied to clipboard' : profile.email}</Roll>
        </span>
        <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">{copied ? '' : 'Copy'}</span>
      </button>
      {links.map((l) => (
        <a key={l.id} href={l.href} target="_blank" rel="noreferrer" className={row}>
          <span className="text-muted">{l.label}</span>
          <span className="truncate transition-transform duration-300 group-hover:translate-x-0.5">{l.handle}</span>
          <span className="text-faint opacity-0 transition-all duration-300 group-hover:-translate-y-px group-hover:opacity-100">↗</span>
        </a>
      ))}
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
      <button onClick={openMenu} className="transition-colors hover:text-ink">
        {isMac ? '⌘K' : 'Ctrl K'}
      </button>
    </div>
  )
}
