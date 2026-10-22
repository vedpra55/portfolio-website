import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { projects, type Project } from '../data'
import { ease, spring, useApp } from '../lib'
import { Preview } from './Previews'
import { Status } from './Work'

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
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-[6px]"
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
        style={{ borderRadius: 18 }}
        drag="y"
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
        className="pointer-events-auto relative max-h-[92dvh] w-full max-w-[600px] overflow-hidden bg-surface shadow-[0_0_0_1px_var(--line),0_30px_80px_-30px_rgb(0_0_0/0.35)]"
      >
        <div className="max-h-[92dvh] overflow-y-auto overscroll-contain">
          <div
            onPointerDown={(e) => drag.start(e)}
            className="absolute inset-x-0 top-0 z-10 flex h-6 cursor-grab touch-none justify-center pt-2 active:cursor-grabbing"
            aria-hidden
          >
            <span className="h-1 w-8 rounded-full bg-black/15 dark:bg-white/20" />
          </div>

          <div className="aspect-[2/1]">
            <Preview id={p.id} active />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <motion.span layoutId={`title-${p.id}`} className="font-medium">{p.name}</motion.span>
              <button onClick={onClose} className="text-muted transition-colors hover:text-ink">Close</button>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } } }}
            >
              <Fade className="text-muted">{p.tagline}</Fade>

              <Fade className="mt-8 divide-y divide-line border-y border-line">
                {p.story.map((s) => (
                  <div key={s.label} className="grid grid-cols-[96px_1fr] gap-4 py-3">
                    <span className="text-muted">{s.label}</span>
                    <span className="leading-relaxed">{s.text}</span>
                  </div>
                ))}
                <div className="grid grid-cols-[96px_1fr] gap-4 py-3">
                  <span className="text-muted">Role</span>
                  <span>{p.role}</span>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-4 py-3">
                  <span className="text-muted">Stack</span>
                  <span>{p.stack.join(', ')}</span>
                </div>
              </Fade>

              <Fade className="mt-6 flex items-baseline justify-between gap-4">
                <span className="flex items-baseline gap-4">
                  <Status project={p} />
                  {p.status === 'live' && p.href ? (
                    <a href={p.href} target="_blank" rel="noreferrer" className="link">Open {p.name} ↗</a>
                  ) : (
                    <button onClick={copyEmail} className="link">Ask for a walkthrough</button>
                  )}
                </span>
                <button onClick={() => openProject(next.id)} className="group text-muted transition-colors hover:text-ink">
                  {next.name} <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
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
        hidden: { opacity: 0, y: 8, transition: { duration: 0.12 } },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
