import { motion, useInView } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { projects, type Project } from '../data'
import { ease, spring, useApp } from '../lib'
import { Preview } from './Previews'

// On touch screens there is no hover, so thumbnails play while on screen instead.
const canHover = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover)').matches

export function Work() {
  return (
    <div className="-mt-3">
      {projects.map((p, i) => (
        <Row key={p.id} project={p} index={i} />
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

/**
 * Scenes are drawn for a 480×300 frame. Thumbnails render that same frame and
 * scale it down, so a thumbnail is a true miniature, not a crop.
 * Without `width` the thumbnail fills its container.
 */
export function Thumb({ id, active, width }: { id: Project['id']; active: boolean; width?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [measured, setMeasured] = useState(0)
  useLayoutEffect(() => {
    if (width || !ref.current) return
    const el = ref.current
    setMeasured(el.offsetWidth)
    const ro = new ResizeObserver(([e]) => setMeasured(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  const w = width ?? measured

  return (
    <motion.div
      ref={ref}
      layoutId={`thumb-${id}`}
      transition={spring}
      style={{ width: width ?? '100%', aspectRatio: '16 / 10', borderRadius: 10 }}
      className="relative shrink-0 overflow-hidden shadow-[0_0_0_1px_var(--line)]"
    >
      <div className="absolute top-0 left-0 h-[300px] w-[480px] origin-top-left" style={{ transform: `scale(${w / 480})` }}>
        <Preview id={id} active={active} />
      </div>
    </motion.div>
  )
}

function Row({ project: p, index }: { project: Project; index: number }) {
  const { openProject } = useApp()
  const ref = useRef<HTMLAnchorElement>(null)
  const inView = useInView(ref, { margin: '-30% 0px' })
  const [hover, setHover] = useState(false)

  return (
    <motion.a
      ref={ref}
      href={`/work/${p.id}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return
        e.preventDefault()
        openProject(p.id)
      }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease, delay: 0.05 * index }}
      className="group flex items-center gap-5 border-b border-line py-5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <motion.span layoutId={`title-${p.id}`} className="font-medium">
            {p.name}
          </motion.span>
          {p.status === 'live' && <span className="size-1.5 translate-y-[-2px] rounded-full bg-live" aria-label="Live" />}
        </div>
        <p className="mt-0.5 text-muted">{p.tagline}</p>
        <p className="mt-3 text-sm text-faint">
          {p.kind} · {p.year}
          <span className="ml-2 inline-block text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            Read →
          </span>
        </p>
      </div>
      <motion.div animate={{ scale: hover ? 1.04 : 1, rotate: hover ? (index % 2 ? 1.2 : -1.2) : 0 }} transition={spring}>
        <Thumb id={p.id} width={144} active={canHover ? hover : inView} />
      </motion.div>
    </motion.a>
  )
}
