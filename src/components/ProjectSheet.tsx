import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { projects, type Project } from '../data'
import { ease, spring, useApp } from '../lib'
import { Preview } from './Previews'
import { StatusBadge } from './Work'

export function ProjectSheet({ id, onClose }: { id: Project['id'] | null; onClose: () => void }) {
  const project = projects.find((p) => p.id === id)

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-bg/60 backdrop-blur-md"
          />
          <Sheet key={project.id} project={project} onClose={onClose} />
        </>
      )}
    </AnimatePresence>
  )
}

function Sheet({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const { openProject, copyEmail } = useApp()
  const drag = useDragControls()
  const next = projects[(projects.findIndex((x) => x.id === p.id) + 1) % projects.length]

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        layoutId={`card-${p.id}`}
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        transition={spring}
        style={{ borderRadius: 28 }}
        drag="y"
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
        className="card pointer-events-auto relative max-h-[92dvh] w-full max-w-[640px] overflow-hidden"
      >
        <div className="max-h-[92dvh] overflow-y-auto overscroll-contain p-2">
          <div
            onPointerDown={(e) => drag.start(e)}
            className="absolute inset-x-0 top-0 z-10 flex h-7 cursor-grab touch-none justify-center pt-2.5 active:cursor-grabbing"
            aria-hidden
          >
            <span className="h-1 w-10 rounded-full bg-black/15 dark:bg-white/20" />
          </div>

          <motion.div layoutId={`preview-${p.id}`} style={{ borderRadius: 22 }} className="aspect-[16/10] overflow-hidden">
            <Preview id={p.id} active />
          </motion.div>

          <motion.button
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 grid size-9 place-items-center rounded-full bg-surface/80 text-ink shadow-[var(--shadow)] backdrop-blur"
          >
            <X className="size-4" />
          </motion.button>

          <div className="px-4 pt-6 pb-4 sm:px-6">
            <motion.div layoutId={`title-${p.id}`} className="flex items-center gap-2.5">
              <span className="text-2xl font-medium tracking-tight">{p.name}</span>
              <StatusBadge status={p.status} />
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
            >
              <Fade className="mt-1.5 font-serif text-[22px] leading-snug text-muted italic">{p.tagline}</Fade>

              <Fade className="mt-5 flex flex-wrap gap-1.5">
                {[p.kind, p.year, p.role].map((m) => (
                  <span key={m} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">{m}</span>
                ))}
              </Fade>

              <div className="mt-7 divide-y divide-line border-y border-line">
                {p.story.map((s, i) => (
                  <Fade key={s.label} className="grid grid-cols-[88px_1fr] gap-4 py-3.5 sm:grid-cols-[110px_1fr]">
                    <span className="flex items-baseline gap-2 text-sm text-muted">
                      <span className="font-mono text-[10px] text-faint">0{i + 1}</span>
                      {s.label}
                    </span>
                    <span className="text-[15px] leading-snug">{s.text}</span>
                  </Fade>
                ))}
              </div>

              <Fade className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span key={t} className="rounded-md bg-sunken px-2 py-1 font-mono text-[11px] text-muted">{t}</span>
                ))}
              </Fade>

              <Fade className="mt-7 flex flex-wrap items-center justify-between gap-3">
                {p.status === 'live' && p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-bg"
                  >
                    Try it live
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <button onClick={copyEmail} className="flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-bg">
                    Ask for a walkthrough
                  </button>
                )}
                <button
                  onClick={() => openProject(next.id)}
                  className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                >
                  Next: <span className="text-ink">{next.name}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Fade>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Fade({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12, filter: 'blur(4px)', transition: { duration: 0.15 } },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
