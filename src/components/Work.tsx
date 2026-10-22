import { useInView } from 'motion/react'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { projects, type Project } from '../data'
import { useApp } from '../lib'
import { Preview } from './Previews'

// On touch screens there is no hover, so thumbnails play while on screen instead.
const canHover = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover)').matches

export function Work() {
  return (
    <div className="-mt-3">
      {projects.map((p) => (
        <Row key={p.id} project={p} />
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
 * Without `width` the thumbnail fills its container. `name` makes it the shared
 * element in a page transition.
 */
export function Thumb({ id, active, width, name }: { id: Project['id']; active: boolean; width?: number; name?: string }) {
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
    <div
      ref={ref}
      style={{ width: width ?? '100%', viewTransitionName: name, viewTransitionClass: 'thumb' } as CSSProperties}
      className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-[10px] shadow-[0_0_0_1px_var(--line)]"
    >
      <div className="absolute top-0 left-0 h-[300px] w-[480px] origin-top-left" style={{ transform: `scale(${w / 480})` }}>
        <Preview id={id} active={active} />
      </div>
    </div>
  )
}

function Row({ project: p }: { project: Project }) {
  const { openProject } = useApp()
  const ref = useRef<HTMLAnchorElement>(null)
  const inView = useInView(ref, { margin: '-30% 0px' })
  const [hover, setHover] = useState(false)

  return (
    <a
      ref={ref}
      href={`/work/${p.id}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return
        e.preventDefault()
        openProject(p.id)
      }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="group flex items-center gap-5 border-b border-line py-5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <span className="font-medium">{p.name}</span>
          {p.status === 'live' && <span className="size-1.5 rounded-full bg-live" aria-label="Live" />}
        </div>
        <p className="mt-0.5 text-muted">{p.tagline}</p>
        <p className="mt-3 text-sm text-faint">
          {p.kind} · {p.year}
          <span className="ml-2 inline-block text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            Read →
          </span>
        </p>
      </div>
      <div className="w-28 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 sm:w-36">
        <Thumb id={p.id} name={`thumb-${p.id}`} active={canHover ? hover : inView} />
      </div>
    </a>
  )
}
