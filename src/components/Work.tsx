import { motion, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { projects, type Project } from '../data'
import { ease, spring, useApp } from '../lib'
import { Preview } from './Previews'

// On touch screens there is no hover, so scenes play while on screen instead.
const canHover = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover)').matches

export function Work({ openId }: { openId: Project['id'] | null }) {
  return (
    <div className="flex flex-col gap-14">
      {projects.map((p, i) => (
        <Row key={p.id} project={p} index={i} hidden={openId === p.id} />
      ))}
    </div>
  )
}

export function Status({ project: p }: { project: Project }) {
  return p.status === 'live' ? (
    <span className="inline-flex items-center gap-1.5 text-muted">
      <span className="size-1.5 rounded-full bg-live" /> Live
    </span>
  ) : (
    <span className="text-muted">Private</span>
  )
}

function Row({ project: p, index, hidden }: { project: Project; index: number; hidden: boolean }) {
  const { openProject } = useApp()
  const ref = useRef<HTMLButtonElement>(null)
  const inView = useInView(ref, { margin: '-25% 0px' })
  const [hover, setHover] = useState(false)
  const active = !hidden && (canHover ? hover : inView)

  return (
    <motion.button
      ref={ref}
      onClick={() => openProject(p.id)}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.04 * index }}
      className="group block w-full text-left"
      aria-label={`Open ${p.name}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <motion.span layoutId={`title-${p.id}`} className="link font-medium">
          {p.name}
        </motion.span>
        <span className="flex gap-3 text-sm">
          <Status project={p} />
          <span className="text-faint tabular-nums">{p.year}</span>
        </span>
      </div>
      <p className="mt-0.5 text-muted">{p.tagline}</p>
      <motion.div
        layoutId={`card-${p.id}`}
        style={{ borderRadius: 14, opacity: hidden ? 0 : 1 }}
        transition={spring}
        className="mt-4 aspect-[16/10] overflow-hidden shadow-[0_0_0_1px_var(--line)]"
      >
        <motion.div
          animate={{ scale: hover ? 1.015 : 1 }}
          transition={{ duration: 0.6, ease }}
          className="size-full"
        >
          <Preview id={p.id} active={active} />
        </motion.div>
      </motion.div>
    </motion.button>
  )
}
