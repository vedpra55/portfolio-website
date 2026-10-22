import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef, useState } from 'react'
import { links, type LinkId } from '../data'
import { BrandIcon } from './BrandIcon'

const tile: Record<LinkId, string> = {
  github: 'bg-[#181717] text-white',
  linkedin: 'bg-[#0A66C2] text-white',
  x: 'bg-white text-black dark:bg-[#0b0b0b] dark:text-white',
  fiverr: 'bg-[#1DBF73] text-white',
  email: 'bg-accent text-white',
}

/** macOS-style dock: icons swell as the pointer gets close. */
export function Dock() {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onPointerMove={(e) => e.pointerType === 'mouse' && mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
      className="flex h-13 items-end gap-2.5"
    >
      {links.map((l) => (
        <DockItem key={l.id} mouseX={mouseX} {...l} />
      ))}
    </motion.div>
  )
}

function DockItem({ id, label, handle, href, mouseX }: (typeof links)[number] & { mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hover, setHover] = useState(false)
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect()
    return r ? x - r.left - r.width / 2 : Infinity
  })
  const size = useSpring(useTransform(distance, [-120, 0, 120], [44, 64, 44]), { stiffness: 400, damping: 28 })
  const icon = useTransform(size, (s) => s * 0.44)

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label}: ${handle}`}
      style={{ width: size, height: size }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileTap={{ scale: 0.9 }}
      className={`relative grid shrink-0 place-items-center rounded-[28%] shadow-[0_8px_20px_-8px_rgb(0_0_0/0.4),inset_0_1px_0_rgb(255_255_255/0.25)] ring-1 ring-black/5 ${tile[id]}`}
    >
      <motion.span style={{ width: icon, height: icon }} className="grid place-items-center">
        <BrandIcon id={id} className="size-full" />
      </motion.span>
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/20 to-transparent" />
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6, x: '-50%', scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 4, x: '-50%', scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-10 left-1/2 rounded-lg bg-ink px-2.5 py-1 text-xs whitespace-nowrap text-bg"
          >
            {label} <span className="opacity-50">{handle}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  )
}
