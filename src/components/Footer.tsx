import { motion } from 'motion/react'
import { links, profile } from '../data'
import { ease, timeIn, useNow } from '../lib'
import { CopyEmail } from './CopyEmail'

export function Footer() {
  const now = useNow(30_000)
  const { time, awake } = timeIn(now, profile.timeZone)
  return (
    <footer id="contact" className="pt-24 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease }}
      >
        <h2 className="text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] font-medium tracking-[-0.045em]">
          <span className="text-faint">Got a messy problem?</span>
          <br />
          Let’s build the <span className="font-serif font-normal tracking-[-0.02em] italic">fix</span>
          <span className="text-accent">.</span>
        </h2>
        <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
          <CopyEmail />
          <span className="text-sm text-muted">
            It’s {time} for me. {awake ? 'I’m probably around.' : 'I’m asleep, I’ll reply in the morning.'}
          </span>
        </div>
      </motion.div>

      <div className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
        <span>© {now.getFullYear()} {profile.name}</span>
        <nav className="flex gap-5">
          {links.map((l) => (
            <a key={l.id} href={l.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
