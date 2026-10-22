import { motion, useInView } from 'motion/react'
import { ArrowUpRight, Lock } from 'lucide-react'
import { useRef } from 'react'
import { projects, type Project } from '../data'
import { ease, spring, trackPointer, useApp } from '../lib'
import { Preview } from './Previews'

export function Work({ openId }: { openId: Project['id'] | null }) {
  return (
    <section id="work" className="scroll-mt-24 py-16">
      <SectionLabel n={projects.length}>Selected work</SectionLabel>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} hidden={openId === p.id} />
        ))}
      </div>
    </section>
  )
}

export function SectionLabel({ children, n }: { children: string; n?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease }}
      className="flex items-baseline justify-between border-b border-line pb-3"
    >
      <h2 className="text-sm font-medium">{children}</h2>
      {n !== undefined && <span className="font-mono text-xs text-muted">{String(n).padStart(2, '0')}</span>}
    </motion.div>
  )
}

export function StatusBadge({ status }: { status: Project['status'] }) {
  return status === 'live' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-live/12 px-2 py-0.5 text-[11px] font-medium text-live">
      <span className="size-1.5 rounded-full bg-live" /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-sunken px-2 py-0.5 text-[11px] font-medium text-muted">
      <Lock className="size-2.5" /> Private
    </span>
  )
}

function ProjectCard({ project: p, index, hidden }: { project: Project; index: number; hidden: boolean }) {
  const { openProject } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-15% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay: (index % 2) * 0.08 }}
    >
      <motion.button
        layoutId={`card-${p.id}`}
        onClick={() => openProject(p.id)}
        onPointerMove={trackPointer}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.985 }}
        transition={spring}
        style={{ borderRadius: 28, opacity: hidden ? 0 : 1 }}
        className="group card spotlight block w-full overflow-hidden p-2 text-left"
        aria-label={`Open ${p.name} case study`}
      >
        <motion.div layoutId={`preview-${p.id}`} style={{ borderRadius: 22 }} className="aspect-[4/3] overflow-hidden">
          <Preview id={p.id} active={inView && !hidden} />
        </motion.div>
        <div className="flex items-start justify-between gap-4 px-3 pt-4 pb-3">
          <div className="min-w-0">
            <motion.div layoutId={`title-${p.id}`} className="flex items-center gap-2.5">
              <span className="text-[17px] font-medium tracking-tight">{p.name}</span>
              <StatusBadge status={p.status} />
            </motion.div>
            <p className="mt-1 truncate text-sm text-muted">{p.tagline}</p>
          </div>
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-sunken text-muted transition-all duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-bg">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </motion.button>
    </motion.div>
  )
}
